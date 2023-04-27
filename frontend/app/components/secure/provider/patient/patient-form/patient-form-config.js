import ValidationConstant from "../../../../../services/validator/validation.constant"

const PatientFormConfig = {
    config: {

        'FirstName': {
            required: { name: ValidationConstant.patient.add.firstName.name },
            maxlength: {
                name: ValidationConstant.patient.add.firstName.name,
                max: ValidationConstant.patient.add.firstName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.firstName.name,
                min: ValidationConstant.patient.add.firstName.minLength.toString()
            },
            pattern: {
                name: ValidationConstant.patient.add.firstName.name,
            }
        },
        'LastName': {
            required: { name: ValidationConstant.patient.add.lastName.name },
            maxlength: {
                name: ValidationConstant.patient.add.lastName.name,
                max: ValidationConstant.patient.add.lastName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.lastName.name,
                min: ValidationConstant.patient.add.lastName.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.lastName.name }
        },
        'Mrn': {
            // required: { name: ValidationConstant.patient.add.mrn.name },
            maxlength: {
                name: ValidationConstant.patient.add.mrn.name,
                max: ValidationConstant.patient.add.mrn.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.mrn.name,
                min: ValidationConstant.patient.add.mrn.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.mrn.name }
        },
        'Ssn': {
            maxlength: {
                name: ValidationConstant.patient.add.ssn.name,
                max: ValidationConstant.patient.add.ssn.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.ssn.name,
                min: ValidationConstant.patient.add.ssn.minLength.toString()
            },
            pattern: {
                name: ValidationConstant.patient.add.ssn.name,
                regex: new RegExp(ValidationConstant.ssn_regex)
            }

        },
        'Dob': {
            required: { name: ValidationConstant.patient.add.dob.name },
            pattern: {
                name: ValidationConstant.patient.add.dob.name,
                // regex: new RegExp(ValidationConstant.dob_regex)
            }
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
            required: { name: ValidationConstant.patient.add.email.name },
            maxlength: {
                name: ValidationConstant.patient.add.email.name,
                max: ValidationConstant.patient.add.email.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.email.name,
                min: ValidationConstant.patient.add.email.minLength.toString()
            },
            pattern: {
                name: ValidationConstant.patient.add.email.name,
                regex: new RegExp(ValidationConstant.email_regex)
            }
        },
        'AddressLine1': {
            // required: { name: ValidationConstant.patient.add.addressLine1.name },
            maxlength: {
                name: ValidationConstant.patient.add.addressLine1.name,
                max: ValidationConstant.patient.add.addressLine1.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.addressLine1.name,
                min: ValidationConstant.patient.add.addressLine1.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.addressLine1.name }
        },
        'AddressLine2': {
            maxlength: {
                name: ValidationConstant.patient.add.addressLine2.name,
                max: ValidationConstant.patient.add.addressLine2.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.addressLine2.name,
                min: ValidationConstant.patient.add.addressLine2.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.addressLine2.name }
        },
        'City': {
            // required: { name: ValidationConstant.patient.add.city.name },
            maxlength: {
                name: ValidationConstant.patient.add.city.name,
                max: ValidationConstant.patient.add.city.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.city.name,
                min: ValidationConstant.patient.add.city.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.city.name }
        },
        'State': {
            // required: { name: ValidationConstant.patient.add.state.name }
        },
        'Country': {
            // required: { name: ValidationConstant.patient.add.country.name }
        },
        'HasInsurance': {
            required: { name: ValidationConstant.patient.add.hasInsurance.name }
        },
        'PostalCode': {
            required: { name: ValidationConstant.patient.add.postalCode.name },
            maxlength: {
                name: ValidationConstant.patient.add.postalCode.name,
                max: ValidationConstant.patient.add.postalCode.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.postalCode.name,
                min: ValidationConstant.patient.add.postalCode.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.postalCode.name }
        },
        'DoctorId': {
            required: { name: ValidationConstant.patient.add.doctorId.name },
        },
        'InsureFirstName': {
            required: { name: ValidationConstant.patient.add.firstName.name },
            maxlength: {
                name: ValidationConstant.patient.add.firstName.name,
                max: ValidationConstant.patient.add.firstName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.firstName.name,
                min: ValidationConstant.patient.add.firstName.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.firstName.name }
        },
        'InsureLastName': {
            required: { name: ValidationConstant.patient.add.firstName.name },
            maxlength: {
                name: ValidationConstant.patient.add.firstName.name,
                max: ValidationConstant.patient.add.firstName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.firstName.name,
                min: ValidationConstant.patient.add.firstName.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.firstName.name }
        },
        'InsurePhone': {
            required: { name: ValidationConstant.patient.add.phone.name },
            maxlength: {
                name: ValidationConstant.patient.add.phone.name,
                max: ValidationConstant.patient.add.phone.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.phone.name,
                min: ValidationConstant.patient.add.phone.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.phone.name }
        },
        'InsureEmail': {
            // required: { name: ValidationConstant.patient.add.email.name },
            maxlength: {
                name: ValidationConstant.patient.add.email.name,
                max: ValidationConstant.patient.add.email.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.email.name,
                min: ValidationConstant.patient.add.email.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.email.name }
        },
        'InsureAddressLine1': {
            required: { name: ValidationConstant.patient.add.addressLine1.name },
            maxlength: {
                name: ValidationConstant.patient.add.addressLine1.name,
                max: ValidationConstant.patient.add.addressLine1.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.addressLine1.name,
                min: ValidationConstant.patient.add.addressLine1.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.addressLine1.name }
        },
        'InsureAddressLine2': {
            maxlength: {
                name: ValidationConstant.patient.add.addressLine2.name,
                max: ValidationConstant.patient.add.addressLine2.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.addressLine2.name,
                min: ValidationConstant.patient.add.addressLine2.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.addressLine2.name }
        },
        'InsureState': {
            required: { name: ValidationConstant.patient.add.state.name }
        },
        'InsureCity': {
            required: { name: ValidationConstant.patient.add.city.name },
            maxlength: {
                name: ValidationConstant.patient.add.city.name,
                max: ValidationConstant.patient.add.city.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.city.name,
                min: ValidationConstant.patient.add.city.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.city.name }
        },
        'InsureCountry': {
            required: { name: ValidationConstant.patient.add.country.name }
        },
        'InsurePostalCode': {
            required: { name: ValidationConstant.patient.add.postalCode.name },
            maxlength: {
                name: ValidationConstant.patient.add.postalCode.name,
                max: ValidationConstant.patient.add.postalCode.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.postalCode.name,
                min: ValidationConstant.patient.add.postalCode.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.postalCode.name }
        },
        'InsurancePartner': {
            required: { name: ValidationConstant.patient.add.insurancePartner.name }
        },
        'PolicyNo': {
            required: { name: ValidationConstant.patient.add.policyNo.name },
            maxlength: {
                name: ValidationConstant.patient.add.policyNo.name,
                max: ValidationConstant.patient.add.policyNo.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.policyNo.name,
                min: ValidationConstant.patient.add.policyNo.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.policyNo.name }
        },
        'GroupNo': {
            required: { name: ValidationConstant.patient.add.groupNo.name },
            maxlength: {
                name: ValidationConstant.patient.add.groupNo.name,
                max: ValidationConstant.patient.add.groupNo.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.groupNo.name,
                min: ValidationConstant.patient.add.groupNo.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.groupNo.name }
        },
        'BinNo': {
            maxlength: {
                name: ValidationConstant.patient.add.binNo.name,
                max: ValidationConstant.patient.add.binNo.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.binNo.name,
                min: ValidationConstant.patient.add.binNo.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.binNo.name }
        },
        'Relation': {
            required: { name: ValidationConstant.patient.add.relation.name }
        },
        // second insurance
        'InsureFirstName2': {
            required: { name: ValidationConstant.patient.add.firstName.name },
            maxlength: {
                name: ValidationConstant.patient.add.firstName.name,
                max: ValidationConstant.patient.add.firstName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.firstName.name,
                min: ValidationConstant.patient.add.firstName.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.firstName.name }
        },
        'InsureLastName2': {
            required: { name: ValidationConstant.patient.add.firstName.name },
            maxlength: {
                name: ValidationConstant.patient.add.firstName.name,
                max: ValidationConstant.patient.add.firstName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.firstName.name,
                min: ValidationConstant.patient.add.firstName.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.firstName.name }
        },
        'InsurePhone2': {
            required: { name: ValidationConstant.patient.add.phone.name },
            maxlength: {
                name: ValidationConstant.patient.add.phone.name,
                max: ValidationConstant.patient.add.phone.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.phone.name,
                min: ValidationConstant.patient.add.phone.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.phone.name }
        },
        'InsureEmail2': {
            // required: { name: ValidationConstant.patient.add.email.name },
            maxlength: {
                name: ValidationConstant.patient.add.email.name,
                max: ValidationConstant.patient.add.email.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.email.name,
                min: ValidationConstant.patient.add.email.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.email.name }
        },
        'SecInsureAddressLine1': {
            required: { name: ValidationConstant.patient.add.addressLine1.name },
            maxlength: {
                name: ValidationConstant.patient.add.addressLine1.name,
                max: ValidationConstant.patient.add.addressLine1.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.addressLine1.name,
                min: ValidationConstant.patient.add.addressLine1.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.addressLine1.name }
        },
        'SecInsureAddressLine2': {
            maxlength: {
                name: ValidationConstant.patient.add.addressLine2.name,
                max: ValidationConstant.patient.add.addressLine2.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.addressLine2.name,
                min: ValidationConstant.patient.add.addressLine2.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.addressLine2.name }
        },
        'InsureState2': {
            required: { name: ValidationConstant.patient.add.state.name }
        },
        'InsureCity2': {
            required: { name: ValidationConstant.patient.add.city.name },
            maxlength: {
                name: ValidationConstant.patient.add.city.name,
                max: ValidationConstant.patient.add.city.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.city.name,
                min: ValidationConstant.patient.add.city.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.city.name }
        },
        'InsureCountry2': {
            required: { name: ValidationConstant.patient.add.country.name }
        },
        'InsurePostalCode2': {
            required: { name: ValidationConstant.patient.add.postalCode.name },
            maxlength: {
                name: ValidationConstant.patient.add.postalCode.name,
                max: ValidationConstant.patient.add.postalCode.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.postalCode.name,
                min: ValidationConstant.patient.add.postalCode.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.postalCode.name }
        },
        'InsurancePartner2': {
            required: { name: ValidationConstant.patient.add.insurancePartner.name }
        },
        'PolicyNo2': {
            required: { name: ValidationConstant.patient.add.policyNo.name },
            maxlength: {
                name: ValidationConstant.patient.add.policyNo.name,
                max: ValidationConstant.patient.add.policyNo.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.policyNo.name,
                min: ValidationConstant.patient.add.policyNo.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.policyNo.name }
        },
        'GroupNo2': {
            required: { name: ValidationConstant.patient.add.groupNo.name },
            maxlength: {
                name: ValidationConstant.patient.add.groupNo.name,
                max: ValidationConstant.patient.add.groupNo.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.groupNo.name,
                min: ValidationConstant.patient.add.groupNo.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.groupNo.name }
        },
        'BinNo2': {
            maxlength: {
                name: ValidationConstant.patient.add.binNo.name,
                max: ValidationConstant.patient.add.binNo.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.patient.add.binNo.name,
                min: ValidationConstant.patient.add.binNo.minLength.toString()
            },
            pattern: { name: ValidationConstant.patient.add.binNo.name }
        },
        'Relation2': {
            required: { name: ValidationConstant.patient.add.relation.name }
        },
        'CheckEligibility': {
            required: { name: ValidationConstant.patient.add.checkEligibility.name }
        },
        'ServiceDate': {
            required: { name: ValidationConstant.patient.add.serviceDate.name }
        }

    },
    'DoctorId': ['', []],
    'ServiceDate': [null, []],

    'InsureFirstName': ['', []],
    'InsureLastName': ['', []],
    'InsurePhone': ['', []],
    'InsureEmail': ['', []],
    'InsureAddressLine1': ['', []],
    'InsureAddressLine2': ['', []],
    'InsureState': ['', []],
    'InsureCity': ['', []],
    'InsureCountry': ['', []],
    'InsurancePartner': ['', []],
    'InsurePostalCode': ['', []],
    'PolicyNo': ['', []],
    'GroupNo': ['', []],
    'BinNo': ['', []],
    'Relation': ['', []],
    'PrimaryInsuranceId': ['', []],
    'SameAsPatientAddress': [false, []],
    //second insurance
    'SecondInsurance': ['0', []],
    'InsureFirstName2': ['', []],
    'InsureLastName2': ['', []],
    'InsurePhone2': ['', []],
    'InsureEmail2': ['', []],
    'SecInsureAddressLine1': ['', []],
    'SecInsureAddressLine2': ['', []],
    'InsureState2': ['', []],
    'InsureCity2': ['', []],
    'InsureCountry2': ['', []],
    'InsurancePartner2': ['', []],
    'InsurePostalCode2': ['', []],
    'PolicyNo2': ['', []],
    'GroupNo2': ['', []],
    'BinNo2': ['', []],
    'Relation2': ['', []],
    'SecondaryInsuranceId': ['', []],
    'SameAsPatientAddress2': [false, []],
}
export default PatientFormConfig