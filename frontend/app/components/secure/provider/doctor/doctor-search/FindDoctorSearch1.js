import React, { useEffect, useState } from 'react'
import Select from "react-select"
import label from '../../../../../../assets/i18n/en.json'
import EquipmentService from '../../../../../services/api/equipment.service'
import StorageService from '../../../../../services/session/storage.service'
import moment from 'moment'
// Common service
import CommonService from '../../../../../services/api/common.service'

const FindDoctorSearch1 = (props) => {
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [isLoader_FindEquipmentType, setIsLoader_FindEquipmentType] = useState(false)

    const [searchValue, setSearchValue] = useState({})
    const [searchErrors, setSearchErrors] = useState({})
    const [displayFilter, setDisplayFilter] = useState({})

    const [equipmentTypeLookupList, setEquipmentTypeLookupList] = useState([])

    const { embed, setKeyword } = (props)

    // temp formula
    const clear = (value) => {

    }
    const clearForm = () => {

    }
    const searchHandler = () => {

    }

    useEffect(() => {
        setIsLoader(true);
        EquipmentService.equipmentTypeLookup()
            .then(
                (response) => {
                    console.log('equipment', response)
                    let list = response.sort((a, b) => a.equipmentType.localeCompare(b.equipmentType)).map(item => {
                        return ({ label: item.equipmentType, value: item.equipmentTypeId })
                    })
                    setEquipmentTypeLookupList(list);
                    setIsLoader(false);
                })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }, [])
    return (
        <div id="initialLoad">
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.processing}</div>
                </div>
            </div>}
            <form className="ui form">
                <div className="u-cf-m"></div>
                <div className="ui segment selection-area">
                    {searchValue.EquipmentTypeName &&
                        <a className="ui label">
                            {label.equipmentType.find.equipmentTypeName || displayFilter}
                            <i className="delete icon" onClick={clear('EquipmentTypeName')}></i>
                        </a>
                    }
                </div>
                <div className="ui content">
                    <div className="">
                        <div className="sixteen wide column">
                            <div className="field w100">
                                <label>{label.equipmentType.find.heading}</label>
                                <Select className="selection" name="EquipmentTypeName" aria-label='equipmentTypeId' onChange={e => { setKeyword(e.label) }} options={equipmentTypeLookupList}>
                                </Select>
                                <span>{searchErrors.EquipmentTypeName}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui clearing divider"></div>
                <button className={isLoader_FindEquipmentType ? 'btn btn-primary loading' : 'btn btn-primary'}
                    type="submit" onClick={searchHandler(true)}>{label.equipmentType.find.find}</button>
            </form>
        </div>
    )
}

export default FindDoctorSearch1