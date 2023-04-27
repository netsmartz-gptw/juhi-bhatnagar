import ValidationConstant from "../../../../../services/validator/validation.constant"

const AppointmentFormConfig = {

    config: {
        'PatientId': {
            required: { name: ValidationConstant.appointment.add.patient.name }
        },
        'PatientType': {
            required: { name: ValidationConstant.appointment.add.patientType.name }
        },
        'Location': {
            required: { name: ValidationConstant.appointment.add.location.name }
        },
        'ServiceType': {
            required: { name: ValidationConstant.appointment.add.serviceType.name }
        },
        'Status': {
            required: { name: ValidationConstant.appointment.add.status.name }
        },
        'Room': {
            required: { name: ValidationConstant.appointment.add.room.name }
        },
        'Equipment': { required: { name: ValidationConstant.appointment.add.equipment.name } },
        'ReasonForVisit': {
            maxlength: {
                name: ValidationConstant.appointment.add.reasonForVisit.name,
                max: ValidationConstant.appointment.add.reasonForVisit.maxLength.toString()
            }
        },
        'DoctorName': {
            required: { name: ValidationConstant.appointment.add.doctor.name },
            doctorName: { name: 'Provider' },
            isActiveDoctor: { name: ValidationConstant.appointment.add.isActiveDoctor.name },
        },
        'RepeatOn': {
            required: { name: ValidationConstant.appointment.add.repeatOn.name }
        },
        'AptTotalCount': {
            required: { name: ValidationConstant.appointment.add.appointmentCount.name },
            pattern: { name: ValidationConstant.appointment.add.appointmentCount.name }
        },
        'Phone': {
            required: { name: ValidationConstant.appointment.add.phone.name },
            maxlength: {
                name: ValidationConstant.appointment.add.phone.name,
                max: ValidationConstant.appointment.add.phone.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.appointment.add.phone.name,
                min: ValidationConstant.appointment.add.phone.minLength.toString()
            },
            pattern: {
                name: ValidationConstant.appointment.add.phone.name,
                regex: new RegExp(ValidationConstant.phone_regex)
            }
        },
        'Email': {
            //required: { name: ValidationConstant.appointment.add.email.name },
            maxlength: {
                name: ValidationConstant.appointment.add.email.name,
                max: ValidationConstant.appointment.add.email.maxLength.toString()
            },
            minlength: {
                name: ValidationConstant.appointment.add.email.name,
                min: ValidationConstant.appointment.add.email.minLength.toString()
            },
            pattern: {
                name: ValidationConstant.appointment.add.email.name,
                regex: new RegExp(ValidationConstant.email_regex)
            }
        },
        'StartTime': {
            required: { name: ValidationConstant.appointment.add.startTime.name }
        },
        'EndTime': {
            required: { name: ValidationConstant.appointment.add.endTime.name }
        },
        'StartDate': {
            required: { name: ValidationConstant.appointment.add.startDate.name },
            PastDate: { name: 'Start Time' },
        },
        'Duration': {
            required: { name: ValidationConstant.appointment.add.duration.name },
            pattern: { name: ValidationConstant.appointment.add.duration.name },
            MinDuration: { name: ValidationConstant.appointment.add.duration.name },
            MaxDuration: { name: ValidationConstant.appointment.add.duration.name }
        },
        'Memo': {
            maxlength: {
                name: ValidationConstant.appointment.add.memo.name,
                max: ValidationConstant.appointment.add.memo.maxLength.toString()
            }
        },
        'PatientInsuranceId': {
            required: { name: ValidationConstant.appointment.add.patientInsuranceId.name },
            pattern: { name: ValidationConstant.appointment.add.patientInsuranceId.name }
        },
    },
    'PatientName': ['', []],
    'DoctorName': ['', []],
    'StartDate': [null, []],
    'RepeatOn': ['0', []],
    'StartTime': [null, []],
    'EndTime': [null, []],
    'Duration': ['', []],
    'AptTotalCount': [''],
    'Phone': ['', []],
    'Email': ['', []],
    'Memo': ['', []],
    'PatientInsuranceId': ['', []],
    'CheckEligibility': [false, []],
}

export default AppointmentFormConfig