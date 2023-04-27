import React, { useEffect, useState, useCallback } from 'react'
import CommonService from '../../../../../services/api/common.service'
import TabsTemplate from '../../../../templates/components/TabsTemplate'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import TransactionService from '../../../../../services/api/transaction.service';
import moment from 'moment'
import Utilities from '../../../../../services/commonservice/utilities'
import TransactionsCardList from '../transactions-card/TransactionsCardList'
import InfiniteScroller from '../../../../templates/components/InfiniteScroller'
import ModalBox from '../../../../templates/components/ModalBox'
import AddInvoice from '../../invoices/add-invoice/AddInvoice'
import { debounce } from 'lodash'
import AddPatient from '../../patient/add-patient/AddPatient'

const FindAllTransactionsList = (props) => {

    const [patientList, setPatientList] = useState()
    const [transactions, setTransactions] = useState()
    const [providerList, setProviderList] = useState([])
    const [keyword, setKeyword] = useState("")
    const [sortBy, setSortBy] = useState(true)
    const [activeKey, setActiveKey] = useState('patientId')
    const [currentFilter, setCurrentFilter] = useState('')
    const [secondFilter, setSecondFilter] = useState('')
    const [isLoader, setIsLoader] = useState(false)
    const [collectPayment, setCollectPayment] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const filters = [
        { title: 'All', value: '' },
        { title: 'ACH', value: 2 },
        { title: 'CC', value: 3 },
        { title: 'Debit', value: 4 },
        { title: 'Cash', value: 9 },
        { title: 'Check', value: 10 },
    ]
    const transactionStatusList = [
        { 'statusName': 'All', 'id': '' },
        { 'statusName': 'Created', 'id': 0 },
        { 'statusName': 'Pending', 'id': 1 },
        { 'statusName': 'Authorized', 'id': 2 },
        { 'statusName': 'Posted', 'id': 3 },
        { 'statusName': 'Failed', 'id': 5 },
        { 'statusName': 'Void', 'id': 8 },
        { 'statusName': 'Approved', 'id': 10 },
        { 'statusName': 'Void attempted', 'id': 11 },
        { 'statusName': 'Hold', 'id': 13 },
        { 'statusName': 'Denied', 'id': 14 },
        { 'statusName': 'Paid', 'id': 16 },
        { 'statusName': 'Closed', 'id': 30 },
    ];


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
        TransactionService.findTransaction(reqObj)
            .then(res => {
                console.log(res.data.data)
                callBack(res.data.data)
            })
    }
    const reInvoiceLoad = useCallback(debounce(invoiceLoad, 500), [])


    const patientLoad = (inputText, callBack) => {
        if (inputText?.length < 3) return;
        let reqObj = { SearchTerm: inputText, isActive: true, isRegistered: true, SortField: 'firstName', isAsc: true }
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


    const transactionLookup = () => {
        setIsLoader(true)
        let reqObj = {
            SortField: 'TransactionDate',
            Asc: sortBy,
            StartRow: 0,
            PageSize: 100
        }
        if (activeKey == 'patientId' && keyword) {
            reqObj.PatientIds = keyword
        }
        if (activeKey == 'transactionDate') {
            reqObj.StartDate = moment(keyword).startOf('d')
            reqObj.EndDate = moment(keyword).add(1, "d").startOf('d')
        }
        if (activeKey == 'invoiceNumber') {
            reqObj.InvoiceNumber = keyword
        }
        if (secondFilter !== '') {
            reqObj.Statuses = secondFilter
        }
        if (currentFilter !== '') {
            reqObj.ChannelType = currentFilter
        }
        TransactionService.findTransaction(reqObj)
            .then(res => {
                if (res?.data?.data) {
                    console.log(res.data.data)
                    setTransactions(res.data.data)
                }
                return setIsLoader(false)
            })
    }

    const reTransactionLookup = useCallback(debounce(transactionLookup, 500), [])

    useEffect(() => {
        reTransactionLookup()
    }, [keyword])

    useEffect(() => {
        transactionLookup()
    }, [currentFilter, secondFilter, sortBy])


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
                                        setKeyword(e.id)
                                    }
                                    else {
                                        setKeyword()
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
                        <div title="Invoice Number" eventKey="invoiceNumber">
                            <AsyncSelect
                                classNamePrefix="react-select"
                                className="react-select-container"
                                name="invoiceId"
                                loadOptions={reInvoiceLoad}
                                placeholder="Search Invoice"
                                onChange={e => {
                                    console.log(e)
                                    if (e?.id) {
                                        setKeyword(e.invoiceNumber)
                                    }
                                    else {
                                        setKeyword()
                                    }
                                }}
                                isClearable={true}
                                getOptionLabel={(option) => {
                                    return (
                                        // option.id + '  | ' + 
                                        option.firstName + ' ' + option.lastName + ' | ' + option.invoiceNumber + ' | ' + Utilities.toDollar(option.tenderInfo?.totalAmount)
                                    )
                                }
                                }
                                getOptionValue={(option) => option.id}
                            />
                        </div>

                        <div title="Transaction Date" eventKey="transactionDate">
                            <div className='input-group'>
                                <input type="date" value={activeKey === 'transactionDate' ? keyword : null} onChange={e => {
                                    e.preventDefault()
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
                                <option value={false} selected>Date: Desc</option>
                                <option value={true}>Date: Asc</option>
                            </select>
                        </div>
                        <div className='col d-flex align-items-end ms-5 w-150px'>
                            <label className='me-3'>Transaction Status: </label>
                            <select className='form-select' onChange={e => { e.preventDefault(); setSecondFilter(e.target.value) }}>
                                {transactionStatusList.map((obj, i) => {
                                    return (
                                        <option value={obj.id}>
                                            {obj.statusName}
                                            {/* (
                                            {Array.isArray(transactions) && transactions.filter((tc) => {
                                                if (obj.id == "" || obj.id == null) {
                                                    return tc
                                                } else if (tc.transactionStatus == parseInt(obj.id)) {
                                                    return tc
                                                }
                                            }).filter((transaction) => {
                                                if (keyword == "" || keyword == null || !keyword) {
                                                    return transaction
                                                } else if (transaction[activeKey]==keyword|| moment(transaction[activeKey]).format("YYYY-MM-DD")==keyword) {
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
                        <div className='col d-flex align-items-end ms-5 w-150px'>
                            <label className='me-3'>Payment Type: </label>
                            <select className='form-select' onChange={e => { e.preventDefault(); setCurrentFilter(e.target.value) }}>
                                {filters.map((obj, i) => {
                                    return (
                                        <option value={obj.value}>
                                            {obj.title}
                                            {/* (
                                            {Array.isArray(transactions) && transactions.filter((tc) => {
                                                if (obj.value == "" || obj.value == null) {
                                                    return tc
                                                } else if (tc.tenderInfo.channelType === obj.value) {
                                                    return tc
                                                }
                                            }).filter((transaction) => {
                                                if (keyword == "" || keyword == null || !keyword) {
                                                    return transaction
                                                } else if (transaction[activeKey]==keyword || moment(transaction[activeKey]).format("YYYY-MM-DD")==keyword) {
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
                <div>
                    {/* <List pageSize={10} noPaginate> */}
                    <InfiniteScroller>
                        {Array.isArray(transactions) && transactions
                            // .filter((tc) => {
                            //     if (currentFilter === "" || currentFilter === null || !currentFilter) {
                            //         return tc
                            //     } else if (tc.tenderInfo.channelType === parseInt(currentFilter)) {
                            //         return tc

                            //     }
                            // }).filter((tc) => {
                            //     if (secondFilter === "" || secondFilter === null || !secondFilter) {
                            //         return tc
                            //     } else if (tc.transactionStatus === parseInt(secondFilter)) {
                            //         return tc

                            //     }
                            // })
                            // .sort((a, b) => sortBy === 'Desc' ? b.createdOn.localeCompare(a.createdOn) : a.createdOn.localeCompare(b.createdOn))
                            .filter((transaction) => {
                                if (keyword === "" || keyword === null || !keyword) {
                                    return transaction
                                } else {
                                    if (transaction[activeKey] == keyword || moment(transaction[activeKey]).format("YYYY-MM-DD") == keyword)
                                        return transaction
                                }
                            }).map((tc, i) => {
                                // console.log(tc)
                                return (
                                    <TransactionsCardList transaction={tc} />
                                )
                            })}
                        {/* </List> */}
                    </InfiniteScroller>
                </div>
            </div>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
                <AddPatient onClose={() => { setShowAdd(false) }} />
            </ModalBox>
            <ModalBox open={collectPayment} onClose={() => { setCollectPayment(false) }} title="Collect Payment" size="fullscreen">
                <AddInvoice onClose={() => { transactionLookup(); return setCollectPayment(false) }} />
            </ModalBox>
        </div>
    )
}

export default FindAllTransactionsList