import React, { useState, useEffect } from 'react'
import PracticeServiceTypeService from '../../../../../services/api/practice-service-type.service'
import PracticeServiceTypeForm from '../practice-service-type-form/PracticeServiceTypeForm'
import APIResponse from '../../../../templates/components/APIResponse'
import toast from 'react-hot-toast'

const EditPracticeServiceType = (props) => {
    const { embed, id, exitEdit, inputChange, refresh } = props;
    const [formData, setFormData] = useState({})
    const [messages, setMessages] = useState({})
    const [isLoaded_form, setIsLoaded_form] = useState(false)
    const [apiResponse,setApiResponse] = useState()


    useEffect(() => {
        PracticeServiceTypeService.getPracticeServiceTypeById(props.id)
            .then(res => {
                console.log(res.data[0])
                setFormData(res.data[0])
                setIsLoaded_form(true)
            })
            .catch(err => { console.log(err); setIsLoaded_form(true) })
    }, [])

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
        let reqObj = {...data}
        reqObj.unitPrice = parseInt(reqObj.unitPrice)
        PracticeServiceTypeService.editPracticeServiceType(reqObj)
            .then(response => {
               setApiResponse(response)
                console.log(response)
                props.exitHandler()
            })
            .catch(error => {
                setApiResponse(error)
                // console.log(error)
            })
    }

    return (
        <div>
            {isLoaded_form && <PracticeServiceTypeForm submitHandler={submitHandler} initialData={formData} messages={messages} inputChange={inputChange} submitLabel="Update" exitHandler={()=>props.exitHandler() }/>}
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default EditPracticeServiceType