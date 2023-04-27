import React, { useEffect, useState, useCallback } from 'react'
import CommonService from '../../../../../services/api/common.service'
import TabsTemplate from '../../../../templates/components/TabsTemplate'
import Dashboard from '../../../../templates/layouts/Dashboard'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import List from '../../../../templates/components/List'
import TransactionCard from '../invoice-card/InvoiceCard'
import InvoiceService from '../../../../../services/api/invoice.service'
import ModalBox from '../../../../templates/components/ModalBox'
import InputMask from 'react-input-mask'
import AddInvoice from '../add-invoice/AddInvoice'
import moment from 'moment'
import Utilities from '../../../../../services/commonservice/utilities'
import InvoiceCard from '../invoice-card/InvoiceCard'
import AddPatient from '../../patient/add-patient/AddPatient'
import InfiniteScroller from '../../../../templates/components/InfiniteScroller'
import { debounce } from 'lodash'
const FindAllInvoices = (props) => {
    const [patientList, setPatientList] = useState()
    const [transactions, setTransactions] = useState()
    const [showAdd, setShowAdd] = useState(false)
    const [keyword, setKeyword] = useState()
    const [patientId, setPatientId] = useState()
    const [invoiceId, setInvoiceId] = useState()
    const [sortBy, setSortBy] = useState('Desc')
    const [collectPayment, setCollectPayment] = useState(false)
    const [activeKey, setActiveKey] = useState('patientId')
    const filters = [
        { title: 'All', value: '' },
        { title: 'Ready To Send', value: 1 },
        { title: 'Awaiting Payment', value: 2 },
        { title: 'Cancelled', value: 3 },
        { title: 'Full Payment', value: 4 },
        { title: 'Membership', value: 5 },
        { title: 'One Time Scheduled Payment', value: 6 },
        { title: 'Payment Plan', value: 7 },
        { title: 'In Progress', value: 8 },
        { title: 'Paid', value: 9 },
        { title: 'Unpaid', value: 10 },
        { title: 'Unsubscribed', value: 11 },
        { title: 'Closed', value: 30 }
    ]
    const [currentFilter, setCurrentFilter] = useState()
    const [isLoader, setIsLoader] = useState(false)


    const initialInvoiceLoad = () => {
        if (keyword) {
            setIsLoader(true)
            let reqObj = {
                SortField: 'createdOn',
                Asc: false,
                StartRow: 0,
                PageSize: 100,
            }
            if (activeKey == 'checkoutDate') {
                reqObj.FromInvoiceDate = moment(keyword).startOf("d")
                reqObj.ToInvoiceDate = moment(keyword).add(1, "d").startOf("d")
            }
            if (activeKey == 'dueDate') {
                reqObj.FromDueDate = moment(keyword).startOf("d")
                reqObj.ToDueDate = moment(keyword).add(1, "d").startOf("d")
            }
            InvoiceService.findInvoice(reqObj)
                .then(res => {
                    console.log(res)
                    setTransactions(res)
                    return setIsLoader(false)
                })
        }
        else {
            setIsLoader(true)
            let reqObj = {
                SortField: 'createdOn',
                Asc: false,
                StartRow: 0,
                PageSize: 100,
            }
            InvoiceService.findInvoice(reqObj)
                .then(res => {
                    console.log(res)
                    setTransactions(res)
                    return setIsLoader(false)
                })
        }
    }
    const reInitialInvoiceLoad = useCallback(debounce(initialInvoiceLoad, 500), [])
    // useEffect(() => {
    //     initialInvoiceLoad()
    // }, [])

    const patientLoad = (inputText, callBack) => {
        if (inputText?.length < 3) return;
        let reqObj = { SearchTerm: inputText, isActive: true, isRegistered: true, SortField: 'firstName', Asc: true }
        CommonService.patientLookup(reqObj)
            .then(res => {
                if (res) {
                    callBack(res.data)
                }
            }
            )
            .catch(err => console.log(err))
    }
    const rePatientLoad = useCallback(debounce(patientLoad, 500), [])

    const invoiceLoad = (inputText, callBack) => {
        if (inputText?.length < 3) return;
        // setIsLoader(true)
        let reqObj = {
            SortField: 'createdOn',
            Asc: false,
            StartRow: 0,
            PageSize: 100,
            InvoiceNumber: inputText
        }
        InvoiceService.findInvoice(reqObj)
            .then(res => {
                console.log(res)
                callBack(res)
            })
    }
    const reInvoiceLoad = useCallback(debounce(invoiceLoad, 500), [])

    //seperate invoice formula for invoice no
    const pullInvoiceNo = (invoiceNo) => {
        setIsLoader(true)
        let reqObj = {
            SortField: 'createdOn',
            Asc: false,
            StartRow: 0,
            PageSize: 100,
            InvoiceNumber: invoiceNo
        }
        InvoiceService.findInvoice(reqObj)
            .then(res => {
                console.log(res)
                setTransactions(res)
                return setIsLoader(false)
            })
    }

    // prevent constant calls to DB
    const rePullInvoiceNo = useCallback(debounce(pullInvoiceNo, 500), [])

    //respond to invoice no change
    useEffect(() => {
        if (keyword?.length >= 3) {
            rePullInvoiceNo(keyword)
        }
    }, [keyword])

    // seperate patient formula
    const pullPatient = (patientId) => {
        setIsLoader(true)
        let reqObj = {
            SortField: 'createdOn',
            Asc: false,
            StartRow: 0,
            PageSize: 100,
            PatientIds: patientId
        }
        InvoiceService.findInvoice(reqObj)
            .then(res => {
                console.log(res)
                setTransactions(res)
                return setIsLoader(false)
            })
    }

    // prevent constant calls to DB
    const rePullPatient = useCallback(debounce(pullPatient, 500), [])

    //respond to patient Id change
    useEffect(() => {
        if (patientId?.length >= 3) {
            rePullPatient(patientId)
        }
    }, [patientId])

    //seperate invoice formula for invoice Id
    const pullInvoice = (invoiceId) => {
        setIsLoader(true)
        let reqObj = {
            SortField: 'createdOn',
            Asc: false,
            StartRow: 0,
            PageSize: 100,
            InvoiceId: invoiceId
        }
        InvoiceService.findInvoice(reqObj)
            .then(res => {
                console.log(res)
                setTransactions(res)
                return setIsLoader(false)
            })
    }
    // prevent constant calls to DB
    const rePullInvoice = useCallback(debounce(pullInvoice, 500), [])

    //response on invoice Id change
    useEffect(() => {
        if (invoiceId?.length >= 3) {
            rePullInvoice(invoiceId)
        }
        else {
            initialInvoiceLoad()
        }
    }, [invoiceId])

    const refresh = () => {
        if (currentFilter) {
            rePullInvoiceFiltered(currentFilter)
        }
        else if (invoiceId?.length >= 3) {
            rePullInvoice(invoiceId)
        }
        else if (patientId?.length >= 3) {
            rePullPatient(patientId)
        }
    }

    const pullInvoiceFiltered = (currentFilter) => {
        setIsLoader(true)
        let reqObj = {
            SortField: 'createdOn',
            Asc: false,
            StartRow: 0,
            PageSize: 100,
            InvoiceStatus: currentFilter
        }
        InvoiceService.findInvoice(reqObj)
            .then(res => {
                console.log(res)
                setTransactions(res)
                return setIsLoader(false)
            })
    }

    const rePullInvoiceFiltered = useCallback(debounce(pullInvoiceFiltered, 500), [])
    // Detect filter change
    useEffect(() => {
        if (currentFilter) {
            rePullInvoiceFiltered(currentFilter)
        }
        else {
            initialInvoiceLoad()
        }
    }, [currentFilter])

    useEffect(() => {
        reInitialInvoiceLoad()
    }, [keyword])
    return (
        <div className=''>
            <div title="Search" className='row d-flex align-items-end'>
                <div className='col'>
                    <TabsTemplate style="pills" activeKey={activeKey} onSelect={k => { setActiveKey(k); setKeyword() }}>
                        <div title="Patient" eventKey="patientId">
                            <AsyncSelect
                                classNamePrefix="react-select"
                                className="react-select-container"
                                name="patientId"
                                loadOptions={rePatientLoad}
                                placeholder="Search Patient"
                                onChange={e => {
                                    console.log(e)
                                    if (e?.id) {
                                        setPatientId(e.id)
                                    }
                                    else {
                                        setPatientId()
                                    }
                                }}
                                isClearable={true}
                                getOptionLabel={(option) => {
                                    return (
                                        option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                                    )
                                }
                                }
                                getOptionValue={(option) => option.id}
                                noOptionsMessage={(e) => { return <button className='btn btn-primary form-control' onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add Patient</button> }}
                            />
                        </div>
                        <div title="Invoice Number" eventKey='invoiceNumber'>
                            <AsyncSelect
                                classNamePrefix="react-select"
                                className="react-select-container"
                                // options={transactions}
                                name="invoiceNumber"
                                loadOptions={reInvoiceLoad}
                                placeholder="Search Invoice Number"
                                // value={transactions && transactions.find(obj => obj.invoiceNumber === keyword)}
                                onChange={e => {
                                    if (e?.id) {
                                        setInvoiceId(e.id)
                                    } else {
                                        setInvoiceId()
                                    }
                                }}
                                isClearable={true}
                                getOptionLabel={(option) => option.invoiceNumber + ' | ' + option.patientName + ' | ' + `${option.adjustedAmountUnpaid != null ? Utilities.toDollar(option.adjustedAmountUnpaid) + '/' : ''}` + Utilities.toDollar(option.finalAmount)
                                }
                                getOptionValue={(option) => option.invoiceId}
                            />
                        </div>
                        <div title="Checkout Date" eventKey="createdOn">
                            <div className='input-group'>
                                <input type="date" value={activeKey === 'createdOn' ? keyword : null} onChange={e => {
                                    setKeyword(e.target.value)
                                }} />
                                <button className='btn btn-primary' onClick={e => { e.preventDefault(); setKeyword() }}>Clear</button>
                            </div>
                        </div>
                        <div title="Due Date" eventKey="dueDate">
                            <div className='input-group'>
                                <input type="date" value={activeKey === 'dueDate' ? keyword : null} onChange={e => {
                                    setKeyword(e.target.value)
                                }} />
                                <button className='btn btn-primary' onClick={e => { e.preventDefault(); setKeyword() }}>Clear</button>
                            </div>
                        </div>
                    </TabsTemplate>
                </div>
                <div className='col'>
                    <div className='d-flex my-3 justify-content-end'>
                        <div className='col d-flex align-items-end w-100px'>
                            <label className='me-3 d-inline-block'>Sort by: </label>
                            <select className='form-select' onChange={e => { setSortBy(e.target.value) }}>
                                <option value='Desc' selected>Date: Desc</option>
                                <option value="Asc">Date: Asc</option>
                            </select>
                        </div>
                        <div className='col d-flex align-items-end ms-5 w-150px'>
                            <label className='me-3'>Filter By: </label>
                            <select className='form-select' onChange={e => { e.preventDefault(); setCurrentFilter(e.target.value) }}>
                                {filters.map((obj, i) => {
                                    return (
                                        <option value={obj.value}>
                                            {obj.title}
                                            {/* (
                                            {Array.isArray(transactions) && transactions.filter((tc) => {
                                                if (obj.value === "" || obj.value === null) {
                                                    return tc
                                                } else if (tc.invoiceStatus === obj.value) {
                                                    return tc
                                                }
                                            }).filter((transaction) => {
                                                if (keyword === "" || keyword === null || !keyword) {
                                                    return transaction
                                                } else if (transaction[activeKey].includes(keyword)) {
                                                    return transaction
                                                }

                                            }).length}
                                            ) */}
                                        </option>
                                    )
                                })
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className='col-auto mb-3'>
                    <button className='btn btn-primary' onClick={e => { e.preventDefault(); setCollectPayment(true) }} title="Create Invoice"><i className='icon plus' /></button>
                </div>

            </div>
            <div className='row-fluid' title="Invoices">
                {isLoader && <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">Loading</div>
                </div>}
                {!isLoader &&
                    <div>
                        {/* <div className='mb-3 btn-group col-12'>
                            {filters.map((obj, i) => {
                                return (
                                    <button
                                        onClick={e => { e.preventDefault(); setCurrentFilter(obj.value) }}
                                        className={currentFilter === obj.value ? 'btn btn-primary' : 'btn btn-secondary'}>
                                        {obj.title} (
                                        {Array.isArray(transactions) && transactions.filter((tc) => {
                                            if (obj.value === "" | null) {
                                                return tc
                                            } else if (tc.invoiceStatus === obj.value) {
                                                return tc
                                            }
                                        }).filter((transaction) => {
                                            if (keyword === "" || keyword === null || !keyword) {
                                                return transaction
                                            } else if (transaction.patientId.includes(keyword.id)) {
                                                return transaction
                                            }

                                        }).length}
                                        )
                                    </button>
                                )
                            })
                            }
                        </div> */}
                        {/* <List pageSize={10} noPaginate> */}
                        <InfiniteScroller>
                            {transactions && Array.isArray(transactions) ? transactions.filter((tc) => {
                                if (currentFilter == "" || currentFilter == null || !currentFilter) {
                                    return tc
                                } else if (tc.invoiceStatus === parseInt(currentFilter)) {
                                    return tc

                                }
                            })
                                .sort((a, b) => sortBy === 'Desc' ? b.createdOn.localeCompare(a.createdOn) : a.createdOn.localeCompare(b.createdOn))
                                .filter((transaction) => {
                                    if (keyword === "" || keyword === null || !keyword) {
                                        return transaction
                                    } else {
                                        if (transaction[activeKey].includes(keyword))
                                            return transaction
                                    }
                                })
                                .map((tc, i) => {
                                    // console.log(tc)
                                    return (
                                        <InvoiceCard transaction={tc} invoiceId={tc.id} keyword={keyword} refresh={() => { refresh() }} />
                                    )
                                }) : null}
                            {/* </List> */}
                        </InfiniteScroller>

                    </div>}
            </div>
            {/* </Dashboard> */}
            <ModalBox open={collectPayment} onClose={() => { setCollectPayment(false) }} size="fullscreen">
                <AddInvoice onClose={() => { transactionLookup(); return setCollectPayment(false) }} initialData={{ patientId: keyword }} isModal />
            </ModalBox>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
                <AddPatient onClose={() => { patientLookup(); return setShowAdd(false) }} />
            </ModalBox>
        </div>
    )
}

export default FindAllInvoices