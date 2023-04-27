import ValidationConstant from "../../../../../services/validator/validation.constant"

const DoctorFormConfig = {

    config: {
        'FirstName': {
            required: { name: ValidationConstant.doctor.add.firstName.name },
            maxlength: {
                name: ValidationConstant.doctor.add.firstName.name,
                max: ValidationConstant.doctor.add.firstName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.doctor.add.firstName.name,
                min: ValidationConstant.doctor.add.firstName.minLength.toString()
            },
            pattern: { name: ValidationConstant.doctor.add.firstName.name }
        },
        'LastName': {
            required: { name: ValidationConstant.doctor.add.lastName.name },
            maxlength: {
                name: ValidationConstant.doctor.add.lastName.name,
                max: ValidationConstant.doctor.add.lastName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.doctor.add.lastName.name,
                min: ValidationConstant.doctor.add.lastName.minLength.toString()
            },
            pattern: { name: ValidationConstant.doctor.add.lastName.name }
        },
        'Phone': {
            required: { name: ValidationConstant.patient.add.phone.name },
            maxlength: {
                name: ValidationConstant.patient.add.phone.name,
                max: ValidationConstant.patient.add.phone.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.phone.name,
                min: ValidationConstant.patient.add.phone.minLength.toString()
            },
            pattern: {
                name: ValidationConstant.patient.add.phone.name,
                regex: new RegExp(ValidationConstant.phone_regex)
            }
        },
        'Email': {
            required: { name: ValidationConstant.doctor.add.email.name },
            maxlength: {
                name: ValidationConstant.doctor.add.email.name,
                max: ValidationConstant.doctor.add.email.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.doctor.add.email.name,
                min: ValidationConstant.doctor.add.email.minLength.toString()
            },
            pattern: {
                name: ValidationConstant.doctor.add.email.name,
                regex: new RegExp(ValidationConstant.email_regex)
            }
        },
        'Npi': {
            required: { name: ValidationConstant.doctor.add.NpiNumber.name },
            maxlength: {
                name: ValidationConstant.doctor.add.NpiNumber.name,
                max: ValidationConstant.doctor.add.NpiNumber.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.doctor.add.NpiNumber.name,
                min: ValidationConstant.doctor.add.NpiNumber.minLength.toString()
            },
            pattern: { name: ValidationConstant.doctor.add.NpiNumber.name }
        },
        'DoctorTypeCode': {
            required: { name: ValidationConstant.doctor.add.doctorTypeCode.name },
        },
        'AddressLine1': {
            required: { name: ValidationConstant.doctor.add.addressLine1.name },
            maxlength: {
                name: ValidationConstant.doctor.add.addressLine1.name,
                max: ValidationConstant.doctor.add.addressLine1.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.doctor.add.addressLine1.name,
                min: ValidationConstant.doctor.add.addressLine1.minLength.toString()
            },
            pattern: { name: ValidationConstant.doctor.add.addressLine1.name }
        },
        'AddressLine2': {
            required: { name: ValidationConstant.doctor.add.addressLine2.name },
            maxlength: {
                name: ValidationConstant.doctor.add.addressLine2.name,
                max: ValidationConstant.doctor.add.addressLine2.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.doctor.add.addressLine2.name,
                min: ValidationConstant.doctor.add.addressLine2.minLength.toString()
            },
            pattern: { name: ValidationConstant.doctor.add.addressLine2.name }
        },
        'City': {
            required: { name: ValidationConstant.doctor.add.city.name },
            maxlength: {
                name: ValidationConstant.doctor.add.city.name,
                max: ValidationConstant.doctor.add.city.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.doctor.add.city.name,
                min: ValidationConstant.doctor.add.city.minLength.toString()
            },
            pattern: { name: ValidationConstant.doctor.add.city.name }
        },
        'State': {
            required: { name: ValidationConstant.doctor.add.state.name }
        },
        'Country': {
            required: { name: ValidationConstant.doctor.add.country.name }
        },
        'PostalCode': {
            required: { name: ValidationConstant.doctor.add.postalCode.name },
            maxlength: {
                name: ValidationConstant.doctor.add.postalCode.name,
                max: ValidationConstant.doctor.add.postalCode.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.doctor.add.postalCode.name,
                min: ValidationConstant.doctor.add.postalCode.minLength.toString()
            },
            pattern: { name: ValidationConstant.doctor.add.postalCode.name }
        },


    },

    'selectedDoctor': ['', []],
    'DoctorTypeCode': ['', []],
    'DoctorTypeTitle': ['', []],
    'NpiNumber': ['', []
    ],
    'FirstName': ['', []
    ],
    'LastName': ['', []
    ],
    'Phone': ['', []
    ],
    'Email': ['', []
    ],
    'Url': ['', []],
    'AddressLine1': ['', []
    ],
    'AddressLine2': ['', []
    ],
    'City': ['', []
    ],
    'State': ['', []
    ],
    'Country': ['', []],
    'PostalCode': ['', []
    ],

}
export default DoctorFormConfig