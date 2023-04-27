import React, { useState, useEffect, useContext } from 'react'
import ServicesForm from '../services-form/ServicesForm'
import label from '../../../../../../assets/i18n/en.json'
import MessageSetting from '../../../../../common/constants/message-setting.constant'
import ServicesService from '../../../../../services/api/services.service'
import { store } from '../../../../../context/StateProvider'
import toast from 'react-hot-toast'

const ServicesAdd = (props) => {
    const { embed, inputChange, refresh, exitHandler } = props;
    const [formData, setFormData] = useState({ serviceType: 1 })
    const [messages, setMessages] = useState({})
    const [isLoader, setIsLoader] = useState(false)
    const state = useContext(store).state
    const submitHandler = (data, proceduralCodesList, diagnosisCodesList) => {
        if (data.unitPrice && data.taxPercent && data.description) {
            const reqObj = {
                'itemType': 2,
                'unitPrice': parseInt(data.unitPrice),
                'description': data.description,
                'quantity': 0,
                'taxPercent': parseInt(data.taxPercent),
                'tags': data.tags,
                'quantity': 0,
                'serviceType':data.serviceType,
                'practiceLocationId': state.practiceLocationId,
                'practiceServiceTypeId': data.practiceServiceTypeId
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

            setIsLoader(true)
            ServicesService.addService(reqObj)
                .then(response => {
                    clearForm()
                    setIsLoader(false)
                    toast.success("Item Succesfully Added" )
                    if(props.refresh){
                        props.refresh()
                    }
                    setMessages({ success: "Item Succesfully Added" })
                    if(props.onClose){
                        props.onClose()
                    }
                    
                })
                .catch(error => {
                    setIsLoader(false)
                    console.log(error)
                })
        } else {
            alert("All fields are required")
        }
    }

    const clearForm = () => {
        setFormData({ serviceType: 1 })
    }
    return (
        <div>
            <ServicesForm submitHandler={submitHandler} onClose={()=>props.onClose()} initialData={formData} inputChange={inputChange} loaded={!isLoader} messages={messages} />
        </div>
    )
}

export default ServicesAdd