import React, { useState, useEffect } from 'react'

// Common Assets 
import label from '../../../../../../assets/i18n/en.json'

import Select from 'react-select'
import List from '../../../../templates/components/List'
import ModalBox from '../../../../templates/components/ModalBox'
import AddPatient from '../add-patient/AddPatient'
import moment from 'moment'
import Utilities from '../../../../../services/commonservice/utilities'

const FindPatient = (props) => {
    const [keyword, setKeyword] = useState("")
    // const [isLoader, setIsLoader] = useState()

    const [showAdd, setShowAdd] = useState(false)
    const changeKeyword = (kw) => {
        console.log(kw)
        setKeyword(kw)
        if (props.setKeyword) {
                props.setKeyword(kw)
        }
    }
    return (
        <div id="initialLoad">
            {props.isLoader && <div className="ui" >
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">Loading...</div>
                </div>
            </div>}
            {!props.isLoader &&
                <div className={`row d-flex align-items-end ${props.className}`}>
                    <div className="required field col-12">
                        <label>Search Patient</label>
                        <div className='input-group col-12'>
                            <Select
                                options={props.patients.sort((a, b) => a.firstName.localeCompare(b.firstName))}
                                name="patientId"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={props.patients.find(obj => obj.id === keyword?.patientId)}
                                onChange={e => {
                                    changeKeyword(e)
                                }}
                                isClearable={true}
                                // getOptionLabel={(option) => {
                                //     return (
                                //         <div className="d-flex row">
                                //             <span className="col">{option.firstName} {option.lastName}</span>
                                //             <span className='col text-center'><i className='icon birthday cake' />{moment(option.dob).format("M/D/YYYY")}</span>
                                //             <span className='col text-end'><i className='icon mobile alternate' />{option.mobile && Utilities.toPhoneNumber(option.mobile) || option.patientPhone && Utilities.toPhoneNumber(option.patientPhone)}</span>
                                //         </div>
                                //     )
                                // }
                                // }
                                getOptionLabel={(option) => {
                                    return (
                                        // <div className="d-flex row">
                                        //     <span className="col">{option.firstName} {option.lastName}</span>
                                        //     <span className='col text-center'><i className='icon birthday cake' />{moment(option.dob).format("M/D/YYYY")}</span>
                                        //     <span className='col text-end'><i className='icon mobile alternate' />{option.mobile && Utilities.toPhoneNumber(option.mobile) || option.patientPhone && Utilities.toPhoneNumber(option.patientPhone)}</span>
                                        // </div>
                                       option.firstName + ' ' +  option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY")+' | '+ Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                            )
                                }
                                }
                                getOptionValue={(option) => option.id}
                                noOptionsMessage={(e) => { return <button className='btn btn-primary form-control' onClick={e=>{e.preventDefault(); setShowAdd(true)}}>Add Patient</button> }}
                            />
                            <button className='btn btn-primary' title="Add Patient" onClick={e=>{e.preventDefault(); setShowAdd(true)}}><i className='icon plus' /></button>
                        </div>
                    </div>
                    <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
                        <AddPatient isModal onClose={()=>{if(props.refresh){props.refresh()} return setShowAdd(false);}}/>
                    </ModalBox>
                </div>}
        </div >

    )
}

export default FindPatient