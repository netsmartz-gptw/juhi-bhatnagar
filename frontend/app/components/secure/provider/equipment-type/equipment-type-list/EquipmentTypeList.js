import React, { useEffect, useState } from 'react'
import Select from "react-select"
import label from '../../../../../../assets/i18n/en.json'
import EquipmentService from '../../../../../services/api/equipment.service'
import StorageService from '../../../../../services/session/storage.service'
import moment from 'moment'
import List from '../../../../templates/components/List'
import EditEquipmentType from '../edit-equipment-type/EditEquipment'
import Modal from '../../../../templates/components/Modal'
// Common service
import CommonService from '../../../../../services/api/common.service'

const EquipmentTypeList = (props) => {
    const { keyword } = props
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [sortBy, setSortBy] = useState('')


    const [equipmentTypeList, setEquipmentTypeList] = useState([])
    const [equipmentTypeLookupList, setEquipmentTypeLookupList] = useState([])

    const sortingItems = {
        date: [
            { 'label': 'Date: Sesc', 'columnName': 'createdOn', value: 'Desc' },
            { 'label': 'Date: Asc', 'columnName': 'createdOn', value: 'Asc' },
        ],
        order:
            [{ 'label': 'Name: A-Z', 'columnName': 'equipmentType', value: 'Desc' },
            { 'label': 'Name: Z-A', 'columnName': 'equipmentType', value: 'Asc' },]
    }

    const [noResultsMessage, setNoResultsMessage] = useState("Please select Equipment Type to begin search")

    const { embed, editEquipment } = (props)


    const onSort = (e) => {
        setSortBy(e.target.value)
        console.log(e.target.value)
    }

    const deleteItem = (id) => {
        setIsLoader(true)
        EquipmentService.deleteEquipment(id)
        console.log(id + " is deleted")
        setIsLoader(false)
    }

    useEffect(() => {
        let arr;
        if (sortBy === 'Asc') {
            // arr = equipmentTypeList.sort((a, b) => a.equipmentType.localeCompare(b.equipmentType))
            setEquipmentTypeLookupList(equipmentTypeList.sort((a, b) => a.equipmentType.localeCompare(b.equipmentType)))
        }
        else if (sortBy === 'Desc') {
            // arr = equipmentTypeList.sort((a, b) => b.equipmentType.localeCompare(a.equipmentType))
            setEquipmentTypeLookupList(equipmentTypeList.sort((a, b) => b.equipmentType.localeCompare(a.equipmentType)))
        }
        else {
            // arr = equipmentTypeList
            setEquipmentTypeLookupList(equipmentTypeList)
        }
        console.log(arr)

    }, [sortBy])

    useEffect(() => {
        setIsLoader(true);
        EquipmentService.equipmentTypeLookup()
            .then((response) => {
                console.log(response)
                setEquipmentTypeList(response);
                setEquipmentTypeLookupList(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
                // setCheckException(error);
            })
    }, [])

    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader"></div>
                </div>
            </div>}
            {!isLoader, equipmentTypeLookupList && <List
                listItemStyle='mb-2'
                sortFunc={onSort}
                sortList={sortingItems.order}
                // pageSize={3}
                isLoading={isLoader}
            >
                {equipmentTypeLookupList.length && equipmentTypeLookupList.filter((equipment) => {
                                    if (keyword === "" | null) {
                                        return equipment
                                    } else if (equipment.equipmentType.toLowerCase().includes(keyword.toLowerCase())) {
                                        return equipment
                                    }
                                }).map(equipmentType => {
                    return (
                        <div className="ui segment results">
                            <div className="results-crsr">
                                <div className="ui right floated header">
                                    {/* <i className="ui icon pencil" onClick={e => { e.preventDefault(); editEquipment(equipmentType) }}></i> */}
                                    <Modal button={<i className="ui icon pencil"></i>} modalId="test" approveButton="Save" approveButtonSubmit={()=>{console.log("test")}}>
                                        <EditEquipmentType id={equipmentType.id}/>
                                        </Modal>
                                    <i className="ui tiny icon trash" onClick={e => { e.preventDefault(); deleteItem(equipmentType.equipmentTypeId) }}></i>
                                </div>
                            </div>
                            <div className="ui horizontal list">
                                <div className="item">
                                    <div className="content">
                                        <div className="ui sub header">{equipmentType.equipmentType}
                                        </div>
                                        <div className="item">
                                            <strong> {label.equipmentType.find.creationDate}: </strong>{equipmentType.createdOn}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                }
                )}
            </List>}
        </div>
    )
}

export default EquipmentTypeList