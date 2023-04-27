import React, { useEffect, useState } from 'react'
import Select from "react-select"
import label from '../../../../../../assets/i18n/en.json'
import DoctorService from '../../../../../services/api/doctor.service'
import StorageService from '../../../../../services/session/storage.service'
import moment from 'moment'
import List from '../../../../templates/components/List'
// Common service
import CommonService from '../../../../../services/api/common.service'

const DoctorList = (props) => {
    const { keyword } = props
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [sortBy, setSortBy] = useState('')


    const [doctorList, setDoctorList] = useState([])
    const [doctorLookupList, setDoctorLookupList] = useState([])

    const sortingItems = {
        date: [
            { 'label': 'Date: Sesc', 'columnName': 'createdOn', value: 'Desc' },
            { 'label': 'Date: Asc', 'columnName': 'createdOn', value: 'Asc' },
        ],
        order:
            [{ 'label': 'Name: A-Z', 'columnName': 'doctor', value: 'Desc' },
            { 'label': 'Name: Z-A', 'columnName': 'doctor', value: 'Asc' },]
    }

    const [noResultsMessage, setNoResultsMessage] = useState("Please select Provider to begin search")

    const { embed, editDoctor } = (props)


    const onSort = (e) => {
        setSortBy(e.target.value)
        // console.log(e.target.value)
    }

    const deleteItem = (id) => {
        setIsLoader(true)
        DoctorService.delete(id)
        // console.log(id + " is deleted")
        setIsLoader(false)
    }

    useEffect(() => {
        let arr;
        if (sortBy === 'Asc') {
            // arr = doctorList.sort((a, b) => a.name.localeCompare(b.name))
            setDoctorLookupList(doctorList.sort((a, b) => a.name.localeCompare(b.name)))
        }
        else if (sortBy === 'Desc') {
            // arr = doctorList.sort((a, b) => b.name.localeCompare(a.name))
            setDoctorLookupList(doctorList.sort((a, b) => b.name.localeCompare(a.name)))
        }
        else {
            // arr = doctorList
            setDoctorLookupList(doctorList)
        }
        // console.log(arr)

    }, [sortBy])

    useEffect(() => {
        setIsLoader(true);
        DoctorService.doctorLookup({ isRegistered: true })
            .then((response) => {
                setDoctorList(response);
                setDoctorLookupList(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                // console.log(error)
                // setCheckException(error);
            })
    }, [])

    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader"></div>
                </div>
            </div>}
            {!isLoader, doctorLookupList && <List
                listItemStyle='mb-2'
                sortFunc={onSort}
                sortList={sortingItems.order}
                // pageSize={3}
                isLoading={isLoader}
            >
                {doctorLookupList.length && doctorLookupList.filter((doctor) => {
                                    if (keyword === "" || keyword=== null || !keyword) {
                                        return doctor
                                    } else if (doctor.name.toLowerCase().includes(keyword.toLowerCase())) {
                                        return doctor
                                    }
                                }).map(doctor => {
                    return (
                        <div className="ui segment results">
                            <div className="results-crsr">
                                <div className="ui right floated header">
                                    <i className="ui icon pencil" onClick={e => { e.preventDefault(); editDoctor(doctor) }}></i>
                                    <i className="ui tiny icon trash" onClick={e => { e.preventDefault(); deleteItem(doctor.id, doctor) }}></i>
                                </div>
                            </div>
                            <div className="ui horizontal list">
                                <div className="item">
                                    <div className="content">
                                        <div className="ui sub header">{doctor.name}
                                        </div>
                                        <div className="item">
                                            <strong> {label.doctor.find.createdOn}: </strong>{doctor.createdOn}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                }
                )}
            </List>}
        </div>
    )
}

export default DoctorList