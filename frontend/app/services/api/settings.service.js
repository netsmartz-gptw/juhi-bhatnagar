import StorageService from '../session/storage.service'
import StorageType from '../session/storage.enum'
import AppSetting from '../../common/constants/appsetting.constant'
import CommonService from './common.service'
import axios from 'axios'

const SettingsService = {
  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'))
  },

  setSettingsData(data) {
    this.settingsData = data
  },

  getSettingsData() {
    return this.settingsData.asObservable()
  },

  setProviderData(data) {
    providerData = data
  },

  getProviderData() {
    return this.providerData
  },

  setLogo(newValue) {
    logoURL = newValue
  },

  getLogo() {
    return logoURL.asObservable()
  },

  getSettings() {
    let loggedInUserData = this.getLoggedInData()
    let url = AppSetting.settings.getProviderSettings
      .replace('{providerId}', loggedInUserData.parentId)
    return axios.get(url).then(a => {
      const loggedInUserRoleDetails = a
      StorageService.save(StorageType.session, 'settingsData', JSON.stringify(loggedInUserRoleDetails))
      return a
    })
      .catch(err=>{console.log(err)})
  },


  updateSettings(data, file) {
    const url = AppSetting.settings.putProviderSettings.replace('{providerId}', this.getLoggedInData().parentId),

    formData = new FormData()
    formData.append('logo', file, `${this.getLoggedInData().parentId}_logo.png`)
    formData.append('skin', data.skin)
    axios.put(url, formData).then((a) => CommonService.log(`updated  w/ id`))
      .catch(CommonService.handleError('update', {}))
  },

  getProviderSettingsLogo(providerName) {
    const url = AppSetting.settings.getProviderSettingsLogo.replace('{providerId}', providerName)
    return axios.get(url)
      .then(a => {return a})
      .catch(error => {return error})
  },

  putProviderSettingsLogo(file) {
    let url = AppSetting.settings.putProviderSettingsLogo.replace('{providerId}', this.getLoggedInData().parentId),
    formData = new FormData()
    formData.append('logo', file, `${+new Date()}_logo.png`)
   return axios.put(url, formData)
      .then(a => {return true})
      .catch(error => {return error})
  },


  getProviderSettingsSkin(providerName) {
    const url = AppSetting.settings.getProviderSettingsSkin.replace('{providerId}', providerName)
    return axios.get(url)
      .then(a => {return a})
      .catch(error=>CommonService.handleError(error))
  },

  putProviderSettingsSkin(reqObj) {
    const url = AppSetting.settings.putProviderSettingsSkin.replace('{providerId}', this.getLoggedInData().parentId)
    return axios.put(url, reqObj)
      .then(a => {return a})
      .catch(error=>{return error})
  }

}

export default SettingsService