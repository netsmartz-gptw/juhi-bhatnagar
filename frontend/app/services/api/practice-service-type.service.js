import StorageService from '../session/storage.service';
import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'

const PracticeServiceTypeService = {
  loggedInUserData: {},

  getLoggedInData() {
    return JSON.parse(StorageService.get('session', 'userDetails'));
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

  handleError(error) {
    console.log(`error failed: ${error.message}`);
    return console.log(error);
  },

  practiceServiceTypeLookup() {
    let url = '';
    url = AppSetting.practiceServiceType.find
      .replace('{parentId}', this.getLoggedInData().parentId)
    return axios.get(url)
      .then(res => { return res })
      .catch(err => this.handleError('lookup error', err))
  },

  deletePracticeServiceType(practiceServiceTypeId) {
    let url = '';
    url = AppSetting.practiceServiceType.delete
      .replace('{parentId}', this.getLoggedInData().parentId).replace('{practiceServiceTypeId}', practiceServiceTypeId)
    return axios.delete(url)
      .then(res => { return res })
      .catch(err => this.handleError('lookup error', err))
  },

  serviceTypeByPracticeServiceTypeId (reqObj) {
    let url = '';
    url = AppSetting.practiceServiceType.getByServiceTypeId.replace('{parentId}', this.getLoggedInData().parentId)+this.buildQuery(reqObj)
    return axios.get(url)
      .then(res => { return res })
      .catch(err => {return err})
  },
  addPracticeServiceType(data) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.practiceServiceType.add
      .replace('{parentId}', this.getLoggedInData().parentId);
    return axios.post(url, data)
      .then(res => { this.log(res); return res })
      .catch(err => { console.log(err) }
      );
  },

  editPracticeServiceType(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.practiceServiceType.edit
      .replace('{parentId}', this.getLoggedInData().parentId)
      .replace('{practiceServiceTypeId}', reqObj.practiceServiceTypeId);

    return axios.put(url, reqObj)
      .then((res) => { console.log(`added  w/ id`); return res })
      .catch(err => this.handleError(err))
  },

  getPracticeServiceTypeById(practiceServiceTypeId) {
    let url = AppSetting.practiceServiceType.getById.replace('{practiceServiceTypeId}', practiceServiceTypeId).replace('{parentId}', this.getLoggedInData().parentId);
    return axios.get(url)
      .then(
        res => {
          this.log(`fetched`);
          return res
        }
      )
      .catch(err => { this.handleError(err) });
  },

  masterServiceTypeLookup() {
    let url = '';
    url = AppSetting.practiceServiceType.masterServiceType.replace('{parentId}', this.getLoggedInData().parentId);
    return axios.get(url)
      .then(res => { return res})
      .catch(err => this.handleError('lookup error', err))
  },

  getServiceCodes() {
    let url = '';
    url = AppSetting.practiceServiceType.serviceCodes.replace('{parentId}', this.getLoggedInData().parentId);
    url = `${url}${this.buildQuery({Type:1})}`;
    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => this.handleError('lookup error', err))
  },

  log(message) {
    console.log(message)
  }
}
export default PracticeServiceTypeService