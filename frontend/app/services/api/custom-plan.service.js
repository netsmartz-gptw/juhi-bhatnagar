import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';

const CustomPlanService = {

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
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

  addCustomPlan(reqObj) {
    const url = AppSetting.customPlans.add
      .replace('{parentId}', this.getLoggedInData()['parentId'])
    return axios.post(url, reqObj)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  editCustomPlan(reqObj) {
    const url = AppSetting.customPlans.edit
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      .replace('{customPlanId}', reqObj.id)

    return axios.post(url, reqObj)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  findCustomPlans(reqObj) {
    const url = AppSetting.customPlans.find
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      + this.buildQuery(reqObj);

    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

    getCustomPlanById(reqObj) {
    const url = AppSetting.customPlans.getById
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      .replace('{customPlanId}', reqObj.id);

    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  activateCustomPlan(reqObj) {
    const url = AppSetting.customPlans.activate
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      .replace('{customPlanId}', reqObj.customPlanId);

    return axios.post(url, {})
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },


  deactivateCustomPlan(reqObj) {
    const url = AppSetting.customPlans.deactivate
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      .replace('{customPlanId}', reqObj.customPlanId);

    return axios.delete(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  getcCustomPlanById(reqObj) {
    const url = AppSetting.customPlans.getById
      .replace('{parentId}', this.getLoggedInData()['parentId'])
      .replace('{customPlanId}', reqObj.customPlanId);

    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  }

}

export default CustomPlanService




