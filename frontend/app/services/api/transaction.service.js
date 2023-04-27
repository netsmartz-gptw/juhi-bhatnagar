import AppSetting from '../../common/constants/appsetting.constant';
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
// import Exception from 'src/app/common/exceptions/exception';
import CommonService from './common.service';
// import ProcessorException from 'src/app/common/processor-exception/processor-exception';
import axios from 'axios'



const TransactionService = {

  getLoggedInData() {
    return JSON.parse(StorageService.get('session', 'userDetails'));
  },

  setFindTransactionData(data) {
    this.findTransactionData = data;
  },

  getFindTransactionData() {
    return this.findTransactionData;
  },

  buildQuery(data) {
    let queryData = '';
    for (const prop in data) {
      if (data[prop] !== '' && data[prop] !== 'undefined' && data[prop] !== null) {
        if (queryData === '') {
          queryData = '?' + prop + '=' + data[prop];
        } else {
          queryData += '&' + prop + '=' + data[prop];
        }
      }
    }

    return queryData;
  },

  // providers or patients/{parentId}/transactions
  findTransaction(data) {
    let loggedInUserData = this.getLoggedInData()
    let url;
    if (this.getLoggedInData()?.userType == 0) {
      url = `${AppSetting.patient.getPatientByUserName}/${loggedInUserData.parentId}/transactions` + this.buildQuery(data);
    } else {
      url = `${AppSetting.provider.common}/${loggedInUserData.parentId}/transactions` + this.buildQuery(data);
    }

    return axios.get(url, data)
        .then(a => {return a})
        .catch(err=>{this.handleError(err)})
  },

  //  /providers/{parentId}/transactions/{id}
  viewTransaction(parentId, transactionId) {
    let url;
    if (this.getLoggedInData().userType == 0) {
      url = `${AppSetting.patient.getPatientByUserName}/${parentId}/transactions/${transactionId}`;
    } else {
      url = `${AppSetting.provider.common}/${parentId}/transactions/${transactionId}`;
    }
    return axios.get(url)
        .then(a => {return a})
        .catch(err=>{return err})
  },

  //  providers/:parentId/transactions/:transactionId/status
  getTransactionStatus(transactionId) {
    let url;
    let loggedInUserData = this.getLoggedInData()
    if (loggedInUserData.userType == 0) {
      url = `${AppSetting.patient.getPatientByUserName}/${loggedInUserData.parentId}/transactions/${transactionId}/status`;
    } else {
      url = `${AppSetting.provider.common}/${loggedInUserData.parentId}/transactions/${transactionId}/status`;
    }
    return axios.get(url)
        .then(a => {return a})
        .catch(err=>{return err})
  },
  // /providers/{parentId}/transactions/{id}/refundTransaction
  refundTransaction( transactionId, data) {
    let loggedInUserData = this.getLoggedInData()
    const url = `${AppSetting.provider.common}/${loggedInUserData.parentId}/transactions/${transactionId}/refund`;
    return axios.post(url, data)
        .then(a => {return a})
        .catch(err=>{this.handleError(err)})
  },

  // /providers/{parentId}/{channelType}/transactions/{id}/cancellations
  voidTransaction(transactionId) {
    let loggedInUserData = this.getLoggedInData()
    const url = `${AppSetting.provider.common}/${loggedInUserData.parentId}/transactions/${transactionId}/void`;
    return axios.post(url, {})
        .then(a => this.log(`fetched`))
        .catch(err=>{this.handleError(err)})
  },

  // /providers/{parentId}/{channelType}/transactions/{id}/cancellations
  skipTransaction(parentId, transactionId) {
    const url = `${AppSetting.provider.common}/${parentId}/transactions/${transactionId}/void`;
    return axios.post(url, {})
        .then(a => this.log(`fetched`))
        .catch(err=>{this.handleError(err)})
  },

  // POST : providers/{parentId:int}/transactions/{id}/adjustment
  adjustTransaction(providerId, transactionId, data) {
    const url = `${AppSetting.provider.common}/${providerId}/transactions/${transactionId}/adjustment` + this.buildQuery(data);
    return axios.post(url, null)
        .then(a => this.log(`fetched`))
        .catch(err=>{this.handleError(err)})
  },

  // /providers/{parentId}/transactions
  forceAuthTransaction(parentId, reqObj) {
    const url = `${AppSetting.provider.common}/${parentId}/transactions`;
    return axios.post(url, reqObj)
        .then(a => this.log(`fetched`))
        .catch(err=>{this.handleError(err)})
  },

  // /providers/id/transactions/id/offline
  offlineTransaction(providerId, transactionId, reqObj) {
    const url = `${AppSetting.provider.common}/${providerId}/transactions/${transactionId}/offline`;
    return axios.post(url, reqObj)
        .then(a => this.log(`fetched`))
        .catch(err=>{this.handleError(err)})
  },

  processTransaction(reqObj) {

    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.transaction.patientTransaction.replace('{patientId}', this.getLoggedInData()['parentId']);
    } else {
      url = AppSetting.transaction.add.replace('{providerId}', this.getLoggedInData()['parentId']);
    }
    return axios.post(url, reqObj)
        .then(a => { return a})
        .catch(err=>{this.handleError(err)})
  },

  handleError(error) {
    return (error) => {
      // TODO: send the error to remote logging infrastructure
     // console.catch(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`operation failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return console.log(error);
     // return Observable.throw(error.json().catch || error.message);
      // return of(result as T);
    };
  },

  /** Log a HeroService message with the MessageService */
  log(message) {
    // this.messageService.add('HeroService: ' + message);
  },
  getExceptionMessage(transactionDetails) {
    let msg = '';
    if (transactionDetails.reasonCode !== null) { // first preference is reasonCode
      msg = ProcessorException.processorExceptionMessages[transactionDetails.reasonCode];
    }
    if ((msg === '' || msg === null || msg === undefined) && transactionDetails.reasonStatus != null) { // second preference is reasonStatus
      msg = Exception.getExceptionMessage(transactionDetails.reasonStatus);
    }
    if (msg !== '' && msg !== null && msg !== undefined && msg !== 'Something went wrong. Please contact administrator.') {
      return msg;
      // Other than these keys, all other messages will be displayed directly as received from backend
    }
    return transactionDetails.reasonStatus;
  },

  // update transaction
  updateTransaction(reqObj) {
    const url = AppSetting.transaction.updateTransaction
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{transactionId}', reqObj.transactionId);
    return axios.put(url, reqObj)
      .then((a) => this.commonService.log(`added  w/ id`))
      .catch(this.commonService.handleError('add', {}))
  },
  getCardDetails(reqObj) {
    const url = AppSetting.transaction.getCardDetails + this.commonService.buildQuery(reqObj);
    return axios.get(url)
        .then(a => this.commonService.log(`fetched`))
        .catch(this.commonService.handleError('', []))
  },
  sendReceipt(transactionId, reqObj) {
    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.transaction.sendReceiptFromPatient
        .replace('{patientId}', this.getLoggedInData()['parentId'])
        .replace('{transactionId}', transactionId)
        + CommonService.buildQuery(reqObj);
    } else {
      url = AppSetting.transaction.sendReceipt
        .replace('{providerId}', this.getLoggedInData()['parentId'])
        .replace('{transactionId}', transactionId)
        + CommonService.buildQuery(reqObj);
    }
    return axios.get(url)
        .then(a => CommonService.log(`fetched`))
        .catch(CommonService.handleError('', []))
  },
  sendSchedule(recurringScheduleId, reqObj) {
    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.transaction.sendScheduleFromPatient
        .replace('{patientId}', this.getLoggedInData()['parentId'])
        .replace('{recurringScheduleId}', recurringScheduleId)
        + this.commonService.buildQuery(reqObj);
    } else {
      url = AppSetting.transaction.sendSchedule
        .replace('{providerId}', this.getLoggedInData()['parentId'])
        .replace('{recurringScheduleId}', recurringScheduleId)
        + this.commonService.buildQuery(reqObj);
    }
    return axios.get(url)
        .then(a => this.commonService.log(`fetched`))
        .catch(this.commonService.handleError('', []))
  }
}


export default TransactionService