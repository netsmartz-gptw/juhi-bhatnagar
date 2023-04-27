import React, { useState, useEffect } from 'react'
import EquipmentTypeForm from '../equipment-type-form/EquipmentTypeForm'
import label from '../../../../../../assets/i18n/en.json'
import EquipmentService from '../../../../../services/api/equipment.service'
import APIResponse from '../../../../templates/components/APIResponse'
import toast from 'react-hot-toast'
import MessageSetting from '../../../../../common/constants/message-setting.constant'

const EditEquipmentType = (props) => {
    const {id,inputChange} = props;
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

    const submitHandler = (data) => {
        // setIsLoader(true)
        const reqObj = {
            equipmentTypeId: data.equipmentTypeId,
            equipmentType: data.equipmentType,
            masterEquipmentTypeId: data.masterEquipmentTypeId,
        }
        EquipmentService.editEquipmentType(reqObj)
            .then(response => {
                setApiResponse(response)
                toast.success(MessageSetting.LoginServiceequipmentType.edit)
                props.exitHandler()
            })
            .catch(error => {
                setApiResponse(error)
            })
    }

    return (
        <div>
           {props.initialData && <EquipmentTypeForm submitHandler={submitHandler} exitHandler={()=>props.exitHandler() } initialData={props.initialData} inputChange={inputChange} submitLabel="Update" messages={messages}/>}
           <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default EditEquipmentType