import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';

let loggedInUserData;

const InsuranceService = {


  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  getInsuranceList() {
    // return this.commonAPIFuncService.get(AppSetting.patient.getInsurancerPartner).pipe(
    //   tap(_ => this.commonAPIFuncService.log(`deleted id`)),
    //   catchError(this.commonAPIFuncService.handleError('delete'))
    // );
    return axios.get(AppSetting.patient.getInsurancerPartner)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  find(reqObj) {
    this.loggedInUserData = this.getLoggedInData();

    let url = '';
    url = AppSetting.insurance.find.replace('{providerId}', this.loggedInUserData.parentId);
    url = `${url}${this.buildQuery(reqObj)}`;

    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  getById(insuranceId) {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.insurance.getById
      .replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{insuranceId}', insuranceId);

    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );

  },

  add(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.insurance.add
      .replace('{providerId}', this.loggedInUserData.parentId);

    return axios.post(url, reqObj)
      .then(a => axios.log(`fetched`))
      .catch(error => { console.log(error) })
  },

  update(reqObj, insuranceId) {
    this.loggedInUserData = this.getLoggedInData();

    let url = '';
    url = AppSetting.insurance.edit
      .replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{insuranceId}', insuranceId)
    
    return axios.put(url, reqObj)
      .then((a) => axios.log(`added  w/ id`))
      .catch(console.log('add', {}))
  },

  delete(insuranceId) {

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

  linkInsurance(insuranceId) {
    const url = AppSetting.insurance.link
      .replace('{providerId}', this.getLoggedInData()['parentId'])
      .replace('{insuranceId}', insuranceId)
    return axios.post(url, {})
      .then(a => axios.log(`fetched`))
      .catch(error => { console.log(error) })
  },

}


export default InsuranceService
