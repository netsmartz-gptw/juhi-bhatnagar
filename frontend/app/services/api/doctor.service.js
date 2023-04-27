import AppSetting from '../../common/constants/appsetting.constant';
import Countries from '../../common/constants/countries.constant';
import StorageType from '../session/storage.enum';
import StorageService from '../session/storage.service';
import axios from 'axios'

const DoctorService = {

  loggedInUserData: {},
  countryList: Countries,

  doctorList: [],

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  find(reqObj) {
    let loggedInUserData = this.getLoggedInData();

    let url = '';
    url = AppSetting.doctor.find.replace('{providerId}', loggedInUserData.parentId);
    url = `${url}${this.buildQuery(reqObj)}`;

    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => { console.log(err) })
  },
  findWithServices(reqObj) {
    let loggedInUserData = this.getLoggedInData();

    let url = '';
    url = AppSetting.doctor.findWithServices.replace('{providerId}', loggedInUserData.parentId);
    url = `${url}${this.buildQuery(reqObj)}`;

    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => { console.log(err) })
  },

  getById(doctorId) {
    let loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.doctor.getById
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{doctorId}', doctorId);

    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => { console.log(err) })

  },

  getNPIRegistry(reqObj) {
    //let loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.doctor.getNPIRegistry + this.buildQuery(reqObj);

    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => { console.log(err) })

  },

  add(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.doctor.add
      .replace('{providerId}', loggedInUserData.parentId);

    return axios.post(url, reqObj)
      .then(res => { return res })
      .catch(err => { return err })
  },

  update(reqObj, doctorId) {
    let loggedInUserData = this.getLoggedInData();

    let url = '';
    url = AppSetting.doctor.edit
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{doctorId}', doctorId);

    return axios.put(url, reqObj)
      .then((res) => { return res})
      .catch(err => {console.log(err); return err})
  },

  delete(doctorId, doctor) {
    let loggedInUserData = this.getLoggedInData()
    let url = AppSetting.doctor.delete.replace('{doctorId}', doctorId).replace('{providerId}', loggedInUserData.parentId)
    axios.delete(url)
      .then(res => { console.log('doctor deleted: ${doctorId}') })
      .catch(err => { console.log(err) })
  },

  linkDoctor(doctorId) {
    const url = AppSetting.doctor.link
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{doctorId}', doctorId);
    return axios.post(url, {})
      .then(res => { return res.data })
      .catch(err => { console.log(err) })
  },

  activatePractitioner(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.doctor.activateDeactivatePractitioners
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{doctorId}', reqObj.id);

    return axios.post(url, {})
      .then(res => { return res.data })
      .catch(err => { console.log(err) })
  },

  deactivatePractitioner(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url;
    url = AppSetting.doctor.activateDeactivatePractitioners
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{doctorId}', reqObj.id);

    return axios.delete(url)
      .then(res => { return res.data })
      .catch(err => { console.log(err) })
  },

  buildQuery(data) {
    let queryData = '';
    for (const prop in data) {
      if (data[prop] !== '' && data[prop] !== 'undefined' && data[prop] !== null && data[prop]?.length !== 0) {
        if (queryData === '') {
          queryData = '?' + prop + '=' + data[prop];
        } else {
          queryData += '&' + prop + '=' + data[prop];
        }
      }
    }
    return queryData;
  },

  // providers/{providerId}/patients/lookup
  doctorLookup(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.doctor.lookup
      .replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);

    return axios.get(url)
      .then(
        (res) => {
          let results = res.data;
          results.forEach(item=>{
            item.fullName = item.firstName[0]+' '+item.lastName
          })
          // console.log(results);
          return results
        })
      .catch(err => { console.log(err) })
  },

  doctorLookupByPracticelocation(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.doctor.practiceLocationDoctor
      .replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);

    return axios.get(url)
      .then(
        (res) => {
          return res.data
        })
      .catch(err => { console.log(err) })
  },

  doctorTypeLookup() {

     let loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.doctor.typeLookup
      .replace('{providerId}',  loggedInUserData.parentId);

    return axios.get(url).then(
      tap(_ => axios.log(`deleted id`)),
      catchError(axios.handleError('delete'))
    );
  },

  mapCountryName(countryId) {
    for (let i = 0; i < this.countryList.length; i++) {
      const element = this.countryList[i];
      if (this.countryList[i].countryId === countryId) {
        return this.countryList[i].name;
      }
    }
  },

  checkAvailability(doctorId, reqObj) {
     let loggedInUserData = this.getLoggedInData();

    let url = AppSetting.doctor.checkAvailability
      .replace('{providerId}',  loggedInUserData.parentId)
      .replace('{doctorId}', doctorId);

    url = `${url}${this.buildQuery(reqObj)}`;

    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => { console.log(err) })
  }

}

export default DoctorService