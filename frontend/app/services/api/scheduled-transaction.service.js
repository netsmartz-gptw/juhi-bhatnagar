import AppSetting from '../../common/constants/appsetting.constant';
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';

import axios from 'axios'

const ScheduledTransactionService = {

  loggedInUserData: {},

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  refundTransaction(reqObj, transactionId) {

    this.loggedInUserData = this.getLoggedInData();
    let url = '';

    url = AppSetting.transaction.refund
      .replace('{providerId}', this.loggedInUserData.parentId)
      .replace('{transactionId}', transactionId);

    return this.commonAPIFuncService.post(url, reqObj)
        .then(a => this.commonAPIFuncService.log(`fetched`))
        .catch(this.commonAPIFuncService.handleError('', []))

  },

  updateScheduleTransaction(reqObj, recurringId, transactionId) {

    let loggedInUserData = this.getLoggedInData();

    let url;
    url = AppSetting.recurringPaymentSchedule.updateRecurringSchedule
      .replace('{providerId}', loggedInUserData.parentId)
      .replace('{recurringId}', recurringId)
      .replace('{transactionId}', transactionId);

    return axios.post(url, reqObj)
        .then(a => {return a})
        .catch(err=>{console.log(err); return err})
  }

}

export default ScheduledTransactionService