
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios';




const ProviderService = {
  loggedInUserData: {},
  findProviderData: {},
  isFromAddProvider: false,


  getLoggedInData() {
    return JSON.parse(StorageService.get('session', 'userDetails'))
  },

  getProviderData() {
    return JSON.parse(StorageService.get({ type: 'session', key: 'providerDetails' }));
  },

  findProvider(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.globalFindProvider;
    url = `${url}${this.buildQuery(reqObj)}`;
    return axios.get(url)
      .then(a => {return a})
        .catch(err=>{return err})
  },


  getProviderById(providerId) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.globalGetProviderById.replace('{providerId}', providerId);
    // console.log("url for get provider by id", url)
    return axios.get(url)
      .then((a => this.log(`fetched`))
        .catch(this.handleError('', []))
      );
  },

  getProviderDetails(providerId) {
    // console.log(providerId)
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.getProviderDetail.replace('{providerId}', providerId);
    // console.log(url)
    return axios.get(url)
      .then(a => { return a.data })
      .catch(err => { return err })
  },
  // /providers/{providerId},/activations
  activateProvider(providerId) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.activateProviderUnderGlobal.replace('{providerId}', providerId);
    return axios.post(url, {})
      .then(a => { return a })
      .catch(err => { return err })
  },
  addUnavailableBlock(data = {}, isAccount) {
    this.loggedInUserData = this.getLoggedInData();
    data = isAccount ? {...data, doctorId: this.loggedInUserData.doctorId} : data;
    let url = AppSetting.provider.addUnavailableBlock(this.loggedInUserData.parentId);
    return axios.post(url, data)
      .then(a => { return a.data })
      .catch(err => { this.handleError(err) })
  },

  getUnavailableBlock(payload) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.addUnavailableBlock(this.loggedInUserData.parentId);
    return axios.get(url, {
      params: payload
    }).then(a => {
      return a.data
    }).catch(err => {
      this.handleError(err)
    })
  },

  editUnavailableBlock(unavailableBlockId, data, isAccount) {
    this.loggedInUserData = this.getLoggedInData();
    data = isAccount ? {...data, doctorId: this.loggedInUserData.doctorId} : data;
    let url = AppSetting.provider.editUnavailableBlock(this.loggedInUserData.parentId, unavailableBlockId);
    return axios.put(url, data)
      .then(a => { return a.data })
      .catch(err => { this.handleError(err) })
  },

  deleteUnavailableBlock(unavailableBlockId) {
    this.loggedInUserData = this.getLoggedInData()
    let url= AppSetting.provider.deleteUnavailableBlock.replace('{parentId}', this.loggedInUserData.parentId)
    .replace('{unavailableBlockId}', unavailableBlockId)
    return axios.delete(url)
    .then(res=>{return res})
    .catch(err=> {this.handleError(err)})
  },
  getNoShow(payload) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.getNoShow(this.loggedInUserData.parentId);
    return axios.get(url, {
      params: payload
    }).then(a => {
      return a.data
    }).catch(err => {
      this.handleError(err)
    })
  },

  getProvidersForSelectedLocation(payload) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.getProvidersForSelectedLocation(this.loggedInUserData.parentId);
    return axios.get(url, {
      params: payload
    }).then(a => {
      return a
    }).catch(err => {
      {return err}
    })
  },

  createProvidersForSelectedLocation(payload) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.createProvidersForSelectedLocation(this.loggedInUserData.parentId);
    return axios.post(url, payload).then(a => {
      return a.data
    }).catch(err => {
      this.handleError(err)
    })
  },

  updateProvidersForSelectedLocation(payload, practiceLocationPractitionerId) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.updateProvidersForSelectedLocation(this.loggedInUserData.parentId, practiceLocationPractitionerId);
    return axios.put(url, payload).then(a => {
      return a.data
    }).catch(err => {
      this.handleError(err)
    })
  },

  deactivateProvider(providerId) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.deactivateProviderUnderGlobal.replace('{providerId}', providerId);
    return axios.delete(url)
      .then(a => { return a })
      .catch(err => { return err })
  },

  getAllActiveProviders() {
    const url = `${AppSetting.provider.get}/list`;
    return axios.get(url).then(a => this.log('fetched'))
      .catch(this.handleError('', []))
  },

  addProvider(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.addProviderUnderGlobal;
    return axios.post(url, reqObj).then(a => this.log('added  w/ id'))
      .catch(this.handleError < any > ('add'))
  },

  editProvider(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.provider.editProviderUnderGlobal.replace('{providerId}', reqObj.id);
    return axios.put(url, reqObj).then((a) => this.log(`added  w/ id`))
      .catch(this.handleError('add', {},))
  },

  emulate(reqObj) {
    // let loggedInUserData = this.getLoggedInData();
    const url = AppSetting.common.emulate
      .replace('{username}', reqObj.userName);
    return axios.post(url, reqObj).then(a => { return a })
      .catch(err => { return err })
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
    // TODO: send the error to remote logging infrastructure
    // console.catch(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    console.log(`operation failed: ${error.message},`);

    // Let the app keep running by returning an empty result.
    return console.log(error);
    // return Observable.throw(error.json().catch || error.message);
    // return of(result as T);
  }
}

export default ProviderService
