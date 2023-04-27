
import axios from 'axios';
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
import Exception from '../../common/exceptions/exception';
import toast, { Toaster } from 'react-hot-toast'
import LoginService from './login.service';
import CommonService from './common.service';
import { Navigate } from 'react-router-dom';
// Add a request interceptor
const TokenInterceptor = () => {
  axios.interceptors.request.use(request => {
    let req = request
    // console.log("API Request URL:", request.url);
    if (request.url.includes('/v1/users/sessions')==false && request.url.includes('patient/sendotp')==false && request.url.includes('v1/patient/sessions')==false && request.url.includes('patient/onetimepassword/sessions')==false) {
      req.headers.common.Authorization = `Bearer ${getToken()}`;
    }
    req.headers.common['Content-Type'] = 'application/json'
    return req
  })
  axios.interceptors.response.use(response => {
    return response
  },
    error => {
      handleAPIResponse(error);
      return error
      }
  )
}


const handleAPIResponse = (apiResponse) => {
  if (apiResponse) {
    let apiResult = Exception.processAPIResponse(apiResponse);
    if (!apiResult.success) {
      toast.error(apiResult.message.join(', '))
    }
  }
}

const getToken = () => {
  if (StorageService.get(StorageType.session, 'auth')) {
    let user = JSON.parse(StorageService.get(StorageType.session, 'auth'));
    if (user && user.token) {
      return user.token;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

export default TokenInterceptor
