import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';

let loggedInUserData = {};

const EligibilityService = {

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  find(reqObj) {
    loggedInUserData = getLoggedInData();
    let url = '';
    
    if (loggedInUserData.userType === 0) {
      url = AppSetting.eligibility.patientFind
        .replace('{patientId}', loggedInUserData.parentId);
    } else if (loggedInUserData.userType === 1) {
      url = AppSetting.eligibility.find
        .replace('{providerId}', loggedInUserData.parentId);
    }

    url = `${url}${this.buildQuery(reqObj)}`;

    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  add(reqObj) {
    loggedInUserData = getLoggedInData();
    let url = '';

    url = AppSetting.eligibility.add
      .replace('{providerId}', this.loggedInUserData.parentId);

    return axios.post(url, reqObj)
    .then(a => axios.log(`fetched`))
    .catch(error => { console.log(error) })
  },

  // update(reqObj, eligibilityId) {
  //   this.loggedInUserData = this.getLoggedInData();

  //   let url = '';
  //   url = AppSetting.eligibility.edit
  //     .replace('{providerId}', this.loggedInUserData.parentId)
  //     .replace('{eligibilityId}', eligibilityId);

  //   return this.commonAPIFuncService.put(url, reqObj).pipe(
  //     tap((a) => this.commonAPIFuncService.log(`added  w/ id`)),
  //     catchError(this.commonAPIFuncService.handleError('add', {}))
  //   );
  // }

  checkStatusNow(eligibilityId) {
    loggedInUserData = getLoggedInData();
    let url = '';

    url = AppSetting.eligibility.checkStatus
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{eligibilityId}', eligibilityId);
    // return this.commonAPIFuncService.put(url, {}).pipe(
    //   tap((a) => this.commonAPIFuncService.log(`deleted  w/ id`)),
    //   catchError(this.commonAPIFuncService.handleError('', []))
    // );
    return axios.put(url, {})
    .then((a) => axios.log(`deleted  w/ id`))
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
  }

}

export default EligibilityService
