import React, {useState,useEffect, useContext} from 'react'
import AppointmentService from '../../../../../services/api/appointment.service'
import CommonService from '../../../../../services/api/common.service'
import toast from 'react-hot-toast'
import MessageSetting from '../../../../../common/constants/message-setting.constant'
import PracticeLocationRoomForm from '../location-room-form/PracticeLocationRoomForm'
import { store } from '../../../../../context/StateProvider'
import APIResponse from '../../../../templates/components/APIResponse';

const PracticeLocationEdit = (props) => {
    let loggedInUserData={}
    loggedInUserData=CommonService.getLoggedInData()
    const [locationFormData, setLocationFormData] = useState(props.initialData)
    const state = useContext(store).state

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
   
    useEffect(()=>{
        AppointmentService.getLocationRoomById(props.initialData.practiceLocationRoomId)
        .then(res =>{
            setLocationFormData(res)
        })
        .catch(err =>{
            console.log(err);
            // setIsLoaded_form(true)
        })
    },[])

    const submitHandler=(data)=>{
        const reqObj ={
            room:data?.room ,
            practiceLocationId:data?.practiceLocationId
        }
  
        AppointmentService.editPracticeLocationRoom(reqObj,state.practiceLocationId)
        .then(res => {
            setApiResponse(res);
            // toast.success(MessageSetting.LoginServicePracticelocation.editRoom)
            if(props.onClose()){
                props.onClose()
            }
        }).catch(err =>{
            setApiResponse(err);
        })
    }
    return(
        <div>
          <PracticeLocationRoomForm submitHandler={submitHandler} initialFormData={locationFormData} onClose={()=>props.onClose()}/>
          <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
      
    )
}

export default PracticeLocationEdit