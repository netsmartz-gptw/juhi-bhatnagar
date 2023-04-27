import React, { useEffect, useState } from 'react'
import List from '../../../../../templates/components/List'
import Tabs from '../../../../../templates/components/Tabs'
import EquipmentService from '../../../../../../services/api/equipment.service'
import Accordion from '../../../../../templates/components/Accordion'
import AddEquipmentType from '../../../equipment-type/add-equipment-type/AddEquipmentType'
import EditEquipmentType from '../../../equipment-type/edit-equipment-type/EditEquipmentType'
import AddEquipment from '../../../equipment/add-equipment/AddEquipment'
import EditEquipment from '../../../equipment/edit-equipment/EditEquipment'
import ModalBox from '../../../../../templates/components/ModalBox'

const EquipmentSettings = (props) => {

    const [isLoader_Equipment, setIsLoader_Equipment] = useState(false)
    const [isLoader_EquipmentType, setIsLoader_EquipmentType] = useState(false)
    const [equipmentList, setEquipmentList] = useState()
    const [equipmentTypeList, setEquipmentTypeList] = useState()

    // For forms 
    const [showEquipmentAdd, setShowEquipmentAdd] = useState(false)
    const [showEquipmentTypeAdd, setShowEquipmentTypeAdd] = useState(false)

    const [showEquipmentEdit, setShowEquipmentEdit] = useState(false)
    const [equipmentId, setEquipmentId] = useState()
    const [showEquipmentTypeEdit, setShowEquipmentTypeEdit] = useState(false)
    const [equipmentTypeInitial, setEquipmentTypeInitial] = useState()

    const equipmentTypeLookup = () => {
        setIsLoader_Equipment(true);
        EquipmentService.equipmentTypeLookup()
            .then((response) => {
                console.log(response)
                setEquipmentList(response);
                setIsLoader_Equipment(false);
            })
            .catch(error => {
                setIsLoader_Equipment(false);
                console.log(error)
                // setCheckException(error);
            })
    }

    const equipmentLookup = () => {
        setIsLoader_EquipmentType(true);
        EquipmentService.masterEquipmentTypeLookup()
            .then((response) => {
                console.log(response)
                setEquipmentTypeList(response);
                setIsLoader_EquipmentType(false);
            })
            .catch(error => {
                setIsLoader_EquipmentType(false);
                console.log(error)
                // setCheckException(error);
            })
    }

    const deleteEquipment = (id) => {
        EquipmentService.deactivateEquipment(id)
            .then(res => {
                console.log(res);
                equipmentLookup();
            })
    }
    useEffect(() => {
        equipmentTypeLookup()
        equipmentLookup()
    }, [])

    return (
        <div>
            <Tabs style="pills">
                <div title="Equipment">
                    <List table resultsMessage="Please begin by adding your first piece of Equipment" tableHeaders={["Name", "Equipment Type", "Actions"]} style="p-0 card">
                        {equipmentList && equipmentList.map((equipment, i) => {
                            return (
                                <tr>
                                    <td>{equipment.equipmentType}</td>
                                    <td>{equipmentTypeList && equipmentTypeList.find(obj => obj.masterEquipmentTypeId === equipment.masterEquipmentTypeId).equipmentType}</td>
                                    <td className=''>
                                        <div className='btn-group'>
                                            <button className="p-0 ps-1 btn btn-primary" onClick={e => { e.preventDefault(); setEquipmentId(equipment.equipmentTypeId); return setShowEquipmentEdit(true) }}><i className="icon pencil" /></button>
                                            <button className="p-0 ps-1 btn btn-primary ms-1"><i className="icon trash" /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </List>
                    <button className="btn btn-primary mt-3" onClick={() => { setShowEquipmentAdd(true) }}>
                            <i className='icon plus' />
                            Add Equipment
                        </button>
                </div>
                <div title="Equipment Type">

                    <List table resultsMessage="Please begin by adding your first Equipment Type" tableHeaders={["Name", "Actions"]} style="card" tHeadStyle="py-0 bg-red m-0">
                        {equipmentTypeList && equipmentTypeList.map((equipmentType, i) => {
                            return (
                                <tr>
                                    <td>{equipmentType.equipmentType}</td>
                                    <td className=''>
                                        <div className='btn-group'>
                                            <button className="p-0 ps-1 btn btn-primary" onClick={e => { e.preventDefault(); setEquipmentTypeInitial(equipmentType); return setShowEquipmentTypeEdit(true) }}><i className="icon pencil" /></button>
                                            <button className="p-0 ps-1 btn btn-primary ms-1"><i className="icon trash" /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </List>
                    <button className="btn btn-primary mt-3" onClick={() => { setShowEquipmentTypeAdd(true) }}>
                        <i className='icon plus' />
                        Add Type Equipment
                    </button>
                </div>
            </Tabs>
            <ModalBox open={showEquipmentAdd} onClose={() => { setShowEquipmentAdd(false) }}>
                <AddEquipment exitHandler={() => setShowEquipmentAdd(false)} />
            </ModalBox>
            <ModalBox open={showEquipmentTypeAdd} onClose={() => { setShowEquipmentTypeAdd(false) }}>
                <AddEquipmentType exitHandler={() => setShowEquipmentTypeAdd(false)} />
            </ModalBox>
            <ModalBox open={showEquipmentEdit} onClose={() => { setShowEquipmentEdit(false) }}>
                <EditEquipment id={equipmentId} exitHandler={() => setShowEquipmentEdit(false)} />
            </ModalBox>
            <ModalBox open={showEquipmentTypeEdit} onClose={() => { setShowEquipmentTypeEdit(false) }}>
                <EditEquipmentType initialData={equipmentTypeInitial} exitHandler={() => setShowEquipmentTypeEdit(false)} />
            </ModalBox>
        </div>
    )
}

export default EquipmentSettings