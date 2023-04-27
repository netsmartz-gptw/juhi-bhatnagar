import React, { useEffect, useState, useContext } from 'react'
import Table from '../../../../../templates/components/Table'
import { store } from '../../../../../../context/StateProvider'
import AppointmentService from '../../../../../../services/api/appointment.service'
import PracticeLocationSelector from '../../../../../templates/components/PracticeLocationSelector'
import ModalBox from '../../../../../templates/components/ModalBox'
import PracticeLocationRoomEdit from '../../../practice-location-room/location-room-edit/PracticeLocationRoomEdit'
import PracticeLocationRoomAdd from '../../../practice-location-room/location-room-add/PracticeLocationRoomAdd'
import PracticeLocationList from '../../../practice-location/location-list/PracticeLocationList'
import PracticeLocationEdit from '../../../practice-location/location-edit/PracticeLocationEdit'
import PracticeLocationAdd from '../../../practice-location/location-add/PracticeLocationAdd'
import toast from 'react-hot-toast'

const LocationSettingsTable = (props) => {

    const [isLoader, setIsLoader] = useState(false)
    const [locationList, setLocationList] = useState()
    const [selectedLocation, setSelectedLocation] = useState()
    const [editModal, setEditModal] = useState(false)
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const getPracticeLocations = () => {
        setIsLoader(true);
        AppointmentService.practiceLocation()
            .then((response) => {
                console.log(response)
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

    const deleteItem = (id) => {
        return AppointmentService.deletePracticeLocation(id)
            .then(res => {
                toast.success("Practice Location deleted");
                getPracticeLocations()
            })
            .catch(err=> {
                toast.error("Error deleting Practice Location")
            })
    }

    const columns = [
        {
            key: "practiceLocation",
            text: "Practice Location",
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
            cell: (location, i) => {
                return (

                    <div className='d-flex justify-content-center'>
                        <button className="p-0 ps-1 btn btn-primary" title="Edit Location" onClick={e => { e.preventDefault(); setSelectedLocation(location); console.log(location); return setEditModal(true) }}><i className="icon pencil" /></button>
                        <button className="p-0 ps-1 btn btn-primary ms-1" title="Delete Location" onClick={e => { e.preventDefault(); setSelectedLocation(location) ;return setDeleteModal(true) }}><i className="icon trash" /></button>
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
        filename: "Locations",
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

    return (
        <div>
            <Table loading={isLoader} records={locationList} config={config} columns={columns}
                extraButtons={[
                    {
                        className: 'btn btn-primary', title: "Add Location", children: <i className='icon plus' />, onClick: (e) => { e.preventDefault(); setAddModal(true); }
                    }]} />
            {/* <PracticeLocationList /> */}
            <ModalBox open={editModal} onClose={() => setEditModal(false)} size="tiny" title="Edit Location">
                <PracticeLocationEdit locationId={selectedLocation?.practiceLocationId} onClose={() => { setEditModal(false); getPracticeLocations() }} />
            </ModalBox>
            <ModalBox open={addModal} onClose={() => setAddModal(false)} size="tiny" title="Add Location">
                <PracticeLocationAdd onClose={() => { setAddModal(false); getPracticeLocations() }} />
            </ModalBox>
            <ModalBox open={deleteModal} onClose={() => { setDeleteModal(false) }} title="Delete Location">
            {selectedLocation?.practiceLocationId && <div className='row d-flex align-items-center justify-content-between'>
                    <div className='col'>
                        Are you sure you want to delete {selectedLocation.practiceLocation}?
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-secondary' onClick={e => { e.preventDefault();setSelectedLocation(); return setDeleteModal(false) }}>No</button>
                        <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); deleteItem(selectedLocation?.practiceLocationId); setDeleteModal(false) }}>Yes</button>
                    </div>
                </div>}
            </ModalBox>
        </div>
    )
}

export default LocationSettingsTable