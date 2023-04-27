import StorageService from "../session/storage.service";
import StorageType from "../session/storage.enum";
import AppSetting from "../../common/constants/appsetting.constant";
import axios from "axios";

const AppointmentService = {
  loggedInUserData: {},
  findAppointmentData: {},
  isFromAddAppointment: false,

  getLoggedInData() {
    return JSON.parse(StorageService.get('session', "userDetails")
    );
  },

  findAppointment(reqObj) {
    let loggedInUserData = this.getLoggedInData();

    let url;
    // console.log(loggedInUserData)
    if (loggedInUserData.userType === 0) {
      url = AppSetting.appointment.getPatientAppointment.replace(
        "{patientId}",
        loggedInUserData.parentId
      );
    } else {
      url = AppSetting.appointment.findAppointment.replace(
        "{providerId}",
        loggedInUserData.parentId
      );
    }
    // console.log(this.buildQuery(reqObj))
    url = `${url}${this.buildQuery(reqObj)}`;
    return axios.get(url, reqObj)
      .then(res => { return res.data })
      .catch(err => { console.log(err) })
  },

  findAppointmentReportForAdmin(reqObj) {
    let url = AppSetting.appointment.getPatientAppointmentForAdmin;
    url = `${url}${this.buildQuery(reqObj)}`;
    return axios.get(url)
      .then((a) => axios.log(`fetched`))
      .catch(console.log("", []))
  },

  sendAptNotification(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.sendAptNotification
      .replace("{providerId}", loggedInUserData.parentId)
      .replace("{appointmentId}", reqObj.id);
    return axios.post(url, reqObj)
      .then((a) => { return a })
      .catch(err => { console.log(err); return err })
  },

  getAppointmentById(appointmentId) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.editAppointment
      .replace("{providerId}", loggedInUserData.parentId)
      .replace("{appointmentId}", appointmentId);
    return axios.get(url)
      .then((res) => { return res.data })
      .catch(console.log("", []))

  },
  practicePatientTypeLookup() {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.patientTypeLookup.replace(
      "{providerId}",
      loggedInUserData.parentId
    );
    return axios.get(url)
      .then((res) => { return res.data })
      .catch(console.log("", []))
  },

  getPracticeServiceTypeForLocation(locationId) {
    let loggedInUserData = this.getLoggedInData();
    console.log(loggedInUserData)
    let url = AppSetting.appointment.getPracticeServiceTypeForLocation
      .replace("{providerId}", loggedInUserData["parentId"])
      .replace("{locationId}", locationId);
    return axios.get(url)
      .then((res) => { return res.data })
      .catch(err => console.log(err))
  },
  statusLookup() {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.statusLookup.replace(
      "{providerId}",
      loggedInUserData.parentId
    );
    return axios.get(url).then((res) => { return res.data })
      .catch(console.log("", []))
  },
  practiceLocationLookup() {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.locationLookup.replace(
      "{providerId}",
      loggedInUserData?.parentId
    );
    return axios.get(url)
      .then((res) => { return res.data })
      .catch(err => {return err})
  },
  practiceLocation() {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.practiceLocation.replace(
      "{providerId}",
      loggedInUserData.parentId
    );
    return axios.get(url)
      .then((res) => { return res.data.selectResponse })
      .catch(err => console.log(err))
  },
  getLocationById(locationId) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.getPracticeLocationId.replace('{providerId}', loggedInUserData["parentId"])
      .replace('{locationId}', locationId)
    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => { this.handleError(err) })
  },
  addPracticeLocation(reqObj) {
    this.loggedInUserData = this.getLoggedInData()
    let url = AppSetting.appointment.addPracticeLocation.replace('{providerId}', this.loggedInUserData.parentId)
    return axios.post(url, reqObj)
      .then(res => { return res })
      .catch(err => { this.handleError('add') })
  },
  editPracticeLocation(reqObj, locationId) {
    this.loggedInUserData = this.getLoggedInData()
    let url = AppSetting.appointment.editPracticeLocation.replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{locationId}', locationId)
    return axios.put(url, reqObj)
      .then(res => { return res})
      .catch(err => { this.handleError(err) })
  },
  deletePracticeLocation(locationId) {
    this.loggedInUserData=this.getLoggedInData()
    let url= AppSetting.appointment.deletePracticeLocation.replace('{parentId}', this.loggedInUserData.parentId)
      .replace('{locationId}', locationId)
    return axios.delete(url)
    .then(res=>{return res})
    .catch(err=> {this.handleError(err)})
  },
  practiceLocationRoom() {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.roomLookup.replace(
      "{providerId}",
      loggedInUserData.parentId
    );
    // console.log(url)
    return axios.get(url)
      .then((res) => { return res.data.data.selectResponse })
      .catch(err => console.log(err))
  },
  addPracticeLocationRoom(reqObj) {
    this.loggedInUserData = this.getLoggedInData()
    let url = AppSetting.appointment.addPracticeLocationRoom.replace('{providerId}', this.loggedInUserData.parentId)
    return axios.post(url, reqObj)
      .then(res => { return res })
      .catch(err => { this.handleError('add') })
  },
  getLocationRoomById(locationRoomId) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.getPracticeLocationRoomId.replace('{providerId}', loggedInUserData["parentId"])
      .replace('{practiceLocationRoomId}', locationRoomId)
    return axios.get(url)
      .then(res => { return res.data })
      .catch(err => { this.handleError(err) })
  },
  editPracticeLocationRoom(reqObj, practiceLocationRoomId) {
    this.loggedInUserData = this.getLoggedInData()
    let url = AppSetting.appointment.editPracticeLocationRoom.replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{practiceLocationRoomId}', practiceLocationRoomId)
    return axios.put(url, reqObj)
      .then(res => { return res })
      .catch(err => { return err })
  },
  deletePracticeLocationRoom(practiceLocationRoomId) {
    this.loggedInUserData=this.getLoggedInData()
    let url= AppSetting.appointment.deletePracticeLocationRoom.replace('{parentId}', this.loggedInUserData.parentId)
      .replace('{practiceLocationRoomId}', practiceLocationRoomId)
    return axios.delete(url)
    .then(res=>{return res})
    .catch(err=> {this.handleError(err)})
  },
  practiceLocationRoomLookup(practiceLocationId) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.roomLookup.replace(
      "{providerId}",
      loggedInUserData.parentId
    );
    url = `${url}${this.buildQuery({ PracticeLocationId: practiceLocationId })}`
    // console.log(url)
    return axios.get(url).then(res => {
      // console.log("length of room lookup",res.data.data.selectResponse);
      let array = res.data.data.selectResponse.filter(element => element.practiceLocationId === practiceLocationId)
      return array
    }
    )
      .catch(err => console.log(err))
  },
  equipmentLookup(practiceLocationId) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.equipmentsLookup.replace(
      "{providerId}",
      loggedInUserData.parentId
    );
    url = `${url}${this.buildQuery({ PracticeLocationId: practiceLocationId })}`
    return axios.get(url).then((res) => {
      console.log(res.data.data);
      let array = res.data.data.filter(element => element.practiceLocationId === practiceLocationId)
      return array
    })
      .catch(err => console.log(err))
  },
  getUnavailableBlocks(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.unavailableBlocks.replace(
      "{providerId}",
      loggedInUserData.parentId
    );
    return axios.post(url, reqObj)
      .then((res) => { return res.data })
      .catch(err => console.log(err))
  },
  getAvailableRoomsForLocationAndService(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.availableRooms.replace(
      "{providerId}",
      loggedInUserData.parentId
    );
    url = `${url}${this.buildQuery(reqObj)}`;
    return axios.get(url).then((a) => axios.log(`fetched`))
      .catch(console.log("", []))
  },
  getAvailableEquipmentsForLocationAndService(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.availableEquipments.replace(
      "{providerId}",
      loggedInUserData.parentId
    );
    url = `${url}${this.buildQuery(reqObj)}`;
    return axios.get(url).then((a) => axios.log("added  w/ id"))
      .catch(console.log < any > ("add"))
  },
  addAppointment(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.findAppointment.replace(
      "{providerId}",
      loggedInUserData["parentId"]
    );
    return axios.post(url, reqObj)
      .then(a => { return a })
      .catch(err => {return err})
  },

  editAppointment(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.editAppointment
      .replace("{providerId}", loggedInUserData["parentId"])
      .replace("{appointmentId}", reqObj.id);
    return axios.put(url, reqObj)
	  .then((a) => { return a })
      .catch(err=>{return err})
  },

  deleteAppointment(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.deleteAppointment.replace(
      "{appointmentId}",
      reqObj.id
    ).replace("{providerId}", loggedInUserData.parentId)
    return axios.put(url, reqObj)
      .then(a => { return a })
      .catch(err => console.log(err))
  },

  checkAvailability(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.appointment.checkAvailability
      .replace("{providerId}", loggedInUserData.parentId)
    return axios.post(url, reqObj).then((res) => { return res.data.data })
      .catch(console.log("", []))
  },

  getMinMaxWorkingHours(reqObj) {
    let loggedInUserData = this.getLoggedInData();

    let url = AppSetting.appointment.getConfigurations.replace(
      "{providerId}",
      loggedInUserData.parentId
    );

    url = `${url}${this.buildQuery(reqObj)}`;

    return axios.get(url).then((a) => axios.log(`fetched`))
      .catch(console.log("", []))
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
  }
}

export default AppointmentService