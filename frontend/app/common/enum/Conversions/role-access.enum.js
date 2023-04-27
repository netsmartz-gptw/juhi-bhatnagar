const RoleAccessEnum = {
    RoleEnum: {
        1: {
            title: "Admin",
            key: "admin",
            permissions: {}
        },
        2: {
            title: "Front Desk",
            key: "front-desk",
            permissions: {}
        },
        3: {
            title: "Provider",
            key: "provider",
            permissions: {}
        },
        4: {
            title: "Call Center",
            key: "call-center",
            permissions: {}
        },
        5: {
            title: "Book Keeper",
            key: "book-keeper",
            permissions: {}
        },
    },
    ModuleEnum: {
        1: {
            title: 'Patient Management', key: 'patient-management'
        },
        2: {
            title: 'Patient Checkout', key: 'patient-checkout'
        },
        3: {
            title: 'Claims Management', key: 'claims-management'
        },
        4: {
            title: "Transactions", key: 'transactions'
        },
        5: {
            title: "Payment Plans", key: 'payment-plans'
        },
        6: {
            title: "Settings", key: 'settings'
        },
        7: {
            title: "Insurance Management", key: 'insurance-management'
        },
        8: {
            title: "User Management", key: 'user-management'
        },
        9: {
            title: "Provider Management", key: 'provider-management'
        },
        10: {
            title: "Forms Management", key: 'forms-management'
        },
        11: {
            title: "Training Videos", key: 'training-videos'
        },
        12: {
            title: "SMS Notifications", key: 'sms-notifications'
        },
        13: {
            title: "Email Notifications", key: 'email-notifications'
        },
        14: {
            title: "Appointment Management", key: 'appointment-management'
        },
        15: {
            title: "Reports", key: 'reports'
        },
        16: {
            title: "Eligibility Management",
            key: 'eligibility-management'
        },
        17: {
            title: "Role Management",
            key: 'role-management'
        }
    },
    FeaturesEnum = {
        101: {
            key: "addLinkPatient",
            title: ""
        },
        102: {
            key: "editPatient",
            title: ""
        },
        103: {
            key: "viewAllPatient",
            title: ""
        },
        104: {
            key: "resetPatientPassword",
            title: ""
        },
        105: {
            key: "addNotes",
            title: ""
        },
        106: {
            key: "patientInsuranceManagement",
            title: ""
        },
        107: {
            key: "bulkUploadPatients",
            title: ""
        },
        108: {
            key: "addPaymentAccount",
            title: ""
        },
        109: {
            key: "editPaymentAccount",
            title: ""
        },
        110: {
            key: "viewPaymentAccount",
            title: ""
        },
        111: {
            key: "deletePaymentAccount",
            title: ""
        },
        112: {
            key: "patientCheckInCheckOut",
            title: ""
        },
        113: {
            key: "optInOut",
            title: ""
        },
        114: {
            key: "uploadAttachments",
            title: ""
        },
        115: {
            key: "viewAttachments",
            title: ""
        },
        116: {
            key: "viewNotes",
            title: ""
        },
        201: {
            key: "productServicesManagement",
            title: ""
        },
        202: {
            key: "itemLookup",
            title: ""
        },
        203: {
            key: "viewAllInvoices",
            title: ""
        },
        204: {
            key: "addInvoice",
            title: ""
        },
        205: {
            key: "editInvoice",
            title: ""
        },
        206: {
            key: "sendToPatientInvoice",
            title: ""
        },
        207: {
            key: "resendInvoice",
            title: ""
        },
        208: {
            key: "closeAndWritreOff",
            title: ""
        },
        209: {
            key: "cancelInvoice",
            title: ""
        },
        210: {
            key: "invoicePayInFull",
            title: ""
        },
        211: {
            key: "createPaymentPlan",
            title: ""
        },
        212: {
            key: "createSubscriptionPlan",
            title: ""
        },
        301: {
            key: "viewAllClaims",
            title: ""
        },
        302: {
            key: "addNewClaim",
            title: ""
        },
        303: {
            key: "editClaim",
            title: ""
        },
        304: {
            key: "reScheduleClaim",
            title: ""
        },
        305: {
            key: "checkClaimStatus",
            title: ""
        },
        306: {
            key: "cancelClaim",
            title: ""
        },
        401: {
            key: "viewAllTransaction",
            title: ""
        },
        402: {
            key: "transactionReceipt",
            title: ""
        },
        403: {
            key: "voidTransaction",
            title: ""
        },
        404: {
            key: "refundTransaction",
            title: ""
        },
        405: {
            key: "cashAndCheckPayments",
            title: ""
        },
        406: {
            key: "updateCashAndCheckPayments",
            title: ""
        },
        407: {
            key: "achPayments",
            title: ""
        },
        501: {
            key: "viewAllplans",
            title: ""
        },
        502: {
            key: "viewReceipt",
            title: ""
        },
        503: {
            key: "viewTransactionHistory",
            title: ""
        },
        504: {
            key: "updatePlan",
            title: ""
        },
        505: {
            key: "updateAccount",
            title: ""
        },
        506: {
            key: "sendPaymentPlanReceipt",
            title: ""
        },
        607: {
            key: "24HourReminderScheduledPaymentNotifications(OTR)",
            title: ""
        },
        601: {
            key: "viewProviderSettings",
            title: ""
        },
        602: {
            key: "uploadLogo",
            title: ""
        },
        603: {
            key: "skins",
            title: ""
        },
        604: {
            key: "profile",
            title: ""
        },
        605: {
            key: "changePassword",
            title: ""
        },
        606: {
            key: "emailSetting",
            title: ""
        },
        607: {
            key: "viewNotificationSetting",
            title: ""
        },
        608: {
            key: "updateNotificationSetting",
            title: ""
        },
        609: {
            key: "viewEquipmentType",
            title: ""
        },
        610: {
            key: "updateEquipmentType",
            title: ""
        },
        611: {
            key: "addEquipmentType",
            title: ""
        },
        612: {
            key: "viewEquipment",
            title: ""
        },
        613: {
            key: "updateEquipment",
            title: ""
        },
        614: {
            key: "addEquipment",
            title: ""
        },
        701: {
            key: "viewAllInsurance",
            title: ""
        },
        702: {
            key: "viewInsuranceDetail",
            title: ""
        },
        703: {
            key: "addInsurance",
            title: ""
        },
        704: {
            key: "editInsurance",
            title: ""
        },
        801: {
            key: "viewAllUsers",
            title: ""
        },
        802: {
            key: "addUser",
            title: ""
        },
        803: {
            key: "editUser",
            title: ""
        },
        804: {
            key: "activatedUser",
            title: ""
        },
        805: {
            key: "deactivateUser",
            title: ""
        },
        806: {
            key: "userResetPassword",
            title: ""
        },
        901: {
            key: "viewAllPractitioner",
            title: ""
        },
        902: {
            key: "addPractitioner",
            title: ""
        },
        903: {
            key: "editPractitioner",
            title: ""
        },
        904: {
            key: "activatePractitioner",
            title: ""
        },
        905: {
            key: "deactivatePractitioner",
            title: ""
        },
        1001: {
            key: "viewAllForms",
            title: ""
        },
        1002: {
            key: "addForms",
            title: ""
        },
        1003: {
            key: "editForms",
            title: ""
        },
        1004: {
            key: "linkForm",
            title: ""
        },
        1005: {
            key: "deactivateForm",
            title: ""
        },
        1005: {
            key: "activateForm",
            title: ""
        },
        1006: {
            key: "duplicateForm",
            title: ""
        },
        1007: {
            key: "viewPublicSubmissions",
            title: ""
        },
        1008: {
            key: "viewFormUrlAndQRCode",
            title: ""
        },
        1009: {
            key: "publicFormSubmissionEmailNotification",
            title: ""
        },
        1010: {
            key: "publicFormURLSenttoPatient",
            title: ""
        },
        1011: {
            key: "addsubmission",
            title: ""
        },
        1101: {
            key: "viewTrainingVideos",
            title: ""
        },
        1401: {
            key: "viewAllAppointment",
            title: ""
        },
        1402: {
            key: "addAppointment",
            title: ""
        },
        1403: {
            key: "editAppointment",
            title: ""
        },
        1404: {
            key: "deleteAppointment",
            title: ""
        },
        1405: {
            key: "24hAutoAppointmentReminder",
            title: ""
        },
        1501: {
            key: "transactionDashboardReports",
            title: ""
        },
        1502: {
            key: "patientReports",
            title: ""
        },
        1503: {
            key: "appointmentReports",
            title: ""
        },
        1504: {
            key: "invoiceReports",
            title: ""
        },
        1505: {
            key: "taxReports",
            title: ""
        },
        1601: {
            key: "viewEligibility",
            title: ""
        },
        1602: {
            key: "addEligibility",
            title: ""
        },
        1701: {
            key: "viewRoles",
            title: ""
        },
        1702: {
            key: "addUpdateRoles",
            title: ""
        },
        1703: {
            key: "activateDeactivateRole",
            title: ""
        },
        1704: {
            key: "roleLookup",
            title: ""
        },
    },

}
export default RoleAccessEnum