import moment from 'moment'
import React, { useEffect, useState, useContext } from 'react'
import Utilities from '../../../../../services/commonservice/utilities'
import { store } from '../../../../../context/StateProvider'
import ReportService from '../../../../../services/api/report.service'
import DoctorService from '../../../../../services/api/doctor.service'
import Select from 'react-select'
import PracticeLocationSelector from '../../../../templates/components/PracticeLocationSelector'
import NoResults from '../../../../templates/components/NoResults'

const EmployeeWorkTicket = (props) => {
    const [tickets, setTickets] = useState()
    const [startDate, setStartDate] = useState(Utilities.toDate(moment().startOf("D")))
    const [endDate, setEndDate] = useState(Utilities.toDate(moment().add(1, "d").startOf("D")))
    const [providerId, setProviderId] = useState()
    const [providerList, setProviderList] = useState()
    const stateAndDispatch = useContext(store)
    const state = stateAndDispatch.state

    const fetchReport = () => {
        let reqObj = {
            FromDate: moment(startDate).startOf('d').format("YYYY-MM-DD HH:MM:ss"),
            ToDate: moment(startDate).endOf('d').format("YYYY-MM-DD HH:MM:ss")
        }
        if (providerId !== undefined && providerId !== null && providerId && state.practiceLocationId) {
            ReportService.getEmployeeWorkTicket(providerId, state?.practiceLocationId, reqObj)
                .then(res => {
                    console.log(res)
                    setTickets(res)
                })
                .catch(err => {
                    console.log(err)
                    setTickets()
                })
        }
        else {
            providerLookup()
        }
    }
    const providerLookup = () => {
        let reqObj = { isRegistered: true, isActive: true, PracticeLocationId: state?.practiceLocationId }
        DoctorService.doctorLookup(reqObj)
            .then(res => {
                console.log(res)
                setProviderList(res)
                setProviderId(res[0].id)
            })
            .catch(err => {
                console.log(err)
                setProviderList()
            })
    }

    useEffect(() => {
        providerLookup()
    }, [])

    useEffect(() => {
        if (startDate && providerId !== undefined && providerId) {
            setEndDate(moment(startDate).add(1, 'd').startOf('d'))
            return fetchReport()
        }
    }, [providerId, state?.practiceLocationId])

    return (
        <div>
            <div className='row d-flex align-items-end'>
                <div className='col'>
                    <div className='field required'>
                        <label>Start Date</label>
                        <input type="date" value={Utilities.toDate(startDate)} onChange={e => { e.preventDefault(); setStartDate(e.target.value) }} />
                    </div>
                </div>
                <div className='col'>
                    <div className='field required'>
                        <label>Search Provider</label>
                        <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={providerList}
                            name="doctorId"
                            value={providerList && providerList.find(obj => obj.id === providerId) || null}
                            onChange={e => {
                                setProviderId(e.id)
                            }}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                        />
                    </div>
                </div>
                <div className='col'>
                    <label>Practice Location</label>
                    <PracticeLocationSelector />
                </div>
                <div className='col-auto'>
                    <div className="col-auto d-flex justify-content-between"><button className="btn btn-primary" onClick={e => { e.preventDefault(); fetchReport() }} title="Pull Report"><i className="icon arrow circle right" /></button></div>
                    {Array.isArray(tickets) && tickets?.length > 0 ? <div className='col-auto'>
                        <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); Utilities.printWindow("work-ticket", "Employee Work Ticket", { landscape: true, style: '.one-third{width:3.45in; height:7.50in}' }) }}><i className='icon print' /></button>
                    </div> : null}
                </div>
            </div>
            <div id="work-ticket" className='mt-4 landscape'>
                <div className='row d-flex g-3 justify-content-center landscape'>
                    {Array.isArray(tickets) && tickets.map((ticket, idx) => {
                        let row = false
                        if ((idx + 1) % 3 == 0) {
                            row = true
                        }
                        return (
                            <>
                                <div className='col-md-4 col-12 one-third'>
                                    <div className='card pt-3 h-100 w-100'>
                                        <div>
                                            <h5 className='text-center'><strong>Work Ticket</strong>
                                                <br />{ticket.doctorName}<br />
                                                {moment(startDate).format("MM/DD/YYYY")}</h5>
                                        </div>
                                        <table className='table table-borderless mt-3'>
                                            <tbody>
                                                <tr><th colSpan={4}>Current Appointment</th></tr>
                                                <tr><td><strong>Client:</strong></td><td colSpan={3}>{ticket.patientName}</td></tr>
                                                <tr><td><strong>Service:</strong></td><td colSpan={3}>{ticket.service}</td></tr>
                                                <tr><td><strong>Appt Type:</strong></td><td colSpan={3}>{ticket.appointmentType}</td></tr>
                                                <tr><td><strong>Resource:</strong></td><td colSpan={3}>{ticket.room}</td></tr>
                                                <tr><td><strong>Time:</strong></td><td colSpan={3}>{moment(ticket.appoinmentStartDate).format("h:mm A")}</td></tr>
                                            </tbody>
                                            <tbody>
                                                <tr><th colSpan={4}>Sales History</th></tr>
                                                {ticket.salesHistory[0].salesDate !== null ? ticket.salesHistory.map(appt => {
                                                    if (appt.salesDate) {
                                                        return (
                                                            <tr>
                                                                <td><small>{moment(appt.salesDate).format("M/D/YY")}</small></td>
                                                                <td><small>{appt.itemName}</small></td>
                                                                <td><small>{appt.doctorName.split(' ')[1]}</small></td>
                                                                <td><small>{Utilities.toDollar(appt.itemTotalCost)}</small></td>
                                                            </tr>
                                                        )
                                                    }
                                                }) : <tr><td colSpan={4}>No Sales Data</td></tr>}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {row && <div className='pagebreak' />}
                            </>
                        )
                    })}

                </div>
                {providerList && !tickets || tickets?.length < 1 ? <NoResults>There are no work tickets on {moment.utc(startDate).format("ddd, MMMM Do")} for {providerList?.find(obj => obj.id === providerId)?.name}</NoResults> : null}
            </div>
        </div>
    )
}

export default EmployeeWorkTicket