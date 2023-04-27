import React, { useEffect, useState } from 'react'
import List from '../../../../templates/components/List'
import AppointmentService from '../../../../../services/api/appointment.service'
import ModalBox from '../../../../templates/components/ModalBox'
import PracticeLocationEdit from '../location-edit/PracticeLocationEdit'

const PracticeLocationList = (props) => {
    const { keyword } = props
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [sortBy, setSortBy] = useState('')
    const [list, setList] = useState([])
    const [locationList, setLocationList] = useState([])
    const [locationId, setLocationId] = useState('')
    const [openModal, setOpenModal] = useState(false)

    const sortingItems = {
        date: [
            { 'label': 'Date: Sesc', 'columnName': 'createdOn', value: 'Desc' },
            { 'label': 'Date: Asc', 'columnName': 'createdOn', value: 'Asc' },
        ],
        order:
            [{ 'label': 'Name: A-Z', 'columnName': 'equipmentType', value: 'Desc' },
            { 'label': 'Name: Z-A', 'columnName': 'equipmentType', value: 'Asc' },]
    }


    const onSort = (e) => {
        setSortBy(e.target.value)
        console.log(e.target.value)
    }

    const editModal = () => {
        setOpenModal(true)
    }

    useEffect(() => {
        if (sortBy === 'Asc') {
            setLocationList(list.sort((a, b) => a.practiceLocation.localeCompare(b.practiceLocation)))
        }
        else if (sortBy === 'Desc') {
            setLocationList(list.sort((a, b) => b.practiceLocation.localeCompare(a.practiceLocation)))
        }
        else {
            setLocationList(list)
        }
    }, [sortBy])

    const getPracticeLocations = () => {
        setIsLoader(true);
        AppointmentService.practiceLocation()
            .then((response) => {
                setList(response);
                setLocationList(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }
    useEffect(() => {
        getPracticeLocations()
    }, [])

    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader"></div>
                </div>
            </div>}
            {!isLoader, locationList && <List
                listItemStyle='mb-2'
                sortFunc={onSort}
                sortList={sortingItems.order}
                isLoading={isLoader}
            >
                {locationList.length && locationList.filter((location) => {
                    if (keyword === "" | null) {
                        return location
                    } else if (location.practiceLocation.includes(keyword)) {
                        return location
                    }
                })
                    .map(practiceLocation => {
                        return (
                            <div className="ui segment results">
                                {/* <div className="results-crsr">
                                    <div className="ui right floated header">
                                        <button className='btn btn-primary' title="Edit Patient" onClick={() => { editModal(); setLocationId(practiceLocation.practiceLocationId) }}><i className={`icon pencil`} /></button>
                                    </div>
                                </div> */}
                                <div className="d-flex row align-items-center justify-content-between">
                                    <div className='col'>
                                        <div className="ui sub header">{practiceLocation.practiceLocation}
                                        </div>
                                    </div>
                                    <div className='col-auto'>
                                        <button className='btn btn-primary' title="Edit Patient" onClick={() => { editModal(); setLocationId(practiceLocation.practiceLocationId) }}><i className={`icon pencil`} /></button>
                                    </div>
                                </div>
                            </div>)
                    }
                    )}
            </List>}
            <ModalBox open={openModal} onClose={() => setOpenModal(false)}>
                <PracticeLocationEdit locationId={locationId} onClose={() => { setOpenModal(false); getPracticeLocations() }} />
            </ModalBox>
        </div >
    )
}

export default PracticeLocationList