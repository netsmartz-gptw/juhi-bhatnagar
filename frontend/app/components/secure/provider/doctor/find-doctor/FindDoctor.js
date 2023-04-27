import React, { useEffect, useState } from 'react'
import Select from "react-select"
import label from '../../../../../../assets/i18n/en.json'
import DoctorService from '../../../../../services/api/doctor.service'

// Common service
import CommonService from '../../../../../services/api/common.service'

const FindDoctor = (props) => {
    // Temp var holders
    const [permissions, setPermissions] = useState({ addDoctor: true })
    const [isLoader_DoctorLookup, setIsLoader_DoctorLookup] = useState(false)
    const [isLoader_MasterDoctorLookup, setIsLoader_MasterDoctorLookup] = useState(false)
    const [isLoader_FindDoctor, setIsLoader_FindDoctor] = useState(false)

    const [searchValue, setSearchValue] = useState({})
    const [searchErrors, setSearchErrors] = useState({})
    const [displayFilter, setDisplayFilter] = useState({})
    const [searchParamsData, setSearchParamsData] = useState({})
    const [pager, setPager] = useState({})
    const [pageNumber, setPageNumber] = useState(1)

    const [doctorLookupList, setDoctorLookupList] = useState([])
    const [doctorList, setDoctorList] = useState([])

    const [sortingItemsList, setSortingItemsList] = useState([])
    const [sortDoctor, setSortDoctor] = useState("")

    const [noRecordsFound_DoctorList, setNoRecordsFound_DoctorList] = useState([])
    const [noResultsMessage, setNoResultsMessage] = useState("Please select Doctor Type to begin search")

    const { embed } = (props)

    // temp formula
    const openAddDoctorModal = () => {

    }
    const clear = (value) => {

    }
    const clearForm = () => {

    }
    const onMultiSelectClick = (values) => {

    }
    const searchHandler = () => {

    }
    const onDoctorOperationClick = (operation, doctor) => {

    }
    useEffect(() => {
        setIsLoader_DoctorLookup(true);
        DoctorService.doctorLookup({ isRegistered: true })
            .then(
                (response) => {
                    console.log('pre map response', response)
                    let list = response.map(item => {
                        return ({ label: item.doctor, value: item.doctorId })
                    })
                    setDoctorLookupList(list);
                    setDoctorList(list)
                    setIsLoader_DoctorLookup(false);
                })
            .catch(error => {
                setIsLoader_DoctorLookup(false);
                console.log(error)
                // setCheckException(error);
            })
    }, [])

    useEffect(() => {
        DoctorService.findDoctor(searchParamsData)
            .then((findDoctorResponse) => {
                console.log('find doctor response', findDoctorResponse)
                if (findDoctorResponse && findDoctorResponse.length === 0) {
                    setNoRecordsFound_DoctorList(true);
                    setNoResultsMessage('No results found');
                    setDoctorList([]);
                } else {
                    setNoRecordsFound_DoctorList(false);
                    setPager(CommonService.setPager(findDoctorResponse, pageNumber, pager))

                    setDoctorList(findDoctorResponse.data)
                    // console.log('find doctor respone', findDoctorResponse.data)
                    // setDoctorList(doctorList.forEach(element => {
                    //     element.operations = [];
                    //     if (permissions.updateEquipmentType) {
                    //         element.operations.push({ 'key': 'editEquipmentType', 'value': 'Edit' });
                    //     }
                    //     const localDate = moment.utc(element.createdOn).local();
                    //     element.createdOn = CommonService.getFormattedDate(localDate['_d']);
                    //     return element
                    // }))
                }
                setIsLoader_FindDoctor(false);
            })
            .catch(error => {
                setIsLoader_FindDoctor(false);
                console.log(error);
            })
    }, [])
    return (
        <div id="initialLoad">
            <form>
                {!embed && <h1 className="ui header">{label.doctor.find.heading}</h1>}
                <div className={embed ? 'ui apf-search' : 'ui apf-search segment'}>
                    {permissions.addDoctor &&
                        <button className={isLoader_DoctorLookup && isLoader_MasterDoctorLookup ? 'tiny ui orange right floated button loading' : 'tiny ui orange right floated button'}
                            type="button" onClick={openAddDoctorModal()}><i
                                className="sun outline icon"></i>{label.doctor.find.addDoctor}
                        </button>
                    }
                    <div className="u-cf-m"></div>
                    <div className="tiny ui secondary menu">
                        <a className="item">{label.doctor.find.doctorName}</a>
                    </div>
                    <div className="ui segment selection-area">
                        {searchValue.DoctorName &&
                            <a className="ui label">
                                {label.doctor.find.doctorName || displayFilter}
                                <i className="delete icon" onClick={clear('DoctorName')}></i>
                            </a>
                        }
                    </div>
                    {/* EquipmentType Name */}
                    <div className="ui">
                        <div className="">
                            <div className="five fields mb0">
                                <div className="field">
                                    <Select className="selection" name="DoctorName" aria-label='doctorId' onChange={e => { e.preventDefault(); onMultiSelectClick(e) }}
                                        // [hasLabels]="true" [maxSelected]="5"
                                        // labelField="doctor" valueField="doctorId"
                                        //  [isSearchable]="true"
                                        options={doctorLookupList} icon="search">
                                        {/* <sui-select-option *ngFor="let o of DoctorName.filteredOptions" [value]="o"></sui-select-option> */}
                                    </Select>
                                    <span>{searchErrors.DoctorName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ui clearing divider"></div>
                    <button className={isLoader_FindDoctor ? 'btn btn-primary loading' : 'btn btn-primary'}
                        type="submit" onClick={searchHandler(true)}>{label.doctor.find.find}</button>
                </div >
                {doctorList.length === 0 && <div className="ui mt-3 segment bg-light p-3 shadow-sm"><span className="">
                    <p>{noResultsMessage}</p>
                </span>
                </div>}
                {doctorList.length > 0 &&
                    <div>
                        <div className="form">
                            <div className="ui grid">
                                <div className="eight wide column">
                                    <div className="ui mini compact segment sort">
                                        <div className="inline field sort-dd">
                                            <label>{label.common.sortBy}: </label>
                                            <Select className="selection" options={sortingItemsList} name="Sorting"
                                                onChange={e => { e.preventDefault(); sortDoctor(e) }}>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Doctor List */}
                        <div>
                            {doctorList.map(doctor => {
                                return (
                                    <div className="ui segment results" key={doctor.id}>
                                        <div className="results-crsr">
                                            <div className="ui right floated header">
                                                <div className="ui right pointing dropdown">
                                                    {/* <i className="ellipsis horizontal icon"></i>
                                                    <div className="menu"                                                                                                               >
                                                        {doctor.operation.map(operation => {
                                                            return (
                                                                <div className="item">
                                                                    <div className="w100" onClick={onDoctorOperationClick(operation, doctor)}>
                                                                        {operation.value}
                                                                    </div>
                                                                </div>)
                                                        })
                                                        }
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ui horizontal list">
                                            <div className="item">
                                                <div className="content">
                                                    <div className="ui sub header">{doctor.doctor}
                                                    </div>
                                                    <div className="item">
                                                        <strong> {label.doctor.find.creationDate}: </strong>{doctor.createdOn}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                            }
                            )}
                        </div>
                    </div>}
            </form>
        </div>
    )
}

export default FindDoctor