import React, {useState} from 'react'
import Dashboard from '../../../../templates/layouts/Dashboard'
import ProductServiceForm from '../product-service-form/ProductServiceForm'
import ProductServiceList from '../product-service-list/ProductServiceList'
import ProductServiceSearch from '../product-service-search/ProductServiceSearch'

const ProductServiceDashboard = (props) => {
    return(
        <Dashboard title="ProductServices Dashboard" Modules>
            <ProductServiceSearch title="ProductService Search" side="left"/>
            <ProductServiceForm title="ProductService Form" side="left"/>
            <ProductServiceList title="ProductService List" side="right"/>
        </Dashboard>
    )
}

export default ProductServiceDashboard