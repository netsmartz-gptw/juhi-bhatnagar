import React, { useContext, useEffect, useState } from 'react';
import { store } from "../../../../../../context/StateProvider";
import ProviderService from "../../../../../../services/api/provider.service";
import DoctorService from "../../../../../../services/api/doctor.service";
import Table from "../../../../../templates/components/Table";
import PracticeLocationSelector from "../../../../../templates/components/PracticeLocationSelector";
import ModalBox from "../../../../../templates/components/ModalBox";
import EditDoctor from "../../../doctor/edit-doctor/EditDoctor";
import AddDoctor from "../../../doctor/add-doctor/AddDoctor";

const PracticeLocationProvider = () => {
    const [isLoader, setIsLoader] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editProvider, setEditProvider] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [providerList, setProviderList] = useState([])
    const [selectedProvider, setSelectedProvider] = useState();
    const [selectedProviderOnLocationIds, setSelectedProviderOnLocationIds] = useState([]);
    const [selectedProviderOnLocation, setSelectedProviderOnLocation] = useState();
    const state = useContext(store).state;

    const getProviders = async () => {
        setIsLoader(true);
        await DoctorService.doctorLookup({})
            .then((response) => {
                setProviderList(response);
                setSelectedProvider[response[0]]
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
            })
    }

    const getProvidersForSelectedLocation = async () => {
        await ProviderService.getProvidersForSelectedLocation({
            PracticeLocationId: state?.practiceLocationId,
        }).then(data => {
            console.log(data)
            if (data?.data) {
                const ids = data?.data?.map(item => item.doctorId);
                setSelectedProviderOnLocationIds(ids);
                setSelectedProviderOnLocation(data?.data);
            }
        }).catch(console.log);
    }

    useEffect(async () => {
        await getProviders();
    }, []);

    useEffect(async () => {
        if (state?.practiceLocationId) {
            await getProvidersForSelectedLocation();
        }
    }, [state?.practiceLocationId])

    const handleCheckboxClick = (provider, isChecked, data) => {
        if (isChecked) {
            ProviderService.updateProvidersForSelectedLocation({
                practiceLocationId: state?.practiceLocationId,
                doctorId: data.doctorId,
                isDeleted: 1
            }, data.practiceLocationPractitionerId).then(async (data) => {
                await getProvidersForSelectedLocation();
                await getProviders();
            }).catch(console.log);
        } else {
            ProviderService.createProvidersForSelectedLocation({
                practiceLocationId: state?.practiceLocationId,
                doctorId: provider.id,
            }).then(async (data) => {
                await getProvidersForSelectedLocation();
                await getProviders();
            }).catch(console.log);
        }
    }

    const columns = [
        {
            key: "isActive",
            text: "",
            // className: "name",
            align: "center",
            sortable: true,
            cell: (provider) => {
                const isChecked = selectedProviderOnLocationIds?.includes(provider?.id);
                const doctorId = provider?.id;
                const data = selectedProviderOnLocation && selectedProviderOnLocation?.find(item => item.doctorId === doctorId);
                return <div className='w-100 d-flex justify-content-center'>
                    <input type="checkbox" checked={isChecked} onChange={e => {
                        handleCheckboxClick(provider, isChecked, data);
                    }} />
                </div>
            }
        },
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
            key: "actionEquipment",
            text: "Availability",
            // className: "name",
            align: "left",
            sortable: false,
            cell: (provider) => {
                return (
                    <div className='btn-group'>
                        <button className="p-0 ps-1 btn btn-primary ms-1" title="Edit Provider" onClick={e => {
                            e.preventDefault();
                        }}
                        ><i className="icon pencil" /></button>
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
        filename: "Practice Location Service Types",
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
                <Table
                    config={config}
                    columns={columns}
                    records={providerList}
                    loading={isLoader}
                    extraButtons={[
                        {
                            className: 'btn btn-primary', title: "Add Practice Location Provider", children: <i className='icon plus' />, onClick: (e) => { e.preventDefault(); setShowAdd(true); }
                        },
                        {
                            className: 'btn btn-transparent m-0 p-0',
                            children: <div style={{ width: '250px' }}>
                                <PracticeLocationSelector />
                            </div>
                        }]}
                />}
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

export default PracticeLocationProvider;