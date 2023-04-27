import moment from 'moment'
import React, { useEffect, useState, useCallback } from 'react'
import CommonService from '../../../../../services/api/common.service'
import Utilities from '../../../../../services/commonservice/utilities'
import InfiniteScroller from '../../../../templates/components/InfiniteScroller'
import AsyncSelect from 'react-select/async';
import PatientCard from './patient-card/PatientCard'
import { debounce } from 'lodash'
import PatientService from '../../../../../services/api/patient.service'
import DimLoader from '../../../../templates/components/DimLoader'
import PlFormsService from '../../../../../services/api/plforms.service'
import InvoiceService from '../../../../../services/api/invoice.service'
import ModalBox from '../../../../templates/components/ModalBox'
import AddPatient from '../add-patient/AddPatient'

const PatientList = (props) => {
    const [patientList, setPatientList] = useState()
    const [keyword, setKeyword] = useState()
    const [isLoader, setIsLoader] = useState(false)
    const [isLoader_Forms, setIsLoader_Forms] = useState(false)
    const [isLoader_Balance, setIsLoader_Balance] = useState(false)
    const [forms, setForms] = useState()
    const [balances, setBalances] = useState()
    const [showAdd, setShowAdd] = useState(false)

    const patientLookup = (keyword) => {
        setPatientList()
        setForms()
        setIsLoader(true)
        if (keyword) {
            PatientService.getPatientById(keyword)
                .then(res => {
                    console.log(res.data)
                    setPatientList([res.data])
                    let patientIds = res.data.id
                    formRetrieve(patientIds)
                    pullInvoiceBalances(patientIds)
                    return setIsLoader(false)
                })
        }
        else {
            let reqObj = { SearchTerm: '', isActive: true, isRegistered: true, StartRow: 0, PageSize: 25, SortField: 'firstName', PatientIds: keyword }
            CommonService.patientLookup(reqObj)
                .then(res => {
                    if (res) {
                        // console.log(res.data)
                        setPatientList(res?.data)
                        let patientIds = res.data.map(obj => { return obj.id })
                        formRetrieve(patientIds)
                        pullInvoiceBalances(patientIds)
                        return setIsLoader(false)
                    }
                })
                .catch(err => {
                    console.log(err);
                    setIsLoader(true)
                })
        }
    }

    const formRetrieve = (patientIds) => {
        // console.log(patientIds)
        let reqObj = {
            PatientIds: patientIds
        }
        PlFormsService.getMapFormsWithPatient(reqObj)
            .then(res => {
                // console.log(res.data)
                if (res?.data?.length > 0) {
                    setForms(res.data)
                }
            })
    }

    const pullInvoiceBalances = (patientIds) => {
        let reqObj = {
            sortField: 'dueDate',
            Asc: 'false',
            PatientIds: patientIds,
            StartRow: 0,
            InvoiceStatuses: '1,2,6,7,8,10',
        }
        InvoiceService.findInvoice(reqObj)
            .then((res) => {
                // console.log(res)
                if (res.length) {
                    if (Array.isArray(res) === true) {
                        setBalances(res.sort((a, b) => b.dueDate.localeCompare(a.dueDate)))
                    }
                    else {
                        setBalances([res]);
                    }
                }
                else {
                    setBalances();
                }
            })
            .catch((err) => {
                console.log(err);
            });

    }

    const rePatientLookup = useCallback(debounce(patientLookup, 500), [])
    useEffect(() => {
        rePatientLookup(keyword)
    }, [keyword])

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

    return (
        <div className=''>
            <div className='row'>
                <div title="Patient" eventKey="patientId">
                    <div className='field p-3'>
                        <label>Search by Patient</label>
                        <div className="row d-flex">
                            <div className="col">
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
                                    noOptionsMessage={(e) => { if (keyword?.length > 3) { return <button className='btn btn-primary form-control' onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add Patient</button> } else { return 'Begin typing to search patients...' } }}
                                />
                            </div>
                            <div className="col-auto">
                                <button className='btn btn-primary form-control' title="Add Patient" onClick={e => { e.preventDefault(); setShowAdd(true) }}><i className='icon plus' /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='ui segment m-3 row d-flex p-3'>
                {/* <List noPaginate className="ui segment mt-3 row d-flex scroll-list p-3 container-fluid" style={patientList && { maxHeight: '55vh' }}> */}
                {isLoader || isLoader_Balance || isLoader_Forms ? <DimLoader /> : null}
                {/* <InfiniteScroller> */}
                {patientList && !isLoader_Forms && !isLoader_Balance ? patientList.map((patient, i) => {
                    let end = false
                    if (i === patientList) {
                        end = true
                    }
                    return (
                        <PatientCard balance={balances?.find(obj => obj.patientId === patient.id) ? balances?.filter(obj => obj.patientId === patient.id) : null} forms={forms?.find(obj => obj.patientId === patient.id) ? forms?.filter(obj => obj.patientId === patient.id) : null} id={patient.id} patient={patient} keyword={keyword} key={i} index={i} refresh={() => patientLookup()} />

                    )
                }) : null}
                {/* </List> */}
                {/* </InfiniteScroller> */}
            </div>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
                <AddPatient onClose={() => { setShowAdd(false) }} />
            </ModalBox>
        </div>
    )
}

export default PatientList