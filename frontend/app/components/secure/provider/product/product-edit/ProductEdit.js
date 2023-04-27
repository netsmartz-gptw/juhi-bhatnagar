import React, { useState, useEffect } from 'react'
import ProductForm from '../product-form/ProductForm'
import ProductService from '../../../../../services/api/product.service'
import toast from 'react-hot-toast';
import APIResponse from '../../../../templates/components/APIResponse';

const ProductEdit = (props) => {
    const { embed, id, exitEdit, inputChange, refresh } = props;
    const [formData, setFormData] = useState({})
    const [messages, setMessages] = useState({})
    const [isLoaded_form, setIsLoaded_form] = useState(false)
    const [apiResponse,setApiResponse] = useState()
    
    useEffect(() => {
        setIsLoaded_form(false)
        ProductService.getProductById({id:props.id})
            .then(res => {
                setFormData(res)
                return setIsLoaded_form(true)
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
        let reqObj = data
        reqObj.unitPrice = parseFloat(reqObj.unitPrice) || 0;
        reqObj.taxPercent = parseFloat(reqObj.taxPercent) || 0;
        reqObj.quantity = parseFloat(reqObj.quantity) || 0;
        reqObj.discount = parseFloat(reqObj.discount) || 0;
        reqObj.discountType=2
        delete reqObj.serviceId
        delete reqObj.serviceType
        // setIsLoader(true)
        ProductService.editProduct(reqObj)
            .then(response => {
                setApiResponse(response)
                toast.success('Product Succesfully Edited')
                props.onClose()
            })
            .catch(error => {
                setApiResponse(error)
                // setIsLoader(false)
                // console.log(error)
            })
    }

    return (
        <div>
            {isLoaded_form && <ProductForm submitHandler={submitHandler} initialData={formData} messages={messages} inputChange={inputChange}
                submitLabel="Update" loaded={isLoaded_form} onClose={() => props.onClose()} />}    
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>    
        </div>
    )
}

export default ProductEdit