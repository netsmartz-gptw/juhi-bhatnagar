import React, { useState, useEffect } from 'react'
import DoctorForm from '../doctor-form/DoctorForm'
import label from '../../../../../../assets/i18n/en.json'
import DoctorService from '../../../../../services/api/doctor.service'
import toast from 'react-hot-toast'
import APIResponse from '../../../../templates/components/APIResponse'
import MessageSetting from '../../../../../common/constants/message-setting.constant'

const EditDoctor = (props) => {
    const { embed, id, exitEdit, inputChange, refresh } = props;
    const [formData, setFormData] = useState({})
    const [messages, setMessages] = useState({})
    const [isLoaded_form, setIsLoaded_form] = useState(false)
    const [isLoader, setIsLoader] = useState(false)
    const [error, setError] = useState()
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

    useEffect(() => {
        DoctorService.getById(id)
            .then(res => {
                res.phone = res.mobile;
                res.doctorTypeCode = res.doctorType;
                setFormData(res)
                setIsLoaded_form(true)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const submitHandler = (data) => {
        setIsLoader(true)
        const reqObj = {
            doctorTypeCode: data.doctorType,
            doctorTypeTitle: "Pediatrics",
            firstName: data.firstName,
            lastName: data.lastName,
            mobile: data.phone.includes("(") ? data.phone.replace("(","").replace(")","").replace(" ","").replace("-","") : data.phone,
            phone: data.phone.includes("(") ? data.phone.replace("(","").replace(")","").replace(" ","").replace("-","") : data.phone,
            email: data.email,
            npi: data.npi,
            address: data.address
        }
        DoctorService.update(reqObj, id)
            .then(response => {
                console.log(response)
                setApiResponse(response)
                toast.success(MessageSetting.LoginServicedoctor.edit)
                setIsLoader(false)
                if (props.onClose) {
                    props.onClose()
                }
            })
            .catch(error => {
                setIsLoader(false)
                setApiResponse(error)
                if(error?.status===400)
                { toast.error(err.data.errors)
                }
                setIsLoaded_form(true)
            })
    }


    return (
        <div>
            {isLoaded_form && <DoctorForm submitHandler={submitHandler} initialData={formData} messages={messages} inputChange={inputChange} onClose={() => props.onClose()} loaded={isLoaded_form} isEdit />}
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
            {error && error.map(err=>{
                return(<span className='error-message'>{err.field.substr(4)}</span>)
            })}
        </div>
    )
}

export default EditDoctor