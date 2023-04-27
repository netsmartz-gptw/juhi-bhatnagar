import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';

const ProviderDashboardService = {

  getLoggedInData() {
    return JSON.parse(StorageService.get('session', 'userDetails'));
  },

  // GET /providers/{parentId}/dashboards/transactionVolume
  getTransactionVolume(reqObj) {
    const url = AppSetting.dashboard.providerTransactionVolume
    .replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);
    return axios.get(url)
      .then((a => {return a.data}))
        .catch(error => { console.log(error) })
  },
  getTransactionVolumeAdmin(reqObj) {
    const url = AppSetting.dashboard.adminTransactionVolume + this.buildQuery(reqObj);
    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },
  getInvoiceVolume(reqObj) {
    const url = AppSetting.dashboard.providerInvoiceVolume
    .replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);
    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },
  // GET {{transaction_url}}/providers/{parentId}/dashboards/recentActivities
  getRecentActivities(reqObj) {
    const url = AppSetting.dashboard.providerRecentActivities
    .replace('{providerId}', this.getLoggedInData()['parentId']) + this.buildQuery(reqObj);
    return axios.get(url)
      .then((a => axios.log(`fetched`))
        .catch(error => { console.log(error) })
      );
  },
  findProvider() {
    let url = AppSetting.provider.globalFindProvider;
    return axios.get(url)
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
  //    // console.catch(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     this.log(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return throwError(error);
  //    // return Observable.throw(error.json().catch || error.message);
  //     // return of(result as T);
  //   };
  // }

  /** Log a HeroService message with the MessageService */
  // private log(message: string) {
  //   // this.messageService.add('HeroService: ' + message);
  // }
}

export default ProviderDashboardService;
