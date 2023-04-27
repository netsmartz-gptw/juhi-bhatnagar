import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';

const ClaimsService = {

  loggedInUserData: {},

  getLoggedInData() {
    return JSON.parse(StorageService.get('session', 'userDetails'));
  },

  findClaims(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.claims.findClaims
      .replace('{providerId}', this.loggedInUserData.parentId);

    url = `${url}${this.buildQuery(reqObj)}`;
    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .error(error => { console.log(error) })
      );
  },

  getClaimsById(claimId, reqObj) {
    this.loggedInUserData = this.getLoggedInData();

    let url = AppSetting.claims.getClaimById
      .replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{claimId}', claimId);

    url = `${url}${this.buildQuery(reqObj)}`;
    return axios.get(url)
      .then((a) => axios.log(`fetched`))
      .error(error => console.log(error))
  },

  add(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.claims.add
      .replace('{providerId}', this.loggedInUserData.parentId);

    return axios.post(url, reqObj)
      .then(a => axios.log(`fetched`))
      .error(error => { console.log(error) })
  },

  update(reqObj, claimId) {
    this.loggedInUserData = this.getLoggedInData();

    let url = '';
    url = AppSetting.claims.edit
      .replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{claimId}', claimId);

    return axios.put(url, reqObj)
      .then((a) => axios.log(`added  w/ id`))
      .error(console.log('add', {}))
  },

  deleteClaim(claimId) {
    const url = AppSetting.claims.delete
      .replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{claimId}', claimId);
    return axios.delete(url)
      .then((a) => axios.log(`deleted  w/ id`))
      .error(console.log < any > ('delete'))
  },

  reschedule(reqObj, claimId) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.claims.reschedule
      .replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{claimId}', claimId);

    return axios.put(url, reqObj)
      .then(a => axios.log(`fetched`))
      .error(error => { console.log(error) })
  },

  checkStatusNow(claimId) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.claims.checkStatus
      .replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{claimId}', claimId);
    return axios.put(url, {})
      .then((a) => axios.log(`deleted  w/ id`))
      .error(error => { console.log(error) })
  },

  getClaimCount(reqObj) {
    this.loggedInUserData = this.getLoggedInData();

    let url = '';
    url = AppSetting.claims.getClaimCount
      .replace('{providerId}', this.loggedInUserData.parentId);

    return axios.post(url, reqObj)
      .then((a => axios.log(`fetched`))
        .error(error => { console.log(error) })
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

export default ClaimsService
