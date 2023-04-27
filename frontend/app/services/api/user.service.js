import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios';

const UserService = {
  loggedInUserData: {},
  findUserData: '',
  isFromAddUser: false,

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  findUser(reqObj) {
    let loggedInUserData = this.getLoggedInData();
    let url;
    if(reqObj.practiceId){
      url = AppSetting.user.find.replace('{providerId}', reqObj.practiceId);
    }
    else{
     url = AppSetting.user.find.replace('{providerId}', loggedInUserData.parentId);
    }
    url = `${url}${this.buildQuery(reqObj)}`;
    return axios.get(url)
        .then(res=>{return res.data})
        .catch(err=>{this.handleError(err)})
  },


  getUserById(userId) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.user.getById.replace('{providerId}',loggedInUserData.parentId)
    .replace('{userId}', userId);
    return axios.get(url)
        .then(res=>{return res.data})
        .catch(err=>{this.handleError(err)})
  },

  // /providers/{providerId}/users/{userId}/activations
  activateUser(userId) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.user.activate.replace('{providerId}', loggedInUserData.parentId)
    .replace('{userId}', userId);
    return axios.post(url, {})
        .then(res=>{return res.data})
        .catch(err=>{this.handleError(err)})
  },

  //  /providers/{parentId}/users/{userId}/activations
  deactivateUser(userId) {
    let loggedInUserData = this.getLoggedInData();
    let url = AppSetting.user.deactivate.replace('{providerId}', loggedInUserData.parentId)
    .replace('{userId}', userId);
    return axios.delete(url)
        .then(res=>{return res.data})
        .catch(err=>{this.handleError(err)})
  },


  addUser(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.user.add.replace('{providerId}', this.loggedInUserData.parentId);
    return axios.post(url, reqObj)
      .then(res=>{
        return res
      })
      .catch(err => { 
        this.handleError('add') 
        return err
      })
},

  editUser(reqObj) {
    this.loggedInUserData = this.getLoggedInData();
    let url = AppSetting.user.edit.replace('{providerId}', this.loggedInUserData.parentId)
    .replace('{userId}', reqObj.id);
    return axios.put(url, reqObj)
      .then(res=>{
        return res
      })
      .catch(err => { 
        return err
        // this.handleError(err) 
      })
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
    return (error) => {
      // TODO: send the error to remote logging infrastructure
     // console.catch(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`operation failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return console.log(error);
     // return Observable.throw(error.json().catch || error.message);
      // return of(result as T);
    };
  },

  /** Log a HeroService message with the MessageService */
  log(message) {
    // this.messageService.add('HeroService: ' + message);
  },
}

export default UserService
