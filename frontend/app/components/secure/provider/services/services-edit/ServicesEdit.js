import React, { useState, useEffect } from 'react'
import ServicesForm from '../services-form/ServicesForm'
import ServicesService from '../../../../../services/api/services.service'

const ServicesEdit = (props) => {
    const { embed, id, exitEdit, inputChange, refresh } = props;
    const [formData, setFormData] = useState({})
    const [messages, setMessages] = useState({})
    const [isLoaded_form, setIsLoaded_form] = useState(false)
    
    useEffect(() => {
        ServicesService.getServiceById(id)
            .then(res => {
                res.productName = res.name;
                res.productAlias = res.name;
                res.cptCode = res.serviceId;
                res.icd10Code = res.serviceId;
                res.codeName = res.serviceId;
                setFormData(res)
                setIsLoaded_form(true)
            })
            .catch(err => { console.log(err); setIsLoaded_form(true) })
    }, [])

    const submitHandler = (data, proceduralCodesList, diagnosisCodesList) => {
        const reqObj = {
            itemType: 2,
            unitPrice: parseInt(data.unitPrice),
            description: data.description,
            quantity: 0,
            taxPercent: parseInt(data.taxPercent),
            tags: data.tags,
            quantity: 0,
            serviceType: data.serviceType,
            id: data.id
        };

        if (data.cptCode !== undefined && data.cptCode !== null && data.cptCode !== '') {
            reqObj.serviceId = data.cptCode;
        }

        if (data.cptCode !== undefined && data.cptCode !== null && data.cptCode !== '' && data.serviceType === 1) {
            const selectedCode = proceduralCodesList.find(t => t.id === data.codeName);
            reqObj.name = selectedCode.name;
            reqObj.serviceId = data.cptCode;
            if (data.productAlias != undefined && data.productAlias != null && data.productAlias.trim() != '') {
                reqObj.name = data.productAlias.trim()
            }
        }

        if (data.icd10Code !== undefined && data.icd10Code !== null && data.icd10Code !== '' && data.serviceType === 2) {
            const selectedCode = diagnosisCodesList.find(t => t.id === data.codeName);
            reqObj.name = selectedCode.name;
            reqObj.serviceId = data.icd10Code;
            if (data.productAlias != undefined && data.productAlias != null && data.productAlias.trim() != '') {
                reqObj.name = data.productAlias.trim()
            }
        }

        // setIsLoader(true)
        ServicesService.editService(reqObj)
            .then(response => {
                setMessages({ success: "Item Succesfully Edited" })
                alert('Item Succesfully Edited')
                props.exitHandler()
            })
            .catch(error => {
                // setIsLoader(false)
                console.log(error)
                alert('Error')
            })
    }

    return (
        <div>
            {isLoaded_form && <ServicesForm submitHandler={submitHandler} initialData={formData} messages={messages} inputChange={inputChange}
                submitLabel="Update" loaded={isLoaded_form} exitHandler={() => props.exitEdit()} />}
        </div>
    )
}

export default ServicesEdit