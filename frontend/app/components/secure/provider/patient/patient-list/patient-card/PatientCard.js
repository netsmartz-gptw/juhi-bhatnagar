import React, { useEffect, useState } from 'react'
import PatientService from '../../../../../../services/api/patient.service'
import moment from 'moment'
import { Dropdown, Accordion, Icon } from 'semantic-ui-react'
import ModalBox from '../../../../../templates/components/ModalBox'
import EditPatient from '../../edit-patient/EditPatient'
import AddAppointmentForm from '../../../appointment/add-appointment-form/AddAppointmentForm'
import NoteAdd from '../../../note/note-add/NoteAdd'


// Accordion Imports
import AppointmentList from "../patient-card/appointment-list/AppointmentList";
import ContactDetails from '../patient-card/contact-details/ContactDetails';
import FormsList from "../patient-card/forms/forms-list/FormsList"
import OpenBalancesList from '../patient-card/open-balances/open-balances-list/OpenBalancesList';
import TransactionHistoryList from "../patient-card/transactions-list/TransactionHistoryList"
import WalletList from "../patient-card/wallet/wallet/WalletList"


import PatientAccountAdd from '../../../patient-account/patient-account-add/PatientAccountAdd'
import { useNavigate } from 'react-router-dom'
import Utilities from '../../../../../../services/commonservice/utilities'
import PCNoteList from './pc-note-list/PCNoteList'
import AddInvoice from '../../../invoices/add-invoice/AddInvoice'
import AddForms from '../../add-forms/AddForms'
import MembershipList from './membership/MembershipList'

import toast from 'react-hot-toast'
import PatientOptInOut from '../../patient-optinout/PatientOptInOut'
import PlFormsService from '../../../../../../services/api/plforms.service'
import PaymentPlanList from '../../../report/paymentPlan-list/PaymentPlanList'
import CommunicationList from './communication-list/CommunicationList'


const PatientCard = (props) => {
    const [showMore, setShowMore] = useState(false)
    const [keyword, setKeyword] = useState(props.keyword || null)
    const [showAddAppointment, setShowAddAppointment] = useState(false)
    const [showAddPaymentAccount, setShowAddPaymentAccount] = useState(false)
    const [showProcessPayment, setShowProcessPayment] = useState(false)
    const [activeIndex, setActiveIndex] = useState()
    const [patient, setPatient] = useState(props.patient)
    const [showDeactivate, setShowDeactivate] = useState(false)
    const [forms, setForms] = useState()
    const [balance, setBalance] = useState()

    const [contactDetailsAdd, setContactDetailsAdd] = useState(false)
    const [noteAdd, setNoteAdd] = useState(false)
    const [showAddForms, setShowAddForms] = useState(false)
    const [optInLocale, setOptInLocale] = useState()
    const [showOpt, setShowOpt] = useState(false)
    const [refresh, setRefresh] = useState()
    const [balances, setBalances] = useState()
    const [contactDetails, setContactDetails] = useState()
    const navigate = useNavigate()

    const formRetrieve = () => {
        let reqObj = {
            PatientIds: props.id
        }
        PlFormsService.getMapFormsWithPatient(reqObj)
            .then(res => {
                if (res?.data?.length > 0) {
                    // console.log(res?.data[0].formIds)
                    setForms(res?.data[0].formIds)
                }
            })
    }

    const optInOut = (authorizeMode) => {
        setRefresh(false)
        let reqObj = {
            authorizeMode: authorizeMode,
            isOptOut: patient.isOptIn === 1 ? true : false,
            patientId: patient.id
        }
        PatientService.optInOptOutPatient(reqObj)
            .then(res => {
                console.log(res)
                toast.success(res.message)
                return setRefresh(true)
            })
            .catch(err => {
                console.log(err)
                toast.success("Opt In/Out Failed")
                return setRefresh(true)
            })

    }
    const findPatient = () => {
        PatientService.getPatientById(props.id)
            .then(res => {
                if (res?.data) {
                    console.log(res.data)
                    setPatient(res.data)
                }
            })
    }

    const setIndex = (i) => {
        if (i === activeIndex) {
            setActiveIndex()
        }
        else {
            setActiveIndex(i)
        }
    }

    const toggleShowAddForms = (e) => {
        e.preventDefault();
        setShowAddForms(false)
    }

    const deactivate = (id) => {
        PatientService.inactivatePatient(props.id)
            .then(res => { return res.data })
    }

    useEffect(() => {
        if (refresh == true) {
            findPatient()
            formRetrieve()
            return setRefresh(false)
        }
    }, [refresh])


    // useEffect(() => {
    //     findPatient()
    // }, [props.id])

    useEffect(() => {
        setKeyword(props.keyword)
    }, [props.keyword])
    useEffect(() => {
        // formRetrieve() //remove once api updated
        // findPatient() //remove once api updated
    }, [props.keyword])

    useEffect(() => {
        if (props?.forms) {
            // console.log(props.forms[0])
            setForms(props.forms[0].formIds)
        }
    }, [props.forms])

    useEffect(() => {
        if (props?.balance) {
            let total = 0
            // console.log(props?.balance)
            props?.balance.forEach(obj => total += obj.finalAmount)
            setBalance(total)
            setBalances(props.balance)
        }
    }, [props.balance])
    return (
        <div className='container-flex card mb-3 bg-light'>
            {patient &&
                <div className='row d-flex p-3'>
                    <div className='col-12 row-fluid d-flex justify-content-between'>
                        <div className='col row d-flex align-items-start'>
                            <div className='col btn text-start' onClick={e => { e.preventDefault(); setShowMore(!showMore) }}>
                                <div className='row d-flex align-items-center justify-content-between g-3'>
                                    <div className='col-md-auto col-12'>
                                        <h5><strong>{patient.firstName} {patient.lastName}</strong>
                                        </h5>
                                    </div>
                                    <div className='col-md col-sm-12'>
                                        {forms && forms.map(form => {
                                            return (
                                                <span className={`badge text-white me-1 ${form.status === 0 ? 'bg-danger' : 'bg-success'}`}>{form.formTitle}</span>
                                            )
                                        })}
                                        {/* {forms && forms.length > 3 ? <a href="#" onClick={e => { e.preventDefault(); setActiveIndex(3) }}>and {forms.length - 3} more</a> : null} */}
                                    </div>
                                    <div className="col-md-auto col-12">
                                        <div className='btn-group'>
                                            <button className='btn btn-primary' title="Collect Payment from Patient" onClick={e => { e.preventDefault(); setShowProcessPayment(true) }}><i className={`icon dollar`} /></button>
                                            <button className='btn btn-primary' title="Edit Patient" onClick={e => { e.preventDefault(); setContactDetailsAdd(true) }}><i className={`icon pencil`} /></button>
                                            <button className='btn btn-primary' title="Add a Patient Note" onClick={e => { e.preventDefault(); setNoteAdd(true) }}><i className={`icon sticky note outline`} /></button>
                                            <button className='btn btn-primary' title="Add Appointment for Patient" onClick={e => { e.preventDefault(); setShowAddAppointment(true) }}><i className={`icon calendar plus outline`} /></button>
                                            <Dropdown button direction="left" icon="ellipsis horizontal" className="btn-primary icon btn p-o">
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={e => { e.preventDefault(); findPatient(); return setShowOpt(true) }}>{patient.isOptIn === 1 ? 'Opt Out' : 'Opt In'} for Notifications</Dropdown.Item>
                                                    <Dropdown.Item onClick={e => { e.preventDefault(); setShowAddPaymentAccount(true) }}>Add Payment Account</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12 row d-flex g-3'>
                                        <span className='col-md-4 col-12 d-inline-block text-truncate'><i className='icon birthday cake' /> {moment.utc(patient.dob).format("M/D/YYYY")}</span>
                                        <span className='col-md-4 col-12 d-inline-block text-truncate'>
                                            <strong>SSN </strong>
                                            {patient.ssn || '----'}
                                        </span>
                                        <span className='col-md-4 col-12 d-inline-block text-truncate'><i className='icon envelope' />{patient.email || '----'}</span>
                                        <span className='col-md-4 col-12 d-inline-block text-truncate'><i className='icon phone' /> {patient.phone && Utilities.toPhoneNumber(patient.phone) || patient.mobile && Utilities.toPhoneNumber(patient.mobile)}</span>
                                        <div className='col-md-4 col-12 d-flex align-items-center'>
                                            {patient.isOptIn == 1 ?
                                                <span className='align-items-center'><i className='col-auto icon check' title="Opted In" /><span className='col-auto'>Opted in for mobile</span></span>
                                                : patient.isOptIn === 0 ? <span className='align-items-center'><i className='col-auto icon dont' title="Opted Out" /><span className='col-auto'>Opted out of mobile</span></span> : null}
                                        </div>
                                        {balance &&  <span className='col-md-4 col-12 d-inline-block text-truncate' title="Open Balance">
                                            <strong>OPEN</strong> {Utilities.toDollar(balance)}</span>
}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showMore && <div className='mt-3'>
                        <Accordion fluid styled>
                            <Accordion.Title
                                active={activeIndex === 0}
                                index={0}
                                onClick={e => { e.preventDefault(); setIndex(0) }}
                            > <Icon name='dropdown' />Additional Details</Accordion.Title>
                            <Accordion.Content active={activeIndex === 0}>
                                {activeIndex === 0 && <ContactDetails patientId={patient.id} patient={patient} keyword={keyword} pull={activeIndex === 0} />}
                            </Accordion.Content>


                            <Accordion.Title
                                active={activeIndex === 1}
                                index={1}
                                onClick={e => { e.preventDefault(); setIndex(1) }}
                            > <Icon name='dropdown' />Wallet{activeIndex === 1 && <Icon name="plus" title="Add Patient Wallet Details" onClick={e => { e.preventDefault(); setShowAddPaymentAccount(true) }} className='btn p-1 float-right' />}</Accordion.Title>
                            <Accordion.Content active={activeIndex === 1}>
                                {activeIndex === 1 && <WalletList patientId={patient.id} keyword={keyword} pull={activeIndex === 1} />}
                            </Accordion.Content>
                            <Accordion.Title
                                active={activeIndex === 3}
                                index={3}
                                onClick={e => { e.preventDefault(); setIndex(3) }}
                            > <Icon name='dropdown' />Forms{activeIndex === 3 && <Icon patientId={patient.id} name="plus" title="Add Forms to Patient" className='btn p-0 m-0 float-right' onClick={e => { e.preventDefault(); setShowAddForms(true) }} />}</Accordion.Title>
                            <Accordion.Content active={activeIndex === 3}>
                                {activeIndex === 3 && <FormsList forms={forms} email={patient.email} patientId={patient.id} patient={patient} keyword={keyword} pull={activeIndex === 3} openModal={() => setShowAddForms(true)} />}
                            </Accordion.Content>

                            <Accordion.Title
                                active={activeIndex === 4}
                                index={4}
                                onClick={e => { e.preventDefault(); setIndex(4) }}
                            > <Icon name='dropdown' />Notes{activeIndex === 4 && <Icon name="plus" title="Add a Patient Note" className='btn p-0 m-0 float-right' onClick={e => { e.preventDefault(); setNoteAdd(true) }} />}</Accordion.Title>
                            <Accordion.Content active={activeIndex === 4}>
                                {activeIndex === 4 && <PCNoteList patientId={patient.id} keyword={keyword} pull={activeIndex === 4} refresh={refresh} />}
                            </Accordion.Content>

                            <Accordion.Title
                                active={activeIndex === 5}
                                index={5}
                                onClick={e => { e.preventDefault(); setIndex(5) }}
                            > <Icon name='dropdown' />Appointments{activeIndex === 5 && <Icon name="plus" title="Add Appointment for Patient" className='btn p-0 m-0 float-right' onClick={e => { e.preventDefault(); setShowAddAppointment(true) }} />}</Accordion.Title>
                            <Accordion.Content active={activeIndex === 5}>
                                {activeIndex === 5 && <AppointmentList patientId={patient.id} keyword={keyword} pull={activeIndex === 5} refresh={() => props.refresh()} />}
                            </Accordion.Content>

                            <Accordion.Title
                                active={activeIndex === 6}
                                index={6}
                                onClick={e => { e.preventDefault(); setIndex(6) }}
                            > <Icon name='dropdown' />Open Balances{activeIndex === 6 && <Icon name="plus" title="Add Invoice for Patient" className='btn p-0 m-0 float-right' onClick={e => { e.preventDefault(); setShowProcessPayment(true) }} />}</Accordion.Title>
                            <Accordion.Content active={activeIndex === 6}>
                                {activeIndex === 6 && <OpenBalancesList balances={balances} patientId={patient.id} keyword={keyword} pull={activeIndex === 6} />}
                            </Accordion.Content>
                            <Accordion.Title
                                active={activeIndex === 7}
                                index={7}
                                onClick={e => { e.preventDefault(); setIndex(7) }}
                            > <Icon name='dropdown' />Payment Plans and Memberships{activeIndex === 7 && <Icon name="plus" title="Add Membership Details" className='btn p-0 m-0 float-right' onClick={e => { e.preventDefault(); setMembershipAdd(true) }} />}</Accordion.Title>
                            <Accordion.Content active={activeIndex === 7}>
                                {activeIndex === 7 && <MembershipList patientId={patient.id} pull={activeIndex === 7} />}
                            </Accordion.Content>
                            <Accordion.Title
                                active={activeIndex === 8}
                                index={8}
                                onClick={e => { e.preventDefault(); setIndex(8) }}
                            > <Icon name='dropdown' />Transaction History</Accordion.Title>
                            <Accordion.Content active={activeIndex === 8}>
                                {activeIndex === 8 && <TransactionHistoryList patientId={patient.id} keyword={keyword} pull={activeIndex === 8} />}
                            </Accordion.Content>
                            {/* <Accordion.Title
                                active={activeIndex === 9}
                                index={9}
                                onClick={e => { e.preventDefault(); setIndex(9) }}
                            > <Icon name='dropdown' />Insurance Details{activeIndex === 9 && <Icon name="plus" title="Add Insurance Details" className='btn p-0 m-0 float-right' onClick={e => { e.preventDefault(); setContactDetailsAdd(true) }} />}</Accordion.Title>
                            <Accordion.Content active={activeIndex === 9}>
                                <PatientInsuranceInfo patientId={patient.id} patient={patient} keyword={keyword} pull={activeIndex === 9} />
                            </Accordion.Content> */}
                            <Accordion.Title
                                active={activeIndex === 9}
                                index={9}
                                onClick={e => { e.preventDefault(); setIndex(9) }}
                            > <Icon name='dropdown' />Communication History</Accordion.Title>
                            <Accordion.Content active={activeIndex === 9}>
                                {activeIndex === 9 && <CommunicationList patientId={patient.id} keyword={keyword} pull={activeIndex === 9} />}
                            </Accordion.Content>
                        </Accordion>
                    </div>}
                </div>
            }



            <ModalBox open={contactDetailsAdd} onClose={() => { setContactDetailsAdd(false) }} title="Edit Patient">
                <EditPatient id={patient.id} onClose={() => { props.refresh(); return setContactDetailsAdd(false); }} isModal />
            </ModalBox>

            <ModalBox open={noteAdd} onClose={() => { setNoteAdd(false) }} title="Add a Patient Note">
                {/* <h5>Add a Patient Note</h5> */}
                <NoteAdd initialData={{ patientId: patient.id }} patient={patient} onClose={() => setNoteAdd(false)} isModal />
            </ModalBox>

            <ModalBox open={showAddAppointment} onClose={() => { setShowAddAppointment(false) }} title="Add Appointment">
              {showAddAppointment &&  <AddAppointmentForm initialData={{ patientId: patient.id }} onClose={() => setShowAddAppointment(false)} />}
            </ModalBox>
            <ModalBox open={showAddPaymentAccount} onClose={() => { setShowAddPaymentAccount(false) }} title="Add Patient Account">
                <PatientAccountAdd patientId={patient.id} onClose={() => setShowAddPaymentAccount(false)} />
            </ModalBox>
            <ModalBox open={showProcessPayment} onClose={() => { setShowProcessPayment(false) }} title="Add Invoice" size="fullscreen">
                <AddInvoice selectPatientDisabled initialData={{ patientId: patient.id }} onClose={() => { setShowProcessPayment(false); }} isModal />
            </ModalBox>
            <ModalBox requireConfirm open={showDeactivate} onClose={() => { setShowDeactivate(false) }}>
                Are you
            </ModalBox>
            <ModalBox open={showAddForms} onClose={() => { setShowAddForms(false) }} title="Add Forms">
                <AddForms onClose={() => { setRefresh(true); return setShowAddForms(false) }} patientId={patient.id} />
            </ModalBox>
            <ModalBox open={showOpt} onClose={() => { setShowOpt(false) }} title={`Opt ${patient.isOptIn === 1 ? 'Out of' : 'In to'} to text notifications`}>
                <PatientOptInOut patient={patient} onClose={() => { setRefresh(true); return setShowOpt(false) }} />
            </ModalBox>
        </div>
    )
}

export default PatientCard