import React, { useState, useEffect, useContext } from 'react'
import EquipmentTypeForm from "../equipment-type-form/EquipmentTypeForm"
import label from '../../../../../../assets/i18n/en.json'
import MessageSetting from '../../../../../common/constants/message-setting.constant'
import EquipmentService from '../../../../../services/api/equipment.service'
import {store} from '../../../../../context/StateProvider'
import APIResponse from '../../../../templates/components/APIResponse'
import toast from 'react-hot-toast'

const AddEquipmentType = (props) => {
    const {inputChange} = props;
    const [formData, setFormData] = useState(props.initialData||{})
    const [messages, setMessages] = useState({})
    const [isLoader, setIsLoader] = useState(false)
    const [apiResponse,setApiResponse] = useState()
    const globalStateAndDispatch = useContext(store)
    const contextState = globalStateAndDispatch.state

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
        EquipmentService.addEquipmentType({...data, practiceLocationId: contextState.practiceLocationId})
            .then(response => {
                setApiResponse(response)
                clearForm()
                setIsLoader(false)
                toast.success(MessageSetting.LoginServiceequipmentType.add)
                props.exitHandler()
            })
            .catch(error => {
                setIsLoader(false)
                setApiResponse(error)
                console.log(error)
            })
    }

    const clearForm = () => {
        setFormData({})
    }
    return (
        <div>
            <EquipmentTypeForm submitHandler={submitHandler} initialData={formData} inputChange={inputChange} loaded={!isLoader} exitHandler={props.exitHandler} submitLabel="Add" messages={messages} />
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default AddEquipmentType