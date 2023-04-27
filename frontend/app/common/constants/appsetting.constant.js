let baseUrl = 'https://atg96ts3g3.execute-api.us-east-2.amazonaws.com/v1/'; //This is for Dev
// let baseUrl = 'https://api.uat.hellopatients.com/';   //This UAT

// UAT
if (
  window.location.host.includes("login.uat") ||
  window.location.host.includes("admin.uat") ||
  window.location.host.includes("hpt-2.0-uat")
) {
  baseUrl = "https://api.uat.hellopatients.com/";
  // baseUrl = 'https://atg96ts3g3.execute-api.us-east-2.amazonaws.com/v1/';
}

// Production
if (
  window.location.host.includes("hpt-2.0-prd") ||
  window.location.host.includes("v2.hellopatients") ||
  window.location.host.includes("admin.hellopatients") ||
  window.location.host.includes("login.hellopatients")
) {
  baseUrl = 'https://api.hellopatients.com/';
}
const AppSetting = {
  baseUrl: baseUrl,
  defaultCountry: '1',
  common: {
    emulate: baseUrl + 'user/session/{username}/emulation',
    login: baseUrl + 'users/sessions',
    patientLogin: baseUrl + 'patient/sessions',
    getUserByUserName: baseUrl + 'users',
    getCountry: baseUrl + 'countries/list',
    getState: baseUrl + 'states/',
    getTimeZone: baseUrl + 'timezones',
    forgotPassword: baseUrl + 'forgotPassword',
    forgotUsername: baseUrl + 'forgotUsername',
    patientLookup: baseUrl + 'providers/{providerId}/patients/lookup',
    getRefreshToken: baseUrl + 'user/session/{userId}/refresh',
    providerLookup: baseUrl + 'patients/{patientId}/providers',
    customPlanLookup: baseUrl + 'providers/{providerId}/customplans/lookup',
    recurringLookup:
      baseUrl + 'providers/{providerId}/recurringpayments/lookup',
    acceptTerm: baseUrl + 'users/{user}/termsconditions',
    patientLoginOTP: baseUrl + 'patient/sendotp',
    patientLoginViaOTP: baseUrl + 'patient/onetimepassword/sessions',
    insuranceLookup: baseUrl + 'insurance/lookup',
    training: baseUrl + 'training/videos',
    getGlobalUserByUserName: baseUrl + 'users/{username}/name',
    getProviderUserByUserName:
      baseUrl + 'providers/{parentId}/users/{username}/name',
    getPatientUserByUserName:
      baseUrl + 'patients/{parentId}/users/{username}/name',
    getProviderUserDetail:
      baseUrl + 'providers/{parentId}/users/details/{username}',
  },

  featuresaccess: {
    getDefaultconfig: baseUrl + 'modules/{userType}',
    addModuleConfig: baseUrl + 'providers/{parentId}/moduleconfig',
    getModuleConfig: baseUrl + 'providers/{parentId}/moduleconfig',
    getfeatureConfig: baseUrl + 'providers/{parentId}/featureconfig',
    addfeatureConfig: baseUrl + 'providers/{parentId}/featureconfig',
  },
  masterEquipmentType: {
    add: baseUrl + 'masterequipmenttype',
    edit: baseUrl + 'masterequipmenttype/{id}',
    delete: baseUrl + 'masterequipmenttype/{id}',
    getById: baseUrl + 'masterequipmenttype/{id}',
    find: baseUrl + 'masterequipmenttype',
    lookup: baseUrl + 'providers/{parentId}/masterequipmenttype/lookup',
    lookupForGlobal: baseUrl + 'masterequipment/type/lookup',
  },
  equipmentType: {
    add: baseUrl + 'providers/{parentId}/equipmenttype',
    edit: baseUrl + 'providers/{parentId}/equipmenttype/{id}',
    delete: baseUrl + 'providers/{parentId}/equipmenttype/{id}',
    getById: baseUrl + 'providers/{parentId}/equipmenttype/{id}',
    find: baseUrl + 'providers/{parentId}/equipmenttype',
    lookup: baseUrl + 'providers/{parentId}/equipment/type/lookup',
  },
  practicePatientType: {
    lookup: baseUrl + 'providers/{parentId}/practicepatienttype',
  },
  equipment: {
    add: baseUrl + 'providers/{parentId}/equipments',
    find: baseUrl + 'providers/{parentId}/equipments',
    edit: baseUrl + 'providers/{parentId}/equipments/{equipmentId}',
    delete: baseUrl +'providers/{parentId}/equipments/{equipmentId}',
    getAvailableEquipmentsForLocationAndSlot: baseUrl + 'providers/{parentId}/equipments/available',
    lookup: baseUrl + 'providers/{parentId}/equipments/lookup',
    getById: baseUrl + 'providers/{parentId}/equipments/{equipmentId}',
    getEquipmentByLocationId: baseUrl + 'providers/{parentId}/equipments/location/{locationId}'
  },
  practiceLocationAvailablity: {
    locationAvailablity: baseUrl + 'providers/{parentId}/practicelocationavailability',
    deleteAvailability: baseUrl + 'providers/{parentId}/practicelocationavailability/{availabilityId}',
  },
  practiceServiceType: {
    add: baseUrl + 'providers/{parentId}/practiceservicetype',
    find: baseUrl + 'providers/{parentId}/practiceservicetype/lookup',
    edit: baseUrl + 'providers/{parentId}/practiceservicetype/{practiceServiceTypeId}',
    getById: baseUrl + 'providers/{parentId}/practiceservicetype/{practiceServiceTypeId}',
    masterServiceType: baseUrl + 'providers/{parentId}/masterservicetype/lookup',
    serviceCodes: baseUrl + 'providers/{parentId}/servicecodes',
    getByServiceTypeId: baseUrl + 'providers/{parentId}/items/lookup',
    delete:baseUrl + 'providers/{parentId}/practiceservicetype/{practiceServiceTypeId}'
  },
  facility: {
    add: baseUrl + 'facility',
    edit: baseUrl + 'facility',
    delete: baseUrl + 'facility',
    get: baseUrl + 'global/facility',
    getById: baseUrl + 'facility',
    find: baseUrl + 'global/facility/',
    common: baseUrl + 'facility',
  },

  forms: {
    get: baseUrl + 'providers/{parentId}/forms',
    add: baseUrl + 'providers/{parentId}/forms',
    edit: baseUrl + 'providers/{parentId}/forms',
    delete: baseUrl + 'providers/{parentId}/forms/{formId}',
  },

  plforms: {
    get: baseUrl + 'providers/{parentId}/forms',
    getFormById: baseUrl + 'providers/{parentId}/forms/{formId}',
    sendEmail: baseUrl + 'providers/{parentId}/formurl/{formId}/send',
    add: baseUrl + 'providers/{parentId}/forms',
    link: baseUrl + 'providers/{parentId}/forms/{formId}/link',
    edit: baseUrl + 'providers/{parentId}/forms',
    delete: baseUrl + 'providers/{parentId}/forms/{formId}',
    lookup: baseUrl + 'providers/{parentId}/forms/lookup',
    formsMapping: baseUrl + 'providers/{parentId}/formsmapping',
    updateFormsMapping:
      baseUrl + 'providers/{parentId}/formsmapping/{mappingId}',
    submissions: baseUrl + 'submissions',
    getFormsByIds: baseUrl + 'providers/{parentId}/forms',
    submissionsProvider: baseUrl + 'providers/{parentId}/submissions',
    submissionsProviderHistory:
      baseUrl + 'providers/{parentId}/submissions/history',
    updateSubmission: baseUrl + 'submissions/{submissionId}',
    sendForm: baseUrl + 'providers/{parentId}/forms/{formId}/send',
  },

  patientForms: {
    get: baseUrl + 'patients/{parentId}/forms',
    getFormById: baseUrl + 'patients/{parentId}/forms/{formId}',
    getFormsByIds: baseUrl + 'patients/{parentId}/forms',
    formsMapping: baseUrl + 'patients/{parentId}/formsmapping',
    submissionsPatients: baseUrl + 'patients/{parentId}/submissions',
    submissions: baseUrl + 'submissions',
  },

  provider: {
    // add: baseUrl + 'providers',
    edit: baseUrl + 'providers',
    get: baseUrl + 'providers',
    getProviderByUserName: baseUrl + 'providers',
    getProviderDetail: baseUrl + 'providers/{providerId}/details',

    find: baseUrl + 'providers/',
    getById: baseUrl + 'providers',
    common: baseUrl + 'providers',
    delete: baseUrl + 'providers',

    globalGetProviderById: baseUrl + 'providers/{providerId}',
    globalFindProvider: baseUrl + 'providers',
    addProviderUnderGlobal: baseUrl + 'providers',
    editProviderUnderGlobal: baseUrl + 'providers/{providerId}',
    activateProviderUnderGlobal: baseUrl + 'providers/{providerId}/activations',
    deactivateProviderUnderGlobal:
      baseUrl + 'providers/{providerId}/activations',
    deleteProviderUnderGlobal: baseUrl + 'providers/{providerId}',
    addUnavailableBlock: (parentId) => baseUrl + `providers/${parentId}/unavailableblock`,
    editUnavailableBlock: (parentId, unavailableBlockId) => baseUrl + `providers/${parentId}/unavailableblock/${unavailableBlockId}`,
    deleteUnavailableBlock:baseUrl+'providers/{parentId}/unavailableblock/{unavailableBlockId}',
    getNoShow: (parentId) => baseUrl + `providers/${parentId}/noshowReports`,
    getProvidersForSelectedLocation: (parentId) => baseUrl + `providers/${parentId}/practicelocationpractitioner/lookup`,
    createProvidersForSelectedLocation: (parentId) => baseUrl + `providers/${parentId}/practicelocationpractitioner`,
    updateProvidersForSelectedLocation: (parentId, practiceLocationPractitionerId) => baseUrl + `/providers/${parentId}/practicelocationpractitioner/${practiceLocationPractitionerId}`,
  },
  user: {
    find: baseUrl + 'providers/{providerId}/users',
    getById: baseUrl + 'providers/{providerId}/users/{userId}',
    common: baseUrl + 'providers/{providerId}/users',
    delete: baseUrl + 'providers/{providerId}/users/{userId}',
    add: baseUrl + 'providers/{providerId}/user',
    edit: baseUrl + 'providers/{providerId}/users/{userId}',
    activate: baseUrl + 'providers/{providerId}/users/{userId}/activations',
    deactivate: baseUrl + 'providers/{providerId}/users/{userId}/activations',
  },
  // merchant : {
  //   getMerchantByUserName: baseUrl + 'merchants'
  // },
  // ------------------------------------------------------------------------------------------------------------------------------

  patient: {
    getPatientByUserName: baseUrl + 'patients',
    addPatient: baseUrl + 'providers/{providerId}/patients',
    findPatient: baseUrl + 'providers/{providerId}/patients',
    findPatientAccount:
      baseUrl + 'providers/{providerId}/patients/{custId}/accounts',
    linkPatient: baseUrl + 'providers/{providerId}/patients/{patientId}/link',
    activatePatientAccount:
      baseUrl +
      'providers/{providerId}/patients/{patientId}/accounts/{accountId}/activations',
    activatePatient:
      baseUrl + 'providers/{providerId}/patients/{custId}/activations',
    getPatientById: baseUrl + 'providers/{providerId}/patients/{patientId}',
    edit: baseUrl + 'providers/{providerId}/patients/{patientId}',
    editForPatient: baseUrl + 'patients/{patientId}',
    getInsurancerPartner: baseUrl + 'providers/insurancepartners',
    getNotes: baseUrl + 'providers/{providerId}/notes',
    addNote: baseUrl + 'providers/{providerId}/patients/{patientId}/notes',
    addPatientType: baseUrl + `providers/{patientId}/practicepatienttype`,
    editPatientType: baseUrl + `providers/{patientId}/practicepatienttype/{patientTypeId}`,
    isExists: baseUrl + 'providers/{providerId}/patients/exists/{emailId}',
    optInOptOut: baseUrl + 'hpt/mobile/optInoptOut',
    visits: baseUrl + 'providers/{providerId}/patients/{patientId}/visits',
    updateVisits:
      baseUrl + 'providers/{providerId}/patients/{patientId}/visits/{visitId}',
    delete:baseUrl + 'providers/{parentId}/practicepatienttype/{practicePatientTypeId}'
  },
  wallet: {
    findPatientAccount: baseUrl + 'patients/{custId}/accounts',
    linkPatient: baseUrl + 'patients/{patientId}/link',
    activatePatientAccount:
      baseUrl + 'patients/{patientId}/accounts/{accountId}/activations',
    deletePatientAccount: baseUrl + 'patients/{patientId}/accounts/{accountId}',
    activatePatient: baseUrl + 'patients/{custId}/activations',
    edit: baseUrl + 'patients/',
  },
  patientAccount: {
    addPatientAccount: baseUrl + '',
    findPatientAccount: baseUrl + 'patients/{custId}/accounts',
    activatePatientAccount:
      baseUrl + 'patients/{custId}/accounts/{accountId}/activations',
    isExists: baseUrl + 'patients/{patientId}/accounts/exists',
  },
  transaction: {
    add: baseUrl + 'providers/{providerId}/transactions',
    patientTransaction: baseUrl + 'patients/{patientId}/transactions',
    updateTransaction:
      baseUrl + 'providers/{providerId}/transactions/{transactionId}',
    getCardDetails: baseUrl + 'binlookup',
    retry:
      baseUrl + 'providers/{providerId}/transactions/{transactionId}/retry',
    getById: '',
    find: 'providers/{providerId}/transactions',
    sendReceipt:
      baseUrl + 'providers/{providerId}/transactions/{transactionId}/email',
    sendReceiptFromPatient:
      baseUrl + 'patients/{patientId}/transactions/{transactionId}/email',
    sendSchedule:
      baseUrl +
      'providers/{providerId}/schedulepayments/{recurringScheduleId}/email',
    sendScheduleFromPatient:
      baseUrl +
      'patients/{patientId}/schedulepayments/{recurringScheduleId}/email',
    refund:
      baseUrl + 'providers/{providerId}/transactions/{transactionId}/refund',
  },

  recurringPayments: {
    find: baseUrl + 'providers/{providerId}/recurringpayments',
    details: baseUrl + 'providers/{providerId}/patientsdetails',
    getById: baseUrl + 'providers/{providerId}/recurringpayments/{recurringId}',
    add: baseUrl + 'providers/{providerId}/recurringpayments',
    edit: baseUrl + 'providers/{providerId}/recurringpayments/{recurringId}',
    activate:
      baseUrl +
      'providers/{providerId}/recurringpayments/{recurringId}/activations',
    deactivate:
      baseUrl +
      'providers/{providerId}/recurringpayments/{recurringId}/activations',
    cancelPaymentPlan:
      baseUrl + 'providers/{providerId}/recurringpayments/{recurringId}/cancel',
    schedule:
      baseUrl + 'providers/{providerId}/recurringschedule/{recurringId}',
    addScheduleTransaction: baseUrl + 'scheduletransaction',
    updateAccount:
      baseUrl +
      'providers/{providerId}/recurringpayments/{recurringId}/accounts',
    updatePatientAccount:
      baseUrl + 'patients/{patientId}/recurringpayments/{recurringId}/accounts',
    report: baseUrl + 'providers/{providerId}/reports',
    recurringScheduleReport:
      baseUrl + 'providers/{providerId}/scheduledReports',
  },
  patientRecurringPayments: {
    find: baseUrl + 'patients/{patientId}/recurringpayments',
    details: baseUrl + 'patients/{patientId}/patientsdetails',
    getById: baseUrl + 'patients/{patientId}/recurringpayments/{recurringId}',
    add: baseUrl + 'patients/{patientId}/recurringpayments',
    edit: baseUrl + 'patients/{patientId}/recurringpayments/{recurringId}',
    activate:
      baseUrl +
      'patients/{patientId}/recurringpayments/{recurringId}/activations',
    deactivate:
      baseUrl +
      'patients/{patientId}/recurringpayments/{recurringId}/activations',
    schedule: baseUrl + 'patients/{patientId}/recurringschedule/{recurringId}',
    scheduleByDay: baseUrl + 'patients/{patientId}/recurringschedule',
  },

  recurringPaymentSchedule: {
    updateRecurringSchedule:
      baseUrl +
      'providers/{providerId}/recurringpayments/{recurringId}/reschedule/{transactionId}',
  },

  customPlans: {
    find: baseUrl + 'providers/{parentId}/recurringplans',
    getById: baseUrl + 'providers/{parentId}/recurringplans/{customPlanId}',
    add: baseUrl + 'providers/{parentId}/recurringplans',
    edit: baseUrl + 'providers/{parentId}/recurringplans/{customPlanId}',
    activate:
      baseUrl +
      'providers/{parentId}/recurringplans/{customPlanId}/activations',
    deactivate:
      baseUrl +
      'providers/{parentId}/recurringplans/{customPlanId}/activations',
  },

  dashboard: {
    adminTransactionVolume: baseUrl + 'providers/reports',
    providerTransactionVolume:
      baseUrl + 'providers/{providerId}/dashboardReports',
    providerInvoiceVolume: baseUrl + 'providers/{providerId}/reports',
    providerRecentActivities:
      baseUrl + 'providers/{providerId}/recentActivities',
  },

  settings: {
    putProviderSettings: baseUrl + 'providers/{providerId}/providersettings',
    getProviderSettings: baseUrl + 'providers/{providerId}/providersettings',
    putProviderSettingsInvoiceFormat:
      baseUrl + 'providers/{providerId}/providersettings/invoiceformat',
    getProviderSettingsInvoiceFormat:
      baseUrl + 'providers/{providerId}/providersettings/invoiceformat',
    putProviderSettingsSkin:
      baseUrl + 'providers/{providerId}/providersettings/skin',
    getProviderSettingsSkin:
      baseUrl + 'providers/{providerId}/providersettings/skin',
    putProviderSettingsTimezone:
      baseUrl + 'providers/{providerId}/providersettings/timezone',
    getProviderSettingsTimezone:
      baseUrl + 'providers/{providerId}/providersettings/timezone',
    putProviderSettingsLogo:
      baseUrl + 'providers/{providerId}/providersettings/logo',
    getProviderSettingsLogo:
      baseUrl + 'providers/{providerId}/providersettings/logo',
  },

  invoice: {
    findInvoice: baseUrl + 'providers/{providerId}/invoices',
    addInvoice: baseUrl + 'providers/{providerId}/invoices',
    deleteInvoice: baseUrl + 'providers/{providerId}/invoices/{invoiceId}',
    getInvoiceById: baseUrl + 'providers/{providerId}/invoices/{invoiceId}',
    editInvoice: baseUrl + 'providers/{providerId}/invoices/{invoiceId}',
    finalizeInvoice:
      baseUrl + 'providers/{providerId}/invoices/{invoiceId}/finalize',
    patientInvoice: baseUrl + 'patients/{patientId}/invoices',
    getInvoiceByIdForPatient:
      baseUrl + 'patients/{patientId}/invoices/{invoiceId}',
    payments: baseUrl + 'invoices/{invoiceId}/payment',
    schedulepayment: baseUrl + 'invoices/{invoiceId}/schedulepayment',
    recurringpayment: baseUrl + 'invoices/{invoiceId}/recurringpayment',
    resendInvoice: baseUrl + 'invoices/{invoiceId}/email',
    getInvoiceCount: baseUrl + 'providers/{providerId}/invoices/count',
    closeInvoice: baseUrl + 'providers/{providerId}/invoices/{invoiceId}/close',
    statusreport: baseUrl + 'providers/{providerId}/invoicestatus/report',
    taxreport: baseUrl + 'providers/{providerId}/invoicetax/report',
  },
  recurringInvoice: {
    findRecurringInvoice: baseUrl + 'providers/{providerId}/recurringinvoices',
    addRecurringInvoice: baseUrl + 'providers/{providerId}/recurringinvoices',
    deleteRecurringInvoice:
      baseUrl + 'providers/{providerId}/recurringinvoices/{invoiceId}',
    getRecurringInvoiceById:
      baseUrl + 'providers/{providerId}/recurringinvoices/{invoiceId}',
    editRecurringInvoice:
      baseUrl + 'providers/{providerId}/recurringinvoices/{invoiceId}',
    finalizeRecurringInvoice:
      baseUrl + 'providers/{providerId}/recurringinvoices/{invoiceId}/finalize',
  },

  insurance: {
    find: baseUrl + 'providers/{providerId}/insurance',
    add: baseUrl + 'providers/{providerId}/insurance',
    delete: baseUrl + 'providers/{providerId}/insurance/{insuranceId}',
    getById: baseUrl + 'providers/{providerId}/insurance/{insuranceId}',
    edit: baseUrl + 'providers/{providerId}/insurance/{insuranceId}',
    link: baseUrl + 'providers/{providerId}/insurance/{insuranceId}/link',
  },

  patientInsurance: {
    find: baseUrl + 'providers/{providerId}/patients/{patientId}/insurance',
    add: baseUrl + 'providers/{providerId}/patients/{patientId}/insurance',
    delete:
      baseUrl +
      'providers/{providerId}/patients/{patientId}/insurance/{insuranceId}',
    getById:
      baseUrl +
      'providers/{providerId}/patients/{patientId}/insurance/{insuranceId}',
    edit:
      baseUrl +
      'providers/{providerId}/patients/{patientId}/insurance/{insuranceId}',
    changeType:
      baseUrl +
      'providers/{providerId}/patients/{patientId}/insurance/{insuranceId}/type',
    patientFind: baseUrl + 'patients/{patientId}/insurance',
    patientAdd: baseUrl + 'patients/{patientId}/insurance',
    patientDelete: baseUrl + 'patients/{patientId}/insurance/{insuranceId}',
    patientGetById: baseUrl + 'patients/{patientId}/insurance/{insuranceId}',
    patientEdit: baseUrl + 'patients/{patientId}/insurance/{insuranceId}',
    patientChangeType:
      baseUrl + 'patients/{patientId}/insurance/{insuranceId}/type',
  },

  doctor: {
    find: baseUrl + 'providers/{providerId}/doctors',
    findWithServices: baseUrl + 'providers/{providerId}/doctors/services',
    add: baseUrl + 'providers/{providerId}/doctors',
    delete: baseUrl + 'providers/{providerId}/doctors/{doctorId}',
    getById: baseUrl + 'providers/{providerId}/doctors/{doctorId}',
    // getNPIRegistry: 'api',
    getNPIRegistry: baseUrl + 'npiregistry/lookup',
    edit: baseUrl + 'providers/{providerId}/doctors/{doctorId}',
    lookup: baseUrl + 'providers/{providerId}/doctors/lookup',
    practiceLocationDoctor: baseUrl + 'providers/{providerId}/practicelocationpractitioner/lookup',
    link: baseUrl + 'providers/{providerId}/doctors/{doctorId}/link',
    typeLookup: baseUrl + 'providers/{providerId}/doctors/type/lookup',
    activateDeactivatePractitioners:
      baseUrl +
      'providers/{providerId}/doctors/{doctorId}/activations',
    checkAvailability:
      baseUrl + 'providers/{providerId}/doctors/{doctorId}/check/workinghours',
  },

  appointment: {
    findAppointment: baseUrl + 'providers/{providerId}/appointments',
    editAppointment:
      baseUrl + 'providers/{providerId}/appointments/{appointmentId}',
    deleteAppointment: baseUrl + 'providers/{providerId}/appointments/{appointmentId}/cancel',
    getPatientAppointment: baseUrl + 'patients/{patientId}/appointments',
    getPatientAppointmentForAdmin: baseUrl + 'providers/appointments',
    sendAptNotification:
      baseUrl +
      'providers/{providerId}/appointments/{appointmentId}/notification',
    // checkAvailability:
    //   baseUrl + 'providers/{providerId}/doctors/{doctorId}/check/slot',
    checkAvailability:
      baseUrl + 'providers/{providerId}/appointments/getavailableslots',
    getConfigurations: baseUrl + 'providers/{providerId}/appointmentconfig',
    patientTypeLookup:
      baseUrl + 'providers/{providerId}/practicepatienttype/lookup',
    locationLookup: baseUrl + 'providers/{providerId}/practicelocation/lookup',
    practiceLocation: baseUrl + 'providers/{providerId}/practicelocation',
    getPracticeLocationId: baseUrl + 'providers/{providerId}/practicelocation/{locationId}',
    addPracticeLocation: baseUrl + 'providers/{providerId}/practicelocation',
    editPracticeLocation: baseUrl + 'providers/{providerId}/practicelocation/{locationId}',
    deletePracticeLocation:baseUrl + 'providers/{parentId}/practicelocation/{locationId}',
    getPracticeServiceTypeForLocation:
      baseUrl +
      'providers/{providerId}/location/{locationId}/servicetype/lookup',
    equipmentsLookup: baseUrl + 'providers/{providerId}/equipments',
    roomLookup: baseUrl + 'providers/{providerId}/practicelocationroom',
    getPracticeLocationRoomId: baseUrl + 'providers/{providerId}/practicelocationroom/{practiceLocationRoomId}',
    addPracticeLocationRoom: baseUrl + 'providers/{providerId}/practicelocationroom',
    editPracticeLocationRoom: baseUrl + 'providers/{providerId}/practicelocationroom/{practiceLocationRoomId}',
    deletePracticeLocationRoom:baseUrl + 'providers/{parentId}/practicelocationroom/{practiceLocationRoomId}',
    statusLookup:
      baseUrl + 'providers/{providerId}/practiceappointmentstatuscode/lookup',
    unavailableBlocks: baseUrl + 'providers/{providerId}/unavailableblock/details',
    availableRooms: baseUrl + 'providers/{providerId}/practicelocationroom/available',
    availableEquipments: baseUrl + 'providers/{providerId}/equipments/available',
  },

  globalAdminName: 'Hellopayments',
  email: 'support@hellopayments.net',
  defaultLogoForInvoiceFormat:
    'https://hpg2-ui.s3.us-east-2.amazonaws.com/assets/images/logo_login.png',
  resultsPerPage: 10,
  truncateWordLength: 20,
  defaultStartDateRange: 3,

  product: {
    find: baseUrl + 'providers/{parentId}/items',
    findForPartner:
      baseUrl + 'providers/{parentId}/partners/{partnerId}/items',
    getById: baseUrl + 'providers/{parentId}/items/{productId}',
    getByIdForPartner:
      baseUrl +
      'providers/{parentId}/partners/{partnerId}/items/{productId}',
    add: baseUrl + 'providers/{parentId}/items',
    addForPartner:
      baseUrl + 'providers/{parentId}/partners/{partnerId}/items', // partner adds product for himself
    edit: baseUrl + 'providers/{parentId}/items/{productId}',
    editForPartner:
      baseUrl +
      'providers/{parentId}/partners/{partnerId}/items/{productId}',
    addCustomTags: baseUrl + 'providers/{parentId}/tags',
    getAllLookupTags: baseUrl + 'providers/{parentId}/tags/lookup',
    getProductsCptCodes:
      baseUrl + 'providers/{parentId}/servicecodes',
    activateDeactivateProducts:
      baseUrl + 'providers/{parentId}/items/{productId}/activations',
    lookup: baseUrl + 'providers/{parentId}/items/lookup',
  },
  service: {
    find: baseUrl + 'providers/{parentId}/items',
    findForPartner: baseUrl + 'providers/{parentId}/partners/{partnerId}/items',
    getById: baseUrl + 'providers/{parentId}/items/{serviceId}',
    getByIdForPartner: baseUrl + 'providers/{parentId}/partners/{partnerId}/items/{serviceId}',
    add: baseUrl + 'providers/{parentId}/items',
    addForPartner: baseUrl + 'providers/{parentId}/partners/{partnerId}/items',
    edit: baseUrl + 'providers/{parentId}/items/{serviceId}',
    editForPartner: baseUrl + 'providers/{parentId}/partners/{partnerId}/items/{serviceId}',
    addCustomTags: baseUrl + 'providers/{parentId}/tags',
    getAllLookupTags: baseUrl + 'providers/{parentId}/tags/lookup',
    getServiceCptCodes: baseUrl + 'providers/{parentId}/servicecodes',
    activateDeactivateServices: baseUrl + 'providers/{parentId}/items/{serviceId}/activations',
    lookup: baseUrl + 'providers/{parentId}/items/lookup',
  },

  practiceLocationServiceTypes: {
    possibleServiceTypes: baseUrl + 'providers/{parentId}/practiceservicetype/lookup',
    getServiceTypes: baseUrl + 'providers/{parentId}/location/{locationId}/servicetype/lookup',
    selectServiceType: baseUrl + 'providers/{parentId}/practicelocationservicetype',
    unselectServiceType: baseUrl + 'providers/{parentId}/practicelocationservicetype/{practiceLocationServiceTypeId}'
  },

  claims: {
    findClaims: baseUrl + 'providers/{providerId}/claims',
    getClaimById: baseUrl + 'providers/{providerId}/claims/{claimId}',
    add: baseUrl + 'providers/{providerId}/claims',
    edit: baseUrl + 'providers/{providerId}/claims/{claimId}',
    delete: baseUrl + 'providers/{providerId}/claims/{claimId}',
    reschedule: baseUrl + 'providers/{providerId}/claims/{claimId}/reschedule',
    checkStatus: baseUrl + 'providers/{providerId}/claims/{claimId}/status',
    getClaimCount: baseUrl + 'providers/{providerId}/claims/count',
  },
  eligibility: {
    find: baseUrl + 'providers/{providerId}/eligibility',
    patientFind: baseUrl + 'patients/{patientId}/eligibility',
    add: baseUrl + 'providers/{providerId}/eligibility',
    getById: baseUrl + 'providers/{providerId}/eligibility/{eligibilityId}',
    //edit: baseUrl + 'providers/{providerId}/eligibility/{eligibilityId}',
    checkStatus:
      baseUrl + 'providers/{providerId}/eligibility/{eligibilityId}/status',
  },
  emailSettings: {
    putProviderEmailSettings:
      baseUrl + 'providers/{parentId}/providersettings/email',
    verifyIdentity: baseUrl + 'providers/{parentId}/verifyidentity',
    isVerifiedIdentity:
      baseUrl + 'providers/{parentId}/isverifiedidentity',
  },

  productUploads: {
    uploadProductsFile: baseUrl + 'providers/{parentId}/uploaditems',
    getAllUploadLogs: baseUrl + 'providers/{parentId}/uploaditems',
    getByIdUploadLog:
      baseUrl + 'providers/{parentId}/uploaditems/{id}',
  },

  patientUploads: {
    uploadPatientFile:
      baseUrl + 'providers/{parentId}/uploadpatients',
    getAllUploadLogs:
      baseUrl + 'providers/{parentId}/uploadpatients',
    getByIdUploadLog:
      baseUrl + 'providers/{parentId}/uploadpatients/{id}',
    uploadPatientAttachment:
      baseUrl + 'providers/{parentId}/uploadpatients',
  },

  role: {
    find: baseUrl + 'providers/{providerId}/roles',
    add: baseUrl + 'providers/{providerId}/roles',
    delete: baseUrl + 'providers/{providerId}/roles/{roleId}',
    getById: baseUrl + 'providers/{providerId}/roles/{roleId}',
    edit: baseUrl + 'providers/{providerId}/roles/{roleId}',
    lookup: baseUrl + 'providers/{providerId}/roles/lookup',
    activateDeactivateRole:
      baseUrl + 'providers/{parentId}/roles/{roleId}/activations',
  },

  attachments: {
    providerAttachment:
      baseUrl + 'providers/{parentId}/patients/{patientId}/docs',
    providerDelete:
      baseUrl +
      'providers/{parentId}/patients/{patientId}/docs/{docId}',
    patientAttachment: baseUrl + 'patients/{patientId}/docs',
    patientDelete: baseUrl + 'patients/{patientId}/docs/{docId}',
    authorize: baseUrl + 'patients/{patientId}/docs/authorize',
  },

  notification: {
    get: baseUrl + 'providers/{providerId}/claims',
    getById: baseUrl + 'providers/{providerId}/claims/{claimId}',
    getCommunications: baseUrl + 'providers/{parentId}/notifications'
  },
  reports: {
    getEmployeeWorkTicket: baseUrl + 'providers/{parentId}/doctor/{providerId}/location/{locationId}/worktickets',
    getEmployeeSalesReport: baseUrl + 'providers/{parentId}/employeeSalesReports',
    getReconciliationReport: baseUrl + 'providers/{parentId}/reconciliationReports'
  },

  defaultDueInDaysForInvoice: 0,

  dueInDaysOptionsList: [
    { name: 'On Receipt', id: 0 },
    { name: 'Custom', id: '' },
    { name: 'Net 10', id: 10 },
    { name: 'Net 15', id: 15 },
    { name: 'Net 30', id: 30 },
    { name: 'Net 45', id: 45 },
  ],
  excerptSize: 150,
  npiSearchApiVersion: '2.1',
  npiSearchApiMinResult: 20,
  maxRefundLimitInDays: 180,
}

export default AppSetting