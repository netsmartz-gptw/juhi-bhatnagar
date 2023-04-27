import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
import CommonService from './common.service';

let loggedInUserData = {};

const NotificationService = {

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  allNotifications(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.plforms.submissionsProvider.replace('{parentId}', loggedInUserData.parentId);

    url = `${url}${CommonService.buildQuery(reqObj)}`;

    return axios.get(url)
      .then(a => { return a.data.data })
      .catch(error => { console.log(error) })
  },
  communicationsLookup(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.notification.getCommunications.replace('{parentId}', loggedInUserData.parentId);

    url = `${url}${CommonService.buildQuery(reqObj)}`;

    return axios.get(url)
      .then(a => { return a })
      .catch(error => { return error })
  },

  dismiss(submissionId, data) {
    let loggedInUserData = this.getLoggedInData();

    const reqObj = {
      ...data,
      providerId: loggedInUserData.parentId,
    };

    let url;
    url = AppSetting.plforms.updateSubmission
      .replace('{submissionId}', submissionId);

    return axios.put(url, reqObj)
      .then(a => { return a.data })
      .catch(error => { console.log(error) })
  }

}

export default NotificationService