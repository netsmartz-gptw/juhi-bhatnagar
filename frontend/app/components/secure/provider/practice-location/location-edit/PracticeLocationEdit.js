import React, {useState,useEffect} from 'react'
import AppointmentService from '../../../../../services/api/appointment.service'
import CommonService from '../../../../../services/api/common.service'
import PracticeLocationForm from '../location-form/PracticeLocationForm'
import toast from 'react-hot-toast'
import MessageSetting from '../../../../../common/constants/message-setting.constant'
import APIResponse from '../../../../templates/components/APIResponse'

const PracticeLocationEdit = (props) => {
    const {inputChange,locationId}=props
    let loggedInUserData={}
    loggedInUserData=CommonService.getLoggedInData()
    const [locationFormData, setLocationFormData] = useState(props.initialData)
    const [apiResponse,setApiResponse] = useState()
   
    useEffect(()=>{
        AppointmentService.getLocationById(props.locationId)
        .then(res =>{
            // console.log(res)
            setLocationFormData(res)
        })
        .catch(err =>{
            // console.log(err);
            // setIsLoaded_form(true)
        })
    },[])

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
    
    // console.log(userFormData)
    const submitHandler=(data)=>{
        const reqObj ={
            practiceLocation:data?.practiceLocation ,
            timeZoneInfo:0
        }
        AppointmentService.editPracticeLocation(reqObj,locationId)
        .then(response => {
            setApiResponse(response)
            // console.log(response.status)
            // toast.success(MessageSetting.LoginServicePracticelocation.edit)
            if(props.onClose()){
                props.onClose()
            }
        })

        .catch(error => {
            setApiResponse(error)
        })
    }

    // console.log(apiResponse)
    return(
        <div>
          {locationFormData && <PracticeLocationForm submitHandler={submitHandler} initialFormData={locationFormData} onClose={()=>{props.onClose()}}/>}
          <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
      
    )
}

export default PracticeLocationEdit