import React, { useEffect, useState, useContext } from 'react'
import CommonService from '../../../../../services/api/common.service'
import DoctorService from '../../../../../services/api/doctor.service'
import moment from 'moment'
import Utilities from '../../../../../services/commonservice/utilities'
import { store } from '../../../../../context/StateProvider'
import defaultLogo from '../../../../../../assets/images/logo_login.png'
// import defaultLogo from '../../../../../../assets/images/revitalized-logo.png'
import InvoiceService from '../../../../../services/api/invoice.service'
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import StorageService from '../../../../../services/session/storage.service'
import PatientService from '../../../../../services/api/patient.service'
import TransactionService from '../../../../../services/api/transaction.service'
import PaymentsList from '../../report/paymentPlan-list/paymentPlan-card/payments-accordion/payments-list/PaymentsList'
import PaymentHistoryList from '../../report/paymentPlan-list/paymentPlan-card/payment-history-accordion/payment-history-list/PaymentHistoryList'

const InvoicePreview = (props) => {
    const [patientList, setPatientList] = useState()
    const [providerList, setProviderList] = useState()
    const [subTotal, setSubTotal] = useState(0)
    const [totalDiscount, setTotalDiscount] = useState(0)
    const [totalTax, setTotalTax] = useState(0)
    const [total, setTotal] = useState(0)
    const [totalProducts, setTotalProducts] = useState(0)
    const [logo, setLogo] = useState(defaultLogo)
    const [totalServices, setTotalServices] = useState(0)
    const globalStateAndDispatch = useContext(store)
    const state = globalStateAndDispatch.state
    const dispatch = globalStateAndDispatch.dispatch
    const [invoice, setInvoice] = useState(props.transaction || null)
    const [tc, setTc] = useState()

    const getLogo = () => {
        let settings = JSON.parse(StorageService.get('session', 'settingsData'));
        if (settings?.logo) {
            setLogo(settings.logo)
        }
    }
    const handlePdf = () => {
        // const input = document.getElementById('invoice');
        // let canvasOptions = { imageTimeout: 0 }
        // html2canvas(input, canvasOptions)
        //     .then((canvas) => {
        //         let options = { orientation: 'p', unit: 'in', format: 'letter' }
        //         const imgData = canvas.toDataURL('image/png', 1.0);
        //         const pdf = new jsPDF(options);
        //         var width = pdf.internal.pageSize.getWidth();
        //         var height = pdf.internal.pageSize.getHeight();
        //         console.log(width, height)
        //         pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
        //         //   pdf.autoPrint();
        //         pdf.save("Invoice");
        //     })
        Utilities.printWindow('invoice', 'Invoice', { landscape: false })
    }
    const invoiceStatus = [
        { value: 1, title: 'Ready To Send' },
        { value: 2, title: 'Awaiting Payment' },
        { value: 3, title: 'Cancelled' },
        { value: 4, title: 'Full payment created' },
        { value: 5, title: 'Payment plan created' },
        { value: 6, title: 'OneTime scheduled created' },
        { value: 7, title: 'Membership created' },
        { value: 8, title: 'In Progress' },
        { value: 9, title: 'Paid' },
        { value: 10, title: 'Unpaid' },
        { value: 11, title: 'Unsubscribed' },
        { value: 13, title: 'Partial Payment' },
        { value: 30, title: 'Closed' }
    ]

    const filters = [
        { title: "All", value: "", identifier: "all" },
        { title: "Ready To Send", value: 1, identifier: "readyToSend", color: 'lightgreen' },
        { title: "Awaiting Payment", value: 2, identifier: "awaitingPayment", color: 'yellow' },
        { title: "Full Payment", value: 4, identifier: "fullPayment", color: 'blue' },
        { title: "Payment Plan", value: 5, identifier: "paymentPlan", color: 'blue' },
        { title: "Membership", value: 7, identifier: "subscriptionPlan", color: 'blue' },
        { title: "Unpaid", value: 10, identifier: "unPaid", color: 'lightgray' },
        { title: "Cancelled", value: 9, identifier: "cancelled", color: 'red' },
        { title: "Closed", value: 30, identifier: "closed" }
    ]
    const patientLookup = () => {
        // let reqObj = { SearchTerm: '', isActive: true, isRegistered: true, SortField: 'firstName', PatientIds: invoice.patientId }
        PatientService.getPatientById(invoice.patientId)
            .then(res => {
                if (res) {
                    setPatientList(res.data)
                }
            }
            )
            .catch(err => console.log(err))
    }


    const providerLookup = () => {
        // setIsLoader(true)
        if (!providerList && invoice.doctorId) {
            // const reqObj = { isRegistered: true, isActive: true, SearchTerm: invoice?.doctorId };
            DoctorService.getById(invoice.doctorId)
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
        InvoiceService.getInvoiceById(props.invoiceId)
            .then(res => {
                console.log(res)
                setInvoice(res)
            })
    }


    useEffect(() => {
        if (invoice) {
            console.log(invoice)
            patientLookup()
            providerLookup()
        }
    }, [invoice])

    useEffect(() => {
        if (props.invoiceId) {
            invoiceLookup()
        }
    }, [props.invoiceId])

    const lineTotal = (element) => {
        if (typeof element.quantity === 'number') {
            let total = parseInt(element.unitPrice) * parseInt(element.quantity)

            let discountAmt = 0
            if (parseFloat(element.discount) > 0 || parseFloat(element.discountAmount) > 0) {
                discountAmt = parseInt(element.quantity) * element.discountAmount
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
    const channelTypes = {
        1: 'Not Defined',
        2: 'ACH',
        3: 'Credit',
        4: 'Debit',
        10: 'Check',
        9: 'Cash',
    }


    const transactionLookup = () => {
        let reqObj = { InvoiceNo: invoice.invoiceNumber }
        TransactionService.findTransaction(reqObj)
            .then(res => {
                console.log(res.data.data.filter(item =>
                    item.transactionStatus == 2 || item.transactionStatus == 16
                )[0])
                setTc(res.data.data.filter(item =>
                    item.transactionStatus == 2 || item.transactionStatus == 16
                )[0])
            })
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
                let subTotalInside = 0
                let discountTotalInside = 0
                subTotalInside = (item.unitPrice * item.quantity)
                discountTotalInside = parseInt(item.discountAmount) > 0 ? item.discountAmount * item.quantity : parseFloat(item.discountPercent) ? parseFloat(item.discountPercent) / 100 * item.quantity * item.unitPrice : discountTotal
                subTotal += subTotalInside
                discountTotal += discountTotalInside
                productTotal = item.itemType == 1 ? productTotal + lineTotal(item) : productTotal
                serviceTotal = item.itemType == 2 ? serviceTotal + lineTotal(item) : serviceTotal
                taxTotal = parseFloat(item.taxPercent) > 0 ? taxTotal + Math.round((subTotalInside - discountTotalInside) * parseFloat(item.taxPercent)) / 100 : taxTotal
            })
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
            transactionLookup()
        }
        getLogo()
    }, [invoice])

    const sendInvoice = () => {
        let reqObj = {}
        InvoiceService.resendInvoice(invoice.id, reqObj)
    }
    return (
        <div className='container-fluid'>
            <div className='row d-flex justify-content-end'>
                <div className='col-auto me-5 mb-3'>
                    <button className="btn btn-primary" title="Print" onClick={e => { e.preventDefault(); handlePdf() }}><i className='icon file print' /></button>
                </div>
            </div>
            <div id="invoice" className='portrait'>
                <div className='portrait' style={{ margin: '5px' }}>
                    {tc && <div className="row d-flex g-3">
                        <div className="col-12 btn btn-secondary">{invoice?.invoiceStatus && <span
                            title={invoiceStatus.find(obj => obj.value == invoice?.invoiceStatus)?.title}
                        >{invoiceStatus.find(obj => obj.value == invoice?.invoiceStatus)?.title}</span>}
                        </div>
                        {/* { invoice?.invoiceStatus !==5 && invoice?.invoiceStatus !==7 &&invoice?.invoiceStatus !==8 ? <div className="col-12 card px-0">
                            {invoice?.tenderInfo?.channelType !== 10 && invoice?.tenderInfo?.channelType !== 9? <table className="table table-borderless">
                                <thead>
                                    <tr className="thead">
                                        <th className="py-2">Payment Type</th>
                                        {tc?.tenderInfo?.maskAccount || tc?.tenderInfo?.maskCardNumber ? <th className="py-2">Account Number</th> : null}
                                        <th className="py-2">Account Name</th>
                                        <th className="py-2">Card Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2 ps-4">{tc?.operationType === 0 ? 'Sale' : 'Other'} - {tc?.tenderInfo?.channelType && channelTypes[tc?.tenderInfo?.channelType]}</td>
                                        {tc?.tenderInfo?.channelType === 3 || tc?.tenderInfo?.channelType === 4 ? <td className="py-2 ps-4">x{tc?.tenderInfo?.maskCardNumber}</td> : tc?.tenderInfo?.maskAccount ? <td className="py-2 ps-4">{tc?.tenderInfo?.maskAccount}</td> : null}
                                        <td className="py-2 ps-4">{tc?.tenderInfo?.nameOnCheckOrCard} </td>
                                        <td className="py-2 ps-4">{tc?.tenderInfo?.cardType}</td>
                                    </tr>
                                </tbody>
                        </table> :
                            <table className="table table-borderless table-responsive m-0 p-0">
                                <thead>
                                    <tr className="thead">
                                        <th className="py-2">Payment Type</th>
                                        {tc?.tenderInfo?.channelType === 10 && <th className="py-2">Check Number</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2 ps-4">{tc?.operationType == 0 ? 'Sale' : 'Other'} - {tc?.tenderInfo?.channelType && channelTypes[tc?.channelType]}</td>
                     
                                        {tc?.tenderInfo?.channelType === 10 && <td className="py-2 ps-4">{tc?.tenderInfo?.checkNumber}</td>}
                                    </tr>
                                </tbody>
                            </table>
                            }
                        </div>:null} */}
                    </div>}
                    {invoice && <div className={`row d-flex g-3 mt-1`}  >
                        <div className={`col-12 px-0 card d-flex justify-content-center`}>
                            <div className='justify-content-between card-header bg-white p-3 row-fluid d-flex align-items-center'>
                                <div className='col-6'>
                                    <img src={logo || defaultLogo} style={{ height: '.65in' }} />
                                </div>
                                <div className='col-6 text-end'>
                                    {invoice.invoiceNumber && <h5 className='mb-0'>Reference # {invoice.invoiceNumber}</h5>}
                                    {invoice.transactionDate && <span className='text-end'>Checkout Date: {moment(invoice.transactionDate).format("M-D-YYYY")}</span>}<br />
                                    <span className='text-end'>Service Date: {moment(invoice.serviceDate).format("M-D-YYYY")}</span><br />
                                    <span className={`text-end ${new Date(invoice.dueDate) <= new Date() && 'text-danger'}`}>Due Date: {moment(invoice.dueDate).format("M-D-YYYY")}</span>
                                </div>
                            </div>
                            <div className='card-body px-0'>
                                <div className='row px-3 pb-3'>
                                    <div className='col-6'>
                                        <strong>Patient</strong><br />
                                        {invoice.patientName}<br />
                                        {invoice.toEmail && <>{invoice.toEmail}<br /></>}
                                        {invoice.phone && Utilities.toPhoneNumber(invoice.phone)}
                                    </div>
                                    <div className='col-6'>
                                        <strong>Provider</strong><br />
                                        {invoice.doctorName}
                                    </div>
                                </div>
                                <table className='table table-borderless my-0'>
                                    <thead>
                                        {invoice.items && invoice.items.filter(product => { return product.itemType === 1 }).length > 0 &&
                                            <tr>
                                                <th className='py-2'>Products</th>
                                                <th className='py-2'>Unit Rate</th>
                                                <th className='py-2'>Quantity</th>
                                                <th className='py-2'>Discount</th>
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
                                                    <td>
                                                        {/* <div className='input-group align-items-center'> */}
                                                        {/* <i className='icon dollar small' /> */}
                                                        <input disabled value={Utilities.toDollar(product.unitPrice)} type="text" name="unitPrice" onChange={e => { e.preventDefault(); changeProduct(e, i) }} />
                                                        {/* </div> */}
                                                    </td>
                                                    <td><input disabled value={product.quantity} type="number" name="quantity" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                                    <td><input disabled value={product.discountType == 2 && product.discountPercent ? parseFloat(product?.discountPercent) + '%' : product.discountAmount ? Utilities.toDollar(product.discountAmount) : '$0.00'} type="text" name="discount" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                                                    <td >
                                                        <input disabled value={product.taxPercent || 0} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeProduct(e, i) }} />
                                                    </td>
                                                    <td>
                                                        {/* <div className='input-group align-items-center'> */}
                                                        {/* <i className='icon dollar small' /> */}
                                                        <input disabled type="text" disabled value={Utilities.toDollar(lineTotal(product)).toString()} />
                                                        {/* </div> */}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        {invoice.items && invoice.items.filter(product => { return product.itemType === 1 }).length > 0 && <tr className="thead m-0">
                                            <th colSpan={3} className='text-end'>Product Total</th>
                                            <th colSpan={3} className='text-end'>{Utilities.toDollar(totalProducts || 0)}</th>
                                        </tr>}
                                        {invoice.items && invoice.items.filter(product => { return product.itemType === 2 }).length > 0 &&
                                            <tr className="thead">
                                                <th>Services</th>
                                                <th>Unit Rate</th>
                                                <th>Quantity</th>
                                                <th>Discount</th>
                                                <th>Tax(%)</th>
                                                <th>Amount</th>
                                            </tr>}
                                        {invoice.items && invoice.items.filter(product => { return product.itemType === 2 }).map((service, i) => {
                                            return (
                                                <tr>
                                                    <td className='pb-0 pt-3'>{service.name}</td>
                                                    <td>
                                                        <div className='input-group align-items-center'>
                                                            {/* <i className='icon dollar small' /> */}
                                                            <input disabled value={Utilities.toDollar(service.unitPrice)} type="text" name="unitPrice" onChange={e => { e.preventDefault(); changeService(e, i) }} />
                                                        </div>
                                                    </td>
                                                    <td><input disabled value={service.quantity} type="number" name="quantity" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                                    <td><input disabled value={service.discountType == 2 && service.discountPercent ? service.discountPercent + '%' : service.discountAmount ? Utilities.toDollar(service.discountAmount) : '$0.00'} type="text" name="discount" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                                    <td><input disabled value={service.taxPercent || 0} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeService(e, i) }} /></td>
                                                    <td>
                                                        {/* <div className='input-group align-items-center'> */}
                                                        {/* <i className='icon dollar small' /> */}
                                                        <input disabled type="text" disabled value={Utilities.toDollar(lineTotal(service)).toString()} />
                                                        {/* </div> */}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        {invoice.items && invoice.items.filter(product => { return product.itemType === 2 }).length > 0 && <tr className="thead">
                                            <th colSpan={3} className='text-end'>Services Total</th>
                                            <th colSpan={3} className='text-end'>{Utilities.toDollar(totalServices || 0)}</th>
                                        </tr>}
                                        {totalDiscount > 0 || totalTax > 0 ? <tr className='thead'>
                                            <th colSpan={3} className='text-end'>Sub Total</th>
                                            <th colSpan={3} className='text-end'>{Utilities.toDollar(subTotal || 0)}</th>
                                        </tr> : null}
                                        {totalDiscount > 0 ? <tr className="thead">
                                            <th colSpan={3} className='text-end'>Total Discount</th>
                                            <th colSpan={3} className='text-end'>{Utilities.toDollar(totalDiscount || 0)}</th>
                                        </tr> : null}
                                        {totalTax > 0 && <tr className="thead">
                                            <th colSpan={3} className='text-end'>Total Tax</th>
                                            <th colSpan={3} className='text-end'>{Utilities.toDollar(totalTax || 0)}</th>
                                        </tr>}
                                        <tr className="thead">
                                            <th colSpan={3} className='text-end'>Total Amount</th>
                                            <th colSpan={3} className='text-end'>{Utilities.toDollar(total)}</th>
                                        </tr>
                                        <tr>
                                            <td colspan={6}>
                                                Note: {invoice.description}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan={6}>
                                                Status:  {invoice.invoiceStatus && <span
                                                    title={invoiceStatus.find(obj => obj.value == invoice.invoiceStatus)?.title}
                                                >{invoiceStatus.find(obj => obj.value == invoice.invoiceStatus)?.title}</span>}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                    }
                </div>
                {invoice && <div className='portrait' style={{ margin: '5px' }}>
                    <div className='row d-flex g-3 mt-1'>
                        {/* {invoice.invoiceStatus >= 6 && invoice.invoiceStatus <= 8 ? */}
                            <div className='card px-0'>
                                <table className='table pagebreak'><tbody>
                                    <tr className='thead'><th colSpan={6}>Payment History</th></tr>
                                    <tr><td colSpan={6}>  <PaymentHistoryList paymentPlan={invoice} autoPull /></td></tr>
                                    {invoice.invoiceStatus >= 6 && invoice.invoiceStatus <= 8 ? <> <tr className="thead">  <th colSpan={6}>Scheduled Payments</th></tr>
                                        <tr><td colSpan={6}>
                                            <PaymentsList paymentPlanId={invoice.paymentId} patientId={invoice.patientId} autoPull />
                                        </td></tr></> : null}
                                </tbody>
                                </table>
                            </div>
                         {/* : null} */}
                    </div>
                </div>}
            </div>
            {
                !invoice &&
                <div className={`ui warning message mt-3 segment p-3 shadow-sm`}>
                    <span className="">
                        <p>Invoice Preview Not Found</p>
                    </span>
                </div>
            }
        </div >
    )
}
export default InvoicePreview