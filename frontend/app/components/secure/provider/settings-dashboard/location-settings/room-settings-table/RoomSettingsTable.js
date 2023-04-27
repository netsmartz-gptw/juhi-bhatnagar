import React, { useEffect, useState, useContext } from 'react'
import Table from '../../../../../templates/components/Table'
import { store } from '../../../../../../context/StateProvider'
import AppointmentService from '../../../../../../services/api/appointment.service'
import PracticeLocationSelector from '../../../../../templates/components/PracticeLocationSelector'
import ModalBox from '../../../../../templates/components/ModalBox'
import PracticeLocationRoomEdit from '../../../practice-location-room/location-room-edit/PracticeLocationRoomEdit'
import PracticeLocationRoomAdd from '../../../practice-location-room/location-room-add/PracticeLocationRoomAdd'
import toast from 'react-hot-toast'

const RoomSettingsTable = (props) => {

    const [isLoader, setIsLoader] = useState(false)
    const [roomList, setRoomList] = useState()
    const [selectedRoom, setSelectedRoom] = useState()
    const [editModal, setEditModal] = useState(false)
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const state = useContext(store).state
    const practiceLocationRoomLookup = (id) => {
        setIsLoader(true)
        AppointmentService.practiceLocationRoomLookup(state.practiceLocationId.practiceLocationId)
            .then((response) => {
                console.log(response)
                setRoomList(response)
                setIsLoader(false)
            })
            .catch((error) => {
                // console.log(error)
                setIsLoader(false)
            })
    }

    const deleteItem = (id) => {
        return AppointmentService.deletePracticeLocationRoom(id)
        .then(res => {
            toast.success("Practice Location Room deleted");
            practiceLocationRoomLookup()
        })
        .catch(err => {
            toast.error("Error deleting Practice Location Room")
        })
    }
    const columns = [
        {
            key: "room",
            text: "Room",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "actionPracticePatient",
            text: "Action",
            // className: "name",
            align: "center",
            sortable: false,
            cell: (room, i) => {
                return (

                    <div className='d-flex justify-content-center'>
                        <button className="p-0 ps-1 btn btn-primary" title="Edit room" onClick={e => { e.preventDefault(); setSelectedRoom(room); return setEditModal(true) }}><i className="icon pencil" /></button>
                        <button className="p-0 ps-1 btn btn-primary ms-1" title="Delete Room" onClick={e => { e.preventDefault(); setSelectedRoom(room) ;return setDeleteModal(true) }}><i className="icon trash"/></button>
                    </div>
                )
            }
        }
    ]

    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "Rooms",
        button: {
            excel: true,
            print: true,
            csv: true,
            extra: true
        },
        language: {
            loading_text: "Please be patient while data loads..."
        }
    }

    useEffect(() => {
        if (state?.practiceLocationId?.practiceLocationId) {
            practiceLocationRoomLookup()
        }
    }, [state?.practiceLocationId])

    return (
        <div>
            <Table loading={isLoader} records={roomList} config={config} columns={columns}
                extraButtons={[
                    { className: 'btn btn-transparent m-0 p-0', children: <div style={{ width: '250px' }}><PracticeLocationSelector /></div> },
                    {
                        className: 'btn btn-primary', title: "Add Room", children: <i className='icon plus' />, onClick: (e) => { e.preventDefault(); setAddModal(true); }
                    }]} />
            <ModalBox open={editModal} onClose={() => { setEditModal(false) }} title="Edit Room">
                <PracticeLocationRoomEdit initialData={{ practiceLocationRoomId: selectedRoom?.practiceLocationRoomId }} onClose={() => { practiceLocationRoomLookup(); return setEditModal(false) }} />
            </ModalBox>
            <ModalBox open={addModal} onClose={() => { setAddModal(false) }} title="Add Room">
                <PracticeLocationRoomAdd initialData={{ practiceLocationId: state.practiceLocationId }} onClose={() => { practiceLocationRoomLookup(); return setAddModal(false) }} />
            </ModalBox>
            <ModalBox open={deleteModal} onClose={() => {setDeleteModal(false) }} title="Delete Room">
            {selectedRoom?.practiceLocationRoomId && <div className='row d-flex align-items-center justify-content-between'>
                    <div className='col'>
                        Are you sure you want to delete {selectedRoom.room}?
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-secondary' onClick={e => { e.preventDefault();setSelectedRoom(); return setDeleteModal(false) }}>No</button>
                        <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); {state.practiceLocationId ?deleteItem(selectedRoom?.practiceLocationRoomId):toast.error("Error deleting Practice Location Room")}; setDeleteModal(false) }}>Yes</button>
                    </div>
                </div>}
            </ModalBox>
        </div>
    )
}

export default RoomSettingsTable