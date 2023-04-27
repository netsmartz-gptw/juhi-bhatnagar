import StorageService from './storage.service';
import StorageType from './storage.enum';
import {Route, Navigate} from 'react-router-dom'

const AuthGuard ={

  canActivate() {
    if (StorageService.get({ type: StorageType.session, key: 'auth' })) {
      return true;
    }
    let settingData = JSON.parse(StorageService.get({ type: StorageType.session, key: 'settingsData' }));
    if(settingData!=null && settingData.providerName!=null){
      let newUrl = '/login/'+settingData.providerName;
      Navigate(newUrl);
    }else{
      Navigate('/login');
    }
    return false;
  },

  canLoad(route) {
    if (StorageService.get({ type: StorageType.session, key: 'auth' })) {
      return true;
    }
    let settingData = JSON.parse(StorageService.get({ type: StorageType.session, key: 'settingsData' }));
    if(settingData!=null && settingData.providerName!=null){
      let newUrl = '/login/'+settingData.providerName;
      Navigate(newUrl);
    }else{
      Navigate('/login');
    }
    return false;
  }
}

export default AuthGuard