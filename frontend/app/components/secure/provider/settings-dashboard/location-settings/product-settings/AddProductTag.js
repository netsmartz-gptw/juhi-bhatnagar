import React, {useState, useEffect} from 'react'
import ProductService from '../../../../../../services/api/product.service'
import ProductTagForm from './ProductTagForm'

const AddProductTag = (props)=>{
    const addTag = (reqObj) =>{
        ProductService.addcustomTags(reqObj)
        .then(res=>{
            console.log(res)
            if(props.onClose){
                props.onClose()
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return(
        <ProductTagForm onClose={()=>{props.onClose()}} initialData={props.initialData} submitHandler={addTag}/>
    )
}

export default AddProductTag