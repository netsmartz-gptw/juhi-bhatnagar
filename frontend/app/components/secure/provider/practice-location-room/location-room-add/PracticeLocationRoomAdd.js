import React, { useState} from 'react'
import CommonService from '../../../../../services/api/common.service'
import AppointmentService from '../../../../../services/api/appointment.service'
import toast from 'react-hot-toast'
import MessageSetting from '../../../../../common/constants/message-setting.constant'
import PracticeLocationRoomForm from '../location-room-form/PracticeLocationRoomForm'
import APIResponse from '../../../../templates/components/APIResponse';

const PracticeLocationRoomAdd = (props) => {
    const { inputChange} = props;
    let loggedInUserData={}
    loggedInUserData=CommonService.getLoggedInData()
    const [locationFormData, setLocationFormData] = useState(props.initialData || {})
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
        setIsLoader(true)
        AppointmentService.addPracticeLocationRoom(data)
            .then(res => {
                clearForm()
                setIsLoader(false)
                props.onClose()
                // toast.success(MessageSetting.LoginServicePracticelocation.addRoom)
                setApiResponse(res);
            })
            .catch(error => {
                setIsLoader(false)
                console.log(error)
                setApiResponse(error);
            })
    }

    const clearForm = () => {
        setLocationFormData({})
    }
    return (
        <div>
            <PracticeLocationRoomForm submitHandler={submitHandler} initialFormData={locationFormData} inputChange={inputChange} onClose={()=>{props.onClose()}}/>
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default PracticeLocationRoomAdd