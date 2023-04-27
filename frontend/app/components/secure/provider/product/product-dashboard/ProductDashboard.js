import React, { useState } from 'react'
import label from '../../../../../../assets/i18n/en.json'
import Dashboard from '../../../../templates/layouts/Dashboard'
import ProductAdd from '../product-add/ProductAdd'
import ProductList from '../product-list/ProductList'
import ProductSearch from '../product-search/ProductSearch'
import ProductEdit from '../product-edit/ProductEdit'


const ProductDashboard = (props) => {
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [keyword, setKeyword] = useState("")

    const editProduct = (data) => {
        setEditId(data.id)
        setIsEdit(true)
    }

    const cancleEdit = () => {
        setIsEdit(false)
    }

    const refreshList = () => {
        setRefresh(true)
        setRefresh(false)
    }
    return (
        <Dashboard
            title={label.product.dashboard}
            Modules
        >
            <ProductList keyword={keyword} title={label.product.list.heading} editProduct={editProduct} refresh={refreshList}/> </Dashboard >
    )
}

export default ProductDashboard