import React, { useEffect, useState } from 'react'
import List from '../../../../templates/components/List'
import AppointmentService from '../../../../../services/api/appointment.service'
import ModalBox from '../../../../templates/components/ModalBox'
import PracticeLocationRoomEdit from '../location-room-edit/PracticeLocationRoomEdit'
import axios from 'axios'

const PracticeLocationRoomList = (props) => {
    const { keyword } = props
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [sortBy, setSortBy] = useState('')
    const [list, setList] = useState([])
    const [locationList, setLocationList] = useState([])
    const [practiceLocationRoomId, setPracticeLocationRoomId] = useState('')
    const [openModal, setOpenModal] = useState(false)

    const sortingItems = {
        date: [
            { 'label': 'Date: Desc', 'columnName': 'createdOn', value: 'Desc' },
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
            setLocationList(list.sort((a, b) => a.room.localeCompare(b.room)))
        }
        else if (sortBy === 'Desc') {
            setLocationList(list.sort((a, b) => b.room.localeCompare(a.room)))
        }
        else {
            setLocationList(list)
        }
    }, [sortBy])
  
 
    const practiceLocationRoomLookup = (id) => {
        setIsLoader(true)
       
        AppointmentService.practiceLocationRoomLookup(id)
            .then((response) => {
                setList(response)
                setLocationList(response)
                setIsLoader(false)
            })
            .catch((error) => {
                console.log(error)
                setIsLoader_Room(false)
            })
    }


    useEffect(() => {
        practiceLocationRoomLookup(keyword)
    }, [keyword])

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
                {locationList.length && locationList
                    .map(room => {
                        // console.log(practiceLocation)
                        return (
                            <div className="ui segment results">
                                <div className="d-flex row align-items-center justify-content-between">
                                    <div className='col'>
                                        <div className="ui sub header">{room.room}
                                        </div>
                                    </div>
                                    <div className='col-auto'>
                                        <button className='btn btn-primary' title="Edit Patient" onClick={() => { editModal(); setPracticeLocationRoomId(room.practiceLocationRoomId) }}><i className={`icon pencil`} /></button>
                                    </div>
                                </div>
                            </div>)
                    }
                    )}
            </List>}
            <ModalBox open={openModal} onClose={() => setOpenModal(false)}>
                <PracticeLocationRoomEdit practiceLocationRoomId={practiceLocationRoomId} onClose={() =>  {setOpenModal(false);practiceLocationRoomLookup(keyword)}} />
            </ModalBox>
        </div >
    )
}

export default PracticeLocationRoomList