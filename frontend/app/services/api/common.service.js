import StorageService from '../session/storage.service';
import AppSetting from '../../common/constants/appsetting.constant';
import StorageType from '../session/storage.enum';
import * as moment from 'moment';
import Utilities from '../commonservice/utilities';
import UserTypeEnum from '../../common/enum/user-type.enum';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CommonService = {

  Pager: {
    currentPage: null,
    totalPages: null,
    resultPerPage: null,
    totalResults: null,
    pages: [],
    data: [],
    results: null,
    currentResults: null,
    startRecord: null,
    endRecord: null,
  },

  loggedInUserData: {},

  loggedInAuthData: {},

  pingSubscription: {},
  timeoutSubscription: {},
  timerStartSubscription: {},

  getAuthData() {
    return JSON.parse(StorageService.get(StorageType.session, 'auth'));
  },

  getLoggedInData() {
    if (StorageService.get(StorageType.session, 'userDetails')) {
      return JSON.parse(StorageService.get(StorageType.session, 'userDetails'))
    }
    else return false
  },

  getSettingsData() {
    return JSON.parse(StorageService.get(StorageType.session, 'settingsData'));
  },

  // providers/{providerId}/patients/lookup
  patientLookup(reqObj) {

    let loggedInUserData = this.getLoggedInData();
    let url = '';

    if (loggedInUserData.userType === 0) {
      const providerDetails = JSON.parse(StorageService.get("session", 'providerSelected'));
      url = AppSetting.common.patientLookup
        .replace('{providerId}', providerDetails.id) + this.buildQuery(reqObj);
    } else {
      url = AppSetting.common.patientLookup
        .replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);
    }
    return axios.get(url, reqObj)
      .then(a => { return a })
      .catch(err=>{return err})
  },

  getRefreshToken(reqObj) {
    const url = AppSetting.common.getRefreshToken.replace('{userId}', reqObj.id);
    return axios.post(url, reqObj)
      .then((a => {
        return a.data
      }))
      .catch(err => {
        return err
      })
  },
  trainingVideos(reqObj) {
    const url = AppSetting.common.training + this.buildQuery(reqObj);
    return axios.get(url).then(_ => axios.log(`deleted id`))
      .catch(console.log('delete'))

  },

  // providers/{providerId}/patients/lookup
  insuranceLookup(reqObj) {

    let loggedInUserData = this.getLoggedInData();
    let url = '';

    if (loggedInUserData.userType === 0) {
      const providerDetails = JSON.parse(StorageService.get("session", 'providerSelected'));
      url = AppSetting.common.insuranceLookup
        .replace('{providerId}', providerDetails.id) + this.buildQuery(reqObj);
    } else {
      url = AppSetting.common.insuranceLookup
        .replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);
    }
    return axios.get(url, reqObj).then(a => { return a.data })
      .catch(console.log('delete'))
  },

  // patients/{patientId}/providers/lookup
  providerLookup() {
    const url = AppSetting.common.providerLookup.replace('{patientId}', this.getLoggedInData()['parentId']);
    return axios.get(url)
    .then(res=>{return res})
      .catch(err=>{return err})
  },

  //GET /providers/{parentId}/customplans/lookup
  customPlanLookup(reqObj) {
    const url = AppSetting.common.customPlanLookup.replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);
    return axios.get(url).then(_ => axios.log(`deleted id`))
      .catch(this.handleError('delete'))
  },

  // providers/{parentId:int}/recurringpayments/lookup
  recurringLookup(reqObj) {
    const url = AppSetting.common.recurringLookup.replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);
    return axios.get(url).then(_ => axios.log(`deleted id`))
      .catch(this.handleError('delete'))
  },

  getCountryList() {
    return axios.get(AppSetting.common.getCountry).then(console.log(`deleted id`))
      .catch(console.log('delete'))
  },

  getStateList(countryId) {
    return axios.get(AppSetting.common.getState + countryId).then(_ => axios.log(`deleted id`))
      .catch(console.log('delete'))
  },

  getTimeZoneList() {
    return axios.get(AppSetting.common.getTimeZone).then(_ => axios.log(`fetched`))
      .catch(console.log('fetch'))
  },

  getUserNameAvailability(username) {
    const url = AppSetting.common.getUserByUserName + '/' + username + '/isavailable';
    return axios.get(url).then(_ => axios.log('UserNameCheck'))
      .catch(console.log('UserNameCheck'))
  },

  dynamicUrl(url, reqObj) {
    url = AppSetting.baseUrl + url;
    return axios.get(url).then(_ => axios.log('dynamicUrl'))
      .catch(console.log('dynamicUrl'))
  },

  getFullName(nameObj) {
    let fullName = '';
    fullName = (nameObj.title != null) ? `${nameObj.title}` : '';
    fullName = (nameObj.firstName != null) ? `${fullName} ${nameObj.firstName}` : `${fullName}`;
    fullName = (nameObj.lastName != null) ? `${fullName} ${nameObj.lastName}` : `${fullName}`;
    return fullName.trim();
  },
  getFullName1(firstName, lastName) {
    let fullName = '';
    fullName = (firstName != null) ? `${fullName} ${firstName}` : `${fullName}`;
    fullName = (lastName != null) ? `${fullName} ${lastName}` : `${fullName}`;
    return fullName.trim();
  },
  getFullAddress(addressObj, countryList) {
    let fullAddress = `${addressObj.addressLine1}${addressObj.addressLine2}${addressObj.city}${addressObj.state}${addressObj.country}${addressObj.postalCode}`;
    if (fullAddress !== '') {
      addressObj.country = (addressObj.country !== '' && addressObj.country != null) ? this.mapCountryName(addressObj.country, countryList) : '';
      fullAddress = '';
      fullAddress = (addressObj.addressLine1 !== '' && addressObj.addressLine1 != null) ? `${addressObj.addressLine1}, ` : '';
      fullAddress = (addressObj.addressLine2 !== '' && addressObj.addressLine2 != null) ? `${fullAddress}${addressObj.addressLine2}, ` : `${fullAddress}`;
      fullAddress = (addressObj.city !== '' && addressObj.city != null) ? `${fullAddress}${addressObj.city}, ` : `${fullAddress}`;
      fullAddress = (addressObj.state !== '' && addressObj.state != null) ? `${fullAddress}${addressObj.state}, ` : `${fullAddress}`;
      fullAddress = (addressObj.country !== '' && addressObj.country != null) ? `${fullAddress}${addressObj.country}, ` : `${fullAddress}`;
      fullAddress = (addressObj.postalCode !== '' && addressObj.postalCode != null) ? `${fullAddress}${addressObj.postalCode}` : `${fullAddress}`;
    }
    return fullAddress;
  },

  mapCountryName(countryId, countryList) {
    for (let i = 0; i < countryList.length; i++) {
      const element = countryList[i];
      if (countryList[i].countryId === countryId) {
        return countryList[i].name;
      }
    }
  },

  mapCountryId(countryName, countryList) {
    for (let i = 0; i < countryList.length; i++) {
      const element = countryList[i];
      if (countryList[i].name === countryName) {
        return countryList[i].countryId;
      }
    }
  },

  enumSelector(definition) {
    return Object.keys(definition)
      .map(key => ({ value: definition[key], title: key }));
  },

  logOut(sessionTimedOut) {
    // alert("log out")
    let settingData;
    StorageService.setLoginCount();
    console.log(settingData)
    let count = StorageService.getLoginCount();
    if (count === 1) {
      if (StorageService.get({ type: StorageType.session, key: 'settingsData' }) !== 'undefined') {
        settingData = JSON.parse(StorageService.get({ type: StorageType.session, key: 'settingsData' }));
      }
      try {
        StorageService.remove(StorageType.session, 'userDetails');
        StorageService.remove(StorageType.session, 'auth');
        StorageService.remove(StorageType.session, 'roleDetails');
        StorageService.remove(StorageType.session, 'settingsData');
        StorageService.remove(StorageType.session, 'providerList');
        StorageService.remove(StorageType.session, 'providerSelected');
        StorageService.remove(StorageType.session, 'moduleDetails');
        StorageService.remove(StorageType.session, 'locale');
      } catch (Execption) {
        StorageService.remove(StorageType.session, 'userDetails');
        StorageService.remove(StorageType.session, 'auth');
        StorageService.remove(StorageType.session, 'roleDetails');
        StorageService.remove(StorageType.session, 'settingsData');
        StorageService.remove(StorageType.session, 'providerList');
        StorageService.remove(StorageType.session, 'providerSelected');
        StorageService.remove(StorageType.session, 'moduleDetails');
        StorageService.remove(StorageType.session, 'locale');
      }
      StorageService.save(StorageType.local, 'sessionExpired', JSON.stringify(true));
    }
    return settingData.providerName
  },

  // returns only date (yyyy-mm-dd) from date object
  getFormattedDate_yyyy_mm_dd(date) {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }
  },

  // returns only date (ddd hh:mm a  MM-DD-YYYY) from date string from db
  getFormattedTimeDate(date) {
    if (date) {
      return moment.utc(date).local().format('ddd hh:mm a  MM-DD-YYYY');
    }
  },

  // returns only date (mm-dd-yyyy) from date object
  getFormattedDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (1 + d.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = d.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '-' + day + '-' + year;
  },

  // convert date according to local timeZone
  getLocalFormattedDate(date) {
    const localDate = moment.utc(date).local();
    return this.getFormattedDate(localDate['_d']);
  },

  // returns only time (hh:mm:ss) from date object
  getFormattedTime(date) {
    const d = new Date(date);
    let minutes = d.getMinutes().toString();
    let hours = d.getHours().toString();
    let seconds = d.getSeconds().toString();
    hours = (hours.length > 1) ? hours : '0' + hours;
    minutes = (minutes.length > 1) ? minutes : '0' + minutes;
    seconds = (seconds.length > 1) ? seconds : '0' + seconds;
    return hours + ':' + minutes + ':' + seconds;
  },

  // returns only time (hh:mm) from date object
  getFormattedTimehhmm(date) {
    const d = new Date(date);
    let minutes = d.getMinutes().toString();
    let hours = d.getHours().toString();
    hours = (hours.length > 1) ? hours : '0' + hours;
    minutes = (minutes.length > 1) ? minutes : '0' + minutes;
    return hours + ':' + minutes;
  },

  getFormattedDateForReqObj(date) {
    if (date !== undefined && date !== null && date !== '') {
      date = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
      return date;
    }
    return null;
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

  handleError(error) {
    // TODO: better job of transforming error for user consumption
    this.log(`operation failed: ${error.message}`);
    // Let the app keep running by returning an empty result.
    return console.log(error);
    // return of(result as T);
  },

  /** Log a HeroService message with the MessageService */
  log(message) {
    // this.messageService.add('HeroService: ' + message);
  },

  // pagination logic---------------------------------------------------------
  initiatePager() {
    let pager = {
      currentPage: 1,
      totalPages: 0,
      resultPerPage: AppSetting.resultsPerPage,
      totalResults: 0,
      pages: [],
      data: [],
    }
    return pager;
  },

  setPager(result, pageNumber, pager) {
    const data = result.data;
    const dataCount = result.totalRowCount;
    const pageCount = Math.ceil(dataCount / pager.resultPerPage);
    if (dataCount > 0) {
      pager.totalPages = pageCount;
      pager.results = dataCount;
      pager.totalResults = dataCount;
      pager.data = data;
      pager.currentResults = data.length;
      pager.currentPage = pageNumber;
      pager.pages = Utilities.getPaginationNumberArray(dataCount, pageNumber, pager.resultPerPage);
      pager.startRecord = ((pager.currentPage * pager.resultPerPage) - (pager.resultPerPage - 1))
      pager.endRecord = ((pager.currentPage * pager.resultPerPage) > pager.totalResults) ? pager.totalResults : pager.currentPage * pager.resultPerPage;
    } else {
      this.initiatePager();
    }
    return pager;
  },

  calculatePageStartRow(pageNumber, resultPerPage) {
    return (((pageNumber * 1) - 1) * (resultPerPage * 1));
  },

  getFormattedDateToDisplayInFilter(date) { // used to display date in filter as "23 March 2019" to match with datepicker format
    if (date) {
      return moment(date).format('D MMMM YYYY');
    }
    return null;
  },

  // returns date time (10-11-2019 03:53:24 / mm-dd-yyyy hh:mm:ss) from date object
  getFormattedDateTime(date) {
    if (date) {
      const localDate = moment.utc(date, "YYYY-MM-DDTHH:mm:ss.SSSz").local();
      const d = this.getFormattedDate(localDate['_i']);
      const t = this.getFormattedTime(localDate['_i']);
      return d + ' ' + t;
    }
  },

  getFormattedTimeWithMeredian(date) {
    const localDate = moment.utc(date).local();
    const dt = new Date(localDate['_i']);
    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hhours = hours < 10 ? '0' + hours : hours;
    // appending zero in the start if hours less than 10
    const mminutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;

  },

  getFormattedDateTimeWithMeredian(date) {
    const localDate = moment.utc(date).local();
    const dt = new Date(localDate['_i']);
    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hhours = hours < 10 ? '0' + hours : hours;
    // appending zero in the start if hours less than 10
    const mminutes = minutes < 10 ? '0' + minutes : minutes;

    const d = this.getFormattedDate(localDate['_i']);
    const t = this.getFormattedTime(localDate['_i']);

    return d + ' ' + hhours + ':' + mminutes + ' ' + ampm;

  },

  getFormattedMinOrMaxDate(date, operation, days) { // used to set minDate Or maxDate for datePicker (DateRange)
    days = (days === 'custom') ? 0 : days;
    if (date === undefined || date === null || date === '') {
      date = moment();
    }
    if (operation === 'add') {
      date = moment(date, 'MM-DD-YYYY HH:mm:ss').add(days, 'days');
    } else if (operation === 'sub') {
      date = moment(date, 'MM-DD-YYYY HH:mm:ss').subtract(days, 'days');
    }
    return date.startOf('day')['_d'];
  },

  getConvertedDateFormat(date) {
    if (date == null || date === undefined || date === '') {
      date = new Date();
    } else {
      let dt = date.split('T')[0].replace(/-/g, '/');
      let time = date.split('T')[1];
      if (time === undefined || time === null || time === '') {
        time = '00:00:00';
      }
      date = new Date(new Date(dt).setHours(time.split(':')[0], time.split(':')[1], time.split(':')[2].split('.')[0]));
    }
    return this.getFormattedDate(date);
  },

  calculateDueInDays(invoiceDate, dueDate) {

    invoiceDate = moment(invoiceDate);
    dueDate = moment(dueDate);

    let days = dueDate.diff(invoiceDate, 'days');
    dueDate.add(days, 'days');

    // In case when custom value is selected for DueInDays
    if (AppSetting.dueInDaysOptionsList.find(x => x.id === days) === undefined) {
      days = '';
    }

    return days;
  },

  isEmpty(value) {
    if (value === undefined || value === null || value === '' || value === '' || value === [] || value === {}) {
      return true;
    }
    return false;
  },

  // setA - setB
  difference(setA, setB) {
    const _difference = new Set(setA);
    for (const elem of Array.from(setB)) {
      _difference.delete(elem);
    }
    return _difference;
  },

  getLastSegmentOfUrl(url) {
    return url.slice(url.lastIndexOf('/') + 1);
  },

  trimSpaces(str) {
    return str.replace(/\s/g, "");
  },

  copyMessage(val) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.copyAlert('Copied', 2000);
  },

  copyAlert(msg, duration) {
    var el = document.createElement('div');
    el.setAttribute(
      'style',
      `background-color: black;color: white;width:60px;position:fixed;left:1%;bottom:5%;border-radius: 4px; padding: 5px;z-index: 9;
     `,
    );
    el.setAttribute('class', 'canvas-legend');
    el.innerHTML = msg;
    setTimeout(function () {
      el.parentNode.removeChild(el);
    }, duration);
    document.body.appendChild(el);
  },

  calculateDateDifference(date, now) {
    let A = moment(new Date(date), 'MM/DD/YYYY');
    let B = (now !== undefined) ? moment(new Date(now), 'MM/DD/YYYY') : moment(new Date(), 'MM/DD/YYYY');

    let days = B.diff(A, 'days');

    return days;

  },

  createDateFromDateTime(date, time, meridian) {
    let mdate = moment(date + ' ' + time + ' ' + meridian, 'MM-DD-YYYY hh:mm A');
    let jDate = new Date(mdate.format());
    const localDate = moment.utc(jDate, true).format('YYYY-MM-DDTHH:mm:ss.SSSz');
    return localDate.replace('UTC', 'Z');
  },

  pad(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  },

  getStartDate(date, time) {
    const _date = new Date(date);
    const convertedDate = `${this.pad((_date.getMonth() + 1), 2)}/${this.pad(_date.getDate(), 2)}/${_date.getFullYear()}`;
    const convertedTime = moment(time, 'hh:mm A').format('HH:mm')
    const __datetime = new Date(convertedDate + ' ' + convertedTime);
    return new Date(__datetime);
  },

  add_minutes(dt, minutes) {
    return new Date(dt.getTime() + minutes * 60000);
  },
  startCheckingIdleTime() {

    this.stopIdleSubscription();
    this.userIdle.startWatching();
    this.userIdle.resetTimer();
    this.timerStartSubscription = this.userIdle.onTimerStart().subscribe(count => {
    });
    this.timeoutSubscription = this.userIdle.onTimeout().subscribe(() => {
      this.logOut(true);
    });
    this.pingSubscription = this.userIdle.ping$.subscribe((value) => {
      this.refreshToken();
    });
  },

  stopIdleSubscription() {
    if (this.pingSubscription && !this.pingSubscription.closed) { this.pingSubscription.unsubscribe(); }
    if (this.timerStartSubscription && !this.timerStartSubscription.closed) { this.timerStartSubscription.unsubscribe(); }
    if (this.timeoutSubscription && !this.timeoutSubscription.closed) { this.timeoutSubscription.unsubscribe(); }
    this.userIdle.stopTimer();
    this.userIdle.stopWatching();
  },

  restart() {
    this.userIdle.resetTimer();
  },
  refreshToken() {
    this.loggedInAuthData = JSON.parse(StorageService.get({ type: StorageType.session, key: 'auth' }));
    this.loggedInUserData = JSON.parse(StorageService.get({ type: StorageType.session, key: 'userDetails' }));
    let reqObj = {
      "token": this.loggedInAuthData.token,
      "id": this.loggedInUserData.id,
      "changePassword": false,
      "userType": this.loggedInUserData.userType,
      "role": this.loggedInUserData.roleId,
      "parentId": this.loggedInUserData.parentId
    }
    this.getRefreshToken(reqObj).subscribe(
      response => {
        this.loggedInAuthData = response;
        StorageService.save(StorageType.session, "auth", JSON.stringify(response))
      },
      error => {
        this.logOut();
      });
  },
  handleError(error) {
    console.log(error)
  }
}
export default CommonService