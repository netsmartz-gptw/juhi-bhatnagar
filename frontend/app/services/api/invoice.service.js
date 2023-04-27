import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';

const InvoiceService = {

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  setSelectedStatuses(status = false) {
    this.filterByStatus = status;
  },

  getSelectedStatuses() {
    return this.filterByStatus;
  },

  findInvoice(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = '';
    if (loggedInUserData?.userType === 0) {
      url = AppSetting.invoice.patientInvoice
        .replace('{patientId}', loggedInUserData.parentId);
    } else if (loggedInUserData?.userType === 1) {
      url = AppSetting.invoice.findInvoice
        .replace('{providerId}', loggedInUserData.parentId);
    }
    url = `${url}${this.buildQuery(reqObj)}`;

    return axios.get(url)
      .then((a => { return a.data.data }))
      .catch(error => { console.log(error) })
  },

  //https://atg96ts3g3.execute-api.us-east-2.amazonaws.com/v1/providers/n3WB8xog/invoices/6RWPDjW1

  getInvoiceById(invoiceId) {
    let loggedInUserData = this.getLoggedInData();

    let url = '';

    if (loggedInUserData.userType === 0) {
      url = AppSetting.invoice.getInvoiceByIdForPatient
        .replace('{patientId}', loggedInUserData.parentId)
        .replace('{invoiceId}', invoiceId);
    } else if (loggedInUserData.userType === 1) {
      url = AppSetting.invoice.getInvoiceById
        .replace('{providerId}', loggedInUserData.parentId)
        .replace('{invoiceId}', invoiceId);
    }

    return axios.get(url)
      .then(a => { return a.data })
      .catch(error => { console.log(error) })

  },

  addInvoice(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    const url = AppSetting.invoice.addInvoice
      .replace('{providerId}', this.loggedInUserData.parentId);

    return axios.post(url, reqObj)
      .then(a => { 
        return a 
      })
      .catch(error => { 
        console.log(error) 
        return error
      })
  },

  editInvoice(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    const url = AppSetting.invoice.editInvoice
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{invoiceId}', reqObj.invoiceId);

    return axios.put(url, reqObj)
      .then(a => { 
        return a 
      })
      .catch(error => { 
        console.log(error) 
        return error
      })
  },

  deleteInvoice(invoiceId) {
    const url = AppSetting.invoice.deleteInvoice
      .replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{invoiceId}', invoiceId);

    return axios.delete(url)
      .then((a => axios.log(`deleted  w/ id`))
        .catch(error => { console.log(error) })
      );
  },

  resendInvoice(invoiceId, reqObj) {
    const url = AppSetting.invoice.resendInvoice
      .replace('{invoiceId}', invoiceId);

    return axios.post(url, reqObj)
      .then(a => { return a })
      .catch(error => { return error })
  },

  finalizeInvoice(invoiceId) {
    let loggedInUserData = this.getLoggedInData();
    const url = AppSetting.invoice.finalizeInvoice
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{invoiceId}', invoiceId);

    return axios.post(url, {})
      .then(a => axios.log(`added  w/ id`))
      .catch(error => { console.log(error) })
  },

  getInvoiceCount(reqObj) {
    this.loggedInUserData = this.getLoggedInData();

    let url = '';
    url = AppSetting.invoice.getInvoiceCount
      .replace('{providerId}', this.loggedInUserData.parentId);

    return axios.post(url, reqObj)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );

  },

  closeAndWriteOff(invoiceId, reqObj) {
    let loggedInUserData = this.getLoggedInData()
    const url = AppSetting.invoice.closeInvoice
      .replace('{providerId}', 
      loggedInUserData.parentId)
      .replace('{invoiceId}', invoiceId);
    return axios.post(url, reqObj)
      .then(a =>{return a})
        .catch(error => { console.log(error) })
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

  payment(invoiceId, reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    const url = AppSetting.invoice.payments
      .replace('{invoiceId}', invoiceId);

    return axios.post(url, reqObj)
      .then(a => { return console.log(a) })
      .catch(error => { console.log(error); return error; })
  },

  schedulePayment(invoiceId, reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    const url = AppSetting.invoice.schedulepayment
      .replace('{invoiceId}', invoiceId);

    return axios.post(url, reqObj)
      .then((a => axios.log(`added  w/ id`))
        .catch(error => { console.log(error) })
      );
  },

  // /providers/{parentId}/recurringpayments
  addRecurringPayment(invoiceId, reqObj) {
    const url = AppSetting.invoice.recurringpayment
      .replace('{invoiceId}', invoiceId);

    return axios.post(url, reqObj)
      .then(a => {return a})
        .catch(error => {return error })
  },

  getInvoiceStatusReport(reqObj) {
    const url = AppSetting.invoice.statusreport
      .replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);
    return axios.get(url)
      .then(a => { return a.data })
      .catch(error => { console.log(error) })
  },

  // https://atg96ts3g3.execute-api.us-east-2.amazonaws.com/v1/providers/n3WB8xog/invoices/6RWPDjW1

  getTaxReport(reqObj) {
    const url = AppSetting.invoice.taxreport
      .replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);

    return axios.get(url)
      .then((a => a.data))
      .catch(error => { console.log(error) })
  }

}

export default InvoiceService
