import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios';

const ForgotPasswordService = {

  forgotPassword(userName, reqObj) {
    let url = AppSetting.baseUrl + 'users/' + userName + '/forgotpasswords';
    // if(window.location.host.includes("localhost:")||window.location.host.includes("logindev.")||window.location.host.includes("login.uat")||window.location.host.includes("login.hellopatients")){
    if (window.location.host.includes("logindev.") || window.location.host.includes("login.uat") || window.location.host.includes("login.hellopatients")) {
      url = AppSetting.baseUrl + 'patient/' + userName + '/forgotpasswords';
    }

    return axios.post(url, reqObj)
      .then(a => { return a })
      .catch(err => { return err });
  }
}

export default ForgotPasswordService
