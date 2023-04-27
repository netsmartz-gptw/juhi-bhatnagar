import StorageService from '../../services/session/storage.service'
import StorageType from '../../services/session/storage.enum'
import AppSetting from '../../common/constants/appsetting.constant'
import UserTypeEnum from '../../common/enum/user-type.enum.js'
import CommonService from '../../services/api/common.service'
import FeaturesEnum from '../../common/enum/features.enum'
import axios from 'axios'

const AccessRightsService = {
  getLoggedInUserModuleDetails() {
    return JSON.parse(StorageService.get(StorageType.session, 'moduleDetails'))
  },
  patientUser: {
    '101': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '102': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 },
    '103': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '131': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '132': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '201': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 }, // Manage_Provider
    '202': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 }, // Manage_Patient
    '301': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '302': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '351': { 'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '352': { 'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '354': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '355': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '401': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 }, // Prefrence_Rate_Plan
    '402': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 }, // Prefrence_Fees
    '501': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 }, // Manage_Provider_AllowedTransactionType
    '502': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 }, // Manage_Provider_Processor_Config
    '503': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 }, // Prefrence_ProviderBilling_Config
    '510': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '511': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 }
  },
  globalAdmin: {
    '2101': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2102': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 },
    '2103': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2131': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2132': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 },
    '2161': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2162': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2201': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 },  // Manage_Provider
    '2202': { 'addAccess': 1, 'deleteAccess': 0, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 },  // Manage_Patient
    '2203': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1 },  // ReportAccess_ProviderActivation
    '2301': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2302': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2303': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2351': { 'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2352': { 'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2353': { 'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2401': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2402': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },  // Defaults_Rate_Plan
    '2501': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },  // Manage_Provider_Processor_Config
    '2502': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '2503': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },  // Manage_Provider_AllowedTransactionType
    '2504': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },  // Prefrence_ProviderBilling_Config
    '2505': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1 },  // ReportAccess_ProviderBilling
    '2510': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 },
    '2511': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 },
    '2512': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1 },  // ReportAccess_Transaction
  },

  providerAdmin: {
    '1101': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '1102': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 },
    '1103': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '1201': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },  // Patient_Management
    '1202': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },  // Patient_Account
    '1203': { 'addAccess': 1, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1 },
    '1204': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 },
    '1210': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 1, 'modifyAccess': 1, 'viewAccess': 1 },
    '1301': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '1351': { 'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '1352': { 'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '1401': { 'addAccess': 1, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '1402': { 'addAccess': 0, 'deleteAccess': 1, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },
    '1403': { 'addAccess': 1, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 1, 'viewAccess': 1 },  // Transactions
    '1501': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1 },  // Allowed Transaction Type
    '1502': { 'addAccess': 0, 'deleteAccess': 0, 'executeAccess': 0, 'modifyAccess': 0, 'viewAccess': 1 }   // Processor Configuration
  },

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'))
  },

  getloggedInUserRoleDetails() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'))
  },

  setLoggedInUserModuleDetails(data) {
    // return loggedInUserModuleDetailsNew(data)
  },

  getAllowedTransactionTypesDetails() {
    return JSON.parse(StorageService.get(StorageType.session, 'allowedTransactionTypes'))
  },

  // Method to check Module Permission
  hasModuleAccessRedirect(moduleId) {
    // temp code to be removed after API Completion for module access for other entities
    if (this.loggedInUserData.userType != 1) {
      return
    }
    // temp code to be removed after API Completion for module access for other entities
    this.loggedInUserModuleDetails = this.getLoggedInUserModuleDetails()
    if (this.loggedInUserModuleDetails.hasOwnProperty(moduleId) && Boolean(JSON.parse(this.loggedInUserModuleDetails[moduleId]['hasAccess'])) === true) {
      return
    } else {
      StorageService.save(StorageType.local, 'unathorizedToAccessResource', JSON.stringify(true))
      CommonService.logOut()
    }
  },

  // Method to check Module Permission
  hasModuleAccess(moduleId) {
    this.loggedInUserData = this.getLoggedInData()
    this.loggedInUserModuleDetails = this.getLoggedInUserModuleDetails()
    if (this.loggedInUserModuleDetails && this.loggedInUserModuleDetails.hasOwnProperty(moduleId) && Boolean(JSON.parse(this.loggedInUserModuleDetails[moduleId]['hasAccess'])) === true) {
      return true
    } else {
      return false
    }
  },

  // Method to check Operation Permission
  hasAccess(requiredAccess) {
    this.loggedInUserData = this.getLoggedInData()
    if (this.loggedInUserData.roleId != null && this.loggedInUserData.roleId != '') {
      this.loggedInUserRoleDetails = this.getloggedInUserRoleDetails()
    } else {
      return true
    }

    if (this.loggedInUserRoleDetails.accessDetails.length > 0) {
      let featuresList = []
      this.loggedInUserRoleDetails.accessDetails.forEach(moduleDetail => {
        if (Boolean(JSON.parse(moduleDetail.hasAccess)) === true) {
          if(Array.isArray(moduleDetail.featureList)){
          featuresList.push(...moduleDetail.featureList)
          }
          else{
            featuresList.push(moduleDetail.featureList)
          }
        }
      })

      if (featuresList.length > 0) {
        let feature = featuresList.find(x => x?.featureId == requiredAccess);
        if (feature != undefined) {
          // console.log('feature access given'),
          return true
        } else {
          // console.log('this feature not accessible'),
          return false;
        }
      } else {
        // console.log('no feature access for this user'),
        return false;
      }

    } else {
      // console.log('no module access for this user')
      return false
    }

  },

  getAllFeatureAccessToUser() {
    return JSON.parse(StorageService.get(StorageType.session, 'permissions'))
  },

  setAllFeatureAccessToUser() {
    let array = this.convertEnumToArray(FeaturesEnum)

    let permission = {}

    array.forEach(element => {
      element.hasAccess = this.hasAccess(element.id)
      permission[element.name] = element.hasAccess
    })

    StorageService.save(StorageType.session, 'permissions', JSON.stringify(permission))
  },

  convertEnumToArray(enums) {
    const arrayObjects = []
    for (const [propertyKey, propertyValue] of Object.entries(enums)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue
      }
      arrayObjects.push({ id: propertyValue, name: propertyKey })
    }
    return arrayObjects
  },

  // /roles
  getRoleDetails() {
    this.loggedInUserData = this.getLoggedInData()
    let url = ''
    if (this.loggedInUserData.userType === 1) {  // Provider
      url = `${AppSetting.baseUrl}providers/${this.loggedInUserData.parentId}/roles/${this.loggedInUserData.roleId}`
    } else if (this.loggedInUserData.userType === 2) {  // Global
      url = `${AppSetting.baseUrl}roles/${this.loggedInUserData.roleId}`
    }
    return axios.get(url)
      .then(results => {
        const loggedInUserRoleDetails = {}
        let tempOperationId
        results['roleDetails'].forEach(function (item) {
          tempOperationId = item.operationId
          loggedInUserRoleDetails[tempOperationId] = item
        })
        StorageService.save(StorageType.session, 'roleDetails', JSON.stringify(loggedInUserRoleDetails))
        this.log(`fetched`)
      })
      .error(error => { this.handleError('', error) })
  },

  getModuleDetails(userDataResponse) {
    console.log(userDataResponse)
    const response = userDataResponse.accessDetails
    const loggedInUserModuleDetails = {}
    let tempModuleId
    response.forEach(function (item) {
      tempModuleId = item.moduleId
      loggedInUserModuleDetails[tempModuleId] = item
    })
    StorageService.save(StorageType.session, 'moduleDetails', JSON.stringify(loggedInUserModuleDetails))
    // this.setLoggedInUserModuleDetails(loggedInUserModuleDetails)
    this.setAllFeatureAccessToUser()

  },

  getModuleConfig(parentId) {
    let url = AppSetting.featuresaccess.getModuleConfig.replace('{parentId}', parentId)
    return axios.get(url)
      .then((res) => {
        console.log(res); return res
      })
      .catch(err => console.log(err))
  },

  getfeatureConfig(reqObj) {
    let loggedInUserData = this.getLoggedInData()
    let url
    if (reqObj.practiceId) {
      url = AppSetting.featuresaccess.getfeatureConfig.replace('{parentId}', reqObj.practiceId)
    }
    else {
      url = AppSetting.featuresaccess.getfeatureConfig.replace('{parentId}', loggedInUserData.parentId)
    }
    if (reqObj) { url = `${url}${this.buildQuery(reqObj)}` }

    return axios.get(url)
      .then(
        (res) => {
          res.data.data.forEach(element => {
            element.isSmsEnabled = Boolean(JSON.parse(element.isSmsEnabled))
            element.isEmailEnabled = Boolean(JSON.parse(element.isEmailEnabled))
          })
          const data = res.data.data
          return data
        })
      .catch(error => console.log('', error))
  },

  // Get Allowed Transaction Types for logged in user
  getAllowedTransactionType() {
    this.loggedInUserData = this.getLoggedInData()
    let url = ''
    if (this.loggedInUserData.userType === 1) {
    } else {
    }
    return axios.get(url)
      .then((a) => {
        const allowedTransactionTypes = a.map(item => item.channelType).filter((value, index, self) => self.indexOf(value) === index)
        StorageService.save(StorageType.session, 'allowedTransactionTypes', JSON.stringify(allowedTransactionTypes))
        console.log(`fetched`)
      })
      .error(error => this.handleError('', error))
  },

  buildQuery(data) {
    let queryData = "";
    for (const prop in data) {
      if (
        data[prop] !== "" &&
        data[prop] !== "undefined" &&
        data[prop] !== null
      ) {
        if (queryData === "") {
          queryData = "?" + prop + "=" + data[prop];
        } else {
          queryData += "&" + prop + "=" + data[prop];
        }
      }
    }
    return queryData;
  },
  parseModules(data) {
    return (
      [
        { key: 1, data: data.filter(obj => obj.moduleId === 1) },
        { key: 2, data: data.filter(obj => obj.moduleId === 2) },
        { key: 3, data: data.filter(obj => obj.moduleId === 3) },
        { key: 4, data: data.filter(obj => obj.moduleId === 4) },
        { key: 5, data: data.filter(obj => obj.moduleId === 5) },
        { key: 6, data: data.filter(obj => obj.moduleId === 6) },
        { key: 7, data: data.filter(obj => obj.moduleId === 7) },
        { key: 8, data: data.filter(obj => obj.moduleId === 8) },
        { key: 9, data: data.filter(obj => obj.moduleId === 9) },
        { key: 10, data: data.filter(obj => obj.moduleId === 10) },
        { key: 11, data: data.filter(obj => obj.moduleId === 11) },
        { key: 12, data: data.filter(obj => obj.moduleId === 12) },
        { key: 13, data: data.filter(obj => obj.moduleId === 13) },
        { key: 14, data: data.filter(obj => obj.moduleId === 14) },
        { key: 15, data: data.filter(obj => obj.moduleId === 15) },
        { key: 16, data: data.filter(obj => obj.moduleId === 16) },
        { key: 17, data: data.filter(obj => obj.moduleId === 17) },
      ]
    )
  },

  handleError(error) {
    // TODO: better job of transforming error for user consumption
    console.log(`operation failed: ${error.message}`)
    return this.throwError(error)
    // return of(result as T)
  },
}

export default AccessRightsService