import React, { useEffect, useState, useContext } from "react";
import Table from "../../../../templates/components/Table";
import Dashboard from "../../../../templates/layouts/Dashboard";
import ProviderService from "../../../../../services/api/provider.service";
import moment from 'moment'
import Utilities from "../../../../../services/commonservice/utilities";
import { store } from "../../../../../context/StateProvider";
import Module from "../../../../templates/components/Module";
import PracticeLocationSelector from "../../../../templates/components/PracticeLocationSelector";

const NoShow = (props) => {
    const [noShowData, setNoShowData] = useState();
    const [isLoader, setIsLoader] = useState(false)
    const [offsetHour, setOffsetHour] = useState(moment().utcOffset() >= 0 ? Math.floor(moment().utcOffset() / 60) : Math.ceil(moment().utcOffset() / 60),)
    const [offsetMinute, setOffsetMinute] = useState(moment().utcOffset() % 60)
    const [slabBy, setSlabBy] = useState('Month')
    const [startDate, setStartDate] = useState(new Date().toISOString())
    const [endDate, setEndDate] = useState(new Date(moment().endOf("D").toISOString()))
    const [timePeriod, setTimePeriod] = useState("day")
    const state = useContext(store).state

    const getNoShow = () => {
        ProviderService.getNoShow({
            FromDate: moment(startDate).format("YYYY-MM-DD HH:MM:ss"),
            ToDate: moment(endDate).format("YYYY-MM-DD HH:MM:ss"),
            LocationIds: state.practiceLocationId
        }).then(data => {
            setNoShowData(data);
        }).catch(console.log);
    }


    const equipmentTypeColumns = [
        {
            key: "fromDate",
            text: "Date",
            align: "left",
            sortable: true,
            cell: record => {
                return moment(record.fromDate).format('l')
            }
        },
        {
            key: "patientName",
            text: "Client",
            align: "left",
            sortable: true,
        },
        {
            key: "patientPhone",
            text: "Mobile Phone",
            align: "left",
            sortable: true,
            cell: (patient) => Utilities.toPhoneNumber(patient.patientPhone)
        },
        {
            key: "practiceServiceType",
            text: "Service",
            align: "left",
            sortable: true,
        },
        {
            key: "doctorName",
            text: "Provider",
            align: "left",
            sortable: true,
        }
    ]

    const changeStart = (date) => {
        if (timePeriod === "quarter") {
            setStartDate(moment(date).startOf("quarter"))
            setEndDate(moment(date).add(2, "M").endOf("M"))
        }
        else if (timePeriod !== "custom") {
            setStartDate(moment(date).startOf(timePeriod[0].toLocaleUpperCase()))
            setEndDate(moment(date).endOf(timePeriod[0].toLocaleUpperCase()))
        }
        getNoShow()
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
        getNoShow()
    }, [state?.practiceLocationId])

    return (
        <div className="row d-flex g-4">
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
                                    <select className="form-select" value={moment(startDate).month() + 1} onChange={e => { e.preventDefault(); console.log(moment(startDate).startOf("M").month(e.target.value - 1).toISOString()); setStartDate(new Date(moment(startDate).startOf("M").month(e.target.value - 1))); setEndDate(new Date(moment(endDate).month(e.target.value - 1).endOf('M'))); return getNoShow() }}>
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
                                    <input type="date" value={Utilities.toDate(endDate)} onChange={e => { e.preventDefault(); setEndDate(e.target.value); return getNoShow() }} disabled={timePeriod !== "custom"} />
                                </div>
                            </div>}
                            <div className='col'>
                                <div className='ui field'>
                                    <label>Practice Location</label>
                                    <PracticeLocationSelector/>
                                </div>
                            </div>
                            <div className="col-auto"><button className="btn btn-primary" onClick={e=>{e.preventDefault(); getNoShow()}} title="Pull Report"><i className="icon arrow circle right"/></button></div>
                        </div>
                    </div>
                </Module>
            </div>
            <div className="col-12">
                <Module title="No Show Report">
                    <Table
                        records={noShowData}
                        columns={equipmentTypeColumns}
                        loading={false}
                        fileName={'No Show Appointment List'}
                    />
                </Module>
            </div>
        </div>)
}

export default NoShow;