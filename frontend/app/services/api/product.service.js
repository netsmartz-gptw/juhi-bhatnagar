import axios from 'axios'
import StorageService from '../session/storage.service';
import AppSetting from '../../common/constants/appsetting.constant';
import StorageType from '../session/storage.enum';
import CommonService from './common.service';
import UserTypeEnum from '../../common/enum/user-type.enum';

const ProductService = {
  // findMerchantData,
  isFromAddProduct: false,
  loggedInUserData: {},

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  productLookup(reqObj) {
    let url = '';

    url = AppSetting.product.lookup
      .replace('{parentId}', this.getLoggedInData()['parentId']) +

      CommonService.buildQuery(reqObj);

    return axios.get(url)
      .then(res => { return res.data })
      .catch(err =>{return err})
  },

  addProduct(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.product.add
      .replace('{parentId}', this.getLoggedInData()['parentId']);

    return axios.post(url, reqObj)
      .then(a => { return a})
      .catch(err => {return err})

  },

  editProduct(reqObj) {
    let url = '';
    url = AppSetting.product.edit
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      .replace('{productId}', reqObj.id);
    return axios.put(url, reqObj)
      .then(a => { return a.data })
      .catch(err => console.log(err))
  },

  findProduct(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.product.find
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      + CommonService.buildQuery(reqObj);

    return axios.get(url)
      .then(a => { return a.data })
      .catch(err => console.log(err))

  },
  getProductById(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.product.getById
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      .replace('{productId}', reqObj.id);

    return axios.get(url)
      .then(a => { return a.data })
      .catch(err => console.log(err))

  },

  addcustomTags(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.product.addCustomTags
      .replace('{parentId}', loggedInUserData.parentId);
    return axios.post(url, reqObj)
      .then(a => { return a })
      .catch(err => {return err})
  },

  getAllLookupTags() {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.product.getAllLookupTags
      .replace('{parentId}', this.getLoggedInData()['parentId']);

    return axios.get(url)
      .then(a => { return a })
      .catch(err => {return err})
  },
  getProductsCptCodes(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url;

    url = AppSetting.product.getProductsCptCodes
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      + CommonService.buildQuery(reqObj);

    return axios.get(url)
      .then(a => { return a.data })
      .catch(err => console.log(err))
  },
  activateProduct(id) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    url = AppSetting.product.activateDeactivateProducts
      .replace('{parentId}', this.loggedInUserData.parentId)
      .replace('{productId}', id);
    return axios.post(url, {})
      .then(a => { return a.data })
      .catch(err => console.log(err))
  },

  deactivateProduct(id) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    url = AppSetting.product.activateDeactivateProducts
      .replace('{parentId}', this.loggedInUserData.parentId)
      .replace('{productId}', id);

    return axios.delete(url)
      .then(a => { return a.data })
      .catch(err => console.log(err))

  },

  practiceLocationLookup() {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.locationLookup.replace(
      "{providerId}",
      loggedInUserData.parentId
    );
    return axios.get(url)
      .then((res) => { return res.data })
      .catch(err => console.log(err))
  },
}

export default ProductService