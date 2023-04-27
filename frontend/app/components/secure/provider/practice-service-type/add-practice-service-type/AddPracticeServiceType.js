import React, { useState, useContext } from 'react'
import PracticeServiceTypeService from '../../../../../services/api/practice-service-type.service'
import { store } from '../../../../../context/StateProvider'
import PracticeServiceTypeForm from '../practice-service-type-form/PracticeServiceTypeForm'
import APIResponse from '../../../../templates/components/APIResponse';
import toast from 'react-hot-toast';

const AddPracticeServiceType = (props) => {
    const { embed, inputChange, refresh, exitHandler } = props;
    const [formData, setFormData] = useState({})
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
        // return console.log(data);
        setIsLoader(true)
        PracticeServiceTypeService.addPracticeServiceType(
            { ...data, defaultDuration: parseInt(data.defaultDuration), unitPrice: parseInt(data.unitPrice)}
            )
            .then(response => {
                setApiResponse(response)
                clearForm()
                setIsLoader(false)
                // toast.success("Service Type added successfully")
                props.exitHandler()
            })
            .catch(error => {
                setApiResponse(error)
                setIsLoader(false)
                // console.log(error)
            })
    }

    const clearForm = () => {
        setFormData({})
    }

    return (
        <div>
            <PracticeServiceTypeForm submitHandler={submitHandler} initialData={formData} inputChange={inputChange} exitHandler={() => props.exitHandler()} submitLabel="Add" messages={messages} />
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default AddPracticeServiceType