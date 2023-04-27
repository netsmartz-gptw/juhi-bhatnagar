import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'

const EquipmentService = {
  loggedInUserData: {},

  getLoggedInData() {
    return JSON.parse(StorageService.get('session', 'userDetails'));
  },

  getEquipmentTypeById(equipmentId) {
    // console.log(equipmentId)
    let url = AppSetting.equipmentType.getById.replace('{id}', equipmentId).replace('{parentId}', this.getLoggedInData().parentId);
    return axios.get(url)
      .then(
        res => {
          this.log(`fetched`);
          return res
        }
      )
      .catch(err => { this.handleError(err) });
  },

  // activateEquipment(equipmentId, parentId) {
  //   const url = AppSetting.equipment.common + '/' + equipmentId + '/activations/';
  //   return axios.post(url, {parentId: parentId, id: equipmentId})
  //     
  //       tap(a => this.log(`fetched`)),
  //       catchError(this.handleError('', []))
  //     );
  // }

  deactivateEquipment(equipmentId) {
    const url = AppSetting.equipment.common + '/' + equipmentId + '/activations/';
    return axios.delete(url)
      .then(res => { return res.data })
      .catch(err => { console.log(err) }
      );
  },

  findMasterEquipmentType(data) {
    let url = '';
    url = AppSetting.masterEquipmentType.find + this.buildQuery(data);

    return axios.get(url)
      .then(res => { this.log(`fetched`); return res.data })
      .catch(err => { this.handleError(err) })
  },

  findEquipmentType(reqObj) {
    let url = '';
    url = AppSetting.equipmentType.find.replace('{parentId}', this.getLoggedInData().parentId);
    url = `${url}${this.buildQuery(reqObj)}`;
    console.log('find equipment type url', url)
    return axios.get(url)
      .then(res => { this.log('findEquipmentType', res); return res.data })
      .catch(err => { this.handleError(err) })
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

  addMasterEquipmentType(data) {
    return axios.post(AppSetting.masterEquipmentType.add, data)
      .then(res => { res.data })
      .catch(err => { console.log(err) }
      );
  },

  editMasterEquipmentType(data) {
    const url = AppSetting.masterEquipmentType.edit
      .replace('{id}', data['masterEquipmentTypeId'])
    return axios.put(url, data)
      .then(res => { return res.data })
      .catch(err => { console.log(err) }
      );
  },

  addEquipmentType(data) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.equipmentType.add
      .replace('{parentId}', this.getLoggedInData().parentId);
    return axios.post(url, data)
      .then(res => { this.log(res); return res })
      .catch(err => { console.log(err) }
      );
  },
  editEquipmentType(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.equipmentType.edit
      .replace('{parentId}', this.getLoggedInData().parentId)
      .replace('{id}', reqObj.equipmentTypeId);

    return axios.put(url, reqObj)
      .then((res) => { console.log(`added  w/ id`); return res })
      .catch(err => this.handleError(err))
  },
  deleteEquipmentType(equipmentId) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.equipmentType.delete.replace('{parentId}', this.loggedInUserData['parentId']).replace('{id}', equipmentId)
    return axios.delete(url)
      .then((res) => { return res })
      .catch(err => this.handleError(err))
  },
  equipmentTypeLookup() {
    let url = '';
    url = AppSetting.equipmentType.lookup
      .replace('{parentId}', this.getLoggedInData().parentId);
    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => this.handleError('equipment lookup error', err))
  },
  masterEquipmentTypeLookupForProvider() {
    let url = '';
    url = AppSetting.masterEquipmentType.lookup
      .replace('{parentId}', this.getLoggedInData()['parentId']);
    return axios.get(url)
      .then(res => { console.log(`deleted id`); return res.data })
      .catch(err => { this.handleError(err) })
  },
  masterEquipmentTypeLookup() {
    let url = '';
    url = AppSetting.masterEquipmentType.lookupForGlobal;
    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => { this.handleError(err) })
  },
  handleError(error) {
    // TODO: send the error to remote logging infrastructure

    // TODO: better job of transforming error for user consumption
    console.log(`error failed: ${error.message}`);
    // Let the app keep running by returning an empty result.
    // return Observable.throw(error.json().catch || error.message);
    return console.log(error);
    // return of(result as T);
  },

  addEquipment(data) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.equipment.add
      .replace('{parentId}', this.getLoggedInData().parentId);
    return axios.post(url, data)
      .then(res => { this.log(res); return res })
      .catch(err => { console.log(err) }
      );
  },
  editEquipment(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = '';
    url = AppSetting.equipment.edit
      .replace('{parentId}', this.getLoggedInData().parentId)
      .replace('{equipmentId}', reqObj.equipmentId);

    return axios.put(url, reqObj)
      .then((res) => { console.log(`added  w/ id`); return res })
      .catch(err => this.handleError(err))
  },
  deleteEquipment(equipmentId) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.equipment.delete.replace('{parentId}', loggedInUserData['parentId']).replace('{equipmentId}', equipmentId)
    return axios.delete(url)
      .then((res) => { return res })
      .catch(err => this.handleError(err))
  },
  equipmentLookup(practiceLocationId) {
    let url = '';
    url = AppSetting.equipment.getEquipmentByLocationId
      .replace('{parentId}', this.getLoggedInData().parentId).replace('{locationId}',practiceLocationId);
    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => this.handleError('equipment lookup error', err))
  },
  getEquipmentById(equipmentId) {
    // console.log(equipmentId)
    let url = AppSetting.equipment.getById.replace('{equipmentId}', equipmentId).replace('{parentId}', this.getLoggedInData().parentId);
    return axios.get(url)
      .then(
        res => {
          this.log(`fetched`);
          return res
        }
      )
      .catch(err => { this.handleError(err) });
  },
        // server.post('/providers/:parentId/equipments', interceptor(this.commonHelper, this.addEquipment.bind(this)));

        // server.get('/providers/:parentId/equipments', interceptor(this.commonHelper, this.findEquipments.bind(this)));

        // server.put('/providers/:parentId/equipments/:equipmentId', interceptor(this.commonHelper, this.updateEquipments.bind(this)));

        // server.get('/providers/:parentId/equipments/available', interceptor(this.commonHelper, this.getAvailableEquipmentsForLocationAndSlot.bind(this)));

        // server.get('/providers/:parentId/equipments/lookup', interceptor(this.commonHelper, this.lookUpEquipments.bind(this)));

        // server.get('/providers/:parentId/equipments/:equipmentId', interceptor(this.commonHelper, this.getEquipmentById.bind(this)));

        // server.get('/providers/:parentId/equipments/location/:locationId', interceptor(this.commonHelper, this.getEquipmentByLocationId.bind(this)));

  /** Log a HeroService message with the MessageService */
  log(message) {
    console.log(message)
  }
}
export default EquipmentService