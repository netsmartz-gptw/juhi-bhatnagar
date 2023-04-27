import React, { useState, useEffect } from 'react'
import DoctorForm from "../doctor-form/DoctorForm"
import label from '../../../../../../assets/i18n/en.json'
import MessageSetting from '../../../../../common/constants/message-setting.constant'
import DoctorService from '../../../../../services/api/doctor.service'
import APIResponse from '../../../../templates/components/APIResponse'
import toast from 'react-hot-toast'

const AddDoctor = (props) => {
    const { embed, inputChange, refresh } = props;
    const [formData, setFormData] = useState({ address: {} });
    const [messages, setMessages] = useState({})
    const [isLoader, setIsLoader] = useState(false)
    const [apiResponse,setApiResponse] = useState()

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
        if (data.doctorTypeCode && data.firstName && data.lastName && data.phone && data.email) {
            data.phone = data.phone.includes("(") ? data.phone.replace("(","").replace(")","").replace(" ","").replace("-","") : data.phone;
            data.doctorTypeTitle = "Pediatrics";
            data.url = '';
            // return;
            setIsLoader(true)
            DoctorService.add(data)
                .then(response => {
                    setApiResponse(response)
                    clearForm()
                    setIsLoader(false)
                    refresh()
                    toast.success("Provider Succesfully Added")
                    console.log(response)
                    if(props.onClose){
                        props.onClose()
                    }
                })
                .catch(error => {
                    setIsLoader(false)
                    setApiResponse(error)
                })
        } else {
            toast.error("All fields are required!")
        }
    }

    const clearForm = () => {
        setFormData({})
    }
    return (
        <div>
            <DoctorForm submitHandler={submitHandler} initialData={formData} onClose={()=>{props.onClose()}} inputChange={inputChange} loaded={!isLoader} messages={messages} />
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default AddDoctor