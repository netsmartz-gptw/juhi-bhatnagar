import axios from 'axios'
import StorageService from '../session/storage.service';
import AppSetting from '../../common/constants/appsetting.constant';
import StorageType from '../session/storage.enum';
import CommonService from './common.service';
import UserTypeEnum from '../../common/enum/user-type.enum';

const ServicesService = {
  // findMerchantData,
  isFromAddServices: false,
  loggedInUserData: {},

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  serviceLookup(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.service.find
      .replace('{parentId}', this.getLoggedInData()['parentId']) +
      CommonService.buildQuery(reqObj);

    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => console.log(err))
  },

  addService(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.service.add
      .replace('{parentId}', this.getLoggedInData()['parentId']);

    return axios.post(url, reqObj)
      .then(a => { return a.data })
      .catch(err => {console.log(err); return err} )

  },

  editService(reqObj) {
    let url = '';
    url = AppSetting.service.edit
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      .replace('{serviceId}', reqObj.id);
    return axios.put(url, reqObj)
      .then(a => { return a.data })
      .catch(err => console.log(err))
  },

  findService(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.service.find
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      + CommonService.buildQuery(reqObj);

    return axios.get(url)
      .then(a => { return a.data })
      .catch(err => console.log(err))

  },
  getServiceById(id) {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.service.getById
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      .replace('{serviceId}', id);

    return axios.get(url)
      .then(a => { return a.data })
      .catch(err => console.log(err))

  },

  addcustomTags(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.service.addCustomTags
      .replace('{parentId}', this.getLoggedInData()['parentId']);
    return axios.post(url, reqObj)
      .then(a => { return a.data })
      .catch(err => console.log(err))
  },

  getAllLookupTags() {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.service.getAllLookupTags
      .replace('{parentId}', this.getLoggedInData()['parentId']);

    return axios.get(url)
      .then(a => { return a.data })
      .catch(err => console.log(err))
  },
  getServicesCptCodes(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.service.getServiceCptCodes
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      + CommonService.buildQuery(reqObj);

    return axios.get(url)
      .then(a => { return a.data })
      .catch(err => console.log(err))
  },
  activateService(id) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    url = AppSetting.service.activateDeactivateServices
      .replace('{parentId}', this.loggedInUserData.parentId)
      .replace('{serviceId}', id);
    return axios.post(url, {})
      .then(a => { return a.data })
      .catch(err => console.log(err))
  },

  deactivateService(id) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    url = AppSetting.service.activateDeactivateServices
      .replace('{parentId}', this.loggedInUserData.parentId)
      .replace('{serviceId}', id);

    return axios.delete(url)
      .then(a => { return a.data })
      .catch(err => console.log(err))

  }
}

export default ServicesService