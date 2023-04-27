import React, { useEffect, useState, useContext } from 'react'
import PracticeServiceTypeService from '../../../../../../services/api/practice-service-type.service'
import AddPracticeServiceType from '../../../practice-service-type/add-practice-service-type/AddPracticeServiceType'
import EditPracticeServiceType from '../../../practice-service-type/edit-practice-service-type/EditPracticeServiceType'
import ModalBox from '../../../../../templates/components/ModalBox'
import Table from '../../../../../templates/components/Table'
import { store } from '../../../../../../context/StateProvider'
import Utilities from '../../../../../../services/commonservice/utilities'
import CommonService from '../../../../../../services/api/common.service'
import toast from 'react-hot-toast'

const PracticeServiceType = (props) => {
    const globalStateAndDispatch = useContext(store)
    const contextState = globalStateAndDispatch.state

    const [isLoader_PracticeService, setIsLoader_PracticeService] = useState(false)
    const [practiceServiceList, setPracticeServiceList] = useState()

    // For forms 
    const [showPracticeServiceAdd, setShowPracticeServiceAdd] = useState(false)

    const [showPracticeServiceEdit, setShowPracticeServiceEdit] = useState(false)
    const [practiceServiceId, setPracticeServiceId] = useState()
    const [selectedServiceType, setSelectedServiceType] = useState()
    const [deleteModal, setDeleteModal] = useState()

    const practiceServiceTypeLookup = () => {
        setIsLoader_PracticeService(true);
        PracticeServiceTypeService.practiceServiceTypeLookup()
            .then((response) => {
                // console.log(response.data)
                setPracticeServiceList(response.data);
                setIsLoader_PracticeService(false);
            })
            .catch(error => {
                setIsLoader_PracticeService(false);
                console.log(error)
            })
    }

    useEffect(() => {
        practiceServiceTypeLookup()
    }, [])

    const deleteItem = () => {
        return PracticeServiceTypeService.deletePracticeServiceType(selectedServiceType.practiceServiceTypeId)
            .then(res => {
                toast.success("Practice Service Type Deleted")
                practiceServiceTypeLookup()
            })
            .catch(err => {
                toast.error("Error deleting Service Type")
            })
    }

    const practiceServiceColumns = [
        {
            key: "practiceServiceType",
            text: "Practice Service Type",
            align: "left",
            sortable: true
        },
        {
            key: "appointmentFillColor",
            text: "Appointment Fill Color",
            align: "left",
            sortable: true,
            cell: (practiceServiceType, i) => {
                return (
                    <div className="d-flex align-items-center">
                        <span className="me-3" style={{height:'15px',width:'15px',display:'block', backgroundColor:practiceServiceType.appointmentFillColor}} title={practiceServiceType.appointmentFillColor}></span> <p>{practiceServiceType.appointmentFillColor}</p>
                    </div>
                )
            }
        },
        {
            key: "actionPracticeServiceType",
            text: "Action",
            align: "left",
            sortable: false,
            cell: (practiceServiceType, i) => {
                // console.log(practiceServiceType)
                return (

                    <div className='btn-group'>
                        <button className="p-0 ps-1 btn btn-primary" title="edit" onClick={e => { e.preventDefault(); setPracticeServiceId(practiceServiceType.practiceServiceTypeId); return setShowPracticeServiceEdit(true) }}><i className="icon pencil" /></button>
                        <button className="p-0 ps-1 btn btn-primary ms-1" title="delete" onClick={e => { e.preventDefault(); setSelectedServiceType(practiceServiceType); return setDeleteModal(true) }}><i className="icon trash" /></button>
                    </div>
                )
            }
        }
    ]

    const practiceServiceConfig = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "Practice_Service_Type",
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
            <div title="Practice Service Type" className='py-3'>
                <Table records={practiceServiceList} columns={practiceServiceColumns} config={practiceServiceConfig} loading={isLoader_PracticeService} 
                extraButtons={[{
                    className: 'btn btn-primary',
                    title: "Add Pracice Service Type",
                    children:
                        <span><i className='icon plus' /></span>
                    ,
                    onClick: (e) => {
                        e.preventDefault();
                        setShowPracticeServiceAdd(true)
                    }
                }]}
                />
            </div>
            <ModalBox open={showPracticeServiceAdd} onClose={() => { setShowPracticeServiceAdd(false) }} size="small">
                <AddPracticeServiceType exitHandler={() => setShowPracticeServiceAdd(false)} />
            </ModalBox>
            <ModalBox open={showPracticeServiceEdit} onClose={() => { setShowPracticeServiceEdit(false) }}>
                <EditPracticeServiceType id={practiceServiceId} exitHandler={() => setShowPracticeServiceEdit(false)} />
            </ModalBox>

            <ModalBox open={deleteModal} onClose={() => { setDeleteModal(false) }}>
                {selectedServiceType?.practiceServiceTypeId && <div className='row d-flex align-items-center justify-content-between'>
                    <div className='col'>
                        Are you sure you want to delete {selectedServiceType.practiceServiceType}?
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-secondary' onClick={e => { e.preventDefault(); setSelectedServiceType(); return setDeleteModal(false) }}>No</button>
                        <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); deleteItem(); setDeleteModal(false) }}>Yes</button>
                    </div>
                </div>}
            </ModalBox>
        </div>
    )
}

export default PracticeServiceType