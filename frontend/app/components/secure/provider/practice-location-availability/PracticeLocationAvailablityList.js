import React, { useEffect, useState } from 'react'
import label from '../../../../../assets/i18n/en.json'
import PracticeLocationAvailabilityService from '../../../../services/api/practice-location-availablity.service';
import AppointmentService from '../../../../services/api/appointment.service'
import List from '../../../templates/components/List'
import { Dropdown } from 'semantic-ui-react'
import Select from "react-select"
import toast from 'react-hot-toast';

import MessageSetting from '../../../../common/constants/message-setting.constant'
import ModalBox from '../../../templates/components/ModalBox';

const PracticeLocationAvailablityList = (props) => {
    const { keyword, refresh } = props
    const [isLoader, setIsLoader] = useState(false)
    const [sortBy, setSortBy] = useState('')

    const [locationId, setLocationId] = useState('')
    const [locationLookupList, setLocationLookupList] = useState([])
    const [list, setList] = useState([])
    const [deleteModal,setDeleteModal] = useState(false)
    

    const dowList = [
        {
            label: 'Sun',
            value: 1
        },
        {
            label: 'Mon',
            value: 2
        },
        {
            label: 'Tue',
            value: 3
        },
        {
            label: 'Wed',
            value: 4
        },
        {
            label: 'Thu',
            value: 5
        },
        {
            label: 'Fri',
            value: 6
        },
        {
            label: 'Sat',
            value: 7
        },
    ]

    const sortingItems = {
        date: [
            { 'label': 'Date: Sesc', 'columnName': 'createdOn', value: 'Desc' },
            { 'label': 'Date: Asc', 'columnName': 'createdOn', value: 'Asc' },
        ],
        order:
            [{ 'label': 'Name: A-Z', 'columnName': 'name', value: 'Desc' },
            { 'label': 'Name: Z-A', 'columnName': 'name', value: 'Asc' },]
    }

    const [noResultsMessage, setNoResultsMessage] = useState("Please select Service to begin search")
    const { embed, editService } = (props)

    const onSort = (e) => {
        setSortBy(e.target.value)
    }

    const changeStatus = (service) => {

    }

    useEffect(() => {
        setIsLoader(true);
        PracticeLocationAvailabilityService.practiceLocationAvailablity({ PracticeLocationId: locationId })
            .then((response) => {
                // console.log(response)
                // setLocationList(response.selectResponse.splice(1,5));
                setLocationLookupList(response.selectResponse.splice(1, 5));
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
                // setCheckException(error);
            })
    }, [locationId])

    useEffect(() => {
        setIsLoader(true);
        AppointmentService.practiceLocation()
            .then(
                (response) => {
                    // console.log(response)
                    let array = response.map(item => {
                        return ({ label: item.practiceLocation, value: item.practiceLocationId })
                    })
                    setList(array);
                    setIsLoader(false);
                })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }, [])

    const addHandler = (e) => {
        e.preventDefault();
        let newStateObject = [...locationLookupList];
        newStateObject.push({ dow: 0, startTime: '', endTime: '' });
        setLocationLookupList(newStateObject);
    }

    const changeLocation = (e) => {
        // console.log(e)
        setLocationId(e)

    }

    const inputChange = (e, i) => {
        let newStateObject = [...locationLookupList];
        newStateObject[i][e.target.name] = e.target.value;
        return setLocationLookupList(newStateObject);
    }

    const saveRow = (src) => {
        if (src.dow && src.startTime && src.endTime && locationId) {
            setIsLoader(true);
            const reqObj = { dow: src.dow, startTime: src.startTime, endTime: src.endTime, practiceLocationId:locationId }
            const resObj = src.practiceLocationAvailabilityId ? PracticeLocationAvailabilityService.updateAvailability(reqObj, src.practiceLocationAvailabilityId) : PracticeLocationAvailabilityService.createAvailability(reqObj)
            resObj.then((response) => {
                // console.log(response)
                toast.success('Record Updated')
                setIsLoader(false);
            })
                .catch(error => {
                    setIsLoader(false);
                    console.log(error)
                })
        }
    }

    const deleteAvailability = (id)  =>  {
        
        PracticeLocationAvailabilityService.deleteAvailability(id)
        .then(res => toast.success('Delete Availability successful'))
        .catch(err => console.log(err))
    }

    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader"></div>
                </div>
            </div>}
            <div className='field row ui segment results'>
                <div className='col-9'>
                    <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        value={list.find(obj => obj.practiceLocationId === locationId)}
                        options={list}
                        onChange={e => { changeLocation(e.value) }}
                        isClearable={true}
                        getOptionLabel={(option) => { return (option.label) }}
                    />

                </div>
                <div className='col-3'>
                    <button className='btn btn-primary' title="Add Location" onClick={addHandler}>Add</button>
                </div>
            </div>
            {!isLoader, locationLookupList && <List
                listItemStyle='mb-2'
                sortFunc={onSort}
                // pageSize={3}
                isLoading={isLoader}
            >
                {locationLookupList.length && locationLookupList.map((src, i) => {
                // console.log(src.practiceLocationAvailabilityId)
                    return (
                    
                        <div class="ui segment results" key={src.id}>
                            <div class="ui horizontal list d-flex justify-content-between align-items-center">
                                <div class="item w-100">
                                    <div class="content">
                                        <div class="ui sub header">
                                            <Select
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                value={dowList.find(obj => obj.value === src.dow)}
                                                options={dowList}
                                                onChange={e => { inputChange({ target: { value: e.value, name: 'dow' } }, i) }}
                                                isClearable={true}
                                                getOptionLabel={(option) => { return (option.label) }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="item w-100">
                                    <div className="content">
                                        <div className="ui sub header">
                                            <input
                                                type='time'
                                                className="form-control"
                                                name="startTime"
                                                value={src.startTime}
                                                onChange={(e) => { e.preventDefault(); inputChange(e, i) }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="item w-100">
                                    <div className="content">
                                        <div className="ui sub header">
                                            <input
                                                type='time'
                                                className="form-control"
                                                name="endTime"
                                                value={src.endTime}
                                                onChange={(e) => { e.preventDefault(); inputChange(e, i) }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="item w-100">
                                    <div className="content">
                                        <div className="ui sub header">
                                            <button className='btn btn-primary' title="Save Availability" onClick={e => { saveRow(src) }}>Save</button>
                                            <button className='btn btn-primary' title="Delete Availability" onClick={e => { setDeleteModal(true);}}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                                <ModalBox open={deleteModal} onClose={() => { setDeleteModal(false) }} title="Delete Block">
                                        {/* {locationLookupList.practiceLocationAvailabilityId && <div className='row d-flex align-items-center justify-content-between'> */}
                                                <div className='col'>
                                                    Are you sure you want to delete ?
                                                </div>
                                                <div className='col-auto'>
                                                    <button className='btn btn-secondary' onClick={e => { e.preventDefault(); return setDeleteModal(false) }}>No</button>
                                                    <button className='btn btn-secondary' onClick={e => { e.preventDefault(); deleteAvailability(src.practiceLocationAvailabilityId); setDeleteModal(false) }}>Yes</button>
                                                </div>
                                            {/* </div>} */}
                                </ModalBox>
                            </div>
                        </div>)
                }
                )}
            </List>}
        </div>
    )
}

export default PracticeLocationAvailablityList