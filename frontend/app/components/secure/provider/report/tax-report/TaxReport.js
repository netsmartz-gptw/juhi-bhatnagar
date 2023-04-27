import React, { useState, useEffect } from 'react';
import label from '../../../../../../assets/i18n/en.json'
import Calendar from 'react-calendar';
import InvoiceService from '../../../../../services/api/invoice.service';
import Utilities from '../../../../../services/commonservice/utilities';
import * as moment from "moment";
import Select from 'react-select';
import Table from '../../../../templates/components/Table';
import Module from '../../../../templates/components/Module';

const TaxReport = (props) => {
    const [isLoader, setIsLoader] = useState(false)
    const [newInitialReqObject, setNewInitialReqObject] = useState({})
    const [data, setData] = useState()
    const [offsetHour, setOffsetHour] = useState(moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60),)
    const [offsetMinute, setOffsetMinute] = useState(moment().utcOffset() % 60)
    const [slabBy, setSlabBy] = useState('Month')
    const [startDate, setStartDate] = useState(new Date(moment().startOf("D")).toISOString())
    const [endDate, setEndDate] = useState(new Date(moment().endOf("D").toISOString()))
    const [timePeriod, setTimePeriod] = useState("day")

    // const for table 
    const columns = [
        // ["Name", "Equipment Type", "Room", "Actions"]
        {
            key: "TransactionDate",
            text: "Transaction Date",
            align: "left",
            sortable: true,
            cell: (invoice, i) => moment(invoice.TransactionDate).format("MM-DD-YYYY H:mm A")
        },
        {
            key: "InvoiceNumber",
            text: "Invoice Number",
            align: "left",
            sortable: true,
        },
        {
            key: "Name",
            text: "Name",
            // className: "name",
            align: "left",
            sortable: true,
        },
        {
            key: "UnitPrice",
            text: "Unit Price",
            // className: "name",
            align: "left",
            sortable: false,
            cell: (invoice, i) => Utilities.toDollar(invoice.UnitPrice)
        },
        {
            key: "Quantity",
            text: "Quantity",
            // className: "name",
            align: "left",
            sortable: false,
        },
        {
            key: "ItemSubTotal",
            text: "SubTotal",
            // className: "name",
            align: "left",
            sortable: false,
            cell: (invoice, i) => isNaN(invoice.ItemSubTotal) ? invoice.ItemSubTotal : Utilities.toDollar(invoice.ItemSubTotal)
        },
        {
            key: "TaxAmount",
            text: "Tax",
            // className: "name",
            align: "left",
            sortable: false,
            cell: (invoice, i) => isNaN(invoice.TaxAmount) ? invoice.TaxAmount : Utilities.toDollar(invoice.TaxAmount)
        },
        {
            key: "ItemTotal",
            text: "Item Total",
            // className: "name",
            align: "left",
            sortable: false,
            cell: (invoice, i) => isNaN(invoice.ItemTotal) ? invoice.ItemTotal : Utilities.toDollar(invoice.ItemTotal)
        },
        {
            key: "PaymentType",
            text: "Payment Method",
            // className: "name",
            align: "left",
            sortable: false,
        }
    ]
    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "Tax Report",
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


    const getTaxReport = (downloadFormat) => {
        let newInitialReqObject = {
            StartDate: new Date(startDate).toISOString(),
            EndDate: new Date(endDate).toISOString(),
            offsetHour: offsetHour,
            offsetMinute: offsetMinute
        }
        setIsLoader(true);
        InvoiceService.getTaxReport(newInitialReqObject)
            .then(res => {
                // console.log(res)
                if (res && res.length > 0) {
                    setData(res)
                    setIsLoader(false)
                    console.log(res)
                    let TotalAmountOfItemSubTotal = 0;
                    let TotalAmountOfItemTotal = 0;
                    let TotalQuantity = 0;
                    let TotalTaxAmount = 0;
                    res.forEach(element => {
                        // console.log(element)
                        // element.UnitPrice = '$' + formatNumber(element.UnitPrice, "en-US", '1.2-2');
                        //console.log(element.TransactionDate)
                        element.TransactionDate = moment.utc(element.TransactionDate, 'YYYY-MM-DDTHH:mm:ss.SSSz').local().format('MM/DD/YYYY') || null;
                        //console.log(element.TransactionDate)
                        TotalAmountOfItemSubTotal = TotalAmountOfItemSubTotal + element.ItemSubTotal || null;
                        TotalAmountOfItemTotal = TotalAmountOfItemTotal + element.ItemTotal || null;
                        TotalQuantity = TotalQuantity + element.Quantity || null;
                        TotalTaxAmount = TotalTaxAmount + element.TaxAmount || null;
                        // element.ItemSubTotal = formatNumber(element.ItemSubTotal, "en-US", '1.2-2');
                        // element.ItemTotal = formatNumber(element.ItemTotal, "en-US", '1.2-2');
                        // element.TaxAmount = formatNumber(element.TaxAmount, "en-US", '1.2-2');
                    });
                    //adding total record at the end of array object
                    res.push({
                        TransactionDate: '', InvoiceNumber: '', Name: '',
                        UnitPrice: '', Quantity: TotalQuantity,
                        TaxAmount: Utilities.toDollar(TotalTaxAmount), ItemSubTotal: Utilities.toDollar(TotalAmountOfItemSubTotal), ItemTotal: Utilities.toDollar(TotalAmountOfItemTotal), PaymentType: ''
                    })
                    //console.log(res.length)
                    if (downloadFormat === 'CSV') {
                        if (Utilities.exportToCsv(res, 'Tax_Report.csv')) {
                            setIsLoader(false);
                        }
                    }
                    if (downloadFormat === 'PDF') {
                        const pdfdata = Utilities.exportToPdf(res, 'Tax_Report.csv');
                        // console.log(pdfdata);
                        if (pdfdata) {
                            const filters = {};
                            Utilities.pdf(pdfdata, filters, 'Tax_Report.pdf');
                            setIsLoader(false);
                        }
                    }
                } else {
                    setIsLoader(false);
                    console.log("No Record Found");
                }
            }
            ).catch(err => { console.log(err); setIsLoader(false); })
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
        // getTaxReport()
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
        getTaxReport()
    }, [startDate, endDate])

    return (
        <div>
            <div className="row mt-3 g-4 d-flex justify-content-center">
                <div className='col-12'>
                    <Module title="Filters">
                        <div className='row d-flex'>
                            <div className='col-12 row d-flex justify-content-center mx-0  align-items-end'>
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
                                        <select className="form-select" value={moment(startDate).month() + 1} onChange={e => { e.preventDefault(); console.log(moment(startDate).startOf("M").month(e.target.value - 1).toISOString()); setStartDate(new Date(moment(startDate).startOf("M").month(e.target.value - 1))); setEndDate(new Date(moment(endDate).month(e.target.value - 1).endOf('M'))); return getTaxReport
                                        () }}>
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
                                        <input type="date" value={Utilities.toDate(endDate)} onChange={e => { e.preventDefault(); setEndDate(e.target.value);  }} disabled={timePeriod !== "custom"} />
                                    </div>
                                </div>}
                                <div className="col-auto"><button className="btn btn-primary" onClick={e=>{e.preventDefault(); getTaxReport()}} title="Pull Report"><i className="icon arrow circle right"/></button></div>
                            </div>
                        </div>
                    </Module>
                </div>
                <div className="col-12">
                    <Module title="Tax Report">
                        <Table config={config} records={data} columns={columns} loading={isLoader} />
                    </Module>
                </div>
            </div>
        </div>
    )
}

export default TaxReport