import React, { useEffect, useState, useContext } from 'react'
import EquipmentService from '../../../../../../services/api/equipment.service'
import AccordionTemplate from '../../../../../templates/components/AccordionTemplate'
import AddEquipmentType from '../../../equipment-type/add-equipment-type/AddEquipmentType'
import EditEquipmentType from '../../../equipment-type/edit-equipment-type/EditEquipmentType'
import AddEquipment from '../../../equipment/add-equipment/AddEquipment'
import EditEquipment from '../../../equipment/edit-equipment/EditEquipment'
import ModalBox from '../../../../../templates/components/ModalBox'
import Table from '../../../../../templates/components/Table'
import { store } from '../../../../../../context/StateProvider'
import PracticeLocationSelector from '../../../../../templates/components/PracticeLocationSelector'
import toast from 'react-hot-toast'

const EquipmentSettings = (props) => {
    const globalStateAndDispatch = useContext(store)
    const contextState = globalStateAndDispatch.state

    const [isLoader_Equipment, setIsLoader_Equipment] = useState(false)
    const [isLoader_EquipmentType, setIsLoader_EquipmentType] = useState(false)
    const [equipmentList, setEquipmentList] = useState()
    const [equipmentTypeList, setEquipmentTypeList] = useState()
    const [selectEquipment,setSelectedEquipment] = useState()
    const [deleteModal,setDeleteModal] = useState(false)
    // For forms 
    const [showEquipmentAdd, setShowEquipmentAdd] = useState(false)
    const [showEquipmentTypeAdd, setShowEquipmentTypeAdd] = useState(false)
    const [masterEquipmentTypeList, setMasterEquipmentTypeList] = useState()

    const [showEquipmentEdit, setShowEquipmentEdit] = useState(false)
    const [equipmentId, setEquipmentId] = useState()
    const [equipmentTypeId, setEquipmentTypeId] = useState()
    const [showEquipmentTypeEdit, setShowEquipmentTypeEdit] = useState(false)
    const [equipmentTypeInitial, setEquipmentTypeInitial] = useState()
    const [selectEquipmentType,setSelectedEquipmentType] = useState()
    const [deleteTypeModal,setDeleteTypeModal] = useState(false)
    // console.log(contextState)
    const equipmentLookup = () => {
        setIsLoader_Equipment(true);
        EquipmentService.equipmentLookup(contextState.practiceLocationId)
            .then((response) => {
                console.log(response)
                setEquipmentList(response);
                setIsLoader_Equipment(false);
            })
            .catch(error => {
                setIsLoader_Equipment(false);
                // console.log(error)
                // setCheckException(error);
            })
    }

    const equipmentTypeLookup = () => {
        setIsLoader_EquipmentType(true);
        EquipmentService.equipmentTypeLookup()
            .then((response) => {
                // console.log(response)
                setEquipmentTypeList(response);
                setIsLoader_EquipmentType(false);
            })
            .catch(error => {
                setIsLoader_EquipmentType(false);
                // console.log(error)
                // setCheckException(error);
            })
    }

    const pullMasterEquipmentType = () => {
        EquipmentService.masterEquipmentTypeLookupForProvider()
            .then(res => {
                // console.log(res)
                setMasterEquipmentTypeList(res)
            })
    }

    const deleteEquipment = (id) => {
        EquipmentService.deleteEquipment(id)
            .then(res=>{
                toast.success("Equipment deleted")
                equipmentLookup()
            })
            .catch(err=> toast.error("Error in deleting Equipment"))
    }

    const deleteTypeEquipment = (id) => {
        EquipmentService.deleteEquipmentType(id)
            .then(console.log("deleted"))

    }

    useEffect(() => {
        // console.log(contextState.practiceLocationId.practiceLocationId)
        if (contextState.practiceLocationId) {
            equipmentLookup()
            equipmentTypeLookup()
            pullMasterEquipmentType()
        }
    }, [contextState.practiceLocationId])

    const equipmentColumns = [
        // ["Name", "Equipment Type", "Room", "Actions"]
        {
            key: "description",
            text: "Name",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "equipmentTypeId",
            text: "Equipment Type",
            // className: "name",
            align: "left",
            sortable: true,
            cell: (equipment) => { if (equipmentTypeList) { return equipmentTypeList.find(obj => obj.equipmentTypeId === equipment.equipmentTypeId)?.equipmentType } }
        },
        // {
        //     key: "location",
        //     text: "Locations",
        //     // className: "name",
        //     align: "left",
        //     sortable: true,
        //     cell: (equipment) => { return 'Portable' }
        // },
        {
            key: "actionEquipment",
            text: "Action",
            // className: "name",
            align: "center",
            sortable: false,
            cell: (equipment, i) => {  
                // console.log(equipment)
                return (
           
                    <div className='d-flex justify-content-center'>
                        <button className="p-0 ps-1 btn btn-primary" title="edit" onClick={e => { e.preventDefault();setEquipmentId(equipment.equipmentId); return setShowEquipmentEdit(true) }}><i className="icon pencil" /></button>
                        <button className="p-0 ps-1 btn btn-primary ms-1" title="delete" onClick={e=>{e.preventDefault(); setSelectedEquipment(equipment) ;return setDeleteModal(true)}}><i className="icon trash" /></button>
                    </div>
                )
            }
        }
    ]
    const equipmentTypeColumns = [
        {
            key: "equipmentType",
            text: "Name",
            align: "left",
            sortable: true,
        },
        {
            key: "masterEquipmentTypeId",
            text: "Master Equipment Type",
            align: "left",
            sortable: true,
            cell: (equipmentType) => { if (masterEquipmentTypeList) { return masterEquipmentTypeList.find(obj => obj.masterEquipmentTypeId === equipmentType.masterEquipmentTypeId)?.equipmentType } }
        },
        {
            key: "actionEquipmentType",
            text: "Action",
            align: "center",
            sortable: false,
            cell: (equipmentType, i) => {
                // console.log(equipmentType)
                return (
                    <div className='d-flex justify-content-center'>
                        <button className="p-0 ps-1 btn btn-primary" onClick={e => { e.preventDefault(); setEquipmentTypeInitial(equipmentType); return setShowEquipmentTypeEdit(true) }}><i className="icon pencil" /></button>
                        <button className="p-0 ps-1 btn btn-primary ms-1" onClick={e=>{e.preventDefault();setSelectedEquipmentType(equipmentType); return setDeleteTypeModal(true)}}><i className="icon trash" /></button>
                    </div>)
            }
        }
    ]
    const equipmentConfig = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "Equipment",
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
            <AccordionTemplate id="equipmentaccordion" accordionId="equipmentaccordion" defaultActiveKey={0}>
                <div title="Equipment" className='py-3'>
                    <Table records={equipmentList} columns={equipmentColumns} config={equipmentConfig} loading={isLoader_Equipment} extraButtons={[
                        { className: 'btn btn-transparent m-0 p-0', children:<div style={{ width: '250px' }}> <PracticeLocationSelector /> </div>},
                        {
                        className: 'btn btn-primary',
                        title: "Add Equipment",
                        children:
                            <span><i className='icon plus' /></span>
                        ,
                        onClick: (e) => {
                            e.preventDefault();
                            setShowEquipmentAdd(true)
                        }
                    }
                    
                    ]} />
                </div>
                <div title="Equipment Type" className='py-3'>
                    <Table records={equipmentTypeList} columns={equipmentTypeColumns} config={equipmentConfig} loading={isLoader_EquipmentType}
                        extraButtons={[
                            { className: 'btn btn-transparent m-0 p-0 ', children: <div style={{ width: '250px' }}> <PracticeLocationSelector /></div> },
                            {
                            className: 'btn btn-primary',
                            title: "Add Equipment Type",
                            children:
                                <span><i className='icon plus' /></span>
                            ,
                            onClick: (e) => {
                                e.preventDefault();
                                setShowEquipmentTypeAdd(true)
                            }
                        }
                       
                        ]} />
                </div>
            </AccordionTemplate>
            <ModalBox open={showEquipmentAdd} onClose={() => { setShowEquipmentAdd(false) }} title="Add Equipment">
                <AddEquipment  initialData={{practiceLocationId: contextState.practiceLocationId}} onClose={() => {equipmentLookup(); return  setShowEquipmentAdd(false)}} />
            </ModalBox>
            <ModalBox open={showEquipmentTypeAdd} onClose={() => { setShowEquipmentTypeAdd(false) }} title="Add Equipment Type">
                <AddEquipmentType initialData={{practiceLocationId: contextState.practiceLocationId}} onClose={() =>{equipmentTypeLookup(); return setShowEquipmentTypeAdd(false)} }/>
            </ModalBox>
            <ModalBox open={showEquipmentEdit} onClose={() => { setShowEquipmentEdit(false) }} title="Edit Equipment">
                <EditEquipment id={equipmentId} onClose={() => { equipmentLookup(); return setShowEquipmentEdit(false) }} />
            </ModalBox>
            <ModalBox open={showEquipmentTypeEdit} onClose={() => { setShowEquipmentTypeEdit(false) }} title="Edit Equipment Type">
                <EditEquipmentType initialData={equipmentTypeInitial} onClose={() => { equipmentTypeLookup(); return setShowEquipmentTypeEdit(false) }} />
            </ModalBox>
            <ModalBox open={deleteModal} onClose={() => { setDeleteModal(false) }} title="Delete Equipment">
            {selectEquipment?.equipmentId && <div className='row d-flex align-items-center justify-content-between'>
                    <div className='col'>
                        Are you sure you want to delete {selectEquipment.description} ?
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-secondary' onClick={e => { e.preventDefault();setEquipmentId(equipment.equipmentId); return setDeleteModal(false) }}>No</button>
                        <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); deleteEquipment(selectEquipment.equipmentId); setDeleteModal(false) }}>Yes</button>
                    </div>
                </div>}
            </ModalBox>
            <ModalBox open={deleteTypeModal} onClose={() => { setDeleteTypeModal(false) }} title="Delete Equipment Type">
            {selectEquipmentType?.equipmentTypeId && <div className='row d-flex align-items-center justify-content-between'>
                    <div className='col'>
                        Are you sure you want to delete  ?
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-secondary' onClick={e => { e.preventDefault();setEquipmenTypetId(selectEquipmentType.equipmentTypeId); return setDeleteTypeModal(false) }}>No</button>
                        <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); deleteTypeEquipment(selectEquipmentType.equipmentTypeId); setDeleteTypeModal(false) }}>Yes</button>
                    </div>
                </div>}
            </ModalBox>
        </div>
    )
}

export default EquipmentSettings