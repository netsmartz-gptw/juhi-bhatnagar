import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'

const PracticePatientService = {
  loggedInUserData: {},

  getLoggedInData() {
    return JSON.parse(StorageService.get('session', 'userDetails'));
  },

  addPatientType(data) {
    const parentId = this.getLoggedInData()['parentId'];
    let url = AppSetting.patient.addPatientType.replace("{patientId}",parentId);
    return axios.post(url, data)
        .then(res=>{return res.data})
        .catch(err => { this.handleError(err) })
  },

  editPatientType(data) {
    const parentId = this.getLoggedInData()['parentId'];
    let url = AppSetting.patient.editPatientType.replace("{patientId}",parentId).replace("{patientTypeId}", data.practicePatientTypeId);
    return axios.put(url, data)
        .then(res=>{return res.data})
        .catch(err => { this.handleError(err) })
  },

  deletePatientType(practicePatientTypeId) {
    const parentId = this.getLoggedInData()['parentId'];
    let url = AppSetting.patient.delete.replace("{parentId}",parentId).replace("{practicePatientTypeId}", practicePatientTypeId);
    return axios.delete(url)
        .then(res=>{return res.data})
        .catch(err => { this.handleError(err) })
  },

  practicePatientLookup(practiceLocationId) {
    let url = '';
    url = AppSetting.practicePatientType.lookup
      .replace('{parentId}', this.getLoggedInData().parentId);
    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => this.handleError('practice patient error', err))
  },
  log(message) {
    console.log(message)
  }
}
export default PracticePatientService