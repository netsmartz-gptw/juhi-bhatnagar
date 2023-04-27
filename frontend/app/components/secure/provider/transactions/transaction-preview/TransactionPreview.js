import React, { useEffect, useState, useContext } from 'react'
import { Popup } from 'semantic-ui-react'
import CommonService from '../../../../../services/api/common.service'
import DoctorService from '../../../../../services/api/doctor.service'
import moment from 'moment'
import Utilities from '../../../../../services/commonservice/utilities'
import { store } from '../../../../../context/StateProvider'
import defaultLogo from '../../../../../../assets/images/logo_login.png'
import InvoiceService from '../../../../../services/api/invoice.service'
import TransactionService from '../../../../../services/api/transaction.service';

const TransactionPreview = (props) => {
    const [patientList, setPatientList] = useState()
    const [providerList, setProviderList] = useState()
    const [subTotal, setSubTotal] = useState(0)
    const [totalDiscount, setTotalDiscount] = useState(0)
    const [totalTax, setTotalTax] = useState(0)
    const [total, setTotal] = useState(0)
    const [viewEmail, setViewEmail] = useState(false)
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalServices, setTotalServices] = useState(0)
    const globalStateAndDispatch = useContext(store)
    const state = globalStateAndDispatch.state
    const dispatch = globalStateAndDispatch.dispatch
    const [invoice, setInvoice] = useState(props.transaction || null)
    const [transactionEmail, setTransactionEmail] = useState()
    const [selectedPatient, setSelectedPatient] = useState()

    const patientLookup = () => {
        let reqObj = { SearchTerm: '', isActive: true, isRegistered: true, SortField: 'firstName' }
        CommonService.patientLookup(reqObj)
            .then(res => {
                if (res) {
                    setPatientList(res.data)
                    if (props.transaction.patientId) {
                        setSelectedPatient(res.data.find(obj => obj.id === props.transaction.patientId))
                        setTransactionEmail(res.data.find(obj => obj.id === props.transaction.patientId).email)
                    }
                    else if (invoice.patiendId) {
                        setSelectedPatient(res.data.find(obj => obj.id === invoice.patientId))
                        setTransactionEmail(res.data.find(obj => obj.id === invoice.patientId).email)
                    }
                    else {
                        setSelectedPatient(res.data[0])
                        setTransactionEmail(res.data[0].email)
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

                    })
                .catch((error) => {
                    // setIsLoader(false)
                    console.log(error);
                })
        }
    }

    const invoiceLookup = () => {
        InvoiceService.getInvoiceById(props.transaction.invoiceId)
            .then(res => {
                setInvoice(res)
            })
    }


    useEffect(() => {
        patientLookup()
        providerLookup()
    }, [])

    useEffect(() => {
        // console.log(props.transaction)
        if (props.transaction.invoiceId) {
            invoiceLookup()
        }
    }, [props.transaction.invoiceId])

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
        let newArray
        if (items) {
            if (Array.isArray(items)) {
                newArray = items
            }
            else {
                newArray = [items]
            }

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

            // console.log(serviceTotal)
            setTotalDiscount(discountTotal)
            setTotalServices(serviceTotal)
            setTotalProducts(productTotal)
            setSubTotal(subTotal)
            setTotalTax(taxTotal)
            setTotal(subTotal - discountTotal + taxTotal)
        }
    }

    useEffect(() => {
        if (invoice) {
            sumItems(invoice.items)
            if (invoice.toEmail) {
                setTransactionEmail(invoice.toEmail)
            }
        }
    }, [invoice])
    // console.log(invoice)

    const print = () => {
        let content = document.getElementById("recepit");
        let pri = document.getElementById("recepitContent").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    const sendToMail = () => {
        if (transactionEmail !== '') {
            TransactionService.sendReceipt(invoice.id, { emailIds: transactionEmail }).then(res => {
                if (res) {
                    toast.success('Email Sent!');
                    setViewEmail(false)
                }
            }
            )
                .catch(err => { toast.error('Error'); setViewEmail(false) })
        }
    }

    return (
        <div className='container mb-3'>
            {invoice && <div className='row d-flex'>
            {!props.embed && <button className="btn btn-primary"  onClick={e => { e.preventDefault(); Utilities.printWindow('receipt',"Receipt",{landscape: false}) }}><i className='icon file pdf'/></button>}
                <div className='col-12 mt-3 px-0'>
                    <div className='d-flex justify-content-end'>
                        <button className='btn btn-primary' title="Print" onClick={e => { e.preventDefault(); print() }}><i className="icon print" /></button>
                        <button className='btn btn-primary ms-3' title="Download" onClick={e => { e.preventDefault(); }}><i className="icon arrow alternate down" /></button>
                        <Popup
                            on='click'
                            open={viewEmail}
                            onOpen={() => setViewEmail(true)}
                            onClose={() => setViewEmail(false)}
                            wide
                            position='bottom right'
                            trigger={<button className='btn btn-primary ms-3' title="Send recepit to ulternate emails"><i className="icon envelope" /></button>}
                        >
                            <div>
                                <div className='field required'>
                                    <label>Email</label>
                                    <input type="email" className="custom-pop" placeholder="Email" value={transactionEmail} onChange={e => { e.preventDefault(); setTransactionEmail(e.target.value) }} />
                                </div>
                                <div className='text-center py-3'>
                                    <button className='btn btn-primary' onClick={e => { e.preventDefault(); sendToMail() }}>Send</button>
                                </div>
                            </div>
                        </Popup>
                    </div>
                </div>
                <div className='col-12 mt-3 px-0 card' id="receipt">
                    <div className='justify-content-between card-header bg-white p-3 row-fluid d-flex align-items-center'>
                        <div className='col-6'>
                            <img src={state.logo || defaultLogo} />
                        </div>
                        <div className='col-6 text-end'>
                            {invoice.invoiceNumber && <h5 className='mb-0'>Reference # {invoice.invoiceNumber}</h5>}
                            <span className='text-end'>Checkout Date: {moment(invoice.transactionDate).format("M-D-YYYY")}</span><br />
                            <span className='text-end'>Service Date: {moment(invoice.serviceDate).format("M-D-YYYY")}</span><br />
                            <span className={`text-end ${new Date(invoice.dueDate) <= new Date() && 'text-danger'}`}>Due Date: {moment(invoice.dueDate).format("M-D-YYYY")}</span>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-6'>
                                <strong>Patient</strong><br />
                                {invoice.patientName}<br />
                                {invoice.email && invoice.email}
                            </div>
                            <div className='col-6'>
                                <strong>Provider</strong><br />
                                {invoice.doctorName}
                            </div>
                        </div>
                    </div>
                    <table className='table table-borderless my-0'>
                        <thead>
                            {invoice.items && invoice.items.filter(product => { return product.itemType === 1 }).length > 0 &&
                                <tr>
                                    <th className='py-2'>Products</th>
                                    <th className='py-2'>Unit Rate</th>
                                    <th className='py-2'>Quantity</th>
                                    <th className='py-2'>Discount(%)</th>
                                    <th className='py-2'>Tax(%)</th>
                                    <th className='py-2'>Amount</th>
                                </tr>
                            }
                        </thead>
                        <tbody>
                            {invoice.items && invoice.items.filter(product => { return product.itemType === 1 }).map((product, i) => {
                                return (
                                    <tr>
                                        <td className='pb-0 pt-3'>{product.name}</td>
                                        <td><input disabled value={Utilities.toDollar(product.unitPrice)} type="text" name="unitPrice" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                        <td><input disabled value={product.quantity} type="number" name="quantity" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                        <td><input disabled value={product.discount || 0} type="number" name="discount" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                        <td><input disabled value={product.taxPercent || 0} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                        <td><input disabled type="text" disabled value={Utilities.toDollar(lineTotal(product)).toString()} /></td>
                                    </tr>
                                )
                            })}
                            {invoice.items && invoice.items.filter(product => { return product.itemType === 1 }).length > 0 && <tr className="thead m-0">
                                <th colSpan={4} className='text-end'>Total Products</th>
                                <th colSpan={3} className='text-end'>{Utilities.toDollar(totalProducts || 0)}</th>
                            </tr>}
                            {invoice.items && invoice.items.filter(product => { return product.itemType === 2 }).length > 0 &&
                                <tr className="thead">
                                    <th>Services</th>
                                    <th>Unit Rate</th>
                                    <th>Quantity</th>
                                    <th>Discount(%)</th>
                                    <th>Tax(%)</th>
                                    <th>Amount</th>
                                </tr>}
                            {invoice.items && invoice.items.filter(product => { return product.itemType === 2 }).map((service, i) => {
                                return (
                                    <tr>
                                        <td className='pb-0 pt-3'>{service.name}</td>
                                        <td><input disabled value={Utilities.toDollar(service.unitPrice)} type="text" name="unitPrice" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                        <td><input disabled value={service.quantity} type="number" name="quantity" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                        <td><input disabled value={service.discount || 0} type="number" name="discount" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                        <td><input disabled value={service.taxPercent || 0} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                        <td><input disabled type="text" disabled value={Utilities.toDollar(lineTotal(service)).toString()} /></td>
                                    </tr>
                                )
                            })}
                            {invoice.items && invoice.items.filter(product => { return product.itemType === 2 }).length > 0 && <tr className="thead">
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
                    <div className='col row-fluid btn d-flex align-items-center' onClick={e => { e.preventDefault(); setShow(!show) }}>
                        <div className='col-12 text-start row d-flex justify-content-between m-3'>
                            Note: {invoice.description}
                        </div>
                    </div>
                </div>
            </div>}
            {!invoice &&
                <div className={`ui warning message mt-3 segment p-3 shadow-sm`}>
                    <span className="">
                        <p>Receipt Not Found</p>
                    </span>
                </div>
            }
            <iframe id="recepitContent" style={{ height: '0px', width: '0px', position: 'absolute' }}></iframe>

        </div>
    )
}
export default TransactionPreview