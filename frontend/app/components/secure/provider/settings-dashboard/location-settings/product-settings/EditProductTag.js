import React, {useState, useEffect} from 'react'
import ProductService from '../../../../../../services/api/product.service'
import ProductTagForm from './ProductTagForm'

const EditProductTag = (props)=>{
    const edit = (reqObj) =>{

        ProductService.addcustomTags(reqObj)
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return(
        <ProductTagForm onClose={()=>{props.onClose()}} initialData={props.initialData} submitHandler={edit}/>
    )
}

export default EditProductTag