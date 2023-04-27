import moment from 'moment';
import React, { useEffect, useState, useContext } from 'react'
import { store } from '../../../../../context/StateProvider';
import CommonService from '../../../../../services/api/common.service'
import TransactionService from '../../../../../services/api/transaction.service';
import Utilities from '../../../../../services/commonservice/utilities';
import Module from '../../../../templates/components/Module';
import PracticeLocationSelector from '../../../../templates/components/PracticeLocationSelector';
import Table from '../../../../templates/components/Table';

const TransactionReportTable = (props) => {
    const [transactions, setTransactions] = useState()
    const [isLoader, setIsLoader] = useState(false)
    const [offsetHour, setOffsetHour] = useState(moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60),)
    const [offsetMinute, setOffsetMinute] = useState(moment().utcOffset() % 60)
    const [slabBy, setSlabBy] = useState('Month')
    const [startDate, setStartDate] = useState(new Date(moment().startOf("D")).toISOString())
    const [endDate, setEndDate] = useState(new Date(moment().endOf("D").toISOString()))
    const [timePeriod, setTimePeriod] = useState("day")
    const state = useContext(store).state
    // const [patientList, setPatientList] = useState()
    const filters = [
        { title: 'All', value: "" },
        { title: 'ACH', value: 2 },
        { title: 'Credit', value: 3 },
        { title: 'Debit', value: 4 },
        { title: 'Cash', value: 9 },
        { title: 'Check', value: 10 },
    ]
    const transactionStatusList = [
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
        { 'statusName': 'Success', 'id': 16 },
        { 'statusName': 'Closed', 'id': 30 },
    ];

    // const for table 
    const columns = [
        // ["Name", "Equipment Type", "Room", "Actions"]
        {
            key: "transactionDate",
            text: "Date",
            align: "left",
            sortable: true,
            cell: (tc) => moment(tc.transactionDate).format("MM-DD-YYYY h:mm A")
        },
        {
            key: "id",
            text: "Transaction Id",
            align: "left",
            sortable: true,
        },
        {
            key: "amount",
            text: "Amount",
            align: "left",
            sortable: true,
            cell: (tc) => Utilities.toDollar(tc.tenderInfo.totalAmount)
        },
        {
            key: "channelType",
            text: "Payment Method",
            align: "left",
            sortable: false,
            cell: (tc) => filters.find(obj=>obj.value === tc.tenderInfo.channelType).title
        },
        {
            key: "nameOnCard",
            text: "Name on Account",
            align: "left",
            sortable: false,
            cell: (tc) => tc.tenderInfo.nameOnCheckOrCard
        },
        {
            key: "cardType",
            text: "Account Type",
            align: "left",
            sortable: true,
            cell: (tc) => tc.tenderInfo.cardType ? tc.tenderInfo.cardType : tc.tenderInfo.bankName
        },
        {
            key: "lastFour",
            text: "Account/Check Number",
            align: "left",
            sortable: true,
            cell: (tc) => tc.tenderInfo.maskCardNumber ? tc.tenderInfo.maskCardNumber : tc.tenderInfo.maskAccount? tc.tenderInfo.maskAccount : tc.tenderInfo.checkNumber
        },
        {
            key: "firstName",
            text: "Patient First Name",
            align: "left",
            sortable: true,
        },
        {
            key: "lastName",
            text: "Patient Last Name",
            align: "left",
            sortable: true,
        },
        {
            key: "transactionStatus",
            text: "Status",
            align: "left",
            sortable: true,
            cell: (tc)=> transactionStatusList.find(obj=> obj.id === tc.transactionStatus)?.statusName
        },
        // {
        //     key: "actions",
        //     text: "Actions",
        //     align: "center",
        //     sortable: false,
        //     cell: (tc) => {
        //         return (
        //             <div className='row d-flex justify-content-center'>
        //                 <div className='btn-group col-auto'>
        //                     <button className="btn btn-primary" title="Cancel"><i className="icon dont" /></button>
        //                     <button className="btn btn-primary" title="Refund"> <i className='icon dollar' /></button>
        //                     <button className="btn btn-primary" title="Receipt"><i className="icon sticky note outline" /></button>
        //                 </div>
        //             </div>
        //         )
        //     }
        // },
    ]
    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "All Transactions Report",
        button: {
            excel: true,
            print: true,
            csv: true,
            extra: true
        },
        language: {
            loading_text: "Please be patient while data loads..."
        }
    }


    const transactionLookup = () => {
        setIsLoader(true)
        let reqObj = {
            sortField: 'createdOn',
            Asc: 'false',
            // PageSize: 20,
            StartRow: 0,
            StartDate: new Date(startDate).toISOString(),
            EndDate: new Date(endDate).toISOString(),
            PracticeLocationId: state.practiceLocationId
        }
        TransactionService.findTransaction(reqObj)
            .then(res => {
                console.log(res.data.data)
                setTransactions(res.data.data)
                return setIsLoader(false)
            })
    }
    const changeStart = (date) => {
        if (timePeriod === "quarter") {
            setStartDate(moment(date).startOf("quarter"))
            setEndDate(moment(date).add(2, "M").endOf("M"))
        }
        else if (timePeriod !== "custom") {
            setStartDate(moment(date).startOf(timePeriod[0].toLocaleUpperCase()))
            setEndDate(moment(date).endOf(timePeriod[0].toLocaleUpperCase()))
        }
        // transactionLookup()
    }
    const changeRange = () => {
        if (timePeriod === "quarter") {
            setStartDate(moment(startDate).startOf("quarter"))
            setEndDate(moment(startDate).add(2, "M").endOf("M"))
        }
        else if (timePeriod !== "custom") {
            setStartDate(moment(startDate).startOf(timePeriod[0].toLocaleUpperCase()))
            setEndDate(moment(startDate).endOf(timePeriod[0].toLocaleUpperCase()))
        }
    }

    useEffect(() => {
        changeRange()
    }, [timePeriod])

    useEffect(() => {
        transactionLookup()
    }, [])

    return (
        <div className='row d-flex g-4'>
            <div className='col-12'>
                <Module title="Filters">
                    <div className='row d-flex'>
                        <div className='col-12 row d-flex justify-content-center mx-0 align-items-end'>
                            <div className='col'>
                                <div className='ui field'>
                                    <label>Time Period</label>
                                    <select className='form-select' value={timePeriod} onChange={e => { e.preventDefault(); setTimePeriod(e.target.value) }}>
                                        <option value="day">Day</option>
                                        <option value="week">Week</option>
                                        <option value="month">Month</option>
                                        <option value="quarter">Quarter</option>
                                        <option value="year">Year</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                            </div>
                            {timePeriod === 'quarter' || timePeriod === 'year' || timePeriod === 'month' ? <div className='col'>
                                <div className='ui field'>
                                    <label>Year</label>
                                    <input type="number" value={moment(startDate).year()} onChange={e => { e.preventDefault(); console.log(e.target.value + 1); setStartDate(new Date(moment(startDate).year(e.target.value)).toISOString()); setEndDate(new Date(moment(endDate).year(e.target.value)).toISOString()); }} />
                                </div>
                            </div> : null}
                            {timePeriod === 'quarter' && <div className='col'>
                                <div className='ui field'>
                                    <label>Quarter</label>
                                    <select className="form-select" value={moment(startDate).quarter()} onChange={e => { e.preventDefault(); setStartDate(moment(startDate).quarter(e.target.value)); setEndDate(moment(endDate).quarter(e.target.value).endOf('quarter')); }}>
                                        <option value={1}>Q1</option>
                                        <option value={2}>Q2</option>
                                        <option value={3}>Q3</option>
                                        <option value={4}>Q4</option>
                                    </select>
                                </div>
                            </div>}
                            {timePeriod === 'month' && <div className='col'>
                                <div className='ui field'>
                                    <label>Month</label>
                                    <select className="form-select" value={moment(startDate).month() + 1} onChange={e => { e.preventDefault(); console.log(moment(startDate).startOf("M").month(e.target.value - 1).toISOString()); setStartDate(new Date(moment(startDate).startOf("M").month(e.target.value - 1))); setEndDate(new Date(moment(endDate).month(e.target.value - 1).endOf('M'))); return transactionLookup() }}>
                                        <option value={1}>January</option>
                                        <option value={2}>February</option>
                                        <option value={3}>March</option>
                                        <option value={4}>April</option>
                                        <option value={5}>May</option>
                                        <option value={6}>June</option>
                                        <option value={7}>July</option>
                                        <option value={8}>August</option>
                                        <option value={9}>September</option>
                                        <option value={10}>October</option>
                                        <option value={11}>November</option>
                                        <option value={12}>December</option>
                                    </select>
                                </div>
                            </div>}
                            {timePeriod === 'week' || timePeriod === 'day' || timePeriod === 'custom' ? <div className='col'>
                                <div className='ui field'>
                                    <label>Start Date</label>
                                    <input type="date" value={Utilities.toDate(startDate)} onChange={e => { e.preventDefault(); setStartDate(e.target.value) }} onBlur={e=>{e.preventDefault(); changeStart(startDate)}} disabled={timePeriod !== 'day' && timePeriod !== 'week' && timePeriod !== 'custom'} />
                                </div>
                            </div> : null}
                            {timePeriod === 'custom' && <div className='col'>
                                <div className='ui field'>
                                    <label>End Date</label>
                                    <input type="date" value={Utilities.toDate(endDate)} onChange={e => { e.preventDefault(); setEndDate(e.target.value); return transactionLookup() }} disabled={timePeriod !== "custom"} />
                                </div>
                            </div>}
                            <div className='col'>
                                <div className='ui field'>
                                    <label>Practice Location</label>
                                    <PracticeLocationSelector />
                                </div>
                            </div>
                            <div className="col-auto"><button className="btn btn-primary" onClick={e=>{e.preventDefault(); transactionLookup()}} title="Pull Report"><i className="icon arrow circle right"/></button></div>
                        </div>
                    </div>
                </Module>
            </div>
            <div className='col-12'>
                <Module title="Transaction Report">
                    <Table config={config} records={transactions} columns={columns} loading={isLoader} />
                </Module>
            </div>
        </div>
    )
}

export default TransactionReportTable