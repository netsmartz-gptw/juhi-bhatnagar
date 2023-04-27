import React, { useState, useEffect } from 'react'
import label from '../../../../../../assets/i18n/en.json'
import EquipmentService from '../../../../../services/api/equipment.service'
import EquipmentForm from '../equipment-form/EquipmentForm'
import APIResponse from '../../../../templates/components/APIResponse'
import toast from 'react-hot-toast'
import MessageSetting from '../../../../../common/constants/message-setting.constant'

const EditEquipment = (props) => {
    const {id, inputChange} = props;
    const [formData, setFormData] = useState({})
    const [messages, setMessages] = useState({})
    const [isLoaded_form, setIsLoaded_form] = useState(false)
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
        EquipmentService.getEquipmentById(id)
            .then(res => {
                // console.log(res.data)
                setFormData(res.data)
                setIsLoaded_form(true)
            })
            .catch(err => { console.log(err); setIsLoaded_form(true) })
    }, [])

    const submitHandler = (data) => {
        // setIsLoader(true)

        EquipmentService.editEquipment(data)
            .then(response => {
                // console.log(response)
                setApiResponse(response)
                // toast.success(MessageSetting.LoginServiceequipmentType.edit)
                props.exitHandler()
            })
            .catch(error => {
                setApiResponse(error)
            })
    }

    return (
        <div>
            {isLoaded_form && <EquipmentForm submitHandler={submitHandler} initialData={formData} messages={messages} inputChange={inputChange} submitLabel="Update" exitHandler={()=>props.exitHandler() }/>}
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default EditEquipment