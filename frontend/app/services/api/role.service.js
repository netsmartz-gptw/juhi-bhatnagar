import AppSetting from '../../common/constants/appsetting.constant';
// import Countries from 'src/app/common/constants/countries.constant';
import StorageType from '../session/storage.enum';
import StorageService from '../session/storage.service';
import axios from 'axios'

const RoleService = {

  loggedInUserData: {},

  roleList: [],

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  find(reqObj) {
    let loggedInUserData = this.getLoggedInData();

    let url = '';
    if (reqObj.practiceId) {
      url = AppSetting.role.find.replace('{providerId}', reqObj.practiceId);
    }
    else {
      url = AppSetting.role.find.replace('{providerId}', loggedInUserData.parentId);
    }
    url = `${url}${this.buildQuery(reqObj)}`;

    return axios.get(url)
      .then(a => { return a })
      .catch(err => { return err })
  },

  getById(roleId) {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.role.getById
      .replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{roleId}', roleId);

    return axios.get(url)
      .then(a => { return a })
      .catch(err => { return err })

  },

  add(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.role.add
      .replace('{providerId}', loggedInUserData.parentId);

    return axios.post(url, reqObj)
      .then(a => { return a })
      .catch(err => { return err })
  },

  update(reqObj, roleId) {
    let loggedInUserData = this.getLoggedInData();

    let url = '';
    url = AppSetting.role.edit
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{roleId}', roleId);

    return axios.put(url, reqObj)
      .then(a => { return a })
      .catch(err => { return err })
  },

  delete(roleId) { },




  activateRole(roleId) {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.role.activateDeactivateRole
      .replace('{parentId}', this.loggedInUserData.parentId)
      .replace('{roleId}', roleId);

    return axios.post(url, {})
      .then(a => axios.log(`fetched`))
      .catch(axios.handleError('', []))
  },

  deactivateRole(roleId) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    url = AppSetting.role.activateDeactivateRole
      .replace('{parentId}', this.loggedInUserData.parentId)
      .replace('{roleId}', roleId);

    return axios.delete(url)
      .then(a => axios.log(`fetched`))
      .catch(axios.handleError('', []))
  },

  buildQuery(data) {
    let queryData = '';
    for (const prop in data) {
      if (data[prop] !== '' && data[prop] !== 'undefined' && data[prop] !== null && data[prop].length !== 0) {
        if (queryData === '') {
          queryData = '?' + prop + '=' + data[prop];
        } else {
          queryData += '&' + prop + '=' + data[prop];
        }
      }
    }
    return queryData;
  },

  roleLookup(reqObj) {

    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.role.lookup
      .replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);

    return axios.get(url)
      .then(data => data)
      .catch(err => {
        console.log(err)
      })
  },


}

export default RoleService