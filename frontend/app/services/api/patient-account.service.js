import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios';
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';

const PatientAccountService = {

  sendMessage(message) {
    this.subject.next({ text: message });
  },

  setSelectedAccount(id, maskedCardNumber, tab) {
    this.subject.next({ AccountId: id, cardNumber: maskedCardNumber, tab: tab });
  },

  getSelectedAccount() {
    return this.subject.asObservable();
  },

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  addPatientAccount(patientId, data) {
    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.patientAccount.addPatientAccount.replace('{custId}', patientId);
    } else {
      url = AppSetting.provider.common + '/' + this.getLoggedInData()['parentId']
        + '/patients/' + patientId + '/accounts'
    }

    return axios.post(url, data)
      .then((res => { console.log(res);return res}))
      .catch(error => { console.log(error) })
  },

  editPatientAccount(data, patientId, patientAccountId) {
    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.patientAccount.findPatientAccount.replace('{custId}', patientId) + '/' + patientAccountId;
    } else {
      url = AppSetting.provider.common + '/' + this.getLoggedInData()['parentId'] + '/patients/' + patientId +
        '/accounts/' + patientAccountId;
    }

    return axios.put(url, data)
      .then(a => { return a })
      .catch(error => { console.log(error) })
  },

  deletePatientService(patientId, patientAccountId) {
    const url = AppSetting.provider.common + '/' + this.getLoggedInData()['parentId'] + '/patients/' + patientId +
      '/accounts/' + patientAccountId;
    return axios.delete(url)
      .then((a => axios.log(`deleted id`))
        .catch(error => { console.log(error) })
      );
  },

  getPatientAccountById(patientId, providerId, patientAccountId) {
    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.patientAccount.findPatientAccount.replace('{custId}', patientId) + '/' + patientAccountId;
    } else {
      url = AppSetting.provider.common + '/' + providerId + '/patients/' + patientId + '/accounts/' + patientAccountId;
    }

    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  activatePatientAccount(patientId, parentId, patientAcountId) {
    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.wallet.activatePatientAccount.replace('{patientId}', patientId)
        .replace('{accountId}', patientAcountId);
    } else {
      url = AppSetting.patient.activatePatientAccount
        .replace('{providerId}', parentId)
        .replace('{patientId}', patientId)
        .replace('{accountId}', patientAcountId)
    }
    return axios.post(url, {})
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },

  inactivatePatientAccount(patientId, patientAccountId) {

    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.wallet.activatePatientAccount.replace('{patientId}', patientId)
        .replace('{accountId}', patientAccountId);
    } else {
      url = AppSetting.provider.common + '/' + this.getLoggedInData().parentId + '/patients/' + patientId + '/accounts/' + patientAccountId + '/activations';
    }
    return axios.delete(url)
      .then(a => { return a })
      .catch(error => { console.log(error) })
  },

  deletePatientAccount(patientId, parentId, patientAccountId) {

    let url;
    if (this.getLoggedInData().userType == 0) {
      url = AppSetting.wallet.deletePatientAccount.replace('{patientId}', patientId)
        .replace('{accountId}', patientAccountId);
    } else {
      url = AppSetting.provider.common + '/' + parentId + '/patients/' + patientId + '/accounts/' + patientAccountId;
    }

    return axios.delete(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
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

  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     // TODO: send the error to remote logging infrastructure
  //     // console.catch(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     this.log(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return throwError(error);
  //     // return Observable.throw(error.json().catch || error.message);
  //     // return of(result as T);
  //   };
  // }

  /** Log a HeroService message with the MessageService */
  // private log(message: string) {

  // }

  isExistsPatientAccount(reqObj) {
    let url;
    url = AppSetting.patientAccount.isExists
      .replace('{patientId}', this.getLoggedInData()['parentId']);

    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  }
}

export default PatientAccountService;
