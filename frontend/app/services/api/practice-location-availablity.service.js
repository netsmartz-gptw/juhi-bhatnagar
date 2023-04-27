import StorageService from '../session/storage.service';
import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'

const PracticeLocationAvailabilityService = {
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


  practiceLocationAvailablity(reqObj) {
    let url = '';
    url = AppSetting.practiceLocationAvailablity.locationAvailablity
      .replace('{parentId}', this.getLoggedInData().parentId)+this.buildQuery(reqObj);
    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => console.log('lookup error', err))
  },

  
  createAvailability(reqObj) {
    let url = '';
    url = AppSetting.practiceLocationAvailablity.locationAvailablity
      .replace('{parentId}', this.getLoggedInData().parentId);
    return axios.post(url, reqObj)
      .then(res => { return res.data })
      .catch(err => console.log('lookup error', err))
  },

  deleteAvailability(practiceLocationAvailabilityId) {
    this.loggedInUserData = this.getLoggedInData()
    let url=AppSetting.practiceLocationAvailablity.deleteAvailability.replace('{parentId}',this.loggedInUserData.parentId)
    .replace('{availabilityId}',practiceLocationAvailabilityId)
    return axios.delete(url)
    .then(res=> {return res})
    .catch(err => console.log(err))
  },

  updateAvailability(reqObj, id) {
    let url = '';
    url = AppSetting.practiceLocationAvailablity.locationAvailablity
      .replace('{parentId}', this.getLoggedInData().parentId) + `/${id}`;
    return axios.put(url, reqObj)
      .then(res => { return res.data })
      .catch(err => console.log('lookup error', err))
  }
}

export default PracticeLocationAvailabilityService