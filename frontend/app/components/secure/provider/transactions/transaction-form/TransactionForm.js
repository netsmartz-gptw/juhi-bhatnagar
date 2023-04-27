import React, { useEffect, useState } from 'react'
import CommonService from '../../../../../services/api/common.service'
import AccordionTemplate from '../../../../templates/components/AccordionTemplate'
import Select from 'react-select'
import DoctorService from '../../../../../services/api/doctor.service'
import ProductService from '../../../../../services/api/product.service'
import InputMask from 'react-input-mask'
import moment from 'moment'
import Utilities from '../../../../../services/commonservice/utilities'
import ModalBox from '../../../../templates/components/ModalBox'
import AddPatient from '../../patient/add-patient/AddPatient'
import { IMaskInput } from 'react-imask'
import { IconGroup } from 'semantic-ui-react'
import InvoiceService from '../../../../../services/api/invoice.service'

const TransactionForm = (props) => {
    const [patientList, setPatientList] = useState()
    const [inputData, setInputData] = useState(props.initialData)
    const [providerList, setProviderList] = useState()
    const [productList, setProductList] = useState()
    const [selectedProductList, setSelectedProductList] = useState([])
    const [serviceList, setServiceList] = useState()
    const [selectedServiceList, setSelectedServiceList] = useState([])
    const [subTotal, setSubTotal] = useState(0)
    const [totalDiscount, setTotalDiscount] = useState(0)
    const [totalTax, setTotalTax] = useState(0)
    const [total, setTotal] = useState(0)
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalServices, setTotalServices] = useState(0)
    const [showAdd, setShowAdd] = useState(false)
    const [payMethod, setPayMethod] = useState(0)
    const [selectedPatient, setSelectedPatient] = useState()

    const patientLookup = () => {
        let reqObj = { SearchTerm: '', isActive: true, isRegistered: true, SortField: 'firstName'  }
        CommonService.patientLookup(reqObj)
            .then(res => {
                if (res) {
                    console.log(res)
                    setPatientList(res)
                    if (props.initialData.patientId) {
                        setSelectedPatient(res.data.find(obj => obj.id === props.initialData.patientId))
                    }
                }
            }
            )
            .catch(err => console.log(err))
    }


    const providerLookup = () => {
        // setIsLoader(true)
        if (!providerList) {
            const reqObj = { isRegistered: true, isActive: true };
            DoctorService.doctorLookup(reqObj)
                .then(
                    (response) => {
                        setProviderList(response)
                        if (props.initialData.patientId) {
                            inputChange({ target: { name: 'doctorId', value: providerList.find(obj => obj.id === props.initialData.doctorId) } })
                        }
                        // setIsLoader(false)
                    })
                .catch((error) => {
                    // setIsLoader(false)
                    console.log(error);
                })
        }
    }

    const productLookup = () => {
        ProductService.productLookup()
            .then(res => {
                console.log(res)
                setProductList(res.filter(result => { return result.itemType === 1 }))
                setServiceList(res.filter(result => { return result.itemType === 2 }))
            })
    }
    const parseItems = () => {
        setSelectedProductList(props.initialData.items.filter(obj => { return obj.itemType === 1 }).map(prod=>
  
            {
                let newProd =prod
                newProd.serviceId = prod.serviceId || null
                newProd.discount = prod.discount || 0
            return newProd
        }))
        setSelectedServiceList(props.initialData.items.filter(obj => { return obj.itemType === 2 }).map(serv=>
            {
                let newServ =serv
                newServ.serviceId = serv.serviceId || null
                newServ.discount = serv.discount || 0
            return newServ
        }))
    }
    useEffect(() => {
        patientLookup()
        providerLookup()
        productLookup()
        if (props.initialData.items) {
            parseItems()
        }
    }, [])

    const addProduct = (product) => {
        let newProduct = { ...product }
        let newList = [...selectedProductList]
        newProduct.quantity = 1
        newProduct.discount = product.discount || 0
        newProduct.discountType = product.discountType || 1
        newProduct.serviceId = product.serviceId || null
        newProduct.taxPercent = parseInt(product.taxPercent) || 0
        newList.push(newProduct)
        setSelectedProductList([...newList])
    }

    const addService = (service) => {
        let newService = { ...service }
        let newList = [...selectedServiceList]
        newService.quantity = 1
        newService.discount = service.discount || 0
        newService.discountType = service.discountType || 1
        newService.serviceId = service.serviceId || null
        newService.taxPercent = parseInt(service.taxPercent) || 0
        newList.push(newService)
        setSelectedServiceList([...newList])
    }

    const changeProduct = (e, i) => {
        let newList = [...selectedProductList]
        newList[i][e.target.name] = e.target.value
        return setSelectedProductList([...newList])
    }

    const changeService = (e, i) => {
        let newList = [...selectedServiceList]
        newList[i][e.target.name] = e.target.value
        return setSelectedServiceList([...newList])
    }

    const removeProduct = (i) => {
        setSelectedProductList([...selectedProductList].splice(1))
    }
    const removeService = (i) => {
        setSelectedServiceList([...selectedServiceList].splice(1))
    }

    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value
        setInputData(newStateObject);
        return console.log(inputData)
    };

    const lineTotal = (element) => {
        let total = parseInt(element.unitPrice) * parseInt(element.quantity)
        if (element.discount > 0) {
            total = total - Math.round((element.discount / 100) * 100) / 100 * total
            if (element.taxPercent > 0) {
                return Math.round(total * (1 + element.taxPercent / 100) * 100) / 100
            }
            else {
                return total
            }
        }
        else {
            if (element.taxPercent > 0) {
                return Math.round(total * (1 + element.taxPercent / 100) * 100) / 100
            }
            else {
                return total
            }
        }
    }

    const sumItems = (items) => {
        let newArray = [...items]
        let subTotal = 0
        let discountTotal = 0
        let taxTotal = 0
        let productTotal = 0
        let serviceTotal = 0
        newArray.forEach((item, i) => {
            subTotal = subTotal + (item.unitPrice * item.quantity)
            discountTotal = parseInt(item.discount) > 0 ? discountTotal + Math.round(parseInt(item.quantity) * item.unitPrice * (item.discount / 100) * 100) / 100 : discountTotal
            taxTotal = parseInt(item.taxPercent) > 0 ? taxTotal = Math.round(parseInt(item.quantity) * item.unitPrice * (parseInt(item.taxPercent) / 100) * 100) / 100 : taxTotal
            productTotal = item.itemType == 1 ? productTotal + lineTotal(item) : productTotal
            serviceTotal = item.itemType == 2 ? serviceTotal + lineTotal(item) : serviceTotal
        })
        console.log(serviceTotal)
        setTotalDiscount(discountTotal)
        setTotalServices(serviceTotal)
        setTotalProducts(productTotal)
        setSubTotal(subTotal)
        setTotalTax(taxTotal)
        setTotal(subTotal - discountTotal + taxTotal)
    }

    useEffect(() => {
        sumItems([...selectedProductList, ...selectedServiceList])
    }, [selectedProductList, selectedServiceList])

    useEffect(() => {
        return inputChange({
            target: {
                name: "paymentMethod", value: payMethod
            }
        })
    }, [payMethod])

    return (
        <div>
            <div className='container-fluid mb-3'>
                <h5 className='text-center'>Collect Payment</h5>
                <div className='row d-flex align-items-end'>
                    <div className="required field col-12">
                        <label><i className="icon user outline" /> Choose Patient</label>
                        <div className='input-group col-12'>
                            <Select
                                className="col"
                                options={patientList}
                                name="patientId"
                                value={selectedPatient}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.id, name: 'patientId' }
                                    })
                                    setSelectedPatient(e)
                                }}
                                isClearable={false}
                                isDisabled={props.initialData.patientId}
                                getOptionLabel={(option) => {
                                    return (
                                        option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                                    )
                                }
                                }
                                getOptionValue={(option) => option.id}
                                noOptionsMessage={(e) => { return <button className='btn btn-primary form-control' onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add Patient</button> }}
                            />
                            {!props.initialData.patientId && <button className='btn btn-primary col-auto' title="Add Patient" onClick={e => { e.preventDefault(); setShowAdd(true) }}><i className='icon plus' /></button>}
                        </div>
                        {/* {props.initialData.patientId} */}
                    </div>
                </div>
                <AccordionTemplate id="addTransaction" accordionId="addTransaction" className="my-3" defaultActiveKey={0}>
                    <div title='Products/Services'>
                        <div className='container-fluid my-3'>
                            <div className='row d-flex'>
                                <div className='col-12 mt-3 px-0 card table-responsive'>
                                    <table className='table table-borderless my-0'>
                                        <thead>
                                            <tr>
                                                <th className='py-2'>Products</th>
                                                <th className='py-2'>Unit Rate</th>
                                                <th className='py-2'>Quantity</th>
                                                <th className='py-2'>Discount(%)</th>
                                                <th className='py-2'>Tax(%)</th>
                                                <th className='py-2'>Amount</th>
                                                <th className='py-2'></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedProductList && selectedProductList.map((product, i) => {
                                                return (
                                                    <tr>
                                                        <td className='pb-0 pt-3'>{product.name}</td>
                                                        <td><input disabled value={Utilities.toDollar(product.unitPrice)} type="text" name="unitPrice" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                                        <td><input value={selectedProductList[i].quantity} type="number" name="quantity" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                                        <td><input value={selectedProductList[i].discount} type="number" name="discount" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                                        <td><input value={selectedProductList[i].taxPercent} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                                        <td><input type="text" disabled value={Utilities.toDollar(lineTotal(product)).toString()} /></td>
                                                        <td><button className='btn btn-transparent' onClick={e => { e.preventDefault(); removeProduct(i) }}>
                                                            <i className='icon trash' />
                                                        </button></td>
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td colSpan={7}>
                                                    <div className='input-group row align-items-center'>
                                                        <i className='icon plus col-auto mb-2' />
                                                        <Select
                                                            options={productList}
                                                            onChange={e => {
                                                                addProduct(e)
                                                            }}
                                                            value={null}
                                                            className="col"
                                                            placeholder="Add Product"
                                                            getOptionLabel={(option) => option.name + ' | $' + option.unitPrice}
                                                            getOptionValue={(option) => option.id}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            {selectedProductList.length > 0 && <tr className="thead m-0">
                                                <th colSpan={4} className='text-end'>Total Products</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(totalProducts || 0)}</th>
                                            </tr>}
                                            <tr className="thead">
                                                <th>Services</th>
                                                <th>Unit Rate</th>
                                                <th>Quantity</th>
                                                <th>Discount(%)</th>
                                                <th>Tax(%)</th>
                                                <th>Amount</th>
                                                <th></th>
                                            </tr>
                                            {selectedServiceList && selectedServiceList.map((service, i) => {
                                                return (
                                                    <tr>
                                                        <td className='pb-0 pt-3'>{service.name}</td>
                                                        <td><input disabled value={Utilities.toDollar(service.unitPrice)} type="text" name="unitPrice" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                                        <td><input value={selectedServiceList[i].quantity} type="number" name="quantity" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                                        <td><input value={selectedServiceList[i].discount} type="number" name="discount" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                                        <td><input value={selectedServiceList[i].taxPercent} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                                        <td><input type="text" disabled value={Utilities.toDollar(lineTotal(service)).toString()} /></td>
                                                        <td><button className='btn btn-transparent' onClick={e => { e.preventDefault(); removeService(i) }}>
                                                            <i className='icon trash' />
                                                        </button></td>
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td colSpan={7}>
                                                    <div className='input-group row align-items-center'>
                                                        <i className='icon plus col-auto mb-2' />
                                                        <Select
                                                            options={serviceList}
                                                            onChange={e => {
                                                                addService(e)
                                                            }}
                                                            value={null}
                                                            className="col"
                                                            placeholder="Add Service"
                                                            getOptionLabel={(option) => option.name + ' | $' + option.unitPrice}
                                                            getOptionValue={(option) => option.id}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            {selectedServiceList.length > 0 && <tr className="thead">
                                                <th colSpan={4} className='text-end'>Total Services</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(totalServices || 0)}</th>
                                            </tr>}
                                            {totalDiscount > 0 || totalTax > 0 ? <tr className='thead'>
                                                <th colSpan={4} className='text-end'>Sub Total</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(subTotal || 0)}</th>
                                            </tr> : null}
                                            {totalDiscount > 0 ? <tr className="thead">
                                                <th colSpan={4} className='text-end'>Total Discount</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(totalDiscount || 0)}</th>
                                            </tr> : null}
                                            {totalTax > 0 && <tr className="thead">
                                                <th colSpan={4} className='text-end'>Total Tax</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(totalTax || 0)}</th>
                                            </tr>}
                                            <tr className="thead">
                                                <th colSpan={4} className='text-end'>Total Amount</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(total)}</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div title='Payment Options'>
                        <div className='container-fluid'>
                            <div className='row d-flex p-3'>
                                <div className='col-12 row d-flex mb-3'>
                                    <div className="field ui checkbox col">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={payMethod === 1}
                                            value={1}
                                            name="paymentMethod"
                                            onInputCapture={(e => {
                                                e.preventDefault(); if (payMethod !== 1) {
                                                    setPayMethod(1)
                                                }
                                                else {
                                                    setPayMethod(0)
                                                }
                                            })}
                                        />
                                        <label className="form-check-label">
                                            Send To Patient
                                        </label>
                                    </div>
                                    <div className="field ui checkbox col">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={payMethod === 0}
                                            value={0}
                                            name="paymentMethod"
                                            onInputCapture={(e => {
                                                e.preventDefault();
                                                if (payMethod !== 0)
                                                    setPayMethod(0)
                                                else {
                                                    setPayMethod(1)
                                                }

                                            })}
                                        />
                                        <label className="form-check-label">
                                            Pay In Full
                                        </label>
                                    </div>
                                    <div className="field ui checkbox col">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={payMethod === 2}
                                            value={2}
                                            name="paymentMethod"
                                            onInputCapture={(e => {
                                                e.preventDefault(); if (payMethod !== 2) {
                                                    setPayMethod(2)
                                                }
                                                else {
                                                    setPayMethod(0)
                                                }
                                            })}
                                        />
                                        <label className="form-check-label">
                                            Create Payment Plan
                                        </label>
                                    </div>
                                    <div className="field ui checkbox col">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={payMethod === 3}
                                            value={3}
                                            name="paymentMethod"
                                            onInputCapture={(e => {
                                                console.log(e)
                                                e.preventDefault(); if (payMethod !== 3) {
                                                    setPayMethod(3)
                                                }
                                                else {

                                                    setPayMethod(0)
                                                }
                                            })}
                                        />
                                        <label className="form-check-label">
                                            Setup Subscription
                                        </label>
                                    </div>
                                </div>
                                <div className=''>
                                    {payMethod !== 0 && <div className='row d-flex'>
                                        <div className='field required col-6'>
                                            <label>Checkout Date</label>
                                            <input type="datetime-local" name="checkoutDate" value={inputData.checkoutDate} onChange={e => { e.preventDefault(); inputChange(e) }} />
                                        </div>
                                        <div className='field required col-6'>
                                            <label>Due in Days</label>
                                            <select className="form-select" name="terms" value={inputData.terms} onChange={e => { e.preventDefault(); inputChange(e) }}>
                                                <option selected value="on-receipt">On Receipt</option>
                                                <option value="custom">Custom</option>
                                                <option value="net-10">Net 10</option>
                                                <option value="net-15">Net 15</option>
                                                <option value="net-30">Net 30</option>
                                                <option value="net-45">Net 45</option>
                                            </select>
                                        </div>
                                        <div className='field required col-6'>
                                            <label>Due Date</label>
                                            <input type="datetime-local" name="dueDate" value={inputData.dueDate} onChange={e => { e.preventDefault(); inputChange(e) }} />
                                        </div>
                                        <div className='field required col-6'>
                                            <label>Service Date</label>
                                            <input type="datetime-local" name="serviceDate" value={inputData.serviceDate} onChange={e => { e.preventDefault(); inputChange(e) }} />
                                        </div>
                                    </div>}
                                    {selectedServiceList.length > 0 && <div className='field required col-12'>
                                        <label>Search Provider</label>
                                        <Select
                                            options={providerList}
                                            isDisabled={!providerList}
                                            name="doctorId"
                                            isSearchable
                                            isClearable
                                            value={providerList && providerList.find(obj => obj.id === inputData.doctorId)}
                                            onChange={e => {
                                                inputChange({
                                                    target:
                                                        { value: e.id, name: 'doctorId' }
                                                })
                                            }}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                        />
                                    </div>}
                                </div>
                                <div className='col-12'>
                                    <label>Payment Message</label>
                                    <textarea className='form-control' name="description" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.description || "Thank you for your business"}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionTemplate>
                {/* <hr/> */}
                {!props.isEdit && <div><button className='btn btn-primary me-2'>Save as Draft</button>
                    <button onClick={e => { e.preventDefault(); props.submitHandler(inputData, selectedPatient, [...selectedProductList, ...selectedServiceList]) }} className='btn btn-primary me-2'>{payMethod === 0 ? 'Pay In Full' : payMethod === 1 ? 'Send to Patient' : payMethod === 2 ? 'Create Payment Plan' : 'Setup Subscription'}</button>
                    {!props.hideCancel && <button className='btn btn-secondary' style={{ float: 'right' }} onClick={e => { e.preventDefault(); if (props.cancelClick) { props.cancelClick() } }}>Cancel</button>}
                </div>}
                {props.isEdit && <div><button className='btn btn-primary me-2' onClick={e => { e.preventDefault(); props.submitHandler(inputData, selectedPatient, [...selectedProductList, ...selectedServiceList]) }}>Update</button>
                </div>}
                <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
                    <AddPatient />
                </ModalBox>
            </div>
        </div>
    )
}
export default TransactionForm