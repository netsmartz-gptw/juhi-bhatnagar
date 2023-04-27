import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';

const FacilityService = {
  // loggedInUserData = {};
  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  // deleteFacility(data) {
  //   return this.commonAPIFuncService.delete(AppSetting.facility.add).pipe(
  //     tap(_ => this.log(`deleted id`)),
  //     catchError(this.handleError('delete'))
  //   );
  // }

  getFacilityList() {
    let parentId = this.getLoggedInData()['parentId'];
    let url;
    url = `${AppSetting.facility.get}?ParentID=${parentId}&IsActive=true`;
    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  getFacilityById(facilityId) {
    return axios.get(AppSetting.facility.getById + '/' + facilityId)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  activateFacility(facilityId, parentId) {
    const url = AppSetting.facility.common + '/' + facilityId + '/activations/';
    return axios.post(url, { parentId: parentId, id: facilityId })
      .then(a => axios.log(`fetched`))
      .catch(error => { console.log(error) })
  },

  deactivateFacility(facilityId, parentId) {
    const url = AppSetting.facility.common + '/' + facilityId + '/activations/';

    return axios.delete(url)
      .then(a => axios.log(`fetched`))
      .catch(error => { console.log(error) })
  },

  findFacility(data) {
    let url = '';
    url = AppSetting.facility.find + this.buildQuery(data);

    return axios.get(url)
      .then((a => axios.log(`fetched`))
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
  },

  addFacility(data) {

    return axios.post(AppSetting.facility.add, data)
      .then(a => axios.log(`added  w/ id`))
      .catch(error => { console.log(error) })
  },

  editFacility(data) {
    const url = AppSetting.facility.edit + '/' + data['id'];
    return axios.put(url, data)
      .then(a => axios.log(`added  w/ id`))
      .catch(error => { console.log(error) })
  },

  updateFacility(data) {

    return axios.put(AppSetting.facility.edit, data)
      .then(a => axios.log(`updated`))
      .catch(error => { console.log(error) })
  },


  deleteFacility(facilityId, parentId) {
    return axios.delete(AppSetting.facility.delete + '/' + facilityId)
      .then(a => axios.log(`added  w/ id`))
      .catch(error => { console.log(error) })
  },

  addSuperAdminToFacilityList(facilityList) {
    const obj = {};
    obj['id'] = this.getLoggedInData()['parentId'];
    obj['parentId'] = this.getLoggedInData()['parentId'];
    obj['facilityAdminUser'] = 'AdminUser';
    obj['facilityName'] = 'HelloPayment';
    facilityList.unshift(obj);
    return facilityList;
  },

  /** Log a HeroService message with the MessageService */
  // private log(message: string) {
  // this.messageService.add('HeroService: ' + message);
  // }
}

export default FacilityService
