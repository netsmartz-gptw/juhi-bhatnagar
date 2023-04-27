import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';

const ForgotUsernameService = {

  forgotUsername(email) {
    const url = AppSetting.baseUrl + 'users/' + email + '/forgotusername';
    return axios.post(url, {})
      .then(a => axios.log(`Email: ${email}`))
      .catch(error => { console.log('forgotUsername') })
  }
}

export default ForgotUsernameService
