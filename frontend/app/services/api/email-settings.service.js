import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
let loggedInUserData = {};

const EmailSettingsService = {

  putEmailLogo(file, partnerId) {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    // if (this.loggedInUserData.userType === UserTypeEnum.MERCHANT) {
    //   url = AppSetting.emailSettings.putMerchantEmailLogo
    //     .replace('{merchantId}', this.getLoggedInData()['parentId']);
    // } else if (this.loggedInUserData.userType === UserTypeEnum.RESELLER) {
    //   url = AppSetting.emailSettings.putResellerEmailLogo
    //     .replace('{resellerId}', this.getLoggedInData()['parentId']);
    // } else if (this.loggedInUserData.userType === UserTypeEnum.GLOBAL) {
    //   url = AppSetting.emailSettings.putGlobalEmailLogo;
    // } else if (this.loggedInUserData.userType === UserTypeEnum.PARTNER) {
    //   url = AppSetting.emailSettings.putPartnerEmailLogo
    //     .replace('{merchantId}', this.loggedInUserData.merchantId)
    //     .replace('{partnerId}', this.loggedInUserData.parentId);
    // }

    if (AppSetting.baseUrl === 'https://api.hellopayments.net/') {  // temp fix for image upload is not working on PROD (As per discussion with Manoj)
      url = url.replace('https://api.hellopayments.net/', 'https://d1e8pu72ok79g.cloudfront.net/');
    }
    const formData = new FormData();
    formData.append('logo', file, `${+new Date()}_logo.png`);
    return axios.post(url, formData)
      .then(a => axios.log(`fetched`))
      .catch(error => { console.log(error) })
  },

  getEmailSettings() {
    this.loggedInUserData = this.getLoggedInData();
    let url;
    // if (this.loggedInUserData.userType === UserTypeEnum.MERCHANT) {
    //   url = AppSetting.emailSettings.getEmailSettingsForMerchant
    //     .replace('{merchantId}', this.getLoggedInData()['parentId']);
    // } else if (this.loggedInUserData.userType === UserTypeEnum.RESELLER) {
    //   url = AppSetting.emailSettings.getEmailSettingsForReseller
    //     .replace('{resellerId}', this.getLoggedInData()['parentId']);
    // } else if (this.loggedInUserData.userType === UserTypeEnum.GLOBAL) {
    //   url = AppSetting.emailSettings.getEmailSettingsForGlobal;
    // } else if (this.loggedInUserData.userType === UserTypeEnum.PARTNER) {
    //   url = AppSetting.emailSettings.getEmailSettingsForPartner
    //     .replace('{merchantId}', this.loggedInUserData.merchantId)
    //     .replace('{partnerId}', this.loggedInUserData.parentId);
    // }
    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  putEmailSettings(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = '';
    if (loggedInUserData.userType === 1) {
      url = AppSetting.emailSettings.putProviderEmailSettings
        .replace('{parentId}', loggedInUserData.parentId);
    }
    // else if (this.loggedInUserData.userType === UserTypeEnum.RESELLER) {
    //   url = AppSetting.emailSettings.putEmailSettingsForReseller
    //     .replace('{resellerId}', this.getLoggedInData()['parentId']);
    // } else if (this.loggedInUserData.userType === UserTypeEnum.GLOBAL) {
    //   url = AppSetting.emailSettings.putEmailSettingsForGlobal;
    // } else if (this.loggedInUserData.userType === UserTypeEnum.PARTNER) {
    //   url = AppSetting.emailSettings.putEmailSettingsForPartner
    //     .replace('{merchantId}', this.loggedInUserData.merchantId)
    //     .replace('{partnerId}', this.loggedInUserData.parentId);
    // }
    // return this.commonAPIFuncService.put(url, reqObj)
    //   .pipe(
    //     tap(a => this.commonService.log(`fetched`)),
    //     catchError(this.commonService.handleError('', []))
    //   );
    return axios.put(url, reqObj)
      .then(a=>{console.log(a);return a})
      .catch(error => { console.log(error) })
  },



  verifyIdentity(reqObj = null) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.emailSettings.verifyIdentity
      .replace('{parentId}', this.loggedInUserData.parentId);

    return axios.post(url, reqObj)
      .then(a => axios.log(`fetched`))
      .catch(error => { console.log(error) })
  },

  isVerifiedIdentity() {
    this.loggedInUserData = this.getLoggedInData();

    let url = '';

    url = AppSetting.emailSettings.isVerifiedIdentity
      .replace('{parentId}', this.loggedInUserData.parentId);

    return axios.get(url)
      .then(a => axios.log(`fetched`))
      .catch(error => { console.log(error) })
  },

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  }

}

export default EmailSettingsService
