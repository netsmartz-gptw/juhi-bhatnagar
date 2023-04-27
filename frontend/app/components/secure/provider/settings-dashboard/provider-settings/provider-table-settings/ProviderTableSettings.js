import React, { useEffect, useState, useContext } from 'react'
import DoctorService from '../../../../../../services/api/doctor.service'
import Utilities from '../../../../../../services/commonservice/utilities'
import ModalBox from '../../../../../templates/components/ModalBox'
import { store } from '../../../../../../context/StateProvider'

// Common service
import Table from '../../../../../templates/components/Table'
import EditDoctor from '../../../doctor/edit-doctor/EditDoctor'
import PracticeLocationSelector from '../../../../../templates/components/PracticeLocationSelector'
import AddDoctor from '../../../doctor/add-doctor/AddDoctor'
import ProviderService from '../../../../../../services/api/provider.service'
import toast from 'react-hot-toast'

const ProviderTableSettings = (props) => {
    const { keyword } = props
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editProvider, setEditProvider] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [providerList, setProviderList] = useState([])
    const [selectedProvider, setSelectedProvider] = useState()
    const state = useContext(store).state

    const activateProvider = (id, provider) => {
        if (provider.isActiveDoctor) {
            ProviderService.deactivateProvider(id)
                .then(res => {
                    toast.success("Provider is Deactivated")
                    getProviders()
                })
                .catch(err=>{
                    toast.error("Could not Deactivate")
                })
        }
        else {
            ProviderService.activateProvider(id)
                .then(res => {
                    toast.success("Provider is Activated")
                    getProviders()
                })
                .catch(err=>{
                    toast.error("Could not Deactivate")
                })
        }
    }

    const deleteItem = (id) => {
        setIsLoader(true)
        DoctorService.delete(id)
        // console.log(id + " is deleted")
        setIsLoader(false)
    }
    const getProviders = () => {
        setIsLoader(true);
        DoctorService.doctorLookup({ isRegistered: true, isActive: true, PracticeLocationId: state.practiceLocationId })
            .then((response) => {
                console.log(response)
                setProviderList(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                // console.log(error)
                // setCheckException(error);
            })
    }
    useEffect(() => {
        if (state?.practiceLocationId) {
            getProviders()
        }
    }, [state?.practiceLocationId])


    const columns = [
        {
            key: "firstName",
            text: "First Name",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "lastName",
            text: "Last Name",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "email",
            text: "Email",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "mobile",
            text: "Mobile Number",
            // className: "name",
            align: "left",
            sortable: true,
            cell: (provider) => Utilities.toPhoneNumber(provider.mobile)
        },
        {
            key: "city",
            text: "Location",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "npi",
            text: "NPI",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "status",
            text: "Status",
            // className: "name",
            align: "center",
            sortable: true,
            cell: (provider) => provider.isActiveDoctor ? <span className='btn btn-success text-white w-100'>Active</span> : <span className='btn btn-danger text-white w-100'>Inactive</span>
        },
        {
            key: "actionEquipment",
            text: "Action",
            // className: "name",
            align: "left",
            sortable: false,
            cell: (provider) => {
                console.log(provider)
                return (
                    <div className='btn-group'>
                        <button className="p-0 ps-1 btn btn-primary ms-1" title="Edit Provider" onClick={e => { e.preventDefault(); setSelectedProvider(provider); return setEditProvider(true) }}><i className="icon pencil" /></button>
                        {/* <button className="p-0 ps-1 btn btn-primary" title="Delete Provider" onClick={e => { e.preventDefault(); setSelectedProvider(provider); return setDeleteModal(true) }}><i className="icon trash" /></button> */}
                        <button className="p-0 ps-1 btn btn-primary" title={provider.isActiveDoctor ? 'Deactivate User' : 'Activate User'} onClick={e => { e.preventDefault(); setSelectedProvider(provider); return activateProvider(provider.id, provider) }}>{provider.isActiveDoctor ? <i className="icon dont" /> : <i className="icon check" />}</button>
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
        filename: "Provider Report",
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
            {providerList &&
                <Table config={config} columns={columns} records={providerList} loading={isLoader}
                    extraButtons={[
                        { className: 'btn btn-transparent m-0 p-0', children: <div style={{ width: '250px' }}><PracticeLocationSelector /></div> },
                        { className: 'btn btn-primary', children: <i className='icon plus'/>, onClick: e => { e.preventDefault(); setShowAdd(true) }, title:"Add Provider"}
                    ]} />}
            <ModalBox open={deleteModal} onClose={() => { setDeleteModal(false) }}>
                <div className='row d-flex align-items-center justify-content-between'>
                    <div className='col'>
                        Are you sure you want to delete {selectedProvider?.name}?
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-primary' onClick={e => { e.preventDefault(); deleteItem(selectedProvider?.id) }}>Yes</button>
                        <button className='btn btn-secondary ms-3' onClick={e => { e.preventDefault(); setSelectedProvider(); return setDeleteModal(false) }}>No</button>
                    </div>
                </div>
            </ModalBox>
            <ModalBox open={editProvider} onClose={() => { setEditProvider(false) }} title="Edit Provider">
                <EditDoctor id={selectedProvider?.id} onClose={() => { setEditProvider(false); getProviders() }} />
            </ModalBox>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }} title="Add Provider">
                <AddDoctor onClose={() => { setShowAdd(false); getProviders() }} />
            </ModalBox>
        </div>
    )
}

export default ProviderTableSettings