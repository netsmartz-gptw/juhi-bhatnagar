


import axios from 'axios'
import AppSetting from '../../common/constants/appsetting.constant';
import CommonService from './common.service';

const ChangePasswordService = {

  changePassword(data, userId, userType) {
    let loggedInUserData =CommonService.getLoggedInData()
    let url = '';
    url = AppSetting.baseUrl + 'users/' + userId + '/passwords';
    return axios.post(url, data)
      .then(a => {return a})
      .catch(error => this.handleError(error))
  },

  handleError(error) {
    return (error) => {
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`operation failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      // return Observable.throw(error.json().error || error.message);
      return throwError(error);
      // return of(result as T);
    };
  }

}
export default ChangePasswordService