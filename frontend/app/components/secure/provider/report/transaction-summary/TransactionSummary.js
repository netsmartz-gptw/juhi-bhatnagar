import moment from 'moment'
import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import { Accordion, Icon, IconGroup } from 'semantic-ui-react'
import TransactionStatusEnum from '../../../../../common/enum/transaction-status.enum'
import ProviderDashboardService from '../../../../../services/api/provider-dashboard.service'
import Utilities from '../../../../../services/commonservice/utilities'
import Module from '../../../../templates/components/Module'
import Table from '../../../../templates/components/Table'
import Graph from '../Graph'

const TransactionSummary = (props) => {
    const [data, setData] = useState()
    const [offsetHour, setOffsetHour] = useState(moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60),)
    const [offsetMinute, setOffsetMinute] = useState(moment().utcOffset() % 60)
    const [slabBy, setSlabBy] = useState('Month')
    const [startDate, setStartDate] = useState(new Date(moment().startOf("D")).toISOString())
    const [endDate, setEndDate] = useState(new Date(moment().endOf("D").toISOString()))
    const [timePeriod, setTimePeriod] = useState("day")
    const [channelType, setChannelType] = useState(0)
    const [pointWidth, setPointWidth] = useState(3)
    const [typeData, setTypeData] = useState({ credit: [], ach: [], cash: [], check: [] })

    const [isLoader, setIsLoader] = useState(false)

    // States for report data 
    const [transactionStatusDetails, setTransactionStatusDetails] = useState()
    const [patientReportDetails, setPatientReportDetails] = useState()
    const [paymentCollectedTodayDetails, setPaymentCollectedTodayDetails] = useState()
    const [reportTransactionVolumeDetails, setReportTransactionVolumeDetails] = useState()
    const [outstandingReceivablesDetails, setOutstandingReceivablesDetails] = useState()
    const [selectedDateForReport, setSelectedDateForReport] = useState()
    // const [isWordMonth, setIsWordMonth] = useState(false)



    // Graph states 
    const [graphDetails, setGraphDetails] = useState()
    const [lineChart, setLineChart] = useState()
    const [lineChartLabels, setLineChartLabels] = useState()
    const [dataSet, setDataSet] = useState()
    const [selectedTransactionVolumeType, setSelectedTransactionVolumeType] = useState("totalSale")
    // const [selectedDateRangeForGraph, setSelectedDateRangeForGraph] = useState("year")
    // const [displayChart, setDisplayChart] = useState(false)
    const [slabs, setSlabs] = useState()

    const [thActiveIndex, setThActiveIndex] = useState(0)
    const [ptActiveIndex, setPtActiveIndex] = useState(0)


    // Constants for graph 
    const graphDetailsObject = {
        credit: {
            salesAmount: 0, transactionCount: 0, subTypes: {
                VISA: { channelSubType: 'VISA', salesAmount: 0, transactionCount: 0, average: 0 },
                MASTERCARD: { channelSubType: 'MASTERCARD', salesAmount: 0, transactionCount: 0, average: 0 },
                AMEX: { channelSubType: 'AMEX', salesAmount: 0, transactionCount: 0, average: 0 },
                DISCOVER: { channelSubType: 'DISCOVER', salesAmount: 0, transactionCount: 0, average: 0 },
                DINERS: { channelSubType: 'DINERS', salesAmount: 0, transactionCount: 0, average: 0 },
                JCB: { channelSubType: 'JCB', salesAmount: 0, transactionCount: 0, average: 0 }
            }
        },
        debit: {
            salesAmount: 0, transactionCount: 0, subTypes: {
                VISA: { channelSubType: 'VISA', salesAmount: 0, transactionCount: 0, average: 0 },
                MASTERCARD: { channelSubType: 'MASTERCARD', salesAmount: 0, transactionCount: 0, average: 0 },
                AMEX: { channelSubType: 'AMEX', salesAmount: 0, transactionCount: 0, average: 0 },
                DISCOVER: { channelSubType: 'DISCOVER', salesAmount: 0, transactionCount: 0, average: 0 },
                DINERS: { channelSubType: 'DINERS', salesAmount: 0, transactionCount: 0, average: 0 },
                JCB: { channelSubType: 'JCB', salesAmount: 0, transactionCount: 0, average: 0 }
            }
        },
        ach: {
            salesAmount: 0, transactionCount: 0, subTypes: {
                WEB: { channelSubType: 'WEB', salesAmount: 0, transactionCount: 0, average: 0 },
                TEL: { channelSubType: 'TEL', salesAmount: 0, transactionCount: 0, average: 0 },
                PPD: { channelSubType: 'PPD', salesAmount: 0, transactionCount: 0, average: 0 },
                CCD: { channelSubType: 'CCD', salesAmount: 0, transactionCount: 0, average: 0 }
            }
        },
        cash: {
            salesAmount: 0, transactionCount: 0, subTypes: {}
        },
        check: {
            salesAmount: 0, transactionCount: 0, subTypes: {}
        }
    };


    // jan - dec months wise graph
    const wordMonth = moment.monthsShort().map((value, index) => ({ index: index, month: value }));

    // Others
    const color = {
        red: '#ff0000',
        blue: '#2115ff',
        green: '#3b8004',
        pink: '#cc00ff',
        yellow: '#fdff00',
        purple: '#801580',
        orange: '#FFA500',
        black: '#000000'
    };

    // Api pull for report data 
    const getData = () => {
        setData()
        setIsLoader(true)
        let reqObj = { EndDate: new Date(endDate).toISOString(), StartDate: new Date(startDate).toISOString(), offsetHour: offsetHour, offsetMinute: offsetMinute, slabBy: slabBy };
        setTransactionStatusDetails()
        setReportTransactionVolumeDetails()
        setOutstandingReceivablesDetails()
        setGraphDetails()
        setPaymentCollectedTodayDetails()
        return ProviderDashboardService.getTransactionVolume(reqObj)
            .then(response => {
                console.log(response)
                if (!response) {
                    setData()
                    setTransactionStatusDetails()
                }
                else {
                    setData(response)
                    if (response !== undefined && Array.isArray(response)) {
                        response.forEach(resp => {
                            console.log(resp)
                            if (resp.transactionStatusReport !== undefined) {
                                console.log(resp.transactionStatusReport)
                                setTransactionStatusDetails(resp.transactionStatusReport)
                            }
                            if (resp.patientReport !== undefined) {
                                setPatientReportDetails({
                                    before24HrPatientCount: resp.patientReport.before24HrPatientCount,
                                    customPatientCount: resp.patientReport.customPatientCount,
                                    monthlyPatientRecord: resp.patientReport.monthlyPatientRecord,
                                    totalPatientRegistered: resp.patientReport.totalPatientRegistered,
                                    yearlyPatientRecord: resp.patientReport.yearlyPatientRecord
                                })
                            }
                            if (resp.paymentCollectedToday !== undefined && resp.paymentCollectedToday[0] !== undefined) {
                                setPaymentCollectedTodayDetails({
                                    totalAmount: resp.paymentCollectedToday[0].totalAmount,
                                    totalTransactionCount: resp.paymentCollectedToday[0].totalTransactionCount
                                })

                            }
                            if (resp.outstandingReceivables !== undefined && resp.outstandingReceivables[0] !== undefined) {
                                console.log(resp.outstandingReceivables[0])
                                setOutstandingReceivablesDetails({ totalOutstandingBalance: resp.outstandingReceivables[0].totalOutstandingBalance })
                            }
                            if (resp.paymetRecords !== undefined) {
                                let transactionVolumeDetails = { totalSale: {}, decline: {}, refund: {}, inProcess: {} }
                                resp.paymetRecords.operations.forEach(element => {
                                    switch (element.operationType) {
                                        case 'Sales':
                                            transactionVolumeDetails.totalSale.operationType = element.operationType;
                                            transactionVolumeDetails.totalSale.salesAmount = element.salesAmount;
                                            transactionVolumeDetails.totalSale.transactionCount = element.transactionCount;
                                            element.channels.forEach(element1 => {
                                                if (element1 !== undefined) {
                                                    switch (element1.channelType) {
                                                        case 'CC':
                                                            transactionVolumeDetails.totalSale.creditCard = element1;
                                                            break;
                                                        case 'Debit':
                                                            transactionVolumeDetails.totalSale.debitCard = element1;
                                                            break;
                                                        case 'ACH':
                                                            transactionVolumeDetails.totalSale.ach = element1;
                                                            break;
                                                        case 'Cash':
                                                            transactionVolumeDetails.totalSale.cash = element1;
                                                            break;
                                                        case 'Check':
                                                            transactionVolumeDetails.totalSale.check = element1;
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }
                                            });
                                            break;
                                        case 'Denied':
                                            transactionVolumeDetails.decline.operationType = element.operationType;
                                            transactionVolumeDetails.decline.salesAmount = element.salesAmount;
                                            transactionVolumeDetails.decline.transactionCount = element.transactionCount;
                                            element.channels.forEach(element1 => {
                                                if (element1 !== undefined) {
                                                    switch (element1.channelType) {
                                                        case 'CC':
                                                            transactionVolumeDetails.decline.creditCard = element1;
                                                            break;
                                                        case 'Debit':
                                                            transactionVolumeDetails.decline.debitCard = element1;
                                                            break;
                                                        case 'ACH':
                                                            transactionVolumeDetails.decline.ach = element1;
                                                            break;
                                                        case 'Cash':
                                                            transactionVolumeDetails.decline.cash = element1;
                                                            break;
                                                        case 'Check':
                                                            transactionVolumeDetails.decline.check = element1;
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }
                                            });
                                            break;
                                        case 'Refunded':
                                            transactionVolumeDetails.refund.operationType = element.operationType;
                                            transactionVolumeDetails.refund.salesAmount = element.salesAmount;
                                            transactionVolumeDetails.refund.transactionCount = element.transactionCount;
                                            element.channels.forEach(element1 => {
                                                if (element1 !== undefined) {
                                                    switch (element1.channelType) {
                                                        case 'CC':
                                                            transactionVolumeDetails.refund.creditCard = element1;
                                                            break;
                                                        case 'Debit':
                                                            transactionVolumeDetails.refund.debitCard = element1;
                                                            break;
                                                        case 'ACH':
                                                            transactionVolumeDetails.refund.ach = element1;
                                                            break;
                                                        case 'Cash':
                                                            transactionVolumeDetails.refund.cash = element1;
                                                            break;
                                                        case 'Check':
                                                            transactionVolumeDetails.refund.check = element1;
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }
                                            });
                                            break;
                                        case 'InProcess':
                                            transactionVolumeDetails.inProcess.operationType = element.operationType;
                                            transactionVolumeDetails.inProcess.salesAmount = element.salesAmount;
                                            transactionVolumeDetails.inProcess.transactionCount = element.transactionCount;
                                            element.channels.forEach(element1 => {
                                                if (element1 !== undefined) {
                                                    switch (element1.channelType) {
                                                        case 'CC':
                                                            transactionVolumeDetails.inProcess.creditCard = element1;
                                                            break;
                                                        case 'Debit':
                                                            transactionVolumeDetails.inProcess.debitCard = element1;
                                                            break;
                                                        case 'ACH':
                                                            transactionVolumeDetails.inProcess.ach = element1;
                                                            break;
                                                        case 'Cash':
                                                            transactionVolumeDetails.inProcess.cash = element1;
                                                            break;
                                                        case 'Check':
                                                            transactionVolumeDetails.inProcess.check = element1;
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }
                                            });

                                            break;
                                        default:
                                            break;
                                    }
                                    // console.log("Get Data complete, now create graph", transactionVolumeDetails)
                                    setReportTransactionVolumeDetails(transactionVolumeDetails)
                                    setIsLoader(false)
                                    // prepareGraphObject(selectedDateRangeForGraph, data);
                                    // return prepareGraphDetailsObject()

                                });
                            }
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err)
                setData()
                setTransactionStatusDetails()
                setIsLoader(false)
            })
    }

    const columns = [
        {
            key: "channelType",
            text: "Payment Method",
            // className: "name",
            align: "left",
            sortable: true,
            cell: (tc) => tc.channelType === 'CC' ? `Credit` : `${tc.channelType}`
        },
        {
            key: "operationType",
            text: "Transaction Type",
            // className: "name",
            align: "left",
            sortable: true,
        },
        {
            key: "transactionStatus",
            text: "Transaction Status",
            // className: "name",
            align: "left",
            sortable: true,
        },
        {
            key: "totalTransactions",
            text: "Total Transactions",
            // className: "name",
            align: "left",
            sortable: true,
        },
        {
            key: "totalSalesAmount",
            text: "Total Sales Amount",
            // className: "name",
            align: "left",
            sortable: true,
            cell: (tc) => Utilities.toDollar(tc.totalSalesAmount)
        },
    ]

    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "Transaction Summary Report",
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
        if (transactionStatusDetails && reportTransactionVolumeDetails) { prepareGraphDetailsObject() }
    }, [transactionStatusDetails, reportTransactionVolumeDetails])

    const onChangeSlabs = (data, { wordMonth: number }) => {
        let reqObj = {};
        let selectedTab = data;
        switch (data) {
            case 'year':
                reqObj.EndDate = moment(selectedDateForReport).endOf('y').toISOString();
                reqObj.StartDate = moment(selectedDateForReport).startOf('y').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                reqObj.slabBy = 'Month';

                break;
            case '3month':
                reqObj.EndDate = moment().endOf('d').toISOString();
                reqObj.StartDate = moment().subtract(3, 'months').startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                reqObj.slabBy = 'Week';
                break;
            case '1month':
                reqObj.EndDate = moment(selectedDateForReport).endOf('month').toISOString();
                reqObj.StartDate = moment(selectedDateForReport).startOf('month').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                reqObj.slabBy = 'DayMonth';
                break;
            case 'newmonth':
                reqObj.EndDate = moment(selectedDateForReport).endOf('month').toISOString();
                reqObj.StartDate = moment(selectedDateForReport).startOf('month').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                reqObj.slabBy = 'DayMonth';
                break;
            case 'customDayOfMonth':
                reqObj.EndDate = moment(selectedCustomDateRangeForReport.endDate).endOf('d').toISOString();
                reqObj.StartDate = moment(selectedCustomDateRangeForReport.startDate).startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                reqObj.slabBy = 'DayMonth';
                break;
            case 'customWeekOfMonth':
                reqObj.EndDate = moment(selectedCustomDateRangeForReport.endDate).endOf('d').toISOString();
                reqObj.StartDate = moment(selectedCustomDateRangeForReport.startDate).startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                reqObj.slabBy = 'Week';
                break;
            case 'customMonthOfYear':
                reqObj.EndDate = moment(selectedCustomDateRangeForReport.endDate).endOf('d').toISOString();
                reqObj.StartDate = moment(selectedCustomDateRangeForReport.startDate).startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                reqObj.slabBy = 'CustomYear';
                break;
            case 'week':
                reqObj.EndDate = moment(selectedDateForReport).endOf('d').toISOString();
                reqObj.StartDate = moment(selectedDateForReport).subtract(6, 'd').startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                reqObj.slabBy = 'Day';
                break;
            case 'day':
                reqObj.EndDate = moment(selectedDateForReport).endOf('d').toISOString();
                reqObj.StartDate = moment(selectedDateForReport).startOf('d').toISOString();
                reqObj.offsetHour = moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60);
                reqObj.offsetMinute = (moment().utcOffset() % 60);
                reqObj.slabBy = 'Hour';
                break;
            default:
                break;
        }
        newInitialReqObject = reqObj;
        getTransactionVolume(reqObj);
    }


    const drawLineChart = () => {
        console.log("drawLineChart")
        setLineChart({
            type: 'line',
            data: {
                labels: lineChartLabels || 'no labels',
                datasets: dataSet || 'no data'
            },
            options: {
                legend: { display: false },
                scales: {
                    xAxes: [{
                        ticks: {
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 90
                        }
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                        }
                    }],
                },
                tooltips: {
                    mode: 'index', displayColors: false,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ': $' + formatNumber(Number(tooltipItem.yLabel), "en-US", '1.2-2');
                        },
                        // footer: footer
                    }
                }
            }
        })
        return console.log(lineChart)
    }

    const resetTransactionVolumeDetailsObject = () => {
        setReportTransactionVolumeDetails({
            totalSale: {
                operationType: '',
                salesAmount: 0,
                transactionCount: 0,
                creditCard: { salesAmount: 0, slabs: [], transactionCount: 0 },
                debitCard: { salesAmount: 0, slabs: [], transactionCount: 0 },
                ach: { salesAmount: 0, slabs: [], transactionCount: 0 },
                cash: { salesAmount: 0, slabs: [], transactionCount: 0 },
                check: { salesAmount: 0, slabs: [], transactionCount: 0 },
                showDetails: (selectedTransactionVolumeType === 'totalSale') ? true : false
            },
            decline: {
                operationType: '',
                salesAmount: 0,
                transactionCount: 0,
                creditCard: { salesAmount: 0, slabs: [], transactionCount: 0 },
                debitCard: { salesAmount: 0, slabs: [], transactionCount: 0 },
                ach: { salesAmount: 0, slabs: [], transactionCount: 0 },
                cash: { salesAmount: 0, slabs: [], transactionCount: 0 },
                check: { salesAmount: 0, slabs: [], transactionCount: 0 },
                showDetails: (selectedTransactionVolumeType === 'decline') ? true : false
            },
            refund: {
                operationType: '',
                salesAmount: 0,
                transactionCount: 0,
                creditCard: { salesAmount: 0, slabs: [], transactionCount: 0 },
                debitCard: { salesAmount: 0, slabs: [], transactionCount: 0 },
                ach: { salesAmount: 0, slabs: [], transactionCount: 0 },
                cash: { salesAmount: 0, slabs: [], transactionCount: 0 },
                check: { salesAmount: 0, slabs: [], transactionCount: 0 },
                showDetails: (selectedTransactionVolumeType === 'refund') ? true : false
            },
            inProcess: {
                operationType: '', salesAmount: 0, transactionCount: 0,
                creditCard: { salesAmount: 0, slabs: [], transactionCount: 0 },
                debitCard: { salesAmount: 0, slabs: [], transactionCount: 0 },
                ach: { salesAmount: 0, slabs: [], transactionCount: 0 },
                cash: { salesAmount: 0, slabs: [], transactionCount: 0 },
                check: { salesAmount: 0, slabs: [], transactionCount: 0 },
                showDetails: (selectedTransactionVolumeType === 'inProcess') ? true : false
            },
        })
        // return console.log(reportTransactionVolumeDetails)
    }
    const prepareGraphDetailsObject = () => {
        let graphDetailsObject = {
            credit: {
                salesAmount: 0, transactionCount: 0, subTypes: {
                    VISA: { channelSubType: 'VISA', salesAmount: 0, transactionCount: 0, average: 0 },
                    MASTERCARD: { channelSubType: 'MASTERCARD', salesAmount: 0, transactionCount: 0, average: 0 },
                    AMEX: { channelSubType: 'AMEX', salesAmount: 0, transactionCount: 0, average: 0 },
                    DISCOVER: { channelSubType: 'DISCOVER', salesAmount: 0, transactionCount: 0, average: 0 },
                    DINERS: { channelSubType: 'DINERS', salesAmount: 0, transactionCount: 0, average: 0 },
                    JCB: { channelSubType: 'JCB', salesAmount: 0, transactionCount: 0, average: 0 }
                }
            },
            debit: {
                salesAmount: 0, transactionCount: 0, subTypes: {
                    VISA: { channelSubType: 'VISA', salesAmount: 0, transactionCount: 0, average: 0 },
                    MASTERCARD: { channelSubType: 'MASTERCARD', salesAmount: 0, transactionCount: 0, average: 0 },
                    AMEX: { channelSubType: 'AMEX', salesAmount: 0, transactionCount: 0, average: 0 },
                    DISCOVER: { channelSubType: 'DISCOVER', salesAmount: 0, transactionCount: 0, average: 0 },
                    DINERS: { channelSubType: 'DINERS', salesAmount: 0, transactionCount: 0, average: 0 },
                    JCB: { channelSubType: 'JCB', salesAmount: 0, transactionCount: 0, average: 0 }
                }
            },
            ach: {
                salesAmount: 0, transactionCount: 0, subTypes: {
                    WEB: { channelSubType: 'WEB', salesAmount: 0, transactionCount: 0, average: 0 },
                    TEL: { channelSubType: 'TEL', salesAmount: 0, transactionCount: 0, average: 0 },
                    PPD: { channelSubType: 'PPD', salesAmount: 0, transactionCount: 0, average: 0 },
                    CCD: { channelSubType: 'CCD', salesAmount: 0, transactionCount: 0, average: 0 }
                }
            },
            cash: {
                salesAmount: 0, transactionCount: 0, subTypes: {}
            },
            check: {
                salesAmount: 0, transactionCount: 0, subTypes: {}
            }
        };
        setGraphDetails(graphDetailsObject)
        console.log(reportTransactionVolumeDetails)
        let transactionVolumeDetails = reportTransactionVolumeDetails
        graphDetailsObject.credit.salesAmount = transactionVolumeDetails ? transactionVolumeDetails[selectedTransactionVolumeType].creditCard?.salesAmount : 0
        graphDetailsObject.credit.transactionCount = transactionVolumeDetails ? transactionVolumeDetails[selectedTransactionVolumeType].creditCard?.transactionCount : 0
        graphDetailsObject.credit.average = (graphDetailsObject.credit.transactionCount === 0) ? 0 : graphDetailsObject.credit.salesAmount / graphDetailsObject.credit.transactionCount
        graphDetailsObject.debit.salesAmount = transactionVolumeDetails[selectedTransactionVolumeType].debitCard ? transactionVolumeDetails[selectedTransactionVolumeType].debitCard?.salesAmount : 0
        graphDetailsObject.debit.transactionCount = transactionVolumeDetails[selectedTransactionVolumeType].debitCard ? transactionVolumeDetails[selectedTransactionVolumeType].debitCard?.transactionCount : 0
        graphDetailsObject.debit.average = (graphDetailsObject.debit.transactionCount === 0) ? 0 : graphDetailsObject.debit.salesAmount / graphDetailsObject.debit.transactionCount
        graphDetailsObject.ach.salesAmount = transactionVolumeDetails[selectedTransactionVolumeType].ach ? transactionVolumeDetails[selectedTransactionVolumeType].ach?.salesAmount : 0
        graphDetailsObject.ach.transactionCount = transactionVolumeDetails[selectedTransactionVolumeType].ach ? transactionVolumeDetails[selectedTransactionVolumeType].ach?.transactionCount : 0
        graphDetailsObject.ach.average = (graphDetailsObject.ach.transactionCount === 0) ? 0 : graphDetailsObject.ach.salesAmount / graphDetailsObject.ach.transactionCount

        graphDetailsObject.cash.salesAmount = transactionVolumeDetails[selectedTransactionVolumeType].cash ? transactionVolumeDetails[selectedTransactionVolumeType].cash?.salesAmount : 0
        graphDetailsObject.cash.transactionCount = transactionVolumeDetails[selectedTransactionVolumeType].cash ? transactionVolumeDetails[selectedTransactionVolumeType].cash?.transactionCount : 0
        graphDetailsObject.cash.average = (graphDetailsObject.cash.transactionCount === 0) ? 0 : graphDetailsObject.cash.salesAmount / graphDetailsObject.cash.transactionCount

        graphDetailsObject.check.salesAmount = transactionVolumeDetails[selectedTransactionVolumeType].check ? transactionVolumeDetails[selectedTransactionVolumeType].check?.salesAmount : 0
        graphDetailsObject.check.transactionCount = transactionVolumeDetails[selectedTransactionVolumeType].check ? transactionVolumeDetails[selectedTransactionVolumeType].check?.transactionCount : 0
        graphDetailsObject.check.average = (graphDetailsObject.check.transactionCount === 0) ? 0 : graphDetailsObject.check.salesAmount / graphDetailsObject.check.transactionCount
        let slabs1 = transactionVolumeDetails[selectedTransactionVolumeType].creditCard ? transactionVolumeDetails[selectedTransactionVolumeType].creditCard.slabs : null
        if (slabs1 !== null) {
            slabs1.forEach(slabElement => {
                slabElement?.subTypes.forEach(subTypeElement => {

                    if (graphDetailsObject.credit.subTypes[subTypeElement.channelSubType] == undefined) {
                        graphDetailsObject.credit.subTypes[subTypeElement.channelSubType] = {};
                    }
                    const salesAmount = (graphDetailsObject.credit.subTypes[subTypeElement.channelSubType].salesAmount == undefined) ? 0 : graphDetailsObject.credit.subTypes[subTypeElement.channelSubType].salesAmount;
                    const transactionCount = (graphDetailsObject.credit.subTypes[subTypeElement.channelSubType].transactionCount == undefined) ? 0 : graphDetailsObject.credit.subTypes[subTypeElement.channelSubType].transactionCount;
                    graphDetailsObject.credit.subTypes[subTypeElement.channelSubType].salesAmount = salesAmount + subTypeElement.salesAmount;
                    graphDetailsObject.credit.subTypes[subTypeElement.channelSubType].transactionCount = transactionCount + subTypeElement.transactionCount;
                    graphDetailsObject.credit.subTypes[subTypeElement.channelSubType].channelSubType = subTypeElement.channelSubType;
                    graphDetailsObject.credit.subTypes[subTypeElement.channelSubType].average = graphDetailsObject.credit.subTypes[subTypeElement.channelSubType].salesAmount / graphDetailsObject.credit.subTypes[subTypeElement.channelSubType].transactionCount;
                });
            });
        }
        let slabs2 = transactionVolumeDetails[selectedTransactionVolumeType].debitCard ? transactionVolumeDetails[selectedTransactionVolumeType].debitCard.slabs : null
        if (slabs2 !== null) {
            slabs2.forEach(slabElement => {
                slabElement?.subTypes.forEach(subTypeElement => {
                    if (graphDetailsObject.debit.subTypes[subTypeElement.channelSubType] == undefined) {
                        graphDetailsObject.debit.subTypes[subTypeElement.channelSubType] = {};
                    }
                    const salesAmount = (graphDetailsObject.debit.subTypes[subTypeElement.channelSubType].salesAmount == undefined) ? 0 : graphDetailsObject.debit.subTypes[subTypeElement.channelSubType].salesAmount;
                    const transactionCount = (graphDetailsObject.debit.subTypes[subTypeElement.channelSubType].transactionCount == undefined) ? 0 : graphDetailsObject.debit.subTypes[subTypeElement.channelSubType].transactionCount;
                    graphDetailsObject.debit.subTypes[subTypeElement.channelSubType].salesAmount = salesAmount + subTypeElement.salesAmount;
                    graphDetailsObject.debit.subTypes[subTypeElement.channelSubType].transactionCount = transactionCount + subTypeElement.transactionCount;
                    graphDetailsObject.debit.subTypes[subTypeElement.channelSubType].channelSubType = subTypeElement.channelSubType;
                    graphDetailsObject.debit.subTypes[subTypeElement.channelSubType].average = graphDetailsObject.debit.subTypes[subTypeElement.channelSubType].salesAmount / graphDetailsObject.debit.subTypes[subTypeElement.channelSubType].transactionCount;
                });
            });
        }
        let slabs3 = transactionVolumeDetails[selectedTransactionVolumeType].ach ? transactionVolumeDetails[selectedTransactionVolumeType].ach.slabs : null
        if (slabs3 !== null) {
            slabs3.forEach(slabElement => {
                slabElement?.subTypes.forEach(subTypeElement => {
                    if (graphDetailsObject.ach.subTypes[subTypeElement.channelSubType] == undefined) {
                        graphDetailsObject.ach.subTypes[subTypeElement.channelSubType] = {};
                    }
                    const salesAmount = (graphDetailsObject.ach.subTypes[subTypeElement.channelSubType].salesAmount == undefined) ? 0 : graphDetailsObject.ach.subTypes[subTypeElement.channelSubType].salesAmount;
                    const transactionCount = (graphDetailsObject.ach.subTypes[subTypeElement.channelSubType].transactionCount == undefined) ? 0 : graphDetailsObject.ach.subTypes[subTypeElement.channelSubType].transactionCount;
                    graphDetailsObject.ach.subTypes[subTypeElement.channelSubType].salesAmount = salesAmount + subTypeElement.salesAmount;
                    graphDetailsObject.ach.subTypes[subTypeElement.channelSubType].transactionCount = transactionCount + subTypeElement.transactionCount;
                    graphDetailsObject.ach.subTypes[subTypeElement.channelSubType].channelSubType = subTypeElement.channelSubType;
                    graphDetailsObject.ach.subTypes[subTypeElement.channelSubType].average = graphDetailsObject.ach.subTypes[subTypeElement.channelSubType].salesAmount / graphDetailsObject.ach.subTypes[subTypeElement.channelSubType].transactionCount;
                });
            });
        }
        console.log("finished graph Details", graphDetailsObject)
        // setSlabs(slabs)
        setGraphDetails(graphDetailsObject)
    }

    const icons = {
        blank: 'credit-card',
        AMEX: 'cc amex',
        DINERS: 'cc diners club',
        DISCOVER: 'cc discover',
        JCB: 'cc jcb',
        MASTERCARD: 'cc mastercard',
        VISA: 'cc visa'
    }

    const cards = [
        'AMEX', 'DINERS', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'
    ]

    const banks = [
        'CCD', 'PAYFORM', 'PPD', 'TEL', 'WEB '
    ]


    const changeStart = (date) => {
        if (typeof date == 'date') {
            if (timePeriod === "quarter") {
                setStartDate(moment(date).startOf("quarter"))
                setEndDate(moment(date).add(2, "M").endOf("M"))
            }
            else if (timePeriod !== "custom") {
                setStartDate(moment(date).startOf(timePeriod[0].toLocaleUpperCase()))
                setEndDate(moment(date).endOf(timePeriod[0].toLocaleUpperCase()))
            }
        }
        // getData()
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
        getData()
    }, [])

    return (
        <div
            className="row-fluid g-4"
            id="primary"
            role="tabpanel"
            aria-labelledby="primary-tab"
        >
            <div className="row g-4">
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
                                {/* {timePeriod} */}
                                {/* {startDate.toLocaleString()} */}
                                {/* {endDate.toLocaleString()} */}
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
                                        <select className="form-select" value={moment(startDate).month() + 1} onChange={e => { e.preventDefault(); console.log(moment(startDate).startOf("M").month(e.target.value - 1).toISOString()); setStartDate(new Date(moment(startDate).startOf("M").month(e.target.value - 1))); setEndDate(new Date(moment(endDate).month(e.target.value - 1).endOf('M'))); }}>
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
                                        <input type="date" value={Utilities.toDate(startDate)} onChange={e => { e.preventDefault(); setStartDate(e.target.value) }} onBlur={e => { e.preventDefault(); changeStart(startDate) }} disabled={timePeriod !== 'day' && timePeriod !== 'week' && timePeriod !== 'custom'} />
                                    </div>
                                </div> : null}
                                {timePeriod === 'custom' && <div className='col'>
                                    <div className='ui field'>
                                        <label>End Date</label>
                                        <input type="date" value={endDate} onChange={e => { e.preventDefault(); setEndDate(e.target.value); }} disabled={timePeriod !== "custom"} />
                                    </div>
                                </div>}
                                <div className="col-auto"><button className="btn btn-primary" onClick={e => { e.preventDefault(); getData() }} title="Pull Report"><i className="icon arrow circle right" /></button></div>
                            </div>
                        </div>
                    </Module>
                </div>
                <div className="col-md-6 col-12">
                    <Module
                        title="Transaction History"
                        id="transactionHistory"
                        accordianId="transactionHistory"
                        icon="chart pie"
                        modalSize="small"
                    >
                        <Accordion fluid styled>
                            <Accordion.Title
                                active={thActiveIndex === 0}
                                index={0}
                                onClick={e => { e.preventDefault(); if (thActiveIndex === 0) { setThActiveIndex() } else { setThActiveIndex(0) } }}
                            > <Icon name='dropdown' />
                                <i className="icon calculator green" />
                                <span className="w-100px">
                                    Payments</span><span>{reportTransactionVolumeDetails?.totalSale?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails.totalSale.salesAmount) : '$0.00'}
                                </span>
                            </Accordion.Title>
                            <Accordion.Content active={thActiveIndex === 0}>
                                <div className="col-12 d-flex row ps-4">
                                    <div className="col-12">
                                        <i className="credit card outline icon" />
                                        <span className="w-100px">Credit</span><span>{reportTransactionVolumeDetails?.totalSale?.creditCard?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.totalSale?.creditCard?.salesAmount) : '$0.00'}</span>
                                    </div>
                                    <div className="col-12">
                                        <i className="credit card outline icon" />
                                        <span className="w-100px">Debit</span><span>{reportTransactionVolumeDetails?.totalSale?.debitCard?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.totalSale?.debitCard?.salesAmount) : '$0.00'}</span>
                                    </div>

                                    <div className="col-12">
                                        <i className="money bill alternate outline icon" />
                                        <span className="w-100px">ACH</span><span>{reportTransactionVolumeDetails?.totalSale?.ach?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.totalSale?.ach?.salesAmount) : '$0.00'}</span>
                                    </div>

                                    <div className="col-12">
                                        <i className="money bill alternate outline icon" />
                                        <span className="w-100px">Cash</span><span>{reportTransactionVolumeDetails?.totalSale?.cash?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.totalSale?.cash?.salesAmount) : '$0.00'}</span>
                                    </div>

                                    <div className="col-12">
                                        <i className="money bill alternate outline icon" />
                                        <span className="w-100px">Check</span><span>{reportTransactionVolumeDetails?.totalSale?.check?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.totalSale?.check?.salesAmount) : `$0.00`}</span>
                                    </div>
                                </div>
                            </Accordion.Content>
                            <Accordion.Title
                                active={thActiveIndex === 1}
                                index={1}
                                onClick={e => { e.preventDefault(); if (thActiveIndex === 1) { setThActiveIndex() } else { setThActiveIndex(1) } }}
                            > <Icon name='dropdown' />
                                <i className="calendar minus outline middle aligned icon blue col-2" />
                                <span className="w-100px">Refunds </span><span>{reportTransactionVolumeDetails?.refund?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.refund?.salesAmount) : '$0.00'}</span>
                            </Accordion.Title>
                            <Accordion.Content active={thActiveIndex === 1}>
                                <div className="col-12 d-flex row ps-4">
                                    <div className="col-12">
                                        <i className="credit card outline icon" />
                                        <span className="w-100px">Credit</span><span>{reportTransactionVolumeDetails?.refund?.creditCard?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.refund?.creditCard?.salesAmount) : '$0.00'}</span>
                                    </div>
                                    <div className="col-12">
                                        <i className="credit card outline icon" />
                                        <span className="w-100px">Debit</span><span>{reportTransactionVolumeDetails?.refund?.debitCard?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.refund?.debitCard?.salesAmount) : '$0.00'}</span>
                                    </div>

                                    <div className="col-12">
                                        <i className="money bill alternate outline icon" />
                                        <span className="w-100px">ACH</span><span>{reportTransactionVolumeDetails?.refund?.ach?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.refund?.ach?.salesAmount) : '$0.00'}</span>
                                    </div>

                                    <div className="col-12">
                                        <i className="money bill alternate outline icon" />
                                        <span className="w-100px">Cash</span><span>{reportTransactionVolumeDetails?.refund?.cash?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.refund?.cash?.salesAmount) : '$0.00'}</span>
                                    </div>

                                    <div className="col-12">
                                        <i className="money bill alternate outline icon" />
                                        <span className="w-100px">Check</span><span>{reportTransactionVolumeDetails?.refund?.check?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.refund?.check?.salesAmount) : '$0.00'}</span>
                                    </div>
                                </div>
                            </Accordion.Content>
                            <Accordion.Title
                                active={thActiveIndex === 2}
                                index={2}
                                onClick={e => { e.preventDefault(); if (thActiveIndex === 2) { setThActiveIndex() } else { setThActiveIndex(2) } }}
                            > <Icon name='dropdown' />
                                <i className="calendar plus outline middle aligned icon red col-2" />
                                <span className="w-100px">Declines</span><span>{reportTransactionVolumeDetails && Utilities.toDollar(parseInt(reportTransactionVolumeDetails.decline.salesAmount || 0))}</span>
                            </Accordion.Title>
                            <Accordion.Content active={thActiveIndex === 2}>
                                <div className="col-12 d-flex row ps-4">
                                    <div className="col-12">
                                        <i className="credit card outline icon" />
                                        <span className="w-100px">Credit</span><span>{reportTransactionVolumeDetails?.decline?.creditCard?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.decline?.creditCard?.salesAmount) : '$0.00'}</span>
                                    </div>
                                    <div className="col-12">
                                        <i className="credit card outline icon" />
                                        <span className="w-100px">Debit</span><span>{reportTransactionVolumeDetails?.decline?.debitCard?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.decline?.debitCard?.salesAmount) : '$0.00'}</span>
                                    </div>

                                    <div className="col-12">
                                        <i className="money bill alternate outline icon" />
                                        <span className="w-100px">ACH</span><span>{reportTransactionVolumeDetails?.decline?.ach?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.decline?.ach?.salesAmount) : '$0.00'}</span>
                                    </div>

                                    <div className="col-12">
                                        <i className="money bill alternate outline icon" />
                                        <span className="w-100px">Cash</span><span>{reportTransactionVolumeDetails?.decline?.cash?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.decline?.cash?.salesAmount) : '$0.00'}</span>
                                    </div>

                                    <div className="col-12">
                                        <i className="money bill alternate outline icon" />
                                        <span className="w-100px">Check</span><span>{reportTransactionVolumeDetails?.decline?.check?.salesAmount ? Utilities.toDollar(reportTransactionVolumeDetails?.decline?.check?.salesAmount) : '$0.00'}</span>
                                    </div>
                                </div>
                            </Accordion.Content>
                        </Accordion>
                    </Module>
                </div >
                <div className='col-md-6 col-12'>
                    <Module
                        title="Payments by Type"
                        icon=""
                        modalSize="small"
                    >
                        <Accordion fluid styled>
                            <Accordion.Title
                                active={ptActiveIndex === 0}
                                index={0}
                                onClick={e => { e.preventDefault(); if (ptActiveIndex === 0) { setPtActiveIndex() } else { setPtActiveIndex(0) } }}
                            >
                                {graphDetails && <Icon name='dropdown' />}
                                <i className={`credit card outline icon ${!graphDetails && 'ps-4 pe-3'}`} />
                                <span className="w-100px">Credit</span>{Utilities.toDollar(graphDetails?.credit?.salesAmount || 0)}
                            </Accordion.Title>
                            <Accordion.Content active={ptActiveIndex === 0 && graphDetails}>
                                {graphDetails && cards.map((card, i) => {
                                    if (graphDetails.credit.subTypes[card]) {
                                        // console.log(card)
                                        return (
                                            <div className="col-12 ps-4">
                                                <i className={`icon ${icons[graphDetails.credit.subTypes[card].channelSubType]}`} />
                                                <span className="w-100px">{graphDetails.credit.subTypes[card].channelSubType}</span><span>{graphDetails.credit.subTypes[card].salesAmount ? Utilities.toDollar(graphDetails.credit.subTypes[card].salesAmount) : '$0.00'}</span>
                                            </div>
                                        )
                                    }
                                })}
                            </Accordion.Content>
                            <Accordion.Title
                                active={ptActiveIndex === 1}
                                index={1}
                                onClick={e => { e.preventDefault(); if (ptActiveIndex === 1) { setPtActiveIndex() } else { setPtActiveIndex(1) } }}
                            >
                                {graphDetails && <Icon name='dropdown' />}
                                <i className={`credit card outline icon ${!graphDetails && 'ps-4 pe-3'}`} />
                                <span className="w-100px">ACH</span>{Utilities.toDollar(graphDetails?.ach?.salesAmount || 0)}
                            </Accordion.Title>
                            <Accordion.Content active={ptActiveIndex === 1 && graphDetails}>
                                {graphDetails && banks.map((bank, i) => {
                                    if (graphDetails.ach.subTypes[bank]) {
                                        // console.log(card)
                                        return (
                                            <div className="col-12 ps-4">
                                                <i className={`icon dollar`} />
                                                <span className="w-100px">{graphDetails.ach.subTypes[bank].channelSubType}</span><span>{graphDetails.ach.subTypes[bank].salesAmount ? Utilities.toDollar(graphDetails.ach.subTypes[bank].salesAmount) : '$0.00'}</span>
                                            </div>
                                        )
                                    }
                                })}
                            </Accordion.Content>
                            <Accordion.Title
                                active={true}
                                index={2}
                            // onClick={e => { e.preventDefault(); if (ptActiveIndex === 2) { setPtActiveIndex() } else { setPtActiveIndex(2) } }}
                            >
                                {/* <Icon name='dropdown' /> */}
                                <i className="money bill alternate outline icon ms-4" />
                                <span className="w-100px">Cash</span>{Utilities.toDollar(graphDetails?.cash?.salesAmount || 0)}
                            </Accordion.Title>
                            <Accordion.Content
                            // active={ptActiveIndex === 2}
                            >
                                <div className="col-12 ps-4">
                                    <i className={`icon dollar`} />
                                    <span>Cash - {Utilities.toDollar(graphDetails?.cash?.salesAmount || 0)}</span>
                                </div>
                            </Accordion.Content>
                            <Accordion.Title
                                active={true}
                                index={3}
                            // onClick={e => { e.preventDefault(); if (ptActiveIndex === 3) { setPtActiveIndex() } else { setPtActiveIndex(3) } }}
                            >
                                {/* <Icon name='dropdown' /> */}
                                <i className="money bill alternate outline icon ms-4" />
                                <span className="w-100px">Check</span>{Utilities.toDollar(graphDetails?.check?.salesAmount || 0)}
                            </Accordion.Title>
                            <Accordion.Content
                            //  active={ptActiveIndex === 3}
                            >
                                <div className="col-12 ps-4">
                                    <i className={`icon dollar`} />
                                    <span>Check - {Utilities.toDollar(graphDetails?.check?.salesAmount || 0)}</span>
                                </div>
                            </Accordion.Content>
                        </Accordion>
                    </Module>
                </div>
                <div className="col-md-6 col-12">
                    <Module
                        title="Scheduled Payments Collected Today"
                        icon="calendar outline check"
                        modalSize="small"
                    >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Total Amount</span>
                            <span className="badge bg-primary">{paymentCollectedTodayDetails?.totalAmount ? Utilities.toDollar(paymentCollectedTodayDetails.totalAmount) : '$0.00'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>Total Count</span>
                            <span className="badge bg-primary">{paymentCollectedTodayDetails && paymentCollectedTodayDetails.totalTransactionCount || 0}</span>
                        </div>
                    </Module>
                </div>
                <div className="col-md-6 col-12">
                    <Module
                        title="Outstanding Receivables"
                        icon="money bill alternate outline"
                        modalSize="small"
                    >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Total Outstanding Balance</span>
                            <span className="badge bg-primary">{outstandingReceivablesDetails && Utilities.toDollar(outstandingReceivablesDetails.totalOutstandingBalance || 0)}</span>
                        </div>
                    </Module>
                </div>
                <div className='col-12'>
                    <Module title="Transaction Status">
                        <Table loading={isLoader} columns={columns} config={config} records={transactionStatusDetails} />
                        {/* <div className="scroll-list row m-3" style={{ maxHeight: "50vh" }}>
                            {transactionStatusDetails?.length>0 && transactionStatusDetails ? transactionStatusDetails.map((tc, i) => {
                                console.log(transactionStatusDetails)
                                return (
                                    <div className='card mb-3 p-3'>
                                        <div className='row'>
                                            <div className="col">{tc.channelType === 'CC' ? 'Credit' : tc.channelType} ({tc.operationType}) </div>
                                            <div className="col">Status: {tc.transactionStatus}</div>
                                            <div className="col">Total Transactions: {tc.totalTransactions}</div>
                                            <div className="col">Total Sales Amount: {Utilities.toDollar(tc.totalSalesAmount)}</div>
                                        </div>
                                    </div>
                                )
                            }):<span className="ui warning message mt-3 segment p-3 shadow-sm">There are no Transactions for this time period.</span>}
                        </div> */}
                    </Module>
                </div>
            </div >
        </div >
    )
}
export default TransactionSummary

    // // Data prep for chart

    // const prepareGraphObject = (data, originalReqObj) => {
    //     let transactionVolumeDetails = reportTransactionVolumeDetails || {}
    //     const ccDataSet = { label: 'Credit Card', data: [], borderColor: color.green, backgroundColor: color.green, fill: false, borderWidth: '1', pointRadius: [] };
    //     const ccVisaDataSet = { label: 'VISA', data: [], borderColor: color.orange, backgroundColor: color.orange, fill: false, borderWidth: '1', pointRadius: [] };
    //     const ccMasterCardDataSet = { label: 'MASTERCARD', data: [], borderColor: color.blue, backgroundColor: color.blue, fill: false, borderWidth: '1', pointRadius: [] };
    //     const ccAmexDataSet = { label: 'AMEX', data: [], borderColor: color.green, backgroundColor: color.green, fill: false, borderWidth: '1', pointRadius: [] };
    //     const ccDiscoverDataSet = { label: 'DISCOVER', data: [], borderColor: color.yellow, backgroundColor: color.yellow, fill: false, borderWidth: '1', pointRadius: [] };
    //     const ccDinersDataSet = { label: 'DINERS', data: [], borderColor: color.pink, backgroundColor: color.pink, fill: false, borderWidth: '1', pointRadius: [] };
    //     const ccJcbDataSet = { label: 'JCB', data: [], borderColor: color.purple, backgroundColor: color.purple, fill: false, borderWidth: '1', pointRadius: [] };

    //     const dcDataSet = { label: 'Debit Card', data: [], borderColor: color.blue, backgroundColor: color.blue, fill: false, borderWidth: '1', pointRadius: [] };
    //     const dcVisaDataSet = { label: 'VISA', data: [], borderColor: color.red, backgroundColor: color.red, fill: false, borderWidth: '1', pointRadius: [] };
    //     const dcMasterCardDataSet = { label: 'MASTERCARD', data: [], borderColor: color.blue, backgroundColor: color.blue, fill: false, borderWidth: '1', pointRadius: [] };
    //     const dcAmexDataSet = { label: 'AMEX', data: [], borderColor: color.green, backgroundColor: color.green, fill: false, borderWidth: '1', pointRadius: [] };
    //     const dcDiscoverDataSet = { label: 'DISCOVER', data: [], borderColor: color.yellow, backgroundColor: color.yellow, fill: false, borderWidth: '1', pointRadius: [] };
    //     const dcDinersDataSet = { label: 'DINERS', data: [], borderColor: color.pink, backgroundColor: color.pink, fill: false, borderWidth: '1', pointRadius: [] };
    //     const dcJcbDataSet = { label: 'JCB', data: [], borderColor: color.purple, backgroundColor: color.purple, fill: false, borderWidth: '1', pointRadius: [] };

    //     const achDataSet = { label: 'ACH', data: [], borderColor: color.orange, backgroundColor: color.orange, fill: false, borderWidth: '1', pointRadius: [] };
    //     const achWebDataSet = { label: 'WEB', data: [], borderColor: color.red, backgroundColor: color.red, fill: false, borderWidth: '1', pointRadius: [] };
    //     const achTelDataSet = { label: 'TEL', data: [], borderColor: color.blue, backgroundColor: color.blue, fill: false, borderWidth: '1', pointRadius: [] };
    //     const achCcdDataSet = { label: 'CCD', data: [], borderColor: color.green, backgroundColor: color.green, fill: false, borderWidth: '1', pointRadius: [] };
    //     const achPpdDataSet = { label: 'PPD', data: [], borderColor: color.yellow, backgroundColor: color.yellow, fill: false, borderWidth: '1', pointRadius: [] };

    //     const cashDataSet = { label: 'Cash', data: [], borderColor: color.purple, backgroundColor: color.purple, fill: false, borderWidth: '1', pointRadius: [] };

    //     const checkDataSet = { label: 'Check', data: [], borderColor: color.yellow, backgroundColor: color.yellow, fill: false, borderWidth: '1', pointRadius: [] };
    //     let startDate;
    //     let endDate;
    //     let months;
    //     let count2;
    //     let canvasLabel;
    //     switch (data) {
    //         case 'year':
    //             months = moment.months();
    //             count2 = 0;
    //             canvasLabel = moment(selectedDateForReport).format('YYYY');
    //             months.forEach(yearMonth => {
    //                 ccVisaDataSet.data.push(0);
    //                 ccVisaDataSet.pointRadius.push(0);
    //                 ccMasterCardDataSet.data.push(0);
    //                 ccMasterCardDataSet.pointRadius.push(0);
    //                 ccAmexDataSet.data.push(0);
    //                 ccAmexDataSet.pointRadius.push(0);
    //                 ccDiscoverDataSet.data.push(0);
    //                 ccDiscoverDataSet.pointRadius.push(0);
    //                 ccDinersDataSet.data.push(0);
    //                 ccDinersDataSet.pointRadius.push(0);
    //                 ccJcbDataSet.data.push(0);
    //                 ccJcbDataSet.pointRadius.push(0);
    //                 dcVisaDataSet.data.push(0);
    //                 dcVisaDataSet.pointRadius.push(0);
    //                 dcMasterCardDataSet.data.push(0);
    //                 dcMasterCardDataSet.pointRadius.push(0);
    //                 dcAmexDataSet.data.push(0);
    //                 dcAmexDataSet.pointRadius.push(0);
    //                 dcDiscoverDataSet.data.push(0);
    //                 dcDiscoverDataSet.pointRadius.push(0);
    //                 dcDinersDataSet.data.push(0);
    //                 dcDinersDataSet.pointRadius.push(0);
    //                 dcJcbDataSet.data.push(0);
    //                 dcJcbDataSet.pointRadius.push(0);
    //                 achWebDataSet.data.push(0);
    //                 achWebDataSet.pointRadius.push(0);
    //                 achTelDataSet.data.push(0);
    //                 achTelDataSet.pointRadius.push(0);
    //                 achPpdDataSet.data.push(0);
    //                 achPpdDataSet.pointRadius.push(0);
    //                 achCcdDataSet.data.push(0);
    //                 achCcdDataSet.pointRadius.push(0);
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j] !== undefined
    //                         && yearMonth === transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].slab) {
    //                         ccDataSet.data.push(Utilities.toDollar(transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].salesAmount));
    //                         ccDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '3') { // Credit Card
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         ccVisaDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccVisaDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         ccMasterCardDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccMasterCardDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         ccAmexDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccAmexDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         ccDiscoverDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDiscoverDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         ccDinersDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDinersDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         ccJcbDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccJcbDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length === 0) {
    //                         ccDataSet.pointRadius.push(0);
    //                         ccDataSet.data.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j] !== undefined
    //                         && yearMonth === transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].slab) {
    //                         dcDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].salesAmount);
    //                         dcDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '4') { // Debit Card
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         dcVisaDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcVisaDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         dcMasterCardDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcMasterCardDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         dcAmexDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcAmexDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         dcDiscoverDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDiscoverDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         dcDinersDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDinersDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         dcJcbDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcJcbDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length === 0) {
    //                         dcDataSet.data.push(0);
    //                         dcDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j] !== undefined
    //                         && yearMonth === transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].slab) {
    //                         achDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].salesAmount);
    //                         achDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '2') { // ACH
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'WEB':
    //                                         achWebDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achWebDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'TEL':
    //                                         achTelDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achTelDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'CCD':
    //                                         achCcdDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achCcdDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'PPD':
    //                                         achPpdDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achPpdDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length === 0) {
    //                         achDataSet.pointRadius.push(0);
    //                         achDataSet.data.push(0);

    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j] !== undefined
    //                         && yearMonth === transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].slab) {
    //                         cashDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].salesAmount);
    //                         cashDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length === 0) {
    //                         cashDataSet.data.push(0);
    //                         cashDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j] !== undefined
    //                         && yearMonth === transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].slab) {
    //                         checkDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].salesAmount);
    //                         checkDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length === 0) {
    //                         checkDataSet.data.push(0);
    //                         checkDataSet.pointRadius.push(0);
    //                     }
    //                 }

    //                 count2++;
    //             })
    //             setLineChartLabels(months)
    //             break;
    //         case 'customMonthOfYear':
    //             months = [];
    //             count2 = 0;
    //             canvasLabel = moment(selectedCustomDateRangeForReport.startDate).format('DD MMM YYYY') + "-" + moment(selectedCustomDateRangeForReport.endDate).format('DD MMM YYYY');
    //             let startDate2 = selectedCustomDateRangeForReport.startDate
    //             while (moment(startDate2).add(count2, 'M') <= moment(selectedCustomDateRangeForReport.endDate)) {
    //                 months.push(moment(startDate2).add(count2, 'M').format('MMMM YYYY'));
    //                 let yearMonth = months[count2];
    //                 //startDate2 = moment(startDate2).add(1, 'M');
    //                 ccVisaDataSet.data.push(0);
    //                 ccVisaDataSet.pointRadius.push(0);
    //                 ccMasterCardDataSet.data.push(0);
    //                 ccMasterCardDataSet.pointRadius.push(0);
    //                 ccAmexDataSet.data.push(0);
    //                 ccAmexDataSet.pointRadius.push(0);
    //                 ccDiscoverDataSet.data.push(0);
    //                 ccDiscoverDataSet.pointRadius.push(0);
    //                 ccDinersDataSet.data.push(0);
    //                 ccDinersDataSet.pointRadius.push(0);
    //                 ccJcbDataSet.data.push(0);
    //                 ccJcbDataSet.pointRadius.push(0);
    //                 dcVisaDataSet.data.push(0);
    //                 dcVisaDataSet.pointRadius.push(0);
    //                 dcMasterCardDataSet.data.push(0);
    //                 dcMasterCardDataSet.pointRadius.push(0);
    //                 dcAmexDataSet.data.push(0);
    //                 dcAmexDataSet.pointRadius.push(0);
    //                 dcDiscoverDataSet.data.push(0);
    //                 dcDiscoverDataSet.pointRadius.push(0);
    //                 dcDinersDataSet.data.push(0);
    //                 dcDinersDataSet.pointRadius.push(0);
    //                 dcJcbDataSet.data.push(0);
    //                 dcJcbDataSet.pointRadius.push(0);
    //                 achWebDataSet.data.push(0);
    //                 achWebDataSet.pointRadius.push(0);
    //                 achTelDataSet.data.push(0);
    //                 achTelDataSet.pointRadius.push(0);
    //                 achPpdDataSet.data.push(0);
    //                 achPpdDataSet.pointRadius.push(0);
    //                 achCcdDataSet.data.push(0);
    //                 achCcdDataSet.pointRadius.push(0);
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j] !== undefined
    //                         && yearMonth === transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].slab) {
    //                         ccDataSet.data.push(Utilities.toDollar(transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].salesAmount));
    //                         ccDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '3') { // Credit Card
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         ccVisaDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccVisaDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         ccMasterCardDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccMasterCardDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         ccAmexDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccAmexDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         ccDiscoverDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDiscoverDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         ccDinersDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDinersDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         ccJcbDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccJcbDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length === 0) {
    //                         ccDataSet.pointRadius.push(0);
    //                         ccDataSet.data.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j] !== undefined
    //                         && yearMonth === transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].slab) {
    //                         dcDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].salesAmount);
    //                         dcDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '4') { // Debit Card
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         dcVisaDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcVisaDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         dcMasterCardDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcMasterCardDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         dcAmexDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcAmexDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         dcDiscoverDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDiscoverDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         dcDinersDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDinersDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         dcJcbDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcJcbDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length === 0) {
    //                         dcDataSet.data.push(0);
    //                         dcDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j] !== undefined
    //                         && yearMonth === transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].slab) {
    //                         achDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].salesAmount);
    //                         achDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '2') { // ACH
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'WEB':
    //                                         achWebDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achWebDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'TEL':
    //                                         achTelDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achTelDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'CCD':
    //                                         achCcdDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achCcdDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     case 'PPD':
    //                                         achPpdDataSet.data[count2] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achPpdDataSet.pointRadius[count2] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length === 0) {
    //                         achDataSet.pointRadius.push(0);
    //                         achDataSet.data.push(0);

    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j] !== undefined
    //                         && yearMonth === transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].slab) {
    //                         cashDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].salesAmount);
    //                         cashDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length === 0) {
    //                         cashDataSet.data.push(0);
    //                         cashDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j] !== undefined
    //                         && yearMonth === transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].slab) {
    //                         checkDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].salesAmount);
    //                         checkDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length === 0) {
    //                         checkDataSet.data.push(0);
    //                         checkDataSet.pointRadius.push(0);
    //                     }
    //                 }

    //                 count2++;
    //             }
    //             setLineChartLabels(months)
    //             break;

    //         case '3month':
    //             const weekDates1 = [];
    //             let startDate1 = moment().subtract(3, 'M');
    //             canvasLabel = moment(startDate1).format('MM') + '-' + moment(startDate1).add(3, 'M').format('MM');
    //             // weekDates1.push(moment(startDate1).format('DD-MMM'));
    //             while (moment(startDate1).add(1, 'w') <= moment()) {
    //                 weekDates1.push(moment(startDate1).add(1, 'w').format('DD-MMM'));
    //                 startDate1 = moment(startDate1).add(1, 'w');
    //                 ccVisaDataSet.data.push(0);
    //                 ccVisaDataSet.pointRadius.push(0);
    //                 ccMasterCardDataSet.data.push(0);
    //                 ccMasterCardDataSet.pointRadius.push(0);
    //                 ccAmexDataSet.data.push(0);
    //                 ccAmexDataSet.pointRadius.push(0);
    //                 ccDiscoverDataSet.data.push(0);
    //                 ccDiscoverDataSet.pointRadius.push(0);
    //                 ccDinersDataSet.data.push(0);
    //                 ccDinersDataSet.pointRadius.push(0);
    //                 ccJcbDataSet.data.push(0);
    //                 ccJcbDataSet.pointRadius.push(0);
    //                 dcVisaDataSet.data.push(0);
    //                 dcVisaDataSet.pointRadius.push(0);
    //                 dcMasterCardDataSet.data.push(0);
    //                 dcMasterCardDataSet.pointRadius.push(0);
    //                 dcAmexDataSet.data.push(0);
    //                 dcAmexDataSet.pointRadius.push(0);
    //                 dcDiscoverDataSet.data.push(0);
    //                 dcDiscoverDataSet.pointRadius.push(0);
    //                 dcDinersDataSet.data.push(0);
    //                 dcDinersDataSet.pointRadius.push(0);
    //                 dcJcbDataSet.data.push(0);
    //                 dcJcbDataSet.pointRadius.push(0);
    //                 achWebDataSet.data.push(0);
    //                 achWebDataSet.pointRadius.push(0);
    //                 achTelDataSet.data.push(0);
    //                 achTelDataSet.pointRadius.push(0);
    //                 achPpdDataSet.data.push(0);
    //                 achPpdDataSet.pointRadius.push(0);
    //                 achCcdDataSet.data.push(0);
    //                 achCcdDataSet.pointRadius.push(0);
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j] !== undefined
    //                         && moment(startDate1).week() == transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].slab) {
    //                         ccDataSet.data.push(Utilities.toDollar(transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].salesAmount));
    //                         ccDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '3') { // Credit Card
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         ccVisaDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccVisaDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         ccMasterCardDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccMasterCardDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         ccAmexDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccAmexDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         ccDiscoverDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDiscoverDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         ccDinersDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDinersDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         ccJcbDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccJcbDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length === 0) {
    //                         ccDataSet.data.push(0);
    //                         ccDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j] !== undefined
    //                         && moment(startDate1).week() == transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].slab) {
    //                         dcDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].salesAmount);
    //                         dcDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '4') { // Debit Card
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         dcVisaDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcVisaDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         dcMasterCardDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcMasterCardDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         dcAmexDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcAmexDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         dcDiscoverDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDiscoverDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         dcDinersDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDinersDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         dcJcbDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcJcbDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length === 0) {
    //                         dcDataSet.data.push(0);
    //                         dcDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j] !== undefined
    //                         && moment(startDate1).week() == transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].slab) {
    //                         achDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].salesAmount);
    //                         achDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '2') { // ACH
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'WEB':
    //                                         achWebDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achWebDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'TEL':
    //                                         achTelDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achTelDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'CCD':
    //                                         achCcdDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achCcdDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'PPD':
    //                                         achPpdDataSet.data[weekDates1.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achPpdDataSet.pointRadius[weekDates1.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length === 0) {
    //                         achDataSet.data.push(0);
    //                         achDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j] !== undefined
    //                         && moment(startDate1).week() == transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].slab) {
    //                         cashDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].salesAmount);
    //                         cashDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length === 0) {
    //                         cashDataSet.data.push(0);
    //                         cashDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j] !== undefined
    //                         && moment(startDate1).week() == transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].slab) {
    //                         checkDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].salesAmount);
    //                         checkDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length === 0) {
    //                         checkDataSet.data.push(0);
    //                         checkDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //             }
    //             setLineChartLabels(weekDates1)
    //             break;
    //         case '1month':
    //         case 'customWeekOfMonth':
    //             // Get the first and last day of the month
    //             startDate = moment(originalReqObj.StartDate);
    //             endDate = moment(originalReqObj.EndDate);

    //             if (data == 'customWeekOfMonth') {
    //                 canvasLabel = moment(selectedCustomDateRangeForReport.startDate).format('DD MMM YYYY') + "-" + moment(selectedCustomDateRangeForReport.endDate).format('DD MMM YYYY');
    //             } else {
    //                 canvasLabel = moment(startDate).format('MMMM');
    //             }
    //             let weekDates = [];
    //             //Create a range for the month we can iterate through
    //             let monthRange = moment.range(startDate, endDate)
    //             // Get all the weeks during the current month
    //             let weeks = []
    //             let days = Array.from(monthRange.by('day'));
    //             days.forEach(it => {
    //                 if (!weeks.includes(it.isoWeek())) {
    //                     weeks.push(it.isoWeek());
    //                 }
    //             })
    //             let shouldSkip = false;
    //             let lastWeekDay;
    //             weeks.forEach(weekDayOfMonth => {
    //                 if (shouldSkip) {
    //                     return;
    //                 }
    //                 let startLabel = startDate.format('DD MMM')
    //                 lastWeekDay = startDate.endOf('isoWeek');
    //                 if (lastWeekDay > endDate.endOf('d')) { // if reached last day of month skip other week if any
    //                     lastWeekDay = endDate.endOf('d');
    //                     shouldSkip = true;
    //                 }

    //                 let endLabel = lastWeekDay.format('DD MMM')
    //                 weekDates.push(startLabel + "-" + endLabel);
    //                 ccVisaDataSet.data.push(0);
    //                 ccVisaDataSet.pointRadius.push(0);
    //                 ccMasterCardDataSet.data.push(0);
    //                 ccMasterCardDataSet.pointRadius.push(0);
    //                 ccAmexDataSet.data.push(0);
    //                 ccAmexDataSet.pointRadius.push(0);
    //                 ccDiscoverDataSet.data.push(0);
    //                 ccDiscoverDataSet.pointRadius.push(0);
    //                 ccDinersDataSet.data.push(0);
    //                 ccDinersDataSet.pointRadius.push(0);
    //                 ccJcbDataSet.data.push(0);
    //                 ccJcbDataSet.pointRadius.push(0);
    //                 dcVisaDataSet.data.push(0);
    //                 dcVisaDataSet.pointRadius.push(0);
    //                 dcMasterCardDataSet.data.push(0);
    //                 dcMasterCardDataSet.pointRadius.push(0);
    //                 dcAmexDataSet.data.push(0);
    //                 dcAmexDataSet.pointRadius.push(0);
    //                 dcDiscoverDataSet.data.push(0);
    //                 dcDiscoverDataSet.pointRadius.push(0);
    //                 dcDinersDataSet.data.push(0);
    //                 dcDinersDataSet.pointRadius.push(0);
    //                 dcJcbDataSet.data.push(0);
    //                 dcJcbDataSet.pointRadius.push(0);
    //                 achWebDataSet.data.push(0);
    //                 achWebDataSet.pointRadius.push(0);
    //                 achTelDataSet.data.push(0);
    //                 achTelDataSet.pointRadius.push(0);
    //                 achPpdDataSet.data.push(0);
    //                 achPpdDataSet.pointRadius.push(0);
    //                 achCcdDataSet.data.push(0);
    //                 achCcdDataSet.pointRadius.push(0);
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j] !== undefined
    //                         && weekDayOfMonth == transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].slab) {
    //                         ccDataSet.data.push(Utilities.toDollar(transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].salesAmount));
    //                         ccDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '3') { // Credit Card
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         ccVisaDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccVisaDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         ccMasterCardDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccMasterCardDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         ccAmexDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccAmexDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         ccDiscoverDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDiscoverDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         ccDinersDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDinersDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         ccJcbDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccJcbDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length === 0) {
    //                         ccDataSet.data.push(0);
    //                         ccDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j] !== undefined
    //                         && weekDayOfMonth == transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].slab) {
    //                         dcDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].salesAmount);
    //                         dcDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '4') { // Debit Card
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         dcVisaDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcVisaDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         dcMasterCardDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcMasterCardDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         dcAmexDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcAmexDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         dcDiscoverDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDiscoverDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         dcDinersDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDinersDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         dcJcbDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcJcbDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length === 0) {
    //                         dcDataSet.data.push(0);
    //                         dcDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j] !== undefined
    //                         && weekDayOfMonth == transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].slab) {
    //                         achDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].salesAmount);
    //                         achDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                         if (channelType === '2') { // ACH
    //                             for (let k = 0; k < transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes.length; k++) {
    //                                 switch (transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'WEB':
    //                                         achWebDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achWebDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'TEL':
    //                                         achTelDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achTelDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'CCD':
    //                                         achCcdDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achCcdDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'PPD':
    //                                         achPpdDataSet.data[weekDates.length - 1] = transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achPpdDataSet.pointRadius[weekDates.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length === 0) {
    //                         achDataSet.data.push(0);
    //                         achDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j] !== undefined
    //                         && weekDayOfMonth == transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].slab) {
    //                         cashDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].salesAmount);
    //                         cashDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length === 0) {
    //                         cashDataSet.data.push(0);
    //                         cashDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length; j++) {
    //                     if (transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j] !== undefined
    //                         && weekDayOfMonth == transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].slab) {
    //                         checkDataSet.data.push(transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].salesAmount);
    //                         checkDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length - 1
    //                         || transactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length === 0) {
    //                         checkDataSet.data.push(0);
    //                         checkDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 // if ((yearEnd-yearStart)==1 && weekDayOfMonth == 53) {
    //                 //   console.log("inside ")
    //                 //   yearStart = yearStart + 1
    //                 // }
    //                 // if (weekDayOfMonth == 1) {
    //                 //   console.log("inside ")
    //                 //   monthStart=0;
    //                 // }
    //                 startDate = lastWeekDay.add(1, 'd');
    //             })
    //             setLineChartLabels(weekDates)
    //             break;
    //         case 'newmonth':
    //         case 'customDayOfMonth':
    //             startDate;
    //             endDate;
    //             // Get the first and last day of the month
    //             startDate = moment(originalReqObj.StartDate);
    //             endDate = moment(originalReqObj.EndDate);
    //             if (data == 'customDayOfMonth') {
    //                 canvasLabel = moment(selectedCustomDateRangeForReport.startDate).format('DD MMM YYYY') + "-" + moment(selectedCustomDateRangeForReport.endDate).format('DD MMM YYYY');
    //             } else {
    //                 canvasLabel = moment(startDate).format('MMMM');
    //             }
    //             let dayOfMonth = [];
    //             //Create a range for the month we can iterate through
    //             let monthRange2 = moment.range(startDate, endDate)
    //             // Get all the weeks during the current month
    //             let days2 = Array.from(monthRange2.by('day'));
    //             days2.forEach(day => {
    //                 dayOfMonth.push(day.dayOfYear());

    //             })
    //             let lisOfDay = []
    //             let countDay = 0;
    //             dayOfMonth.forEach(monthDay => {
    //                 lisOfDay.push(days2[countDay].format("Do"))
    //                 ccVisaDataSet.data.push(0);
    //                 ccVisaDataSet.pointRadius.push(0);
    //                 ccMasterCardDataSet.data.push(0);
    //                 ccMasterCardDataSet.pointRadius.push(0);
    //                 ccAmexDataSet.data.push(0);
    //                 ccAmexDataSet.pointRadius.push(0);
    //                 ccDiscoverDataSet.data.push(0);
    //                 ccDiscoverDataSet.pointRadius.push(0);
    //                 ccDinersDataSet.data.push(0);
    //                 ccDinersDataSet.pointRadius.push(0);
    //                 ccJcbDataSet.data.push(0);
    //                 ccJcbDataSet.pointRadius.push(0);
    //                 dcVisaDataSet.data.push(0);
    //                 dcVisaDataSet.pointRadius.push(0);
    //                 dcMasterCardDataSet.data.push(0);
    //                 dcMasterCardDataSet.pointRadius.push(0);
    //                 dcAmexDataSet.data.push(0);
    //                 dcAmexDataSet.pointRadius.push(0);
    //                 dcDiscoverDataSet.data.push(0);
    //                 dcDiscoverDataSet.pointRadius.push(0);
    //                 dcDinersDataSet.data.push(0);
    //                 dcDinersDataSet.pointRadius.push(0);
    //                 dcJcbDataSet.data.push(0);
    //                 dcJcbDataSet.pointRadius.push(0);
    //                 achWebDataSet.data.push(0);
    //                 achWebDataSet.pointRadius.push(0);
    //                 achTelDataSet.data.push(0);
    //                 achTelDataSet.pointRadius.push(0);
    //                 achPpdDataSet.data.push(0);
    //                 achPpdDataSet.pointRadius.push(0);
    //                 achCcdDataSet.data.push(0);
    //                 achCcdDataSet.pointRadius.push(0);

    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length; j++) {
    //                     //console.log("monthDay "+monthDay + " and slab "+transactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].slab)
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j] !== undefined
    //                         && monthDay == reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].slab) {
    //                         ccDataSet.data.push(Utilities.toDollar(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].salesAmount));
    //                         ccDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '3') { // Credit Card
    //                             for (let k = 0; k < reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes.length; k++) {
    //                                 switch (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         ccVisaDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccVisaDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         ccMasterCardDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccMasterCardDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         ccAmexDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccAmexDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         ccDiscoverDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDiscoverDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         ccDinersDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDinersDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         ccJcbDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccJcbDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length === 0) {
    //                         ccDataSet.data.push(0);
    //                         ccDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j] !== undefined
    //                         && monthDay == reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].slab) {
    //                         dcDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].salesAmount);
    //                         dcDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '4') { // Debit Card
    //                             for (let k = 0; k < reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes.length; k++) {
    //                                 switch (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         dcVisaDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcVisaDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         dcMasterCardDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcMasterCardDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         dcAmexDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcAmexDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         dcDiscoverDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDiscoverDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         dcDinersDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDinersDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         dcJcbDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcJcbDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length === 0) {
    //                         dcDataSet.data.push(0);
    //                         dcDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j] !== undefined
    //                         && monthDay == reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].slab) {
    //                         achDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].salesAmount);
    //                         achDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '2') { // ACH
    //                             for (let k = 0; k < reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes.length; k++) {
    //                                 switch (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'WEB':
    //                                         achWebDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achWebDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'TEL':
    //                                         achTelDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achTelDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'CCD':
    //                                         achCcdDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achCcdDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'PPD':
    //                                         achPpdDataSet.data[lisOfDay.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achPpdDataSet.pointRadius[lisOfDay.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length === 0) {
    //                         achDataSet.data.push(0);
    //                         achDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j] !== undefined
    //                         && monthDay == reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].slab) {
    //                         cashDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].salesAmount);
    //                         cashDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length === 0) {
    //                         cashDataSet.data.push(0);
    //                         cashDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j] !== undefined
    //                         && monthDay == reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].slab) {
    //                         checkDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].salesAmount);
    //                         checkDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length === 0) {
    //                         checkDataSet.data.push(0);
    //                         checkDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 countDay++;
    //             })
    //             setLineChartLabels(lisOfDay)
    //             break;
    //         case 'week':
    //             const dates = [];
    //             canvasLabel = moment(selectedDateForReport).subtract(6, 'd').format('DD MMM YYYY') + '-' + moment(selectedDateForReport).format('DD MMM YYYY');
    //             for (let i = 0; i < 7; i++) {
    //                 dates.push(moment(selectedDateForReport).subtract(6, 'd').add(i, 'd').format('DD-MMM'));
    //                 ccVisaDataSet.data.push(0);
    //                 ccVisaDataSet.pointRadius.push(0);
    //                 ccMasterCardDataSet.data.push(0);
    //                 ccMasterCardDataSet.pointRadius.push(0);
    //                 ccAmexDataSet.data.push(0);
    //                 ccAmexDataSet.pointRadius.push(0);
    //                 ccDiscoverDataSet.data.push(0);
    //                 ccDiscoverDataSet.pointRadius.push(0);
    //                 ccDinersDataSet.data.push(0);
    //                 ccDinersDataSet.pointRadius.push(0);
    //                 ccJcbDataSet.data.push(0);
    //                 ccJcbDataSet.pointRadius.push(0);
    //                 dcVisaDataSet.data.push(0);
    //                 dcVisaDataSet.pointRadius.push(0);
    //                 dcMasterCardDataSet.data.push(0);
    //                 dcMasterCardDataSet.pointRadius.push(0);
    //                 dcAmexDataSet.data.push(0);
    //                 dcAmexDataSet.pointRadius.push(0);
    //                 dcDiscoverDataSet.data.push(0);
    //                 dcDiscoverDataSet.pointRadius.push(0);
    //                 dcDinersDataSet.data.push(0);
    //                 dcDinersDataSet.pointRadius.push(0);
    //                 dcJcbDataSet.data.push(0);
    //                 dcJcbDataSet.pointRadius.push(0);
    //                 achWebDataSet.data.push(0);
    //                 achWebDataSet.pointRadius.push(0);
    //                 achTelDataSet.data.push(0);
    //                 achTelDataSet.pointRadius.push(0);
    //                 achPpdDataSet.data.push(0);
    //                 achPpdDataSet.pointRadius.push(0);
    //                 achCcdDataSet.data.push(0);
    //                 achCcdDataSet.pointRadius.push(0);
    //                 const dayOfWeek = moment(selectedDateForReport).subtract(6, 'd').add(i, 'd').format('dddd');
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j] !== undefined
    //                         && dayOfWeek === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].slab) {
    //                         ccDataSet.data.push(Utilities.toDollar(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].salesAmount));
    //                         ccDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '3') { // Credit Card
    //                             for (let k = 0; k < reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes.length; k++) {
    //                                 switch (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         ccVisaDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccVisaDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         ccMasterCardDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccMasterCardDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         ccAmexDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccAmexDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         ccDiscoverDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDiscoverDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         ccDinersDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDinersDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         ccJcbDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccJcbDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length === 0) {
    //                         ccDataSet.data.push(0);
    //                         ccDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j] !== undefined
    //                         && dayOfWeek === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].slab) {
    //                         dcDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].salesAmount);
    //                         dcDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '4') { // Debit Card
    //                             for (let k = 0; k < reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes.length; k++) {
    //                                 switch (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         dcVisaDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcVisaDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         dcMasterCardDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcMasterCardDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         dcAmexDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcAmexDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         dcDiscoverDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDiscoverDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         dcDinersDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDinersDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         dcJcbDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcJcbDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length === 0) {
    //                         dcDataSet.data.push(0);
    //                         dcDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j] !== undefined
    //                         && dayOfWeek === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].slab) {
    //                         achDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].salesAmount);
    //                         achDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '2') { // ACH
    //                             for (let k = 0; k < reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes.length; k++) {
    //                                 switch (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'WEB':
    //                                         achWebDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achWebDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'TEL':
    //                                         achTelDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achTelDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'CCD':
    //                                         achCcdDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achCcdDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'PPD':
    //                                         achPpdDataSet.data[dates.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achPpdDataSet.pointRadius[dates.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length === 0) {
    //                         achDataSet.data.push(0);
    //                         achDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j] !== undefined
    //                         && dayOfWeek === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].slab) {
    //                         cashDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].salesAmount);
    //                         cashDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length === 0) {
    //                         cashDataSet.data.push(0);
    //                         cashDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j] !== undefined
    //                         && dayOfWeek === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].slab) {
    //                         checkDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].salesAmount);
    //                         checkDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length === 0) {
    //                         checkDataSet.data.push(0);
    //                         checkDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //             }
    //             setLineChartLabels(dates)
    //             break;
    //         case 'day':
    //             const hours = [];
    //             canvasLabel = moment(selectedDateForReport).format('DD MMM YYYY')
    //             for (let i = 0; i < 24; i++) {
    //                 hours.push(moment(selectedDateForReport).add(1, 'd').startOf('d').subtract(24, 'h').add(i, 'h').format('ha'));
    //                 ccVisaDataSet.data.push(0);
    //                 ccVisaDataSet.pointRadius.push(0);
    //                 ccMasterCardDataSet.data.push(0);
    //                 ccMasterCardDataSet.pointRadius.push(0);
    //                 ccAmexDataSet.data.push(0);
    //                 ccAmexDataSet.pointRadius.push(0);
    //                 ccDiscoverDataSet.data.push(0);
    //                 ccDiscoverDataSet.pointRadius.push(0);
    //                 ccDinersDataSet.data.push(0);
    //                 ccDinersDataSet.pointRadius.push(0);
    //                 ccJcbDataSet.data.push(0);
    //                 ccJcbDataSet.pointRadius.push(0);
    //                 dcVisaDataSet.data.push(0);
    //                 dcVisaDataSet.pointRadius.push(0);
    //                 dcMasterCardDataSet.data.push(0);
    //                 dcMasterCardDataSet.pointRadius.push(0);
    //                 dcAmexDataSet.data.push(0);
    //                 dcAmexDataSet.pointRadius.push(0);
    //                 dcDiscoverDataSet.data.push(0);
    //                 dcDiscoverDataSet.pointRadius.push(0);
    //                 dcDinersDataSet.data.push(0);
    //                 dcDinersDataSet.pointRadius.push(0);
    //                 dcJcbDataSet.data.push(0);
    //                 dcJcbDataSet.pointRadius.push(0);
    //                 achWebDataSet.data.push(0);
    //                 achWebDataSet.pointRadius.push(0);
    //                 achTelDataSet.data.push(0);
    //                 achTelDataSet.pointRadius.push(0);
    //                 achPpdDataSet.data.push(0);
    //                 achPpdDataSet.pointRadius.push(0);
    //                 achCcdDataSet.data.push(0);
    //                 achCcdDataSet.pointRadius.push(0);
    //                 const dayHour = moment(selectedDateForReport).endOf('d').utc().subtract(24, 'h').add(i, 'h').format('HH')
    //                 // moment().add(1, 'd').startOf('d').utc().subtract(24, 'h').add(i, 'h').format('HH');
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j] !== undefined
    //                         && dayHour === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].slab) {
    //                         // ccDataSet.data.push(Utilities.toDollar(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].salesAmount));
    //                         ccDataSet.data.push(Utilities.toDollar(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].salesAmount));
    //                         ccDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '3') { // Credit Card
    //                             for (let k = 0; k < reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes.length; k++) {
    //                                 switch (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         ccVisaDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccVisaDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         ccMasterCardDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccMasterCardDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         ccAmexDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccAmexDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         ccDiscoverDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDiscoverDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         ccDinersDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccDinersDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         ccJcbDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs[j].subTypes[k].salesAmount;
    //                                         ccJcbDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.creditCard.slabs.length === 0) {
    //                         ccDataSet.data.push(0);
    //                         ccDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j] !== undefined
    //                         && dayHour === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].slab) {
    //                         dcDataSet.data.push('$' + reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].salesAmount);
    //                         dcDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '4') { // Debit Card
    //                             for (let k = 0; k < reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes.length; k++) {
    //                                 switch (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'VISA':
    //                                         dcVisaDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcVisaDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'MASTERCARD':
    //                                         dcMasterCardDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcMasterCardDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'AMEX':
    //                                         dcAmexDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcAmexDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DISCOVER':
    //                                         dcDiscoverDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDiscoverDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'DINERS':
    //                                         dcDinersDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcDinersDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'JCB':
    //                                         dcJcbDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs[j].subTypes[k].salesAmount;
    //                                         dcJcbDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.debitCard.slabs.length === 0) {
    //                         dcDataSet.data.push(0);
    //                         dcDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j] !== undefined
    //                         && dayHour === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].slab) {
    //                         achDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].salesAmount);
    //                         achDataSet.pointRadius.push(pointWidth);
    //                         if (channelType === '2') { // ACH
    //                             for (let k = 0; k < reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes.length; k++) {
    //                                 switch (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].channelSubType) {
    //                                     case 'WEB':
    //                                         achWebDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achWebDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'TEL':
    //                                         achTelDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achTelDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'CCD':
    //                                         achCcdDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achCcdDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     case 'PPD':
    //                                         achPpdDataSet.data[hours.length - 1] = reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs[j].subTypes[k].salesAmount;
    //                                         achPpdDataSet.pointRadius[hours.length - 1] = pointWidth;
    //                                         break;
    //                                     default:
    //                                         break;
    //                                 }
    //                             }
    //                         }
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.ach.slabs.length === 0) {
    //                         achDataSet.data.push(0);
    //                         achDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j] !== undefined
    //                         && dayHour === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].slab) {
    //                         cashDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs[j].salesAmount);
    //                         cashDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.cash.slabs.length === 0) {
    //                         cashDataSet.data.push(0);
    //                         cashDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //                 for (let j = 0; j <= reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length; j++) {
    //                     if (reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j] !== undefined
    //                         && dayHour === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].slab) {
    //                         checkDataSet.data.push(reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs[j].salesAmount);
    //                         checkDataSet.pointRadius.push(pointWidth);
    //                         break;
    //                     } else if (j === reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length - 1
    //                         || reportTransactionVolumeDetails[selectedTransactionVolumeType]?.check.slabs.length === 0) {
    //                         checkDataSet.data.push(0);
    //                         checkDataSet.pointRadius.push(0);
    //                     }
    //                 }
    //             }
    //             setLineChartLabels(hours)
    //             break;
    //         default:
    //             break;
    //     }

    //     let newDataSet = [];
    //     if (channelType === '0') {
    //         newDataSet.push(ccDataSet);
    //         // newDataSet.push(dcDataSet);
    //         newDataSet.push(achDataSet);
    //         newDataSet.push(cashDataSet);
    //         newDataSet.push(checkDataSet);
    //         showGraphDetailsCredit = true;
    //         showGraphDetailsDebit = true;
    //         showGraphDetailsAch = true;
    //         showGraphDetailsCash = true;
    //         showGraphDetailsCheck = true;
    //     } else if (channelType === '2') {  // ACH
    //         newDataSet.push(achWebDataSet);
    //         newDataSet.push(achTelDataSet);
    //         newDataSet.push(achPpdDataSet);
    //         newDataSet.push(achCcdDataSet);
    //         showGraphDetailsCredit = false;
    //         showGraphDetailsDebit = false;
    //         showGraphDetailsAch = true;
    //         showGraphDetailsCash = false;
    //         showGraphDetailsCheck = false;
    //     } else if (channelType === '3') { // CC
    //         newDataSet.push(ccVisaDataSet);
    //         newDataSet.push(ccMasterCardDataSet);
    //         newDataSet.push(ccAmexDataSet);
    //         newDataSet.push(ccDiscoverDataSet);
    //         newDataSet.push(ccDinersDataSet);
    //         newDataSet.push(ccJcbDataSet);
    //         showGraphDetailsCredit = true;
    //         showGraphDetailsDebit = false;
    //         showGraphDetailsAch = false;
    //         showGraphDetailsCash = false;
    //         showGraphDetailsCheck = false;
    //     } else if (channelType === '4') {  // DC
    //         newDataSet.push(dcVisaDataSet);
    //         newDataSet.push(dcMasterCardDataSet);
    //         newDataSet.push(dcAmexDataSet);
    //         newDataSet.push(dcDiscoverDataSet);
    //         newDataSet.push(dcDinersDataSet);
    //         newDataSet.push(dcJcbDataSet);
    //         showGraphDetailsCredit = false;
    //         showGraphDetailsDebit = true;
    //         showGraphDetailsAch = false;
    //         showGraphDetailsCash = false;
    //         showGraphDetailsCheck = false;
    //     } else if (channelType === '9') {  // CASH
    //         newDataSet.push(cashDataSet);
    //         showGraphDetailsCredit = false;
    //         showGraphDetailsDebit = true;
    //         showGraphDetailsAch = false;
    //         showGraphDetailsCash = true;
    //         showGraphDetailsCheck = false;
    //     } else if (channelType === '10') {  // CHECK
    //         newDataSet.push(checkDataSet);
    //         showGraphDetailsCredit = false;
    //         showGraphDetailsDebit = true;
    //         showGraphDetailsAch = false;
    //         showGraphDetailsCash = false;
    //         showGraphDetailsCheck = true;
    //     }
    //     setDisplayChart(true)
    //     console.log(newDataSet)
    //     setDataSet(newDataSet)
    //     return drawLineChart();
    // }