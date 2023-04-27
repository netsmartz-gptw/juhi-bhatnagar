import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';

const PatientInsuranceService = {
  getLoggedInData() {
    return JSON.parse(StorageService.get('session', 'userDetails'));
  },

  add(reqObj, patientId) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    if (this.loggedInUserData.userType == 0) {
      url = AppSetting.patientInsurance.patientAdd
        .replace('{patientId}', this.loggedInUserData.parentId);
    } else if (this.loggedInUserData.userType == 1) {
      url = AppSetting.patientInsurance.add
        .replace('{providerId}', this.loggedInUserData.parentId)
        .replace('{patientId}', patientId);
    }

    return axios.post(url, reqObj)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  update(reqObj, patientInsuranceId, patientId) {
    this.loggedInUserData = this.getLoggedInData();

    let url = '';
    if (this.loggedInUserData.userType == 0) {
      url = AppSetting.patientInsurance.patientEdit
        .replace('{patientId}', this.loggedInUserData.parentId)
        .replace('{insuranceId}', patientInsuranceId);
    } else if (this.loggedInUserData.userType == 1) {
      url = AppSetting.patientInsurance.edit
        .replace('{providerId}', this.loggedInUserData.parentId)
        .replace('{patientId}', patientId)
        .replace('{insuranceId}', patientInsuranceId);
    }

    return axios.put(url, reqObj)
      .then((a => axios.log(`added  w/ id`))
        .catch(error => { console.log(error) })
      );
  },

  delete(patientInsuranceId, patientId) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    if (this.loggedInUserData.userType == 0) {
      url = AppSetting.patientInsurance.patientDelete
        .replace('{patientId}', this.loggedInUserData.parentId)
        .replace('{insuranceId}', patientInsuranceId);
    } else if (this.loggedInUserData.userType == 1) {
      url = AppSetting.patientInsurance.delete
        .replace('{providerId}', this.loggedInUserData.parentId)
        .replace('{patientId}', patientId)
        .replace('{insuranceId}', patientInsuranceId);
    }

    return axios.delete(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  getPatientInsuranceDetails(patientId) {
    let loggedInUserData = this.getLoggedInData();
    let url;

    if (loggedInUserData.userType == 0) {
      url = AppSetting.patientInsurance.patientFind
        .replace('{patientId}', loggedInUserData.parentId);
    } else if (loggedInUserData.userType == 1) {
      url = AppSetting.patientInsurance.find
        .replace('{providerId}', loggedInUserData.parentId)
        .replace('{patientId}', patientId);
    }

    return axios.get(url)
      .then(a => {return a.data.data})
        .catch(error => { console.log(error) })
  },

  updateInsuranceType(reqObj, patientInsuranceId, patientId) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    if (this.loggedInUserData.userType == 0) {
      url = AppSetting.patientInsurance.patientChangeType
        .replace('{patientId}', this.loggedInUserData.parentId)
        .replace('{insuranceId}', patientInsuranceId);
    } else if (this.loggedInUserData.userType == 1) {
      url = AppSetting.patientInsurance.changeType
        .replace('{providerId}', this.loggedInUserData.parentId)
        .replace('{patientId}', patientId)
        .replace('{insuranceId}', patientInsuranceId);
    }

    return axios.put(url, reqObj)
      .then((a => axios.log(`added  w/ id`))
        .catch(error => { console.log(error) })
      );
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
  }

}

export default PatientInsuranceService;
