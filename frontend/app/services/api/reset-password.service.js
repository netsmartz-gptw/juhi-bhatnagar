import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import CommonService from './common.service';

const ResetPasswordService = {
  resetPassword(data, userName, userType, isAdmin) {
    let loggedInDataUser = CommonService.getLoggedInData()
    let url = '';
    url=AppSetting.baseUrl +'users/' + userName + '/passwords';
    if (userType === 1 && data.isReset===true && isAdmin) { //username=userID
      url = AppSetting.baseUrl + 'providers/' + loggedInDataUser.parentId + '/users/' + userName + '/resetpassword';
    }
    if (userType === 1 && data.isReset===true && !isAdmin) { //username=userID
      url = AppSetting.baseUrl + 'providers/' + loggedInDataUser.parentId + '/providerusers/' + userName + '/resetpassword';
    }
    if (  data.isReset===true && userType === 0 ) { //username= patientId
      url = AppSetting.baseUrl + 'patients/' + loggedInDataUser.parentId + '/users/' + userName + '/resetpassword';
    }
    return axios.post(url, data)
      .then(a => this.log(`fetched`))
      .catch(err=>{this.handleError(err)})
  },

  acceptTerms(username,data){
    let url= AppSetting.common.acceptTerm.replace('{user}', username);
    return axios.post(url, data)
      .then(a => {return a})
      .catch(err=>{return err})
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

export default ResetPasswordService