import Messages from './messages.constant'

const Validator = {
  config: {},
  formErrors: {},

  // validateAllFormFields(formGroup) {
  //  formGroup.controls.forEach(field => {
  //     const control = formGroup.get(field);
  //     if (control) {
  //       control.markAsTouched({ onlySelf: true });
  //       control.markAsDirty({ onlySelf: true });
  //     }
  //     else if (control) {
  //       (control.controls).forEach(f => {
  //         const control2 = formGroup.get(f);
  //         if (control2) {
  //           control2.markAsTouched({ onlySelf: true });
  //           control2.markAsDirty({ onlySelf: true });
  //         } else if (control2) {
  //           this.validateAllFormFields(control2);
  //         }
  //       });
  //     }
  //     else if (control) {
  //       this.validateAllFormFields(control);
  //     }
  //   });
  // },

  validate(form) {
    this.formErrors = {};
    this.findChildrenAndValidate(form, '');
    return this.formErrors;
  },

  findChildrenAndValidate(obj, fieldName) {
    if (typeof obj.controls !== 'undefined') {
      const newObj = (obj.controls);
      for (const i in newObj) {
        if (i) {
          this.findChildrenAndValidate(obj.controls[newObj[i]], newObj[i]);
        }
      }
    } else {
      if (obj && obj.dirty && !obj.valid && obj.errors !== null) {
        (obj.errors).forEach((ek) => {
          this.formErrors[fieldName] = this.replacedToArgs(Messages[ek], this.config[fieldName][ek]) + ' ';
        });
      }
    }
  },

  replacedToArgs(message, args) {
    if (args !== undefined) {
      (args).forEach((arg) => {
        message = message.replace(new RegExp(`{${arg}}`, 'g'), args[arg]);
      });
      return message;
    }
    return message;
  },

  emailValidator(email) {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!EMAIL_REGEXP.test(email)) {
      return false;
    }
    return true;
  },

  mobileValidator(mobile) {
    const PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
    if (!PHONE_REGEXP.test(mobile)) {
      return false;
    }
    return true;
  },

  getVerifyMessage(err) {
    if (err) {
      err = err.replace('400 - Bad Request ', '');
      err = err.replace('"', '');
      err = err.replace('"', '');
      return err;
    } else {
      return 'Server is down Please contact to administrator.';
    }
  },

  getAge(birth) {
    const today = new Date();
    const nowyear = today.getFullYear();
    const nowmonth = today.getMonth() + 1;
    const nowday = today.getDate();
    const birthyear = birth.split('/')[2];
    const birthmonth = birth.split('/')[1];
    const birthday = birth.split('/')[0];
    let age = nowyear - birthyear;
    const age_month = nowmonth - birthmonth;
    const age_day = nowday - birthday;
    if (age_month < 0 || (age_month == 0 && age_day < 0)) {
      age = (age - 1);
    }
    return age;
  },

  checkemptyArray(obj) {
    if (obj && obj.length > 0) {
      return true;
    } else {
      return false;
    }
  },

  postalFilter(postalCode) {
    if (!postalCode) {
      return null;
    }

    postalCode = postalCode.toString().trim();

    const us = new RegExp('^\\d{5}(-{0,1}\\d{4})?$');
    const ca = new RegExp(/([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i);

    if (us.test(postalCode.toString())) {
      return postalCode;
    }

    if (ca.test(postalCode.toString().replace(/\W+/g, ''))) {
      return postalCode;
    }
    return null;
  }
}

export default Validator