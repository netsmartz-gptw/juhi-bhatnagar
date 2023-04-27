import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios';
import StorageType from '../session/storage.enum';
import CommonService from './common.service';
import StorageService from '../session/storage.service';
const PatientUploadsService = {

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  getUploadLog(id) {
    let url = AppSetting.patientUploads.getByIdUploadLog.replace('{id}', id);
    let params = {};

    url = url.replace('{parentId}', this.getLoggedInData().parentId);

    return axios.get(url, {
      params: params,
      
    })
      .then(a => {
        a.totalProcessed = this.getTotalRecordsProcessed(a);
        return a;
      })
        .catch(error => {return error })
  },

  getAllUploadLogs(params) {
    const defaultParams = { SortField: 'createdOn', ...params };
    const url = AppSetting.patientUploads.getAllUploadLogs.replace('{parentId}', this.getLoggedInData().parentId);
    // return this.getHttp(url, defaultParams).pipe(catchError(this.commonAPIFuncService.handleError('', [])));
    return axios.get(url, {
      params: defaultParams,
      
    })
      .then(a => {return a})
        .catch(error => { return error })

  },

  upload(file, description) {
    const formData = new FormData();
    formData.append('file', file);

    let url = AppSetting.patientUploads.uploadPatientFile.
      replace('{parentId}', this.getLoggedInData().parentId);

    url = `${url}?description=${description}`;

     return axios.post(url, formData)
      .then(a => {return a})
        .catch(err=>{return err})
    
  },

  uploadAttachment(formData, patientId) {

    let url = '';

    if (this.getLoggedInData().userType === 1) {
      url = AppSetting.attachments.providerAttachment.
        replace('{parentId}', this.getLoggedInData().parentId).
        replace('{patientId}', patientId);
    } else if (this.getLoggedInData().userType === 0) {
      url = AppSetting.attachments.patientAttachment.
        replace('{patientId}', patientId);
    }
      axios.post(url, formData).then((a) => CommonService.log(`fetched`))
      .catch(CommonService.handleError('update', {}))
  },

  findAttachments(patientId, reqObj) {

    let url = '';

    if (this.getLoggedInData().userType === 1) {
      url = AppSetting.attachments.providerAttachment
        .replace('{parentId}', this.getLoggedInData().parentId)
        .replace('{patientId}', patientId);
    } else if (this.getLoggedInData().userType === 0) {
      url = AppSetting.attachments.patientAttachment
        .replace('{patientId}', patientId);
    }

    url = `${url}${this.commonService.buildQuery(reqObj)}`;
   
    return axios.get(url)
    .then((a => axios.log(`fetched`))
      .catch(error => { console.log(error) })
    );
  },
  getFileTypeFromPath(ul) {
    const s = ul.filePath
    const a = s.slice(s.lastIndexOf('.') + 1)
    return a
  },
  download(url) {
    return this.http.get(url, {
      responseType: 'blob'
    })
  },

  deleteAttachment(attachmentId, patientId) {

    let url = '';

    if (this.getLoggedInData().userType === 1) {
      url = AppSetting.attachments.providerDelete
        .replace('{parentId}', this.getLoggedInData().parentId)
        .replace('{patientId}', patientId)
        .replace('{docId}', attachmentId)
    } else if (this.getLoggedInData().userType === 0) {
      url = AppSetting.attachments.patientDelete
        .replace('{patientId}', patientId)
        .replace('{docId}', attachmentId)
    }
    return axios.delete(url)
    .then((a => axios.log(`fetched`))
      .catch(error => { console.log(error) })
    );
  },

  linkProviderToAttachment(reqObj, patientId) {
    let url = '';

    url = AppSetting.attachments.authorize.
      replace('{patientId}', patientId);
    return axios.post(url, reqObj)
    .then((a => axios.log(`fetched`))
      .catch(error => { console.log(error) })
    );
  },

  // custom get with params
  getHttp(url, params) {
    return this.http.get(url, {
      params: params,
      
    });
  },

  // getPresentable file name
  getFilenNameFromPath(ul) {
    const s = ul.filePath;
    const a = s.slice(0, s.lastIndexOf('_')); // remove datetime
    const b = a.slice(a.lastIndexOf('/') + 1); // get file name
    let c = b.slice(b.indexOf('_') + 1); // first _ prefix merhchant
    if (c.indexOf(this.UNIQUE_IDENTIFIER) !== -1) {
      c = c.slice(c.lastIndexOf(this.UNIQUE_IDENTIFIER) + this.UNIQUE_IDENTIFIER.length);
    }
    return c;
  },

  getFileStatusText(status) {
    return this.fileStatusTextMap.get(status);
  },

  checkMissingHeaders(parsedData) {
    const headersSet = new Set();
    headersSet.add(PatientUploadRecordEnum.FirstName);
    headersSet.add(PatientUploadRecordEnum.LastName);
    headersSet.add(PatientUploadRecordEnum.Dob);
    headersSet.add(PatientUploadRecordEnum.Phone);
    headersSet.add(PatientUploadRecordEnum.OptIn);
    headersSet.add(PatientUploadRecordEnum.City);
    headersSet.add(PatientUploadRecordEnum.Country);
    headersSet.add(PatientUploadRecordEnum.State);
    headersSet.add(PatientUploadRecordEnum.PostalCode);

    const parsedHeadersSet = new Set(parsedData.data[0]);
    const missingHeadersSet = this.commonService.difference(headersSet, parsedHeadersSet);
    return Array.from(missingHeadersSet);
  },

  getTotalRecordsProcessed(ul) {
    return (ul.totalProcessed = ul.failedCount + ul.successfulCount || 0);
  }

}

export default PatientUploadsService;
