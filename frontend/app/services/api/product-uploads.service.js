import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageType from '../session/storage.enum';
import CommonService from './common.service'
import StorageService from '../session/storage.service';

const ProductUploadsService = {

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  getUploadLog(id) {
    let url = AppSetting.productUploads.getByIdUploadLog.replace('{id}', id);
    let params = {};

    url = url.replace('{parentId}', this.getLoggedInData().parentId);
    return axios.get(url, {params: params})
      .then(a => {
        a.totalProcessed = this.getTotalRecordsProcessed(a);
        return a;
      })
        .catch(error => { return error })
  },

  getAllUploadLogs(params) {
    const defaultParams = { ...params };
    const url = AppSetting.productUploads.getAllUploadLogs.replace('{parentId}', this.getLoggedInData().parentId);
    // return this.getHttp(url, defaultParams).pipe(catchError(this.commonAPIFuncService.handleError('', [])));
    return axios.get(url, {
      params: defaultParams,

    })
      .then(a => { return a })
      .catch(error => { return error });

  },

  upload(file, description) {
    const formData = new FormData();
    formData.append('file', file);

    let url = AppSetting.productUploads.uploadProductsFile.
      replace('{parentId}', this.getLoggedInData().parentId);

    url = `${url}?description=${description}`;

    return axios.post(url, formData)
      .then((a) => { return a })
      .catch(err => { return err })

  },

  // custom get with params
  // getHttp(url, params?) {
  //   return this.http.get(url, {
  //     params: params,
  //     
  //   });
  // },

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
  getFilenNameFromPathCSV(ul) {
    const s = ul.filePath;
    const a = s.slice(s.lastIndexOf('/') + 1); // get file name
    let newArray = a.split("-")
    newArray = newArray.map(part => {
      return part[0].toUpperCase() + part.substr(1)
    })
    let newString = newArray.join("-")
    return newString;
  },
  getFileTypeFromPath(ul) {
    const s = ul.filePath
    const a = s.slice(s.lastIndexOf('.') + 1)
    return a
  },

  getFileStatusText(status) {
    return this.fileStatusTextMap.get(status);
  },

  checkMissingHeaders(parsedData) {
    const headersSet = new Set();
    //headersSet.add(ProductUploadRecordEnum.ProductType);
    //headersSet.add(ProductUploadRecordEnum.CodeType);
    headersSet.add(ProductUploadRecordEnum.Name);
    //headersSet.add(ProductUploadRecordEnum.CptIcd10Code);
    //headersSet.add(ProductUploadRecordEnum.Icd10Code);
    headersSet.add(ProductUploadRecordEnum.Quantity);
    headersSet.add(ProductUploadRecordEnum.UnitPrice);
    headersSet.add(ProductUploadRecordEnum.TaxPercent);
    headersSet.add(ProductUploadRecordEnum.Description);
    //headersSet.add(ProductUploadRecordEnum.Tags);

    const parsedHeadersSet = new Set(parsedData.data[0]);
    const missingHeadersSet = this.commonService.difference(headersSet, parsedHeadersSet);
    return Array.from(missingHeadersSet);
  },

  getTotalRecordsProcessed(ul) {
    return (ul.totalProcessed = ul.failedCount + ul.successfulCount || 0);
  }

}

export default ProductUploadsService
