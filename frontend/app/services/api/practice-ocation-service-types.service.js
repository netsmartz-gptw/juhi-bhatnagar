import axios from 'axios'
import StorageService from '../session/storage.service';
import AppSetting from '../../common/constants/appsetting.constant';
import StorageType from '../session/storage.enum';
import CommonService from './common.service';

const PracticeLocationServiceTypesService = {
  // findMerchantData,
  isFromAddProduct: false,
  loggedInUserData: {},

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  getPossibleServiceTypes(reqObj) {
    let url = '';
    url = AppSetting.practiceLocationServiceTypes.possibleServiceTypes
      .replace('{parentId}', this.getLoggedInData()['parentId']) +

      CommonService.buildQuery(reqObj);

    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => console.log(err))
  },

  getPossibleServiceTypesByLocation(locationId) {
    let url = '';
    url = AppSetting.practiceLocationServiceTypes.getServiceTypes
      .replace('{parentId}', this.getLoggedInData()['parentId']).replace('{locationId}', locationId);

    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => console.log(err))
  },

  
  selectLocationType(payload) {
    let url = '';
    url = AppSetting.practiceLocationServiceTypes.selectServiceType
      .replace('{parentId}', this.getLoggedInData()['parentId']);

    return axios.post(url, payload)
      .then(res => { return res.data })
      .catch(err => console.log(err))
  },

  
  unselectLocationType(locationId) {
    let url = '';
    url = AppSetting.practiceLocationServiceTypes.unselectServiceType
      .replace('{parentId}', this.getLoggedInData()['parentId']).replace('{practiceLocationServiceTypeId}', locationId);

    return axios.delete(url)
      .then(res => { return res.data })
      .catch(err => console.log(err))
  },

}

export default PracticeLocationServiceTypesService