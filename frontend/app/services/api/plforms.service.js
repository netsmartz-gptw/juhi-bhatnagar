import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
import toast from 'react-hot-toast';
import CommonService from './common.service';
import moment from 'moment'

const PlFormsService = {
  formsStatusColorText: {
    active: { color: 'green', text: 'Active' },
    inactive: { color: 'red', text: 'Inactive' },
    activePublished: { color: 'green', text: 'Active / Published' },
    inactivePublished: { color: 'red', text: 'Inactive / Published' },
    unknown: { color: 'grey', text: 'Unknown' },
  },


  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  getLookupList(params) {
    let url = AppSetting.plforms.lookup.replace('{parentId}', this.getLoggedInData().parentId);
    url = `${url}${this.buildQuery(params)}`; 
    // return this.getHttp(url, params).pipe(catchError(this.handleError('', [])));
    return axios.get(url)
      .then(a => { return a})
      .catch(error => { console.log(error) })
  },

  getFormsList(params ) {
    let url;
    url = AppSetting.plforms.get.replace('{parentId}', this.getLoggedInData().parentId);
    url = `${url}${this.buildQuery(params)}`;
    // return this.getHttp(url, params).pipe(
    //   map((a: any) => {
    //     try {
    //       a.data.map((b) => {
    //         b.createdDate = this.commonService.getFormattedDate(moment.utc(b.createdDate).local()['_d']);
    //         b.modifiedDate = this.commonService.getFormattedDate(moment.utc(b.modifiedDate).local()['_d']);
    //         // if (b.status === FormStatus.Created) {
    //         if (b.isActivated === ActivationEnum.Activated) {
    //           b.statusText = this.formsStatusColorText.active.text;
    //           b.statusColor = this.formsStatusColorText.active.color;
    //         } else if (b.isActivated === ActivationEnum.Deactivated) {
    //           b.statusText = this.formsStatusColorText.inactive.text;
    //           b.statusColor = this.formsStatusColorText.inactive.color;
    //           // }
    //           // } else if (b.status === FormStatus.Published) {
    //           //   if (b.isActivated === ActivationEnum.Activated) {
    //           //     b.statusText = this.formsStatusColorText.activePublished.text;
    //           //     b.statusColor = this.formsStatusColorText.activePublished.color;
    //           //   } else if (b.isActivated === ActivationEnum.Deactivated) {
    //           //     b.statusText = this.formsStatusColorText.inactivePublished.text;
    //           //     b.statusColor = this.formsStatusColorText.inactivePublished.color;
    //           //   }
    //         } else {
    //           b.statusText = this.formsStatusColorText.unknown.text;
    //           b.statusColor = this.formsStatusColorText.unknown.color;
    //         }
    //         return b;
    //       });
    //     } catch {
    //       return a;
    //     }
    //     return a;
    //   }),
    //   catchError(this.handleError('', [])),
    // );

    return axios.get(url,params)
      .then(a => {
        try {
          a.data.map((b) => {
            b.createdDate = this.commonService.getFormattedDate(moment.utc(b.createdDate).local()['_d']);
            b.modifiedDate = this.commonService.getFormattedDate(moment.utc(b.modifiedDate).local()['_d']);
            // if (b.status === FormStatus.Created) {
            if (b.isActivated === ActivationEnum.Activated) {
              b.statusText = this.formsStatusColorText.active.text;
              b.statusColor = this.formsStatusColorText.active.color;
            } else if (b.isActivated === ActivationEnum.Deactivated) {
              b.statusText = this.formsStatusColorText.inactive.text;
              b.statusColor = this.formsStatusColorText.inactive.color;
              // }
              // } else if (b.status === FormStatus.Published) {
              //   if (b.isActivated === ActivationEnum.Activated) {
              //     b.statusText = this.formsStatusColorText.activePublished.text;
              //     b.statusColor = this.formsStatusColorText.activePublished.color;
              //   } else if (b.isActivated === ActivationEnum.Deactivated) {
              //     b.statusText = this.formsStatusColorText.inactivePublished.text;
              //     b.statusColor = this.formsStatusColorText.inactivePublished.color;
              //   }
            } else {
              b.statusText = this.formsStatusColorText.unknown.text;
              b.statusColor = this.formsStatusColorText.unknown.color;
            }
            return b.data;
          });
        } catch {
          return a.data;
        }
        return a.data;
      })
      .catch(error => { console.log(error) })
  },

  // getFacilityById(facilityId) {
  //     return this.commonAPIFuncService.get(AppSetting.plforms.getById + '/' + facilityId)
  //       .pipe(
  //         tap(a => this.log(`fetched`)),
  //         catchError(this.handleError('', []))
  //       );
  // }

  // activateFacility(facilityId, parentId) {
  //   const url = AppSetting.plforms.common + '/' + facilityId + '/activations/';
  //   return this.commonAPIFuncService.post(url, {parentId: parentId, id: facilityId})
  //     .pipe(
  //       tap(a => this.log(`fetched`)),
  //       catchError(this.handleError('', []))
  //     );
  // }

  // deactivateFacility(facilityId, parentId) {
  //   const url = AppSetting.plforms.common + '/' + facilityId + '/activations/';
  //   return this.commonAPIFuncService.delete(url)
  //     .pipe(
  //       tap(a => this.log(`fetched`)),
  //       catchError(this.handleError('', []))
  //     );
  // }

  // findFacility(data) {
  //   let url = '';
  //     url = AppSetting.plforms.find + this.buildQuery(data);
  //   return this.commonAPIFuncService.get(url)
  //     .pipe(
  //       tap(a => this.log(`fetched`)),
  //       catchError(this.handleError('', []))
  //     );
  // }


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
  // Submissions

  sendForm(formId, patientId, emailId) {
    const url = AppSetting.plforms.sendForm
      .replace('{parentId}', this.getLoggedInData().parentId)
      .replace('{formId}', formId);
    // assumption: parentId is always the providerId
    const nPayload = {
      patientId,
      emailId
    };
    // return this.commonAPIFuncService.post(url, nPayload).pipe(catchError(this.handleError('add', {})));
    return axios.post(url, nPayload)
      .then(a => { })
        .catch(error => { console.log(error) })
      
  },

  addSubmission(payload) {
    const url = AppSetting.plforms.submissions;
    // assumption: parentId is always the providerId
    const nPayload = {
      ...payload,
      providerId: this.getLoggedInData().parentId,
    };
    // return this.commonAPIFuncService.post(url, nPayload).pipe(catchError(this.handleError('add', {})));
    return axios.post(url, nPayload)
      .then(a => { })
        .catch(error => { console.log(error) })
      
  },

  updateSubmission(payload, submissionId) {
    const nPayload = {
      ...payload,
      providerId: this.getLoggedInData().parentId,
    };
    const url = AppSetting.plforms.updateSubmission.replace('{submissionId}', submissionId);
    // return this.commonAPIFuncService.put(url, nPayload).pipe(catchError(this.handleError('add', {})));
    return axios.put(url, nPayload)
      .then(a => { })
        .catch(error => { console.log(error) })
      
  },

  getSubmission(params) {
    let url = AppSetting.plforms.submissionsProvider;
    url = url.replace('{parentId}', this.getLoggedInData().parentId);
    url = `${url}${this.buildQuery(params)}`;

    // return this.getHttp(url, params).pipe(
    //   map((a: any) => {
    //     try {
    //       a.data = a.data.map((submission) => {
    //         submission.createdDate = this.commonService.getFormattedTimeDate(
    //           moment.utc(submission.createdDate).local(),
    //         );
    //         // submission.modifiedDate = this.commonService.getFormattedDate(moment.utc(submission.modifiedDate).local()['_d']);
    //         return submission;
    //       });
    //       return a;
    //     } catch {
    //       return a;
    //     }
    //   }),
    //   catchError(this.handleError('', [])),
    // );

    return axios.get(url, {
      // params: params,

    })
      .then(a => {
        try {
          a.data = a.data.map((submission) => {
            submission.createdDate = CommonService.getFormattedTimeDate(moment.utc(submission.createdDate).local(),
            );
            // submission.modifiedDate = this.commonService.getFormattedDate(moment.utc(submission.modifiedDate).local()['_d']);
            return submission;
          });
          return a;
        } catch {
          return a;
        }
      })
        .catch(error => { console.log(error) })
      
  },

  getSubmissionHistory(params) {
    let url = AppSetting.plforms.submissionsProviderHistory;
    url = url.replace('{parentId}', this.getLoggedInData().parentId);
    // return this.getHttp(url, params).pipe(
    //   map((a: any) => {
    //     try {
    //       a.data = a.data.map((submission) => {
    //         submission.createdDate = this.commonService.getFormattedTimeDate(
    //           moment.utc(submission.createdDate).local(),
    //         );
    //         // submission.createdDate = this.commonService.getLocalFormattedDate(submission.createdDate);
    //         return submission;
    //       });
    //       return a;
    //     } catch {
    //       return a;
    //     }
    //   }),
    //   catchError(this.handleError('', [])),
    // );

    return axios.get(url, {
      params: params,

    })
      .then(a => {
        try {
          a.data = a.data.map((submission) => {
            // submission.createdDate = CommonService.getFormattedDate(moment.utc(data.createdDate).local()['_d']),
             submission.createdDate = CommonService.getFormattedTimeDate(moment.utc(submission.createdDate).local(),
            );
            // submission.createdDate = this.commonService.getLocalFormattedDate(submission.createdDate);
            return submission;
          });
          return a;
        } catch {
          return a;
        }
      })
        .catch(error => { console.log(error) })
      
  },

  // Mappings with Patient
  getMapFormsWithPatient(params) {
    let url = AppSetting.plforms.formsMapping.replace('{parentId}', this.getLoggedInData().parentId);
    url = `${url}${this.buildQuery(params)}`;
    // return this.getHttp(url, params).pipe(catchError(this.handleError('', [])));
    return axios.get(url)
      .then(a => { return a.data })
      .catch(error => { console.log(error) })
  },

  // Create when nothing exists
  createMapFormsWithPatient(payload) {
    let url = AppSetting.plforms.formsMapping.replace('{parentId}', this.getLoggedInData().parentId);
    // return this.commonAPIFuncService.post(url, payload).pipe(catchError(this.handleError('add', {})));
    return axios.post(url,payload)
      .then(a => { return a})
        .catch(error => { return error })
  },
  // Edit
  editMapFormsWithPatient(payload, mappingId) {
    toast.success(mappingId)
    const url = AppSetting.plforms.updateFormsMapping
      .replace('{parentId}', this.getLoggedInData().parentId)
      .replace('{mappingId}', mappingId);
    // return this.commonAPIFuncService.put(url, payload).pipe(catchError(this.handleError('add', {})));
    return axios.put(url, payload)
      .then(a => { return a})
        .catch(error => { console.log(error) })
  },

  // Provider forms management

  linkForm(data, formId) {
    const url = AppSetting.plforms.link
      .replace('{parentId}', this.getLoggedInData().parentId)
      .replace('{formId}', formId);
    delete data['formId'];
    // return this.commonAPIFuncService.post(url, data).pipe(
    //   tap((a) => this.log(`added  w/ id`)),
    //   catchError(this.handleError('add', {})),
    // );
    return axios.post(url, data)
      .then(a => axios.log(`added w/ id`))
        .catch(error => { console.log(error) })
      
  },

  addForm(payload) {
    const url = AppSetting.plforms.add.replace('{parentId}', this.getLoggedInData().parentId);
    // return this.commonAPIFuncService.post(url, payload).pipe(
    //   tap((a) => this.log(`added  w/ id`)),
    //   catchError(this.handleError('add', {})),
    // );
    return axios.post(url, payload)
      .then(a => axios.log(`added w/ id`))
        .catch(error => { console.log(error) })
      
  },

  editForm(payload) {
    const url = AppSetting.plforms.edit.replace('{parentId}', this.getLoggedInData().parentId);
    // return this.commonAPIFuncService.put(url, payload).pipe(
    //   tap((a) => this.log(`added  w/ id`)),
    //   catchError(this.handleError('add', {})),
    // );
    return axios.put(url, payload)
      .then(a => axios.log(`added w/ id`))
        .catch(error => { console.log(error) })
      
  },

  getFormsByIds(formIds) {
    let url = AppSetting.plforms.getFormsByIds;
    url = url.replace('{parentId}', this.getLoggedInData().parentId);
    // return this.getHttp(url, { FormIds: formIds.join(',') }).pipe(
    //   map((a: any) => {
    //     try {
    //       a.data = a.data.map((form) => {
    //         form.createdDate = this.commonService.getFormattedDate(moment.utc(form.createdDate).local()['_d']);
    //         form.modifiedDate = this.commonService.getFormattedDate(moment.utc(form.modifiedDate).local()['_d']);
    //         return form;
    //       });
    //       return a;
    //     } catch {
    //       return a;
    //     }
    //   }),
    //   catchError(this.handleError('add', {})),
    // );
    return axios.get(url, {
      params: { FormIds: formIds.join(',') },

    })
      .then(a => {
        try {
          a.data = a.data.map((form) => {
            form.createdDate = this.commonService.getFormattedDate(moment.utc(form.createdDate).local()['_d']);
            form.modifiedDate = this.commonService.getFormattedDate(moment.utc(form.modifiedDate).local()['_d']);
            return form;
          });
          return a;
        } catch {
          return a;
        }
      })
        .catch(error => { console.log(error) })
      
  },

  getForm(formId) {
    let url = AppSetting.plforms.getFormById;
    url = url.replace('{parentId}', this.getLoggedInData().parentId);
    url = url.replace('{formId}', formId);
    // return this.commonAPIFuncService.get(url).pipe(
    //   map((a: any) => {
    //     try {
    //       a.createdDate = this.commonService.getFormattedDate(moment.utc(a.createdDate).local()['_d']);
    //       a.modifiedDate = this.commonService.getFormattedDate(moment.utc(a.modifiedDate).local()['_d']);
    //       return a;
    //     } catch {
    //       return a;
    //     }
    //   }),
    //   catchError(this.handleError('add', {})),
    // );
    return axios.get(url)
      .then(a => {
          let data = a.data
          data.createdDate = CommonService.getFormattedDate(moment.utc(data.createdDate).local()['_d']);
          data.modifiedDate = CommonService.getFormattedDate(moment.utc(data.modifiedDate).local()['_d']);
          return data;
      })
        .catch(error => { console.log(error) })
  },

  deleteForm(formId) {
    let url = AppSetting.plforms.delete;
    url = url.replace('{parentId}', this.getLoggedInData().parentId);
    url = url.replace('{formId}', formId);
    // return this.commonAPIFuncService.delete(url).pipe(catchError(this.handleError('add', {})));
    return axios.delete(url)
      .then(a => { })
        .catch(error => { console.log(error) })
      
  },

  sendEmail(data) {
    let url = AppSetting.plforms.sendEmail;
    url = url.replace('{parentId}', this.getLoggedInData().parentId);
    url = url.replace('{formId}', data.formId);
    const payload = { emailId: data.email };
    // return this.commonAPIFuncService.post(url, payload).pipe(catchError(this.handleError('add', {})));
    return axios.post(url, payload)
      .then(a => { })
        .catch(error => { console.log(error) })
      
  },

  // UTILITIES

  getFormSubmissionStatusHelper(status) {
    return this.formsSubmissionStatusMap.get(status) || { color: 'gray', text: 'unknown' };
  },

  getFormActivationStatusHelper(isActivated) {
    if (isActivated !== undefined) {
      if (isActivated === ActivationEnum.Deactivated) {
        return { color: 'red', text: 'Inactive' };
      }
    }
    return false;
  },

  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     // TODO: send the error to remote logging infrastructure

  //     // TODO: better job of transforming error for user consumption
  //     this.log(`${operation} failed: ${error.message}`);
  //     // Let the app keep running by returning an empty result.
  //     // return Observable.throw(error.json().catch || error.message);
  //     return throwError(error);
  //     // return of(result as T);
  //   };
  // }

  // custom get with params
  // private getHttp(url, params?) {
  //   return this.http.get(url, {
  //     params: params,
  //     
  //   });
  // }

  // addSuperAdminToFacilityList(facilityList) {
  //   const obj = {};
  //   obj['id'] = this.getLoggedInData()['parentId'];
  //   obj['parentId'] = this.getLoggedInData()['parentId'];
  //   obj['facilityAdminUser'] = 'AdminUser';
  //   obj['facilityName'] = 'HelloPayment';
  //   facilityList.unshift(obj);
  //   return facilityList;
  // }

  /** Log a HeroService message with the MessageService */
  // private log(message: string) {
  //   // this.messageService.add('HeroService: ' + message);
  // }

  // pagination logic----------common one was not workin for customer upload---------------
  initiatePager(resultsPerPage = 10) {
    const pager = {};
    pager.currentPage = 1;
    pager.totalPages = 0;
    pager.resultPerPage = resultsPerPage;
    pager.totalResults = 0;
    pager.pages = [];
    pager.data = [];
    return pager;
  },

  setPager(result, pageNumber, pager) {
    const data = result.data;
    const dataCount = result.totalRowCount || result.totalCount;
    const pageCount = Math.ceil(dataCount / pager.resultPerPage);
    if (dataCount > 0) {
      const newPager = { ...pager };
      newPager.totalPages = pageCount;
      newPager.results = dataCount;
      newPager.totalResults = dataCount;
      newPager.data = data;
      newPager.currentResults = data.length;
      newPager.currentPage = pageNumber;
      newPager.pages = this.getPaginationNumberArray(dataCount, pageNumber, newPager.resultPerPage);
      newPager.startRecord = newPager.currentPage * newPager.resultPerPage - (newPager.resultPerPage - 1);
      newPager.endRecord =
        newPager.currentPage * newPager.resultPerPage > newPager.totalResults
          ? newPager.totalResults
          : newPager.currentPage * newPager.resultPerPage;
      return newPager;
    } else {
      return this.initiatePager();
    }
  },

  getPaginationNumberArray(totalItems, currentPage, pageSize) {
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage, endPage;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (totalPages - currentPage < 2) {
        startPage = totalPages - 4;
      } else {
        startPage = currentPage - 2 <= 0 ? 1 : currentPage - 2;
      }
      if (currentPage <= 2) {
        endPage = 5;
      } else {
        endPage = currentPage + 2 >= totalPages ? totalPages : currentPage + 2;
      }
    }
    return this.rangeFunc(startPage, endPage + 1, false);
  },

  rangeFunc(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    const length = Math.max(Math.ceil((stop - start) / step), 0);
    const range = Array(length);

    for (let idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  },

  calculatePageStartRow(pageNumber, resultPerPage) {
    return (pageNumber * 1 - 1) * (resultPerPage * 1);
  }
}

export default PlFormsService;
