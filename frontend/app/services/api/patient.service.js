import AppSetting from '../../common/constants/appsetting.constant';
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
import CommonService from './common.service';
import UserTypeEnum from '../../common/enum/user-type.enum';
import axios from 'axios'

const PatientService = {

  sendMessage(message) {
    this.subject.next({ text: message });
  },
  getMessage() {
    return this.subject.asObservable();
  }, setSelectedPatient(id, name) {
    this.selectedPatientId = id;
    this.selectedPatientName = name;
  },
  setSelectedAccount(id, maskedCardNumber) {
    this.selectedAccountId = id;
    this.selectedAccountcardNumber = maskedCardNumber;
  }, getSelectedAccountId() {
    return this.selectedAccountId;
  },
  getSelectedAccountName() {
    return this.selectedAccountcardNumber;
  }, getSelectedPatientId() {
    return this.selectedPatientId;
  }, getSelectedPatientName() {
    return this.selectedPatientName;
  }, getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  }, getInsuranceList() {
    return axios.get(AppSetting.patient.getInsurancerPartner)
      .then(res => axios.log(`deleted id`))
      .catch(err => { axios.handleError('delete') })
  },
  setPatientUpdated(message) {
    this.patientUpdated.next({ text: message });
  },
  getPatientUpdated() {
    return this.patientUpdated.asObservable();
  },
  setPatientDataUpdated(message) {
    this.patientDataUpdated.next({ text: message });
  },
  getPatientDataUpdated(message) {
    return this.patientDataUpdated.asObservable();
  },
  getPatientData() {
    return this.patientData;
  },
  addNote(data, patientId) {
    this.loggedInUserData = this.getLoggedInData();

    const url = AppSetting.patient.addNote.replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{patientId}', patientId);
    //const url = 'http://10.197.1.67:8081/providers/{providerId}/patients'.replace('{providerId}', 'n1WxodVY');
    return axios.post(url, data)
      .then(a => this.log('added  w/ id'))
      .catch(err => { this.handleError('add') })

  },
  editNote(data, patientId, noteID) {
    this.loggedInUserData = this.getLoggedInData();

    const url = AppSetting.patient.addNote.replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{patientId}', patientId) + '/' + noteID;
    //const url = 'http://10.197.1.67:8081/providers/{providerId}/patients'.replace('{providerId}', 'n1WxodVY');
    return axios.put(url, data).then(a => this.log('added  w/ id'))
      .catch(err => { this.handleError('add') })

  },
  addPatient(data) {
    let loggedInUserData = this.getLoggedInData();

    const url = AppSetting.patient.addPatient.replace('{providerId}', loggedInUserData['parentId']);

    //const url = 'http://10.197.1.67:8081/providers/{providerId}/patients'.replace('{providerId}', 'n1WxodVY');
    return axios.post(url, data)
      .then(a => {
        return a
      })
      .catch(err => { 
        return err
      })

  },
  editPatient(data, patientId) {
    let loggedInUserData = this.getLoggedInData();
    let url = '';
    if (loggedInUserData.userType === 0) {
      url = AppSetting.patient.editForPatient.replace('{patientId}', loggedInUserData.parentId);
    } else if (loggedInUserData.userType === 1) {
      url = AppSetting.patient.edit.replace('{providerId}', loggedInUserData.parentId).replace('{patientId}',patientId);
    }
    return axios.put(url, data)
      .then(a => {
        return a
      })
      .catch(err => { 
        return err
      })

  },
  getPatientById(patientId) {
    console.log(patientId)
    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.wallet.edit + patientId;
    } else {
      url = AppSetting.patient.getPatientById.replace('{providerId}', this.getLoggedInData()['parentId']).replace('{patientId}',patientId)
    }

    return axios.get(url)
      .then(results => {
        return results
      }
      )
      .catch(err => { this.handleError(err) })
  },
  optInOptOutPatient(request) {
    const url = AppSetting.patient.optInOptOut;
    let providerInfo = JSON.parse( StorageService.get('session', 'providerSelected'))
    let reqObj = {...request, providerId: providerInfo.id, providerSuffix: providerInfo.providerUrlSuffix}
    return axios.post(url, reqObj)
      .then(res=>{return res.data})
      .catch(err => { this.handleError(err) })

  },
  linkPatient(request, parentId) {
    const url = AppSetting.patient.linkPatient
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{patientId}', request.id)
    return axios.post(url, request)

      .then(res=>{return res.data})
      .catch(err => { this.handleError(err) })
  },
  findNotes(reqObj) {
    const url = AppSetting.patient.getNotes
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      + this.buildQuery(reqObj);
    return axios.get(url)

      .then(res=>{return res.data})
      .catch(err => { this.handleError(err) })
  },
  inactivatePatient(patientId) {
    let loggedInUserData = this.getLoggedInData
    const url = AppSetting.patient.activatePatient
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{custId}', patientId)
    return axios.delete(url)

      .then(res=>{return res.data})
      .catch(err => { this.handleError(err) })
  },
  findPatient(reqObj) {
    let url;
    if (reqObj.AllActiveInactive) {
      // delete reqObj.isEnabled;
      delete reqObj.AllActiveInactive;
    }
    url = AppSetting.patient.findPatient.replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);
    //url ='http://10.197.1.67:8081/providers/{providerId}/patients'.replace('{providerId}', 'n1WxodVY') + this.buildQuery(reqObj);
    return axios.get(url)

      .then(res=>{return res.data.data})
      .catch(err => { this.handleError(err) })
  },
  fetchPatientAccount(patientId, reqObj) {
    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.wallet.findPatientAccount.replace('{custId}', patientId);
    } else {
      url = AppSetting.patient.findPatientAccount.replace('{providerId}', this.getLoggedInData()['parentId']).replace('{custId}', patientId);
    }
    // url=`${url}${this.buildQuery(reqObj)}`
    return axios.get(url)
      .then(res=>{return res.data.data})
      .catch(err => { this.handleError(err) })
  },
  getRecurringPaymentInfo(patientId, providerId) {
    let url;
    url = `${AppSetting.provider.get}/${providerId}/patients/${patientId}/recurringpayments`;
    return axios.get(url)

      .then(res=>{return res.data})
      .catch(err => { this.handleError(err) })
  },
  getInvoiceInfo(patientId, providerId, type) {
    let url;
    if (type === 'onetime') {
      url = `${AppSetting.provider.get}/${providerId}/patients/${patientId}/invoices`;
      return axios.get(url)

        .then(res=>{return res.data})
        .catch(err => { this.handleError(err) })
    }
    if (type === 'schedule') {
      url = `${AppSetting.provider.get}/${providerId}/patients/${patientId}/invoiceschedule`;
      return axios.get(url)

        .then(res=>{return res.data})
        .catch(err => { this.handleError(err) })
    }
  },
  isExistsPatient(reqObj) {
    let url;
    url = AppSetting.patient.isExists.replace('{providerId}', this.getLoggedInData()['parentId']).replace('{emailId}', reqObj.email);
    return axios.get(url)

      .then(a => this.commonService.log(`fetched`))
      .catch(this.commonService.handleError('', []))
  },
  addVisits(reqObj, parentId) {
    const url = AppSetting.patient.visits
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{patientId}', parentId);
    return axios.post(url, reqObj)

      .then(res=>{return res.data})
      .catch(err => { this.handleError(err) })
  },
  updateVisits(reqObj, patientId, visitId) {
    const url = AppSetting.patient.updateVisits
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{patientId}', patientId)
      .replace('{visitId}', visitId);
    return axios.put(url, reqObj)

      .then(res=>{return res.data})
      .catch(err => { this.handleError(err) })
  },
  findVisits(reqObj, patientId) {
    const url = AppSetting.patient.visits
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{patientId}', patientId)
      + this.buildQuery(reqObj);
    return axios.get(url)

      .then(res => {return res.data})
      .catch(err => { this.handleError(err) })
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
    } return queryData;
  },
  handleError(error) {
    return (error) => {
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`operation failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return console.log(error);
      // return Observable.throw(error.json().error || error.message);
      // return of(result as T);
    };
  },
  /** Log a HeroService message with the MessageService */
  log(message) {
    // this.messageService.add('HeroService: ' + message);
  },
}

export default PatientService