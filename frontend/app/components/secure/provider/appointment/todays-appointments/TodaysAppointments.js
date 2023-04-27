// Node Imports 
import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'

// Template imports 
import List from '../../../../templates/components/List'
import label from '../../../../../../assets/i18n/en.json'

// Service imports 
import AppointmentService from '../../../../../services/api/appointment.service'
import StorageService from '../../../../../services/session/storage.service'
import AppointmentCard from './AppointmentCard'
import Select from 'react-select'
import { store } from '../../../../../context/StateProvider'
import PracticeLocationSelector from '../../../../templates/components/PracticeLocationSelector'


const TodaysAppointments = (props) => {
    // Context items 
    const stateAndDispatch = useContext(store)
    const state = stateAndDispatch.state
    const dispatch = stateAndDispatch.dispatch

    // States 
    const [isLoading, setIsLoading] = useState(true)
    const [appointments, setAppointments] = useState()
    const [noRecordsFound, setNoRecordsFound] = useState([])
    const [metrics, setMetrics] = useState()


    // Get today's Appoitment
    const getAppointment = () => {
        setIsLoading(true)
        let reqObj = {}
        reqObj.FromDate = moment().startOf('d').toISOString();
        reqObj.ToDate = moment().endOf('d').toISOString();
        // reqObj.ProviderIds = JSON.parse(StorageService.get('session', "userDetails")).parentId
        // console.log(reqObj.ProviderIds)
        reqObj.SortField = 'ToDate'
        reqObj.Asc = true
        reqObj.Location = state.practiceLocationId
        if (props.providerId || props.providerPage) {
            reqObj.DoctorIds = props.providerId
        }
        let metrics = { upcoming: 0, checkedIn: 0, withProvider: 0, checkedOut: 0 }
        return AppointmentService.findAppointment(reqObj)
            .then((findAppointmentResponse) => {
                console.log(findAppointmentResponse)
                if (findAppointmentResponse.length === 0) {
                    setAppointments();
                    setNoRecordsFound(true)
                } else {
                    setNoRecordsFound(false)
                    let appointmentList = findAppointmentResponse
                    appointmentList.forEach(element => {
                        let fullName = '';
                        fullName = (element.firstName != null) ? `${fullName} ${element.firstName}` : `${fullName}`;
                        fullName = (element.lastName != null) ? `${fullName} ${element.lastName}` : `${fullName}`;
                        element.fullName = fullName;
                        const toDate = element.toDate;
                        const now = moment(new Date()).toISOString();
                        const dateIsAfter = moment(toDate).isAfter(moment(now));
                        const dateIsSame = moment(toDate).isSame(moment(now));
                        element.past = true;
                        if (dateIsAfter || dateIsSame) {
                            element.past = false;
                        }
                        if (element.checkOutDate && element.practiceServiceType !== "**unavailable**") {
                            metrics.checkedOut = metrics.checkedOut + 1
                        }
                        else if (element.doctorCheckInDate && element.practiceServiceType !== "**unavailable**") {
                            metrics.withProvider = metrics.withProvider + 1
                        }
                        else if (element.checkInDate && element.practiceServiceType !== "**unavailable**") {
                            metrics.checkedIn = metrics.checkedIn + 1
                        }
                        else if (element.practiceServiceType !== "**unavailable**") {
                            metrics.upcoming = metrics.upcoming + 1
                        }
                    })
                    setAppointments(appointmentList.filter(obj => obj.practiceServiceType !== "**unavailable**"))
                    setMetrics(metrics)
                }
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                console.log("appointment list error: ", err)
                // checkException(error);
            });
    }


    useEffect(() => {
        if (state?.practiceLocationId) {
            if (props.providerPage && !props.providerId) {
                setAppointments()
            }
            else {
                getAppointment()
            }
        }
    }, [state?.practiceLocationId])
    return (
        <div>

            {isLoading &&
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.loading}</div>
                </div>}
            <div className="row p-3 pt-0">
                <div className='primary-header d-flex justify-content-between align-items-center row ms-0'>
                    <div className='col-md-auto col-12'>
                        {moment().format("dddd, MMMM, D")}
                    </div>
                    <div className='col-md-auto col-12'>
                        <PracticeLocationSelector />
                    </div>
                </div>
                <div className='col-12 row d-flex p-0 mb-3 my-2 justify-content-between'>
                    <div className='col-auto'>
                            <div className='d-flex align-items-center'><span>Upcoming </span><span className='ms-3 badge bg-primary'>{metrics?.upcoming}</span></div>
                      
                    </div>
                    <div className='col-auto'>
                            <div className='d-flex align-items-center'><span>Checked In</span> <span className='ms-3 badge bg-primary'>{metrics?.checkedIn}</span></div>
                      
                    </div>
                    <div className='col-auto'>
                      
                            <div className='d-flex align-items-center'><span>With Provider</span> <span className='ms-3 badge bg-primary'>{metrics?.withProvider}</span></div>
                      
                    </div>
                    <div className='col-auto'>
                      
                            <div className='d-flex align-items-center'><span>Checked Out</span> <span className='ms-3 badge bg-primary'>{metrics?.checkedOut}</span></div>
                        {/* </div> */}
                    </div>
                </div>
                <List
                    hideSortBy
                    // pageSize={10}
                    className='scroll-list mt-0'
                    noPaginate
                    noResultsMessage="There are no additional appointments for today"
                    style={{ maxHeight: '80vh' }}
                >
                    {appointments && appointments.filter(obj => obj.fromDate >= new Date(moment().startOf('h')).toISOString()).sort((a, b) => a.fromDate.localeCompare(b.fromDate)).filter(obj => obj.visitStatus !== 3).map((appointment, i) => {
                        return (
                            <AppointmentCard appointment={appointment} refresh={getAppointment} />
                        )
                    })}
                </List>
            </div>
        </div>

    )
}

export default TodaysAppointments