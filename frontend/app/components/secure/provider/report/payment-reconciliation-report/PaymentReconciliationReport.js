import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import ReportService from '../../../../../services/api/report.service'
import Utilities from '../../../../../services/commonservice/utilities'
import Module from '../../../../templates/components/Module'
import { store } from '../../../../../context/StateProvider'
import TransactionService from '../../../../../services/api/transaction.service'
import PracticeLocationSelector from '../../../../templates/components/PracticeLocationSelector'
import Table from '../../../../templates/components/Table'
import DoctorService from '../../../../../services/api/doctor.service'
import Select from 'react-select'
import toast from 'react-hot-toast'
import AppointmentService from '../../../../../services/api/appointment.service'
const PaymentReconciliationReport = (props) => {
    const state = useContext(store).state
    const [slabBy, setSlabBy] = useState('M')
    const [startDate, setStartDate] = useState(new Date().toISOString())
    const [endDate, setEndDate] = useState(new Date(moment().endOf("D").toISOString()))
    const [timePeriod, setTimePeriod] = useState("day")
    const [data, setData] = useState()
    const [activeIndex, setActiveIndex] = useState()
    const [isLoader, setIsLoader] = useState(false)
    const [providerList, setProviderList] = useState()
    const [listSlabBy, setListSlabBy] = useState()
    const [selectedProvider, setSelectedProvider] = useState()
    const [sums, setSums] = useState()
    const [locationList, setLocationList] = useState(state.practiceLocations || null)
    const [locationId, setLocationId] = useState(state.practiceLocationId || null)

    // const providerLookup = () => {
    //     setIsLoader(true)
    //     if (state?.practiceLocationId) {
    //         const reqObj = { isRegistered: true, isActive: true, PracticeLocationId: state.practiceLocationId };
    //         DoctorService.doctorLookupByPracticelocation(reqObj)
    //             .then(
    //                 (response) => {
    //                     let array = response.filter(obj => obj.practitionerName !== "null null")
    //                     console.log(response)
    //                     setProviderList(array)
    //                     setSelectedProvider(array[0])
    //                     setIsLoader(false)
    //                 })
    //             .catch((error) => {
    //                 setIsLoader(false)
    //                 console.log(error);
    //             })
    //     }
    //     else {
    //         setIsLoader(false)
    //     }
    // }

    // const for table 
    const columns = [
        // ["Name", "Equipment Type", "Room", "Actions"]
        {
            key: "period",
            text: "Period",
            align: "left",
            sortable: true,
            cell: (tc) => {
                if (tc.period !== 'zzzzzz') {
                    switch (listSlabBy) {
                        case 'Y':
                            return moment.utc(tc.period).format("YYYY")
                        case 'M':
                            return moment.utc(tc.period).format("MMMM")
                        case 'W':
                            if (moment.utc(tc.period).date() < 7 > 1)
                                return moment.utc(tc.period).startOf("M").format("MM-DD-YYYY") + ' - ' + moment.utc(tc.period).endOf("w").format("MM-DD-YYYY")
                            else if (moment.utc(tc.period).date() === 1)
                                return moment.utc(tc.period).startOf("M").format("MM-DD-YYYY") + ' - ' + moment.utc(tc.period).endOf("w").format("MM-DD-YYYY")
                            else
                                return moment.utc(tc.period).startOf("w").format("MM-DD-YYYY") + ' - ' + (moment.utc(tc.period).endOf("w").month() == moment.utc(tc.period).month() ? moment.utc(tc.period).endOf("w").format("MM-DD-YYYY"): moment.utc(tc.period).endOf("M").format("MM-DD-YYYY"))
                        case 'D':
                            return moment.utc(tc.period).format("MM-DD-YYYY")
                        case 'H':
                            return moment.utc(tc.period).format("h:mm A")
                        default:
                            break
                    }
                }
                else { return 'Total' }
            },
        },
        {
            key: "credit",
            text: "Credit",
            align: "left",
            sortable: true,
            cell: (tc) => Utilities.toDollar(tc.credit)
        },
        {
            key: "ach",
            text: "ACH",
            align: "left",
            sortable: true,
            cell: (tc) => Utilities.toDollar(tc.ach)
        },
        {
            key: "cash",
            text: "Cash",
            align: "left",
            sortable: true,
            cell: (tc) => Utilities.toDollar(tc.cash)
        },
        {
            key: "check",
            text: "Check",
            align: "left",
            sortable: true,
            cell: (tc) => Utilities.toDollar(tc.check)
        },
        {
            key: "total",
            text: "Total",
            align: "left",
            sortable: true,
            cell: (tc) => Utilities.toDollar(tc.total)
        }
    ]
    const config = {
        page_size: 15,
        length_menu: [15, 30, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: `Reconciliation Report - ${timePeriod} - ${moment(startDate).format("M-D-YYYY")} to ${moment(endDate).format("M-D-YYYY")} for ${selectedProvider?.practitionerName}`,
        sort: { column: "period", order: "asc" },
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

    const findLocations = () => {
        AppointmentService.practiceLocationLookup()
            .then((res) => {
                setLocationList(res)
                setLocationId(res[0].practiceLocationId)

            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getReport = () => {
        let reqObj = {
            FromDate: moment.utc(startDate).format("YYYY-MM-DD HH:MM:ss"),
            ToDate: moment.utc(endDate).format("YYYY-MM-DD HH:MM:ss"),
            // ProviderId: selectedProvider?.providerId,
            GroupBy: slabBy
        }
        if(locationId){
            reqObj.PracticeLocationId = locationId
        }

        ReportService.getReconciliationReport(reqObj)
            .then(res => {
                console.log(res)
                let results = res
                let credit = 0
                let ach = 0
                let cash = 0
                let check = 0
                results.forEach(tc => {
                    credit += tc.credit
                    cash += tc.cash
                    check += tc.check
                    ach += tc.ach
                    tc.total = tc.credit + tc.check + tc.ach + tc.cash
                })
                if (results?.length > 0) { results.push({ period: 'zzzzzz', credit: credit, ach: ach, cash: cash, check: check, total: check + credit + ach + cash }) }
                return setData(results)
            }
            )
            .catch(err => { console.log(err) })
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
        else {
            setStartDate(date)
        }
        getReport()
    }
    const changeRange = () => {
        if (timePeriod === "quarter") {
            setStartDate(moment(startDate).startOf("quarter"))
            setEndDate(moment(startDate).add(2, "M").endOf("M"))
            setSlabBy("M")
        }
        else if (timePeriod !== "custom") {
            setStartDate(moment(startDate).startOf(timePeriod[0].toLocaleUpperCase()))
            setEndDate(moment(startDate).endOf(timePeriod[0].toLocaleUpperCase()))
            switch (timePeriod) {
                case 'year':
                    setSlabBy("M")
                    break;
                case 'month':
                    setSlabBy("W")
                    break;
                case 'day':
                    setSlabBy("H")
                    break;
                case 'week':
                    setSlabBy("D")
                    break;
                default:
                    break;
            }
        }
    }

    useEffect(() => {
        changeRange()
    }, [timePeriod])

    // useEffect(() => {
    //         getReport()
    // }, [startDate, endDate, slabBy, locationId])

    useEffect(() => {
        if (!locationList) {
            if (StorageService.get("session", "locale")) {
                let payload = JSON.parse(StorageService.get("session", "locale"))
                setLocationList(payload)
            }
            else {
                findLocations();
            }
        }
    }, [])
    return (
        <div className='row g-4'>
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
                                    <select className="form-select" value={moment(startDate).month() + 1} onChange={e => { e.preventDefault(); console.log(moment(startDate).startOf("M").month(e.target.value - 1).toISOString()); setStartDate(new Date(moment(startDate).startOf("M").month(e.target.value - 1))); setEndDate(new Date(moment(endDate).month(e.target.value - 1).endOf('M'))); return getReport() }}>
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
                                    <input type="date" value={Utilities.toDate(endDate)} onChange={e => { e.preventDefault(); setEndDate(e.target.value); }} disabled={timePeriod !== "custom"} />
                                </div>
                            </div>}
                            {timePeriod === 'custom' || timePeriod === 'quarter' ?
                                <div className='col'>
                                    <div className='ui field'>
                                        <label>Group By</label>
                                        <select className="form-select" onChange={e => { setSlabBy(e.target.value) }} value={slabBy}>
                                            <option value="H" selected>Hour</option>
                                            <option value="D">Day</option>
                                            <option value="W">Week</option>
                                            <option value="M">Month</option>
                                            <option value="Y">Year</option>
                                        </select>
                                    </div>
                                </div> : null}
                            <div className='col'>
                                <div className='field'>
                                    <label>Practice Location</label>
                                    <Select
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={locationList && locationList}
                                        isLoading={!locationList}
                                        isDisabled={!locationList}
                                        isClearable
                                        loadingMessage="locationList are loading..."
                                        name="practiceLocationRoomId"
                                        value={locationList && Array.isArray(locationList) ? locationList.find(obj => obj.practiceLocationId === locationId) : null}
                                        onChange={e => {
                                            if(e?.practiceLocationId){
                                            setLocationId(e.practiceLocationId)
                                            }
                                            else{
                                                setLocationId()
                                            }
                                        }}
                                        getOptionLabel={(option) => option.practiceLocation}
                                        getOptionValue={(option) => option.practiceLocationId}
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div className="col-auto"><button className="btn btn-primary" onClick={e=>{e.preventDefault(); setListSlabBy(slabBy); getReport()}} title="Pull Report"><i className="icon arrow circle right"/></button></div>
                        </div>
                    </div>
                </Module>
            </div>
            <div className='col-12'>
                <Module title="Payment Reconciliation Report">
                    <Table config={config} records={data} columns={columns} loading={isLoader} />
                </Module>
            </div>
        </div>
    )
}
export default PaymentReconciliationReport