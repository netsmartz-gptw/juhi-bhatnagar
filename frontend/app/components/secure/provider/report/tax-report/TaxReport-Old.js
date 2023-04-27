import React, { useState, useEffect } from 'react';
import label from '../../../../../../assets/i18n/en.json'
import Calendar from 'react-calendar';
import InvoiceService from '../../../../../services/api/invoice.service';
import Utilities from '../../../../../services/commonservice/utilities';
import * as moment from "moment";
import Select from 'react-select';
import Table from '../../../../templates/components/Table';

const TaxReportOld = (props) => {
    const [isLoader, setIsLoader] = useState(false)
    const [inputData, setInputData] = useState('month')
    const [value, setValue] = useState(new Date());
    const [selectedCustomRange, setSelectedCustomRange] = useState('Today')
    const [selectedDateForReport, setSelectedDateForReport] = useState(moment())
    const [selectedDateRangeForGraph, setSelectedDateRangeForGraph] = useState('newmonth')
    const [selectedCustomDateRangeForReport, setSelectedCustomDateRangeForReport] = useState()
    const [selectedTab, setSelectedTab] = useState('newmonth');
    const [maxGraph, setMaxGraph] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
    const [newInitialReqObject, setNewInitialReqObject] = useState({})
    const [data, setData] = useState()

    const [selectedYear, setSelectedYear] = useState()
    const [selectedMonth, setSelectedMonth] = useState()
    const [selectedWeek, setSelectedWeek] = useState()
    const [selectedDate, setSelectedDate] = useState()
    const [selectedCustom, setSelectedCustom] = useState()

    const [fileType, setFileType] = useState('')

    const fileTypes = [{ label: 'PDF', id: 'PDF' }, { label: 'CSV', id: 'CSV' }];
    // const for table 
    const columns = [
        // ["Name", "Equipment Type", "Room", "Actions"]
        {
            key: "TransactionDate",
            text: "Transaction Date",
            align: "left",
            sortable: true,
            cell: (invoice, i) => moment.isDate(invoice.TransactionDate) ? moment(invoice.TransactionDate).format("MM-DD-YYYY H:mm A") : invoice.TransactionDate
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
            key: "TaxAmount",
            text: "Tax",
            // className: "name",
            align: "left",
            sortable: false,
            cell: (invoice, i) => isNaN(invoice.TaxAmount) ? invoice.TaxAmount : Utilities.toDollar(invoice.TaxAmount)
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
    useEffect(() => {
        setSelectedDate('custom')
        OnRadioChange('custom')
    }, [])
    useEffect(()=>{
        getTaxReport()
        console.log("value", value)
        console.log("inputData",inputData)
    },[inputData, value])

    const inputChange = (e) => {
        setInputData(e.target.value);
        OnRadioChange(inputData)
    };

    const onCalenderChange = (v, e) => {
        // console.log(v)
        setValue(v);
        onGraphRangeChange(v, inputData)
    };

    const getTaxReport = (downloadFormat) => {
        if(!newInitialReqObject.EndDate && !newInitialReqObject.StartDate && !newInitialReqObject.offsetHour && !newInitialReqObject.offsetMinute){
            newInitialReqObject.StartDate =  moment(new Date()).subtract(30, 'days').endOf('d').toISOString();
            newInitialReqObject.EndDate = moment(new Date()).endOf('d').toISOString();
            newInitialReqObject.offsetHour = 5;
            newInitialReqObject.offsetMinute = 30;
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

    const OnRadioChange = (selectedRange) => {
        switch (selectedRange) {
            case 'year':
                setSelectedYear(new Date());
                break;
            case 'month':
                setSelectedMonth(new Date());
                break;
            case 'week':
                setSelectedWeek(new Date());
                break;
            case 'day':
                setSelectedDate(new Date());
                break;
            case 'custom':
                //resetting custom value
                setSelectedCustomRange('Today');
                setSelectedCustom({ start: new Date(), end: new Date() });
                onCustomRangeChange({ "label": "Today", "dates": [moment(), moment()] })
                onGraphRangeChange({ "startDate": moment(), "endDate": moment() }, 'custom')
                break;
            default:
                break;
        }
        setSelectedDateForReport(moment());
        //console.log("OnRadioChange  selectedDateForReport "+selectedDateForReport)
    }

    const onCustomRangeChange = (selectedDate) => {
        //console.log("onCustomRangeChange "+JSON.stringify(selectedDate) )
        setSelectedCustomRange(selectedDate.label);
    }

    const onGraphRangeChange = (selectedDate, selectedRange) => {
        // console.log("onGraphRangeChange ", selectedDate, selectedRange )
        if (selectedDate != undefined) {
            if (selectedRange == 'custom') {
                if (selectedCustomRange == undefined) {
                    if (selectedDate.endDate == null && selectedDate.startDate == null) {
                        selectedDate.endDate = moment();
                        selectedDate.startDate = moment();

                        setSelectedCustom({ endDate: moment(), startDate: moment() })
                        setSelectedCustomRange('Today');
                    }
                    let dayDiff = selectedDate.endDate.diff(selectedDate.startDate, 'days');
                    if (dayDiff == 0) {
                        setSelectedDateRangeForGraph('day');
                        setSelectedDateForReport(selectedDate.startDate);
                    } else if (dayDiff < 31) {
                        setSelectedDateRangeForGraph('customDayOfMonth');
                        setSelectedCustomDateRangeForReport(selectedDate);
                    } else if (dayDiff <= 90) {
                        setSelectedDateRangeForGraph('customWeekOfMonth');
                        setSelectedCustomDateRangeForReport(selectedDate);
                    } else if (dayDiff > 90) {
                        setSelectedDateRangeForGraph('customMonthOfYear');
                        setSelectedCustomDateRangeForReport(selectedDate);
                    }
                } else {
                    switch (selectedCustomRange) {
                        case 'Today':
                            setSelectedDateRangeForGraph('day');
                            setSelectedDateForReport(moment());
                            break;
                        case 'Yesterday':
                            setSelectedDateRangeForGraph('day');
                            setSelectedDateForReport(moment(moment().subtract(1, 'days').startOf('d')));
                            break;
                        case 'Last 7 Days':
                            setSelectedDateRangeForGraph('week');
                            setSelectedDateForReport(moment());
                            break;
                        // case 'Last 30 Days':
                        //   setSelectedDateRangeForGraph('1month');
                        //   setSelectedDateForReport(moment();
                        // break;
                        case 'This Month':
                            setSelectedDateRangeForGraph('newmonth');
                            setSelectedDateForReport(moment());
                            break;
                        case 'Last Month':
                            setSelectedDateRangeForGraph('newmonth');
                            setSelectedDateForReport(moment(moment().subtract(1, 'month').startOf('month')));
                            break;
                        default:
                            break;
                    }

                }
                onChangeSlabs(selectedDateRangeForGraph);
                setSelectedCustomRange(undefined);

            } else {
                setSelectedDateRangeForGraph(selectedRange);
                setSelectedDateForReport(selectedDate);
                onChangeSlabs(selectedRange);
            }
        }


    }
    const downloadReport = (fileType) => {
        // console.log("downloadReport clicked", newInitialReqObject, fileType)
        getTaxReport(fileType);
    }

    const onChangeSlabs = (data) => {
        // console.log('onChangeSlabs',data)
        const reqObj = {};
        setSelectedTab(data);
        switch (data) {
            case 'year':
                reqObj.EndDate = moment(selectedDateForReport).endOf('y').toISOString();
                reqObj.StartDate = moment(selectedDateForReport).startOf('y').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                break;
            case '3month':
                reqObj.EndDate = moment().endOf('d').toISOString();
                reqObj.StartDate = moment().subtract(3, 'months').startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                break;
            case '1month':
                reqObj.EndDate = moment(selectedDateForReport).endOf('month').toISOString();
                reqObj.StartDate = moment(selectedDateForReport).startOf('month').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                break;
            case 'month': //newmonth
                reqObj.EndDate = moment(selectedDateForReport).endOf('month').toISOString();
                reqObj.StartDate = moment(selectedDateForReport).startOf('month').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                break;
            case 'customDayOfMonth':
                reqObj.EndDate = moment(selectedCustomDateRangeForReport.endDate).endOf('d').toISOString();
                reqObj.StartDate = moment(selectedCustomDateRangeForReport.startDate).startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                break;
            case 'customWeekOfMonth':
                reqObj.EndDate = moment(selectedCustomDateRangeForReport.endDate).endOf('d').toISOString();
                reqObj.StartDate = moment(selectedCustomDateRangeForReport.startDate).startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                break;
            case 'customMonthOfYear':
                reqObj.EndDate = moment(selectedCustomDateRangeForReport.endDate).endOf('d').toISOString();
                reqObj.StartDate = moment(selectedCustomDateRangeForReport.startDate).startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                break;
            case 'week':
                reqObj.EndDate = moment(selectedDateForReport).endOf('d').toISOString();
                reqObj.StartDate = moment(selectedDateForReport).subtract(6, 'd').startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                break;
            case 'day':
                reqObj.EndDate = moment(selectedDateForReport).endOf('d').toISOString();
                reqObj.StartDate = moment(selectedDateForReport).startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                break;
            default:
                break;
        }
        setNewInitialReqObject(reqObj);
        //console.log(reqObj)
    }

    const onChangeFileType = (e) => {
        setFileType(e);
        downloadReport(e);
    }

    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.processing}</div>
                </div>
            </div>}
            <div>
                <form>
                    {/* <h1 className="ui header">{label.invoice.report.taxreprot}</h1> */}
                    <div className="ui segment apf-search">
                        <div className="row mt-3 g-4 d-flex justify-content-center">
                            <div className='col-12 row d-flex justify-content-between align-items-center'>
                                <div className="form-check form-check-inline col">
                                    <input className="form-check-input mt-2" type="radio" name="viewType" id="inlineRadio1"
                                        onChange={e => { inputChange(e); }} value="year" defaultChecked={inputData == 'year' ? true : false} />
                                    <label className="form-check-label mt-1" htmlFor="inlineRadio1">Year</label>
                                </div>
                                <div className="form-check form-check-inline col">
                                    <input className="form-check-input mt-2" type="radio" name="viewType" id="inlineRadio2"
                                        onChange={e => { inputChange(e); }} value="month" defaultChecked={inputData == 'month' ? true : false} />
                                    <label className="form-check-label mt-1" htmlFor="inlineRadio2">Month</label>
                                </div>
                                <div className="form-check form-check-inline col">
                                    <input className="form-check-input mt-2" type="radio" name="viewType" id="inlineRadio3"
                                        onChange={e => { inputChange(e); }} value="week" defaultChecked={inputData == 'week' ? true : false} />
                                    <label className="form-check-label mt-1" htmlFor="inlineRadio3">Week</label>
                                </div>
                                <div className="form-check form-check-inline col">
                                    <input className="form-check-input mt-2" type="radio" name="viewType" id="inlineRadio4"
                                        onChange={e => { inputChange(e); }} value="day" defaultChecked={inputData == 'day' ? true : false} />
                                    <label className="form-check-label mt-1" htmlFor="inlineRadio4">Day</label>
                                </div>
                                <div className="form-check form-check-inline col">
                                    <input className="form-check-input mt-2" type="radio" name="viewType" id="inlineRadio5"
                                        onChange={e => { inputChange(e); }} value="custom" defaultChecked={inputData == 'custom' ? true : false} />
                                    <label className="form-check-label mt-1" htmlFor="inlineRadio5">Custom</label>
                                </div>
                                <div className="form-check form-check-inline col-auto">
                                    <Select
                                        options={fileTypes}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        name="masterEquipmentTypeId"
                                        value={fileTypes.find(val => val === fileType)}
                                        placeholder="Select File Type to Download"
                                        onChange={e => {
                                            onChangeFileType(e.id);
                                        }}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.id}
                                    />
                                </div>
                            </div>
                            <div className='col-12 text-center'>
                                <div className="form-check form-check-inline">
                                    {inputData == 'year' && <Calendar
                                        onClickYear={(v, e) => onCalenderChange(v, e)}
                                        value={value}
                                        view="decade"
                                        calendarType="US"
                                        maxDate={maxGraph}
                                        className="calendar-year-view"
                                    />}
                                    {inputData == 'month' && <Calendar
                                        onClickMonth={(v, e) => onCalenderChange(v, e)}
                                        value={value}
                                        view="year"
                                        calendarType="US"
                                        maxDate={maxGraph}
                                        className="calendar-year-view"
                                    />}
                                    {(inputData == 'week' || inputData == 'day') && <Calendar
                                        onClickDay={(v, e) => onCalenderChange(v, e)}
                                        value={value}
                                        calendarType="US"
                                        maxDate={maxGraph}
                                        className="calendar-year-view"
                                    />}
                                    {inputData == 'custom' && <Calendar
                                        onChange={(v, e) => onCalenderChange(v, e)}
                                        value={value}
                                        calendarType="US"
                                        showDoubleView={true}
                                        selectRange={true}
                                        returnValue='range'
                                        maxDate={maxGraph}
                                        className="calendar-custom-view"
                                    />}
                                </div>
                            </div>
                            <div className="col-12">
                                <Table config={config} records={data} columns={columns} loading={isLoader}/>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default TaxReportOld