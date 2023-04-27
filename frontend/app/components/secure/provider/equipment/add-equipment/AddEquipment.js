import React, { useState, useEffect, useContext } from 'react'
import label from '../../../../../../assets/i18n/en.json'
import MessageSetting from '../../../../../common/constants/message-setting.constant'
import EquipmentService from '../../../../../services/api/equipment.service'
import { store } from '../../../../../context/StateProvider'
import EquipmentForm from '../equipment-form/EquipmentForm'
import toast from 'react-hot-toast'
import APIResponse from '../../../../templates/components/APIResponse'

const AddEquipment = (props) => {
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
        EquipmentService.addEquipment({...data, practiceLocationId: contextState.practiceLocationId.practiceLocationId})
            .then(response => {
                setApiResponse(response)
                clearForm()
                setIsLoader(false)
                // toast.success(MessageSetting.LoginServiceequipmentType.add)
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
    // console.log(contextState)
    return (
        <div>
            {/* {contextState.practiceLocationId} */}
            <EquipmentForm submitHandler={submitHandler} initialData={formData} inputChange={inputChange} exitHandler={()=>props.exitHandler() } submitLabel="Add" messages={messages} />
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default AddEquipment