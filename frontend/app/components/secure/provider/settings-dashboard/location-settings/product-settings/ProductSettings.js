import React, { useState } from 'react'
import ProductTable from "../../../product/product-table/ProductTable"
import ProductList from '../../../product/product-list/ProductList'
import ProductSearch from '../../../product/product-search/ProductSearch'
import AccordionTemplate from '../../../../../templates/components/AccordionTemplate'
import ProductTagSettings from './ProductTagSettings'
import ProductUploadTable from './product-upload/ProductUploadTable'

const ProductSettings = (props) => {
    const [keyword, setKeyword] = useState()
    return (
        <div>
            <AccordionTemplate id="product" accordionId="product">
                <div title="Products">
                    <ProductTable title="Products" />
                </div>
                <div title="Product Tags">
                    <ProductTagSettings title="Product Tags"/>
                </div>
                <div title="Product Uploads">
                    <ProductUploadTable title="Product Uploads"/>
                </div>
            </AccordionTemplate>

        </div>
    )
}

export default ProductSettings