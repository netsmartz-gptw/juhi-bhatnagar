import React, { useEffect, useState, useContext } from 'react'
import CommonService from '../../../../../services/api/common.service'
import AccordionTemplate from '../../../../templates/components/AccordionTemplate'
import Select from 'react-select'
import DoctorService from '../../../../../services/api/doctor.service'
import ProductService from '../../../../../services/api/product.service'
import moment from 'moment'
import Utilities from '../../../../../services/commonservice/utilities'
import ModalBox from '../../../../templates/components/ModalBox'
import AddPatient from '../../patient/add-patient/AddPatient'
import DimLoader from '../../../../templates/components/DimLoader'
import { store } from '../../../../../context/StateProvider'
import InvoiceService from '../../../../../services/api/invoice.service'
import toast from 'react-hot-toast'
import AppointmentService from '../../../../../services/api/appointment.service'
import PracticeServiceTypeService from '../../../../../services/api/practice-service-type.service'
import PatientService from '../../../../../services/api/patient.service'

const InvoiceForm = (props) => {
    const [patientList, setPatientList] = useState()
    const [inputData, setInputData] = useState(props.initialData || {})
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
    const [practiceLocations, setPracticeLocation] = useState()
    const [isLoader_Patients, setIsLoader_Patients] = useState(false)
    // Adding location context
    const stateAndDispatch = useContext(store)
    const state = stateAndDispatch.state

    const practiceLocationLookup = () => {
        AppointmentService.practiceLocationLookup()
            .then((res) => {
                console.log(res)
                if (Array.isArray(res)) {
                    setPracticeLocation(res)
                    return inputChange({ target: { value: res[0].practiceLocationId, name: 'practiceLocationId' } })
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        if (!practiceLocations) {
            practiceLocationLookup()
        }
    }, [practiceLocations])
    const paymentTypeList = [
        { value: 1, title: 'Send To Patient' },
        { value: 0, title: 'Pay In Full' },
        { value: 2, title: 'Create Payment Plan' },
        { value: 3, title: 'Setup Membership' }
    ]

    const addInvoiceSubmit = (data,selectedPatient, items) => {
        // setIsLoader(true)
        console.log(data)
        let reqObj = data
        reqObj.autoClaimStatus = false
        reqObj.doctorId = items[0]?.doctorId || doctorList[0].id
        reqObj.invoiceDate = data.invoiceDate ? new Date(data.invoiceDate) : new Date()
        reqObj.dueDate = data.dueDate ? new Date(data.dueDate) : new Date()
        reqObj.serviceDate = data.serviceDate ? new Date(data.serviceDate) : new Date()
        reqObj.items = items
        reqObj.operationType = 2
        reqObj.patientId = selectedPatient.id
        reqObj.patientName = data.patientName || inputData.patientName|| selectedPatient.name || selectedPatient.firstName+' '+selectedPatient.lastName
        reqObj.invoiceStatus = data.invoiceStatus
        reqObj.taxAmount = data.itemTotalTax
        reqObj.practiceLocationId = data.practiceLocationId
        reqObj.visitDate = new Date(data.serviceDate)
        return InvoiceService.addInvoice(reqObj)
            .then(res => {
                console.log(res)
                toast.success("Invoice Succesfully Added")
                // setIsLoader(false)
                setInputData({})
                if (props.onClose) {
                    props.onClose()
                }
            }
            )
            .catch(err => {
                console.log(err)
                if (props.onClose) {
                    props.onClose()
                }
                // setIsLoader(false)
            })
    }
    const patientLookup = () => {
        setIsLoader_Patients(true)
        if (props.initialData?.patientId) {
            PatientService.getPatientById(props.initialData.patientId)
                .then(res => {
                    console.log(res.data)
                    setPatientList([res.data])
                    setSelectedPatient(res.data)
                    setIsLoader_Patients(false)
                })
                .catch(err=>{
                    setIsLoader_Patients(false)
                })
        }
        else if (inputData.practiceLocationId) {
            let reqObj = { SearchTerm: '', isActive: true, isRegistered: true, SortField: 'firstName', PracticeLocationId: inputData.practiceLocationId }
            CommonService.patientLookup(reqObj)
                .then(res => {
                    if (res) {
                        // console.log(res)
                        setPatientList(res.data)
                        if (props.initialData.patientId) {
                            setSelectedPatient(res.data.find(obj => obj.id === props.initialData.patientId))
                        }
                    }
                    setIsLoader_Patients(false)
                }
                )
                .catch(err =>   setIsLoader_Patients(true))

        }
    }


    const providerLookup = () => {
        // setIsLoader(true)
        if (!providerList) {
            const reqObj = { isRegistered: true, isActive: true };
            DoctorService.doctorLookup(reqObj)
                .then(
                    (response) => {
                        setProviderList(response)
                        if (props.initialData.doctorId) {
                            inputChange({ target: { name: 'doctorId', value: response.find(obj => obj.id === props.initialData.doctorId).id } })
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
        ProductService.productLookup({ isActive: true })
            .then(res => {
                console.log(res)
                if (res) {
                    setProductList(res.filter(result => { return result?.itemType === 1 }))
                    setServiceList(res.filter(result => { return result?.itemType === 2 }))
                }
            })
    }
    const parseItems = () => {
        setSelectedProductList(props.initialData.items.filter(obj => { return obj.itemType === 1 }).map(prod => {
            let newProd = prod
            newProd.serviceId = prod.serviceId || null
            newProd.discount = prod.discount || 0
            newProd.discountType = prod.discountType || 2
            newProd.doctorId = prod.doctorId || null
            return newProd
        }))
        setSelectedServiceList(props.initialData.items.filter(obj => { return obj.itemType === 2 }).map(serv => {
            let newServ = serv
            newServ.serviceId = serv.serviceId || null
            newServ.discount = serv.discount || 0
            newServ.discountType = serv.discountType || 2
            newServ.doctorId = serv.doctorId || null
            return newServ
        }))
    }
    useEffect(() => {
        patientLookup()
        if (inputData.practiceLocationId) {
            providerLookup()
            productLookup()
        }
        if (props.initialData?.items) {
            parseItems()
        }
    }, [inputData.practiceLocationId, practiceLocations])

    const addProduct = (product) => {
        let newProduct = {}
        let newList = [...selectedProductList]
        newProduct.name = product.name
        newProduct.itemId = product.id
        newProduct.quantity = 1
        newProduct.discount = product.discount || 0
        newProduct.discountType = parseInt(product.discountType) || 2
        newProduct.doctorId = providerList[0].id
        newProduct.itemType = 1
        // newProduct.serviceId = product.serviceId || null
        newProduct.unitPrice = product.unitPrice
        newProduct.taxPercent = parseInt(product.taxPercent) || 0
        newList.push(newProduct)
        setSelectedProductList([...newList])
    }

    const addService = (service) => {
        let newService = {}
        let newList = [...selectedServiceList]
        newService.itemId = service.id
        newService.itemType = 2
        newService.quantity = 1
        newService.name = service.name
        newService.discount = service.discount || 0
        newService.discountType = parseInt(service.discountType) || 2
        // newService.serviceId = service.serviceId || null
        newService.unitPrice = service.unitPrice
        newService.doctorId = providerList[0].id
        newService.taxPercent = parseInt(service.taxPercent) || 0
        newList.push(newService)
        setSelectedServiceList([...newList])
    }

    const changeProduct = (e, i) => {
        let newList = [...selectedProductList]
        if (e.target.name === "quantity") {
            newList[i][e.target.name] = parseInt(e.target.value)
            return setSelectedProductList([...newList])
        }
        else if (e.target.name === "taxPercent") {
            newList[i][e.target.name] = parseFloat(e.target.value)
            return setSelectedProductList([...newList])
        }
        else if (e.target.name === "discountType") {
            newList[i][e.target.name] = parseInt(e.target.value)
            return setSelectedProductList([...newList])
        }
        else {
            newList[i][e.target.name] = e.target.value
            return setSelectedProductList([...newList])
        }
    }

    const changeService = (e, i) => {
        let newList = [...selectedServiceList]
        if (e.target.name === "quantity") {
            newList[i][e.target.name] = parseInt(e.target.value)
            return setSelectedServiceList([...newList])
        }
        else if (e.target.name === "taxPercent") {
            newList[i][e.target.name] = parseFloat(e.target.value)
            return setSelectedServiceList([...newList])
        }
        else if (e.target.name === "discountType") {
            newList[i][e.target.name] = parseInt(e.target.value)
            return setSelectedServiceList([...newList])
        }
        else {
            newList[i][e.target.name] = e.target.value
            return setSelectedServiceList([...newList])
        }
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

    useEffect(()=>{
        if(selectedPatient){
            inputChange({target:{name:'patientName', value: selectedPatient.name ? selectedPatient.name : `${selectedPatient.firstName} ${selectedPatient.lastName}`}})
        }
    },[selectedPatient])

    const lineTotal = (element) => {
        if (typeof element.quantity === 'number') {
            let total = parseInt(element.unitPrice) * parseInt(element.quantity)

            let discountAmt = 0
            if (parseFloat(element.discount) > 0)
            {
                if (element.discountType == 2)
                {
                    discountAmt = Math.round(parseInt(element.quantity) * element.unitPrice * (element.discount / 100) * 100) / 100 
                }
                else
                {
                    discountAmt = parseInt(element.quantity) * element.discount 
                }
            }

            total = total - discountAmt

            if (element.taxPercent > 0) {
                return Math.round(total * (1 + (element.taxPercent / 100)) * 100) / 100
            }
            else {
                return total
            }

        }
        else return 0
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

            let discountAmt = 0
            if (parseInt(item.discount) > 0)
            {
                if (item.discountType == 2)
                {
                    discountAmt = Math.round(parseInt(item.quantity) * item.unitPrice * (item.discount / 100) * 100) / 100 
                }
                else
                {
                    discountAmt = parseInt(item.quantity) * item.discount 
                }
            }
            discountTotal = discountTotal + discountAmt

            taxTotal = parseInt(item.taxPercent) > 0 ? taxTotal = taxTotal + ((parseInt(item.quantity) * item.unitPrice) - discountAmt) * item.taxPercent / 100 : taxTotal
            productTotal = item.itemType == 1 ? parseInt(productTotal) + lineTotal(item) : parseInt(productTotal)
            serviceTotal = item.itemType == 2 ? parseInt(serviceTotal) + lineTotal(item) : parseInt(serviceTotal)
        })
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
        let invoiceStatus = 0
        if (payMethod === 1) {
            invoiceStatus = 2
            inputChange({
                target: {
                    name: 'transactionType', value: 2
                }
            })
        }
        else if (payMethod === 0) {
            invoiceStatus = 4
            inputChange({
                target: {
                    name: 'transactionType', value: 2
                }
            })
        }
        else if (payMethod === 2) {
            invoiceStatus = 5
            inputChange({
                target: {
                    name: 'transactionType', value: 1
                }
            })
        }
        else if (payMethod === 3) {
            invoiceStatus = 7
            inputChange({
                target: {
                    name: 'transactionType', value: 3
                }
            })
        }
        inputChange({
            target: {
                name: "invoiceStatus", value: invoiceStatus
            }
        })
    }, [payMethod])

    useEffect(() => {
        console.log(props.initialData)
        if (props.initialData?.practiceServiceTypeId) {
            PracticeServiceTypeService.serviceTypeByPracticeServiceTypeId({ practiceServiceTypeId: props.initialData.practiceServiceTypeId })
                .then(res => {
                    console.log(res.data)
                    setSelectedServiceList(res.data.map(serv => {
                        let newServ = serv
                        newServ.serviceId = serv.serviceId || null
                        newServ.discount = serv.discountPercent || 0
                        newServ.discountType = serv.discountType || 2
                        newServ.taxPercent = serv.taxPercent || 0
                        newServ.doctorId = props.initialData.doctorId
                        newServ.quantity = 1
                        return newServ
                    }))
                })

        }
    }, [props.initialData])
    return (
        <div>
            <div className='container-fluid mb-3'>
                {props.isLoader && <DimLoader loadMessage="Creating Invoice" />}
                {/* <h5 className='text-center'>Collect Payment</h5> */}
                <div className='row d-flex align-items-end'>
                    <div className="required field col-6">
                        <label><i className="icon user outline" /> {props.selectPatientDisabled ? 'Patient' : 'Choose Patient'}</label>
                        <div className='input-group col-12'>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={patientList && patientList}
                                name="patientId"
                                isLoading={isLoader_Patients}
                                loadingMessage={() => "Patient loading..."}
                                isDisabled={!inputData.practiceLocationId || !patientList}
                                value={selectedPatient}
                                placeholder='Search...'
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.id, name: 'patientId' }
                                    })
                                    setSelectedPatient(e)
                                }}
                                isClearable={false}
                                isDisabled={props.initialData?.patientId}
                                getOptionLabel={(option) => {
                                    return (
                                        option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                                    )
                                }
                                }
                                getOptionValue={(option) => option.id}
                                noOptionsMessage={(e) => { return <button className='btn btn-primary form-control' onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add Patient</button> }}
                            />
                            {!props.initialData?.patientId && <button className='btn btn-primary col-auto' title="Add Patient" onClick={e => { e.preventDefault(); setShowAdd(true) }}><i className='icon plus' /></button>}
                        </div>
                        {/* {props.initialData.patientId} */}
                    </div>
                    <div className="required field col-6">
                        <label><i className="icon map outline" /> Choose Location</label>
                        <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={practiceLocations}
                            isLoading={!practiceLocations}
                            isDisabled={!practiceLocations}
                            loadingMessage="Locations are loading..."
                            name="practiceLocationId"
                            value={inputData && practiceLocations ? practiceLocations.find(obj => obj.practiceLocationId === inputData.practiceLocationId) : null}
                            onChange={e => inputChange({ target: { value: e.practiceLocationId, name: 'practiceLocationId' } })}
                            getOptionLabel={(option) => option.practiceLocation}
                            getOptionValue={(option) => option.practiceLocationId}
                        >
                        </Select>
                    </div>
                </div>
                <AccordionTemplate id="addTransaction" accordionId="addTransaction" className="my-3" defaultActiveKey={0}>
                    <div title='Products/Services'>
                        <div className='container-fluid my-3'>
                            <div className='row d-flex'>
                                <div className='col-12 px-0 card table-responsive' style={{overflowY: 'unset'}}>
                                    <table className='table table-borderless table-responsive my-0'>
                                        <colgroup>
                                            <col span="1" />
                                            <col span="1" style={{ width: '250px' }} />
                                            <col span="1" />
                                            <col span="1" />
                                            <col span="1" />
                                            <col span="1" />
                                            <col span="1" />
                                            <col span="1" />
                                        </colgroup>

                                        <thead>
                                            <tr>
                                                <th className='py-2'>Products</th>
                                                <th className='py-2'>Provider</th>
                                                <th className='py-2'>Unit Rate</th>
                                                <th className='py-2'>Quantity</th>
                                                <th className='py-2'>Discount</th>
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
                                                        <td>
                                                            <Select
                                                                options={providerList}
                                                                className="react-select-container"
                                                                classNamePrefix="react-select"
                                                                isDisabled={!providerList}
                                                                name="doctorId"
                                                                isSearchable
                                                                value={providerList && providerList.find(obj => obj.id === product.doctorId) || providerList?.length > 0 ? providerList[0]:null}
                                                                onChange={e => {
                                                                    console.log(e.id)
                                                                    if (e?.id) {
                                                                        changeProduct({
                                                                            target:
                                                                                { value: e.id, name: 'doctorId' }
                                                                        }, i)
                                                                    }
                                                                    else {
                                                                        changeProduct({
                                                                            target: {
                                                                                value: null, name: 'doctorId'
                                                                            }
                                                                        }, i)
                                                                    }
                                                                }}
                                                                getOptionLabel={(option) => option.name}
                                                                getOptionValue={(option) => option.id}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className='input-group align-items-center'>

                                                                <input disabled value={Utilities.toDollar(product.unitPrice)} type="text" name="unitPrice" onChange={e => { e.preventDefault(); changeProduct(e, i) }} />
                                                            </div>
                                                        </td>
                                                        <td><input value={selectedProductList[i].quantity} type="number" name="quantity" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                                        <td>
                                                            <div className='input-group d-flex row'>
                                                                <input value={selectedProductList[i].discount} type="number" name="discount" onChange={e => { e.preventDefault(); changeProduct(e, i) }} />

                                                                <select value={selectedProductList[i].discountType} onChange={e => { e.preventDefault(); changeProduct(e, i) }} className='form-select' name="discountType" style={{ maxWidth: '60px' }}>
                                                                    <option selected value={2}>%</option>
                                                                    <option value={1}>$</option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                        <td><input value={selectedProductList[i].taxPercent} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                                        <td>
                                                            <div className='input-group align-items-center'>

                                                                <input type="text" disabled value={Utilities.toDollar(isNaN(lineTotal(product)
                                                                ) ? 0 : lineTotal(product)).toString()} />
                                                            </div>
                                                        </td>
                                                        <td><button className='btn btn-transparent' onClick={e => { e.preventDefault(); removeProduct(i) }}>
                                                            <i className='icon trash' />
                                                        </button></td>
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td colSpan={8}>
                                                    <div className='input-group row align-items-center'>
                                                        <i className='icon plus col-auto my-2 mx-3' />
                                                        <Select
                                                            options={productList}
                                                            onChange={e => {
                                                                addProduct(e)
                                                            }}
                                                            value={null}
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                            placeholder="Add Product"
                                                            getOptionLabel={(option) => option.name + ' | $' + option.unitPrice}
                                                            getOptionValue={(option) => option.id}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            {selectedProductList.length > 0 && <tr className="thead m-0">
                                                <th colSpan={5} className='text-end'>Product Total</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(totalProducts || 0)}</th>
                                            </tr>}
                                            <tr className="thead">
                                                <th>Services</th>
                                                <th>Provider</th>
                                                <th>Unit Rate</th>
                                                <th>Quantity</th>
                                                <th>Discount</th>
                                                <th>Tax(%)</th>
                                                <th>Amount</th>
                                                <th></th>
                                            </tr>
                                            {selectedServiceList && selectedServiceList.map((service, i) => {
                                                return (
                                                    <tr>
                                                        <td className='pb-0 pt-3'>{service.name}</td>
                                                        <td>
                                                            <Select
                                                                options={providerList}
                                                                className="react-select-container"
                                                                classNamePrefix="react-select"
                                                                isDisabled={!providerList}
                                                                name="doctorId"
                                                                isSearchable
                                                                value={providerList && providerList.find(obj => obj.id === service.doctorId) || providerList?.length > 0 ? providerList[0]:null}
                                                                onChange={e => {
                                                                    if (e?.id) {
                                                                        changeService({
                                                                            target:
                                                                                { value: e.id, name: 'doctorId' }
                                                                        }, i)
                                                                    }
                                                                    else {
                                                                        changeService({
                                                                            target: {
                                                                                value: null, name: 'doctorId'
                                                                            }
                                                                        }, i)
                                                                    }
                                                                }}
                                                                getOptionLabel={(option) => option.name}
                                                                getOptionValue={(option) => option.id}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className='input-group align-items-center'>

                                                                <input disabled value={Utilities.toDollar(service.unitPrice)} type="text" name="unitPrice" onChange={e => { e.preventDefault(); changeService(e, i) }} />
                                                            </div>
                                                        </td>
                                                        <td><input value={selectedServiceList[i].quantity} type="number" name="quantity" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                                        <td>
                                                            <div className='input-group d-flex row'>
                                                                <input value={selectedServiceList[i].discount} type="number" name="discount" onChange={e => { e.preventDefault(); changeService(e, i) }} />

                                                                <select value={selectedServiceList[i].discountType} onChange={e => { e.preventDefault(); changeService(e, i) }} className='form-select' name="discountType" style={{ maxWidth: '60px' }}>
                                                                    <option selected value={2}>%</option>
                                                                    <option value={1}>$</option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                        <td><input value={selectedServiceList[i].taxPercent} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                                        <td>
                                                            <div className='input-group align-items-center'>
                                                                <input type="text" disabled value={Utilities.toDollar(isNaN(lineTotal(service)
                                                                ) ? 0 : lineTotal(service)).toString()} />
                                                            </div>
                                                        </td>
                                                        <td><button className='btn btn-transparent' onClick={e => { e.preventDefault(); removeService(i) }}>
                                                            <i className='icon trash' />
                                                        </button></td>
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td colSpan={8}>
                                                    <div className='input-group row align-items-center'>
                                                        <i className='icon plus col-auto my-2 mx-3' />
                                                        <Select
                                                            options={serviceList}
                                                            onChange={e => {
                                                                addService(e)
                                                            }}
                                                            value={null}
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                            placeholder="Add Service"
                                                            getOptionLabel={(option) => option.name + ' | $' + option.unitPrice}
                                                            getOptionValue={(option) => option.id}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            {selectedServiceList.length > 0 && <tr className="thead">
                                                <th colSpan={5} className='text-end'>Service Total</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(totalServices || 0)}</th>
                                            </tr>}
                                            {totalDiscount > 0 || totalTax > 0 ? <tr className='thead'>
                                                <th colSpan={5} className='text-end'>Sub Total</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(subTotal || 0)}</th>
                                            </tr> : null}
                                            {totalDiscount > 0 ? <tr className="thead">
                                                <th colSpan={5} className='text-end'>Total Discount</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(totalDiscount || 0)}</th>
                                            </tr> : null}
                                            {totalTax > 0 && <tr className="thead">
                                                <th colSpan={5} className='text-end'>Total Tax</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(totalTax || 0)}</th>
                                            </tr>}
                                            <tr className="thead">
                                                <th colSpan={5} className='text-end'>Total Amount</th>
                                                <th colSpan={3} className='text-end'>{Utilities.toDollar(total || 0)}</th>
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
                                <div className='field required'>
                                    <label>Payment Type</label>
                                    <Select
                                        options={paymentTypeList}
                                        onChange={e => {
                                            console.log(e)
                                            inputChange({
                                                target:
                                                    { name: 'paymentMethod', value: e.value }
                                            })
                                            setPayMethod(e.value)
                                        }}
                                        value={paymentTypeList && paymentTypeList.find(obj => obj.value === payMethod)}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Add Service"
                                        getOptionLabel={(option) => option.title}
                                        getOptionValue={(option) => option.value}
                                        isSearchable={false}
                                    />
                                    {/* <select name="paymentMethod" onChange={(e => {
                                        e.preventDefault();
                                        inputChange(e)
                                        setPayMethod(e.target.value)
                                    })}
                                        className="form-select">
                                        <option value={1}>
                                            Send To Patient
                                        </option>
                                        <option value={0}>
                                            Pay In Full
                                        </option>
                                        <option value={2}>
                                            Create Payment Plan
                                        </option>
                                        <option value={3}>
                                            Setup Membership
                                        </option>
                                    </select> */}
                                </div>
                                <div className=''>
                                    {payMethod !== 0 && <div className='row d-flex'>
                                        {/* <div className='field required col-6'>
                                            <label>Checkout Date</label>
                                            <input type="datetime-local" name="checkoutDate" value={inputData.checkoutDate || Utilities.toDateTimeLocale(new Date())} onChange={e => { e.preventDefault(); inputChange(e) }} />
                                        </div> */}
                                        <div className='field required col-4'>
                                            <label>Due in Days</label>
                                            <select className="form-select" name="terms" defaultValue={'on-receipt'} value={inputData.terms} onChange={e => { e.preventDefault(); inputChange(e) }}>
                                                <option value="on-receipt">On Receipt</option>
                                                <option value="custom">Custom</option>
                                                <option value="net-10">Net 10</option>
                                                <option value="net-15">Net 15</option>
                                                <option value="net-30">Net 30</option>
                                                <option value="net-45">Net 45</option>
                                            </select>
                                        </div>
                                        <div className='field required col-4'>
                                            <label>Due Date</label>
                                            <input type="date" name="dueDate" value={inputData.dueDate} onChange={e => { e.preventDefault(); inputChange(e) }} />
                                        </div>
                                        <div className='field required col-4'>
                                            <label>Service Date</label>
                                            <input type="date" name="serviceDate" value={inputData.serviceDate} onChange={e => { e.preventDefault(); inputChange(e) }} />
                                        </div>
                                    </div>}
                                    {/* {selectedServiceList.length > 0 &&  */}
                                    {/* <div className='field required col-12'>
                                        <label>Search Provider</label>
                                        <Select
                                            options={providerList}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            isDisabled={!providerList}
                                            name="doctorId"
                                            isSearchable
                                            value={providerList && providerList.find(obj => obj.id === inputData.doctorId)}
                                            onChange={e => {
                                                console.log(e)
                                                if (e.id) {
                                                    inputChange({
                                                        target:
                                                            { value: e.id, name: 'doctorId' }
                                                    })
                                                }
                                                else {
                                                    inputChange({
                                                        target: {
                                                            value: null, name: 'doctorId'
                                                        }
                                                    })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                        />
                                    </div> */}
                                </div>
                                <div className='col-12'>
                                    <label>Payment Message</label>
                                    <textarea className='form-control' name="description" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.description || "Thank you for your business"}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionTemplate>
                {/* {!selectedPatient || !inputData.doctorId ? <span className='form-alert'>{!selectedPatient && !inputData.doctorId ? 'Patient and Provider Selection Required' : !selectedPatient ? 'Patient Selection Required' : !inputData.doctorId ? 'Provider Selection Required' : null}</span> : null} */}
                {/* <hr/> */}
                <div className='col-12 d-flex justify-content-between'>
                    <div className='col-auto'>  {props.isModal &&
                        <button className='btn btn-secondary me-2' onClick={e => { e.preventDefault(); props.onClose() }}>Cancel</button>
                    }</div>
                    {!props.isEdit && <div className='col-auto'><button className='btn btn-primary me-2'
                        onClick={e => {
                            e.preventDefault(); inputChange({
                                target: {
                                    name: 'invoiceStatus', value: 1
                                }
                            });
                            addInvoiceSubmit(inputData, selectedPatient, [...selectedProductList, ...selectedServiceList],payMethod, providerList[0].id)
                        }} disabled={!selectedPatient}>Save as Draft</button>
                        <button disabled={!selectedPatient} onClick={e => { e.preventDefault(); props.submitHandler(inputData, selectedPatient, [...selectedProductList, ...selectedServiceList],payMethod, providerList[0].id) }} className='btn btn-primary me-2'>{payMethod === 0 ? 'Pay In Full' : payMethod === 1 ? 'Send to Patient' : payMethod === 2 ? 'Create Payment Plan' : 'Setup Membership'}</button>
                        {props.isEdit && <div><button className='btn btn-primary me-2' onClick={e => { e.preventDefault(); props.submitHandler(inputData, selectedPatient, [...selectedProductList, ...selectedServiceList],payMethod, providerList[0].id) }}>Update</button>
                        </div>}
                    </div>}
                    {props.isEdit ? <div className='col-auto'><button className="btn btn-primary"
                        onClick={e => { e.preventDefault(); props.submitHandler(inputData, selectedPatient, [...selectedProductList, ...selectedServiceList],payMethod, providerList[0].id) }}>Update</button></div> : null}
                </div>
                <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
                    {showAdd && <AddPatient onClose={() => { setShowAdd(false) }} isModal />}
                </ModalBox>
            </div>
        </div>
    )
}
export default InvoiceForm