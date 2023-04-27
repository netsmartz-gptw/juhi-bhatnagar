import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
import CommonService from "../api/common.service"


const RecurringPaymentsService = {


  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  // /providers/{parentId}/recurringpayments
  findRecurringPayments(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url;
    if (loggedInUserData.userType == 0) {
      url = AppSetting.patientRecurringPayments.find
        .replace('{patientId}', loggedInUserData.parentId)
        + CommonService.buildQuery(reqObj);
    } else {
      url = AppSetting.recurringPayments.find
        .replace('{providerId}', loggedInUserData.parentId)
        + CommonService.buildQuery(reqObj);
    }

    return axios.get(url)
      .then((a => { return a.data.data }))
      .catch(error => { console.log(error) })
  },

  // /providers/{providerId}/recurringpayments/{recurringId}
  getRecurringPaymentsById(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url;
    if (loggedInUserData.userType == 0) {
      url = AppSetting.patientRecurringPayments.getById
        .replace('{patientId}', loggedInUserData.parentId)
        .replace('{recurringId}', reqObj.recurringId);
      // should .recurringId be patientId? or something else?
    } else {
      url = AppSetting.recurringPayments.getById
        .replace('{providerId}', loggedInUserData.parentId)
        .replace('{recurringId}', reqObj.recurringId);
      // should .recurringId be patientId? or something else?
    }

    return axios.get(url)
      .then(a => { return a.data })
      .catch(error => { console.log(error) })
  },

  // /providers/{parentId}/recurringpayments
  addRecurringPayment(reqObj) {
    const url = AppSetting.recurringPayments.add
      .replace('{providerId}', this.getLoggedInData()['parentId']);
    return axios.post(url, reqObj)
      .then(a => { return a })
      .catch(error => { console.log(error) })
  },

  updateRecurringPayment(reqObj) {
    const url = AppSetting.recurringPayments.getById
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{recurringId}', reqObj.recurringId);
    return axios.put(url, reqObj)
      .then(a => {return a})
        .catch(error => { console.log(error) })
  },

  addScheduleTransaction(reqObj) {
    const url = AppSetting.recurringPayments.addScheduleTransaction;
    return axios.post(url, reqObj)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  getPaymentScheduleFor90Day(reqObj) { // todo -- need to parentId from input parameter
    let url;
    url = AppSetting.patientRecurringPayments.scheduleByDay.replace('{patientId}', this.getLoggedInData()['parentId'])
      + this.commonService.buildQuery(reqObj);
    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  // please adjust to work 
  getPaymentSchedule(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url;
    if (loggedInUserData.userType == 0) {
      url = AppSetting.patientRecurringPayments.schedule
        .replace('{patientId}', loggedInUserData.parentId)
        // providerId not parent?
        .replace('{recurringId}', reqObj.recurringId);
    } else {
      url = AppSetting.recurringPayments.schedule
        .replace('{providerId}', loggedInUserData.parentId)
        // providerId not parentId?
        .replace('{recurringId}', reqObj.recurringId);
    }
    return axios.get(url)
      .then(a => { return a.data })
      .catch(error => { console.log(error) })
  },

  // /providers/{parentId}/recurringpayments/{id}
  editRecurringPayment(reqObj) {
    const url = AppSetting.recurringPayments.edit
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{recurringId}', reqObj.recurringId);
    return axios.put(url, reqObj)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  cancelPaymentPlan(reqObj) {
    const url = AppSetting.recurringPayments.cancelPaymentPlan
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{recurringId}', reqObj.id);
    return axios.post(url, reqObj)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  // /providers/{providerId}/recurringpayments/{recurringId}/activations
  activateRecurringPayment(reqObj) {
    const url = AppSetting.recurringPayments.activate
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{recurringId}', reqObj.recurringId);
    return axios.post(url, {})
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  getPaymentPlanReport(reqObj, selectedReportType) {
    let url;
    if (selectedReportType == 'past') {
      url = AppSetting.recurringPayments.report
        .replace('{providerId}', this.getLoggedInData()['parentId']) + this.commonService.buildQuery(reqObj);
    }
    if (selectedReportType == 'future') {
      url = AppSetting.recurringPayments.recurringScheduleReport
        .replace('{providerId}', this.getLoggedInData()['parentId']) + this.commonService.buildQuery(reqObj);
    }
    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },
  // /providers/{providerId}/recurringpayments/{recurringId}/activations
  deactivateRecurringPayment(reqObj) {
    const url = AppSetting.recurringPayments.deactivate
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{recurringId}', reqObj.recurringId);
    return axios.delete(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  getMaskedCardNo(cardNo) {
    var endNo = cardNo.substr(cardNo.length - 4, cardNo.length);
    var cardNumber = "****" + endNo
    return cardNumber;
  },

  getMaskedAccountNo(accNo) {
    const endNo = accNo.substr(accNo.length - 4, accNo.length);
    const accountNumber = '****' + endNo;
    return accountNumber;
  },

  updateAccount(recurringId, reqObj) {
    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.recurringPayments.updatePatientAccount
        .replace('{patientId}', this.getLoggedInData()['parentId'])
        .replace('{recurringId}', recurringId);
    } else {
      url = AppSetting.recurringPayments.updateAccount
        .replace('{providerId}', this.getLoggedInData()['parentId'])
        .replace('{recurringId}', recurringId);
    }
    return axios.put(url, reqObj)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },



}

export default RecurringPaymentsService;
