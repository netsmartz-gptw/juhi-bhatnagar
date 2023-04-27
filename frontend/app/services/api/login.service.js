import AppSetting from '../../common/constants/appsetting.constant.js'
import axios from 'axios'
import UserTypeEnum from '../../common/enum/user-type.enum.js';
import StorageType from '../session/storage.enum.js';
import StorageService from '../session/storage.service.js';
import SettingsService from './settings.service.js';
import ThemeService from '../api/theme.service'

import { Navigate, useNavigate } from 'react-router-dom';

const LoginService = {
  Navigate() {
    return useNavigate()
  },
  login(data) {
    return axios.post(AppSetting.common.login, data)
      .then((res) => { return res })
      .catch((err) => { return err.response })

  },
  patientLogin(data) {
    let url = AppSetting.common.patientLogin
    return axios.post(url, data)
      .then(
        (res) => { return res }
      )
      .catch((err) => { return err }
      );
  },
  patientLoginOTP(data) {
    return axios.post(AppSetting.common.patientLoginOTP, data)
      .then(
        (res) => { return res }
      )
      .catch((err) => { return err }
      );
  },
  logOut(sessionTimedOut) {
    let settingData = JSON.parse(
      StorageService.get(StorageType.session, "settingsData")
    )
    console.log(settingData)
    try {
      this.userName = "";
      StorageService.remove(StorageType.session, "userDetails");
      StorageService.remove(StorageType.session, "auth");
      StorageService.remove(StorageType.session, "roleDetails");
      StorageService.remove(StorageType.session, "settingsData");
      StorageService.remove(StorageType.session, "providerList");
      StorageService.remove(StorageType.session, "providerSelected");
      StorageService.remove(StorageType.session, 'moduleDetails');
      StorageService.remove(StorageType.session, 'locale');
      StorageService.remove(StorageType.session, 'guestUser');
      SettingsService.setSettingsData(undefined);
    } catch (Exception) {
      this.userName = "";
      StorageService.remove(StorageType.session, "userDetails");
      StorageService.remove(StorageType.session, "auth");
      StorageService.remove(StorageType.session, "roleDetails");
      StorageService.remove(StorageType.session, "settingsData");
      StorageService.remove(StorageType.session, "providerList");
      StorageService.remove(StorageType.session, "providerSelected");
      StorageService.remove(StorageType.session, 'moduleDetails');
      StorageService.remove(StorageType.session, 'locale');
      StorageService.remove(StorageType.session, 'guestUser');
      SettingsService.setSettingsData(undefined);
    }
    // if(sessionTimedOut){
    //window.location.reload();
    // var openModals = document.querySelectorAll(".modal.ui");
    // if(openModals) {
    // for(let i = 0; i < openModals.length; i++) {
    // let modalHeader =  openModals[i].getElementsByClassName("header")
    // var closeButton : any = modalHeader[0].getElementsByClassName("close");
    // if(closeButton && closeButton.length > 0) {
    //simulate click on close button
    // closeButton[0].click();
    // }
    // }
    // }
    // }
    // CommonService.stopIdleSubscription();
    // if (settingData != null && settingData.providerName != null) {
    //   let newUrl = "/login/" + settingData.providerName;
    //   this.router.navigate([newUrl]);
    // } else {
    //   this.router.navigate(["/login"]);
    // }
    return settingData?.providerName
  },
  patientLoginViaOTP(data) {
    let url = AppSetting.common.patientLoginViaOTP
    return axios.post(url, data)
      .then(
        (res) => {return res }
      )
      .catch((err) => { return err }
      );
  },
  getloginUserData(userType, username, parentID) {
    let url;
    if (userType == 2) {
      url = AppSetting.common.getGlobalUserByUserName
        .replace('{username}', username);
    } else if (userType == 1) {
      url = AppSetting.common.getProviderUserByUserName
        .replace('{parentId}', parentID)
        .replace('{username}', username);
    } else if (userType === 0) {
      url = AppSetting.common.getPatientUserByUserName
        .replace('{parentId}', parentID)
        .replace('{username}', username);
    }
    return axios.get(url)
      .then(res => {
        return res
      }
      )
      .catch(err => { return err })
  },

  getProviderData(providerId) {
    let url = AppSetting.provider.globalGetProviderById.replace('{providerId}', providerId);
    return axios.get(url)
      .then(
        (res) => { console.log('get provider data', res.data); return res.data }
      )
      .catch((err) => { console.log(err); return err }
      );
  },
  getLogoTheme(providerName) {
    let providerSettings;
    if (providerName !== undefined) {
      return SettingsService.getProviderSettingsLogo(providerName)
        .then(responseLogo => {
          let logoDetails = responseLogo;
          return SettingsService.getProviderSettingsSkin(providerName)
            .then(responseSkin => {
              let SkinDetails = responseSkin;
              providerSettings = {
                logo: responseLogo.data.logo,
                skin: SkinDetails.data.skin,
                providerName: providerName
              };
              // console.log("provider settings", providerSettings)
              StorageService.save(StorageType.session, "settingsData", JSON.stringify(providerSettings));
              ThemeService.changeTheme(SkinDetails.data.skin);
              // this.isLoaderTheme = false;
              // this.isLoaderLogo = false;
              return providerSettings
            })
            .catch(err => {
              console.log(err);
              ThemeService.changeTheme(7);
              // this.isLoaderTheme = false;
              // this.isLoaderLogo = false;
              return err
            })
        })
        .catch(err => {
          console.log(err);
          ThemeService.changeTheme(7);
          // this.isLoaderTheme = false;
          // this.isLoaderLogo = false;
          return ({ 'error': err })
        })
    }
  },

  getloginUserDetail(userType, username, parentID) {
    // console.log("uT", userType)
    // console.log("uN", username)
    // console.log("pID", parentID)
    let url;
    url = AppSetting.common.getProviderUserDetail
      .replace('{parentId}', parentID)
      .replace('{username}', username);
    return axios.get(url)
      .then(
        res => { console.log('fetched', res.data); return res.data }
      )
      .catch(err => {
        console.log(err); return err
      })
  }
}
export default LoginService