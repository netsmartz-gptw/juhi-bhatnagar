import React, { useEffect, useState } from 'react'
import label from '../../../../../../assets/i18n/en.json'
import ProductService from '../../../../../services/api/product.service'
import List from '../../../../templates/components/List'
import { Dropdown } from 'semantic-ui-react'
import Select from 'react-select'
import ModalBox  from '../../../../templates/components/ModalBox'
import EditProduct from "../product-edit/ProductEdit"

const ProductList = (props) => {
    const sortingItems = {
        date: [
            { 'label': 'Date: Sesc', 'columnName': 'createdOn', value: 'Desc' },
            { 'label': 'Date: Asc', 'columnName': 'createdOn', value: 'Asc' },
        ],
        order:
            [{ 'label': 'Name: A-Z', 'columnName': 'name', value: 'Desc' },
            { 'label': 'Name: Z-A', 'columnName': 'name', value: 'Asc' },]
    }

    const [keyword, setKeyword] = useState("")
    const [editProduct, setEditProduct] = useState(false)
    const [deactivateProduct, setDeactivateProduct] = useState(false)
    const [isLoader, setIsLoader] = useState(false)
    const [sortBy, setSortBy] = useState('Desc')

    const [productList, setProductList] = useState([])
    const [productLookupList, setProductLookupList] = useState([])

    const [noResultsMessage, setNoResultsMessage] = useState("Please select Product to begin search")
    // const { embed, editProduct } = (props)

    const changeStatus = (product) => {
        setIsLoader(true)
        let res = product.status == 1 ? ProductService.deactivateProduct(product.id) : ProductService.activateProduct(product.id);

        res.then(() => {
            refresh()
            setIsLoader(false)
        }).catch(err => {
            setIsLoader(false)
        });
    }
    const sort = () => {
        let arr;
        if (sortBy === 'Asc') {
            // arr = productList.sort((a, b) => a.name.localeCompare(b.name))
            setProductLookupList(productList.sort((a, b) => a.name.localeCompare(b.name)))
        }
        else if (sortBy === 'Desc') {
            // arr = productList.sort((a, b) => b.name.localeCompare(a.name))
            setProductLookupList(productList.sort((a, b) => b.name.localeCompare(a.name)))
        }
        else {
            // arr = productList
            setProductLookupList(productList)
        }
    }

    useEffect(() => {
        setIsLoader(true);
        ProductService.productLookup({ ItemType: 1 })
            .then((response) => {
                console.log(response)
                setProductList(response);
                setProductLookupList(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
                // setCheckException(error);
            })
    }, [])

    // const changeStatus = () => {
        
    // }

    // useEffect(() => {
    //     if (sortBy) {
    //         sort()
    //     }
    // }, [sortBy])
    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader"></div>
                </div>
            </div>}
            {!isLoader && productList ?
                <div>
                    <div className='row d-flex col-12 mb-3'>
                        <div className='col-8'>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={keyword}
                                isSearchable
                                isClearable
                                placeholder="Search Products..."
                                onChange={e => { setKeyword(e) }}
                                options={productList}
                                getOptionLabel={e => e.name}
                                getOptionValue={e => e.id}
                            />
                        </div>
                        <div className='col-4'>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={sortingItems.order.find(obj => obj.value === sortBy)}
                                onChange={e => setSortBy(e?.value ? e.value : null)}
                                isSearchable={false}
                                isClearable={false}
                                options={sortingItems.order}
                                getOptionLabel={e => e.label}
                                getOptionValue={e => e.value}
                            />
                        </div>
                    </div>
                    <List
                        listItemStyle='mb-2'
                        // sortFunc={onSort}
                        // sortList={sortingItems.order}
                        // pageSize={3}
                        isLoading={isLoader}
                    >
                        {productList.length && productLookupList.filter((product) => {
                            if (keyword === "" || keyword === null || !keyword) {
                                return product
                            } else if (product.id === keyword.id) {
                                return product
                            }
                        }).sort((a, b) => sortBy==='Desc'? a.name.localeCompare(b.name):b.name.localeCompare(a.name)).map(pdt => {
                            return (
                                <div className="ui segment results" key={pdt.id}>
                                    <div className="results-crsr">
                                        <div className="ui right floated header">
                                            <div className='col-auto'>
                                                <div className='btn-group'>
                                                    <Dropdown button direction="left" icon="ellipsis horizontal" className="btn-primary icon btn p-o">
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={e => { e.preventDefault(); setEditProduct(true) }}>Edit</Dropdown.Item>
                                                            <Dropdown.Item onClick={e => { e.preventDefault(); changeStatus(pdt) }}>{pdt.status == 0 ? 'Activate' : 'Deactivate'}</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ui horizontal list">
                                        <div className="item">
                                            <div className="content">
                                                <div className="ui sub header">{pdt.name}
                                                </div>
                                                <div className="item">
                                                    <strong> {label.product.find.creationDate}: </strong>{pdt.createdOn}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                        }
                        )}
                    </List>
                    <ModalBox open={editProduct} onClose={() => { setEditProduct(false)}} onOpen={() => {setEditProduct(true)}}>
                        <div>Edit product here</div>
                        <EditProduct productId={props.id} onClose={e => { setEditProduct(false); if (props.refresh()) {props.refresh() } }} buttonLabel="Edit" />
                    </ModalBox>
                    {/*  <ModalBox open={editForm} onClose={e => { setEditForm(false) }} onOpen={() => { setToolTip(false); setEditForm(true) }}>
                <EditAppointmentForm id={props.event.id} onClose={e => { setEditForm(false); if (props.refresh()) { props.refresh() } }} buttonLabel="Update" />
            </ModalBox> */}
                    {/* <ModalBox open={deactivateProduct} onClose={() => { setDeactivateProduct(false)}} >
                        <div>Deactivate product here</div>
                    </ModalBox> */}
                </div> : null}
        </div >
    )
}

export default ProductList