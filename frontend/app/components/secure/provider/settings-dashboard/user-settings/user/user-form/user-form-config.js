import ValidationConstant from "../../../../../../../services/validator/validation.constant";

const UserFormConfig ={
    config: {
        'UserAdminUserName': {
            required: { name: ValidationConstant.user.add.userAdminUserName.name },
            maxlength: {
                name: ValidationConstant.user.add.userAdminUserName.name,
                // max: ValidationConstant.userAdminUserName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.user.add.userAdminUserName.name,
                min: ValidationConstant.user.add.userAdminUserName.minLength.toString()
            },
            pattern: { name: ValidationConstant.user.add.userAdminUserName.name }
        },
        'FirstName': {
            required: { name: ValidationConstant.user.add.firstName.name },
            maxlength: {
                name: ValidationConstant.user.add.firstName.name,
                max: ValidationConstant.user.add.firstName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.user.add.firstName.name,
                min: ValidationConstant.user.add.firstName.minLength.toString()
            },
            pattern: { name: ValidationConstant.user.add.firstName.name }
        },
        'LastName': {
            required: { name: ValidationConstant.user.add.lastName.name },
            maxlength: {
                name: ValidationConstant.user.add.lastName.name,
                max: ValidationConstant.user.add.lastName.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.user.add.lastName.name,
                min: ValidationConstant.user.add.lastName.minLength.toString()
            },
            pattern: { name: ValidationConstant.user.add.lastName.name }
        },
        'Phone': {
            required: { name: ValidationConstant.user.add.phone.name },
            maxlength: {
                name: ValidationConstant.user.add.phone.name,
                max: ValidationConstant.user.add.phone.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.user.add.phone.name,
                min: ValidationConstant.user.add.phone.minLength.toString()
            },
            pattern: { 
                name: ValidationConstant.user.add.phone.name ,
                regex: new RegExp(ValidationConstant.user.add.phone_regex)
            }
        },
        'Email': {
            required: { name: ValidationConstant.user.add.email.name },
            maxlength: {
                name: ValidationConstant.user.add.email.name,
                max: ValidationConstant.user.add.email.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.user.add.email.name,
                min: ValidationConstant.user.add.email.minLength.toString()
            },
            pattern: {
                 name: ValidationConstant.user.add.email.name,
                 regex: new RegExp(ValidationConstant.user.add.email_regex)
             }
        },
        'Url': {
            required: { name: ValidationConstant.user.add.url.name },
            maxlength: {
                name: ValidationConstant.user.add.url.name,
                max: ValidationConstant.user.add.url.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.user.add.url.name,
                min: ValidationConstant.user.add.url.minLength.toString()
            },
            pattern: { name: ValidationConstant.user.add.url.name }
        },
        'AddressLine1': {
            required: { name: ValidationConstant.user.add.addressLine1.name },
            maxlength: {
                name: ValidationConstant.user.add.addressLine1.name,
                max: ValidationConstant.user.add.addressLine1.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.user.add.addressLine1.name,
                min: ValidationConstant.user.add.addressLine1.minLength.toString()
            },
            pattern: { name: ValidationConstant.user.add.addressLine1.name }
        },
        'AddressLine2': {
            required: { name: ValidationConstant.user.add.addressLine2.name },
            maxlength: {
                name: ValidationConstant.user.add.addressLine2.name,
                max: ValidationConstant.user.add.addressLine2.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.user.add.addressLine2.name,
                min: ValidationConstant.user.add.addressLine2.minLength.toString()
            },
            pattern: { name: ValidationConstant.user.add.addressLine2.name }
        },
        'City': {
            required: { name: ValidationConstant.user.add.city.name },
            maxlength: {
                name: ValidationConstant.user.add.city.name,
                max: ValidationConstant.user.add.city.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.user.add.city.name,
                min: ValidationConstant.user.add.city.minLength.toString()
            },
            pattern: { name: ValidationConstant.user.add.city.name }
        },
        'State': {
            required: { name: ValidationConstant.user.add.state.name }
        },
        'Country': {
            required: { name: ValidationConstant.user.add.country.name }
        },
        'PostalCode': {
            required: { name: ValidationConstant.user.add.postalCode.name },
            maxlength: {
                name: ValidationConstant.user.add.postalCode.name,
                max: ValidationConstant.user.add.postalCode.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.user.add.postalCode.name,
                min: ValidationConstant.user.add.postalCode.minLength.toString()
            },
            pattern: { name: ValidationConstant.user.add.postalCode.name }
        },
        'RoleId': {
            required: { name: ValidationConstant.user.add.role.name },
        },
    
    }
}

export default UserFormConfig