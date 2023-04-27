import React, { useState, useEffect } from 'react'
import ProductForm from '../product-form/ProductForm'
import label from '../../../../../../assets/i18n/en.json'
import MessageSetting from '../../../../../common/constants/message-setting.constant'
import ProductService from '../../../../../services/api/product.service'
import toast from 'react-hot-toast'
import APIResponse from '../../../../templates/components/APIResponse'

const ProductAdd = (props) => {
    const { embed, inputChange, refresh, exitHandler } = props;
    const [formData, setFormData] = useState({ })
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
        // if (data.name && data.quantity && data.unitPrice && data.taxPercent && data.description && data.practiceLocationId) {
            let reqObj = {...data}
            reqObj.itemType = 1;
            reqObj.unitPrice = parseFloat(reqObj.unitPrice) || 0;
            reqObj.taxPercent = parseFloat(reqObj.taxPercent) || 0;
            reqObj.quantity = parseFloat(reqObj.quantity) || 0;
            reqObj.discount = parseFloat(reqObj.discount) || 0;
            reqObj.discountType = 2
            setIsLoader(true)
            ProductService.addProduct(reqObj)
                .then(response => {
                    setApiResponse(response)
                    clearForm()
                    setIsLoader(false)
                    refresh()
                    setMessages({ success: "Item Succesfully Added" })
                    toast.success("Product Succesfully Added")
                    return props.onClose()
                })
                .catch(error => {
                    setApiResponse(error)
                    setIsLoader(false)
                    console.log(error)
                    toast.error('Error')
                })
        // } else {
        //     toast.error("All fields are required")
        // }
    }

    const clearForm = () => {
        setFormData({ })
    }
    return (
        <div>
            <ProductForm submitHandler={submitHandler} onClose={()=>props.onClose()} initialData={formData} inputChange={inputChange} loaded={!isLoader} messages={messages} />
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>
        </div>
    )
}

export default ProductAdd