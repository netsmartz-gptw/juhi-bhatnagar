import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios';

const PatientFormsService = {

  getLoggedInData() {
    return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
  },

  getFormsByIds(formIds) {
    let url = AppSetting.patientForms.getFormsByIds;
    url = url.replace('{parentId}', this.getLoggedInData().parentId);
    return axios.get(url, {
      params: { FormIds: formIds.join(',') },
    })
      .then((a => {
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
      );
  },

  getSubmissions(params) {
    let url = AppSetting.patientForms.submissionsPatients;
    url = url.replace('{parentId}', this.getLoggedInData().parentId);

    return axios.get(url, {
      params: params,
    })
      .then((a => {
        try {
          a.data = a.data.map((submission) => {
            submission.createdDate = this.commonService.getFormattedDate(
              moment.utc(submission.createdDate).local()['_d'],
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
      );
  },

  getFormsMappings(providerId) {
    let params;
    params = { ProviderId: providerId };
    const url = AppSetting.patientForms.formsMapping.replace('{parentId}', this.getLoggedInData().parentId);
    return axios.get(url, {
      params: params,
    })
      .then((a => {
      })
        .catch(error => { console.log(error) })
      );
  },

  // Submissions

  addSubmission(payload) {
    const url = AppSetting.plforms.submissions;
    // assumption: parentId is always the providerId
    const nPayload = {
      ...payload,
      patientId: this.getLoggedInData().parentId,
    };
    return axios.post(url, nPayload)
      .then((a => { })
        .catch(error => { console.log(error) })
      );
  },

  updateSubmission(payload, submissionId) {
    const nPayload = {
      ...payload,
      patientId: this.getLoggedInData().parentId,
    };
    const url = AppSetting.plforms.updateSubmission.replace('{submissionId}', submissionId);
    return axios.put(url, nPayload)
      .then((a => {
      })
        .catch(error => { console.log(error) })
      );
  },

  // UTILITIES

  getFormSubmissionStatusHelper(status) {
    return this.formsSubmissionStatusMap.get(status) || { color: 'gray', text: 'Unknown' };
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

  /** Log a HeroService message with the MessageService */
  // private log(message: string) {
  //   // this.messageService.add('HeroService: ' + message);
  // }
}

export default PatientFormsService
