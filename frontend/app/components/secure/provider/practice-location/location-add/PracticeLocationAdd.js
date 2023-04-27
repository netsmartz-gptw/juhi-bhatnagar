import React, { useState } from 'react'
import CommonService from '../../../../../services/api/common.service'
import PracticeLocationForm from '../location-form/PracticeLocationForm'
import AppointmentService from '../../../../../services/api/appointment.service'
import toast from 'react-hot-toast'
import MessageSetting from '../../../../../common/constants/message-setting.constant'
import APIResponse from '../../../../templates/components/APIResponse';


const PracticeLocationAdd = (props) => {
    const { inputChange } = props;
    let loggedInUserData = {}
    loggedInUserData = CommonService.getLoggedInData()
    const [locationFormData, setLocationFormData] = useState({ practiceLocation: '' })
    const [isLoader, setIsLoader] = useState(false)
    const [apiResponse, setApiResponse] = useState()

    const onSuccess = (message) => {
        if (props.refresh) {
            props.refresh()
        }
        if (props.onClose) {
            props.onClose()
        }
        if (props.exitHandler) {
            props.exitHandler()
        }
    }

    const submitHandler = (data) => {
        if (!data.practiceLocation) {
            toast.error("Location Required")
        }
        else {
            setIsLoader(true)
            AppointmentService.addPracticeLocation(data)
                .then(response => {
                    setApiResponse(response)
                    clearForm()
                    setIsLoader(false)
                    // toast.success(MessageSetting.LoginServicePracticelocation.add)
                    if (props.onClose()) {
                        props.onClose()
                    }
                })
                .catch(error => {
                    setApiResponse(error)
                    setIsLoader(false)
                    console.log(error)
                })
        }
    }

    const clearForm = () => {
        setLocationFormData({})
    }
    return (
        <div>
            <PracticeLocationForm onClose={() => { if (props.onClose) { props.onClose() } }} submitHandler={submitHandler} initialFormData={locationFormData} inputChange={inputChange} />
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true} />
        </div>
    )
}

export default PracticeLocationAdd