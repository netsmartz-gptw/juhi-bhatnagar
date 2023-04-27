import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';

const FormsService = {
  // loggedInUserData = {};
  formsStatusColorText : {
    active: { color: 'green', text: 'Active' },
    inactive: { color: 'red', text: 'Inactive' },
    activePublished: { color: 'green', text: 'Active / Published' },
    inactivePublished: { color: 'red', text: 'Inactive / Published' },
    unknown: { color: 'grey', text: 'Unknown' },
  },

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  // deleteFacility(data) {
  //   return this.commonAPIFuncService.delete(AppSetting.forms.add).pipe(
  //     tap(_ => this.log(`deleted id`)),
  //     catchError(this.handleError('delete'))
  //   );
  // }

  getLookupList(params) {
    const url = AppSetting.plforms.lookup.replace('{parentId}', this.getLoggedInData().parentId);
    // return this.getHttp(url, params).pipe(catchError(this.handleError('', [])));
    return axios.get(url, {params:params})
      .then(res => {return res.data})
        .catch(error => { console.log(error) })
  },

  getFormsList(params) {
    let url;
    url = AppSetting.forms.get.replace('{parentId}', this.getLoggedInData().parentId);
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

    return axios.get(url, params)
      .then(a => {
        console.log(a)
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
  //     return this.commonAPIFuncService.get(AppSetting.forms.getById + '/' + facilityId)
  //       .pipe(
  //         tap(a => this.log(`fetched`)),
  //         catchError(this.handleError('', []))
  //       );
  // }

  // activateFacility(facilityId, parentId) {
  //   const url = AppSetting.forms.common + '/' + facilityId + '/activations/';
  //   return this.commonAPIFuncService.post(url, {parentId: parentId, id: facilityId})
  //     .pipe(
  //       tap(a => this.log(`fetched`)),
  //       catchError(this.handleError('', []))
  //     );
  // }

  // deactivateFacility(facilityId, parentId) {
  //   const url = AppSetting.forms.common + '/' + facilityId + '/activations/';
  //   return this.commonAPIFuncService.delete(url)
  //     .pipe(
  //       tap(a => this.log(`fetched`)),
  //       catchError(this.handleError('', []))
  //     );
  // }

  // findFacility(data) {
  //   let url = '';
  //     url = AppSetting.forms.find + this.buildQuery(data);
  //   return this.commonAPIFuncService.get(url)
  //     .pipe(
  //       tap(a => this.log(`fetched`)),
  //       catchError(this.handleError('', []))
  //     );
  // }

  // buildQuery(data) {
  //   let queryData = '';
  //   for (const prop in data) {
  //     if (data[prop] !== '' && data[prop] !== 'undefined' && data[prop] !== null) {
  //       if (queryData === '') {
  //         queryData = '?' + prop + '=' + data[prop];
  //       } else {
  //         queryData += '&' + prop + '=' + data[prop];
  //       }
  //     }
  //   }
  //   return queryData;
  // }

  addForm(data) {
    const url = AppSetting.forms.add.replace('{parentId}', this.getLoggedInData().parentId);
    return axios.post(url, data)
      .then((a => axios.log(`added  w/ id`))
        .catch(error => { console.log(error) })
      );
  },

  editForm(data) {
    const url = AppSetting.forms.edit.replace('{parentId}', this.getLoggedInData().parentId);

    return axios.put(url, data)
      .then((a => axios.log(`added  w/ id`))
        .catch(error => { console.log(error) })
      );
  },

  deleteForm(formId) {
    let url = AppSetting.forms.delete;
    url = url.replace('{parentId}', this.getLoggedInData().parentId);
    url = url.replace('{formId}', formId);
    return axios.delete(url)
      .then((a => axios.log(`add`))
        .catch(error => { console.log(error) })
      );
  },

  // updateFacility(data) {
  //   return this.commonAPIFuncService.put(AppSetting.forms.edit, data).pipe(
  //     tap(_ => this.log(`updated`)),
  //     catchError(this.handleError<any>('update'))
  //   );
  // }

  // deleteFacility(facilityId, parentId) {
  //     return this.commonAPIFuncService.delete(AppSetting.forms.delete + '/' + facilityId).pipe(
  //       tap((a) => this.log(`added  w/ id`)),
  //       catchError(this.handleError<any>('add'))
  //     );
  // }

  // custom get with params
  // private getHttp(url, params?) {
  //   return this.http.get(url, {
  //     params: params,
  //     headers: this.httpOptions.headers,
  //   });
  // },

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

export default FormsService
