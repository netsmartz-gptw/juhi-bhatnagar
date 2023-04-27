import React, { useEffect, useState } from 'react'
import Select from "react-select"
import label from '../../../../assets/i18n/en.json'
import moment from 'moment'

const Search = (props) => {
    const defaultOnChange = (e) => {
        if(e?.value){
        setKeyword(e.value)
        }
        else {
            setKeyword()
        }
    }

    const { setKeyword, onSearch, keyword, searchList, isLoader, searchLabel, getOptionLabel, getOptionValue, onChange = defaultOnChange, value } = (props)

    const clearForm = () => {
        setKeyword("")
    }

    return (
        <div id="initialLoad">
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.processing}</div>
                </div>
            </div>}
            <div className="ui content">
                <div className="">
                    <div className="row d-flex align-items-center">
                        <div className="col">
                            <label>{props.searchLabel && props.searchLabel}</label>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                name="EquipmentTypeName"
                                aria-label='equipmentTypeId'
                                value={value}
                                isSearchable
                                isClearable
                                onChange={onChange}
                                options={searchList}
                                getOptionLabel={getOptionLabel}
                                getOptionValue={getOptionValue}
                                // components={{
                                //     DropdownIndicator: () => <i className="ui icon search m-2" onClick={e => {
                                //         e.preventDefault();
                                //         if (typeof props.onSearch === 'function') {
                                //             props.onSearch(keyword);
                                //         }
                                //     }} />,
                                //     IndicatorSeparator: () => null
                                // }}
                            />
                        </div>
                        <div className='col-auto'>
                            <button className='btn btn-primary' type="submit" onClick={e => {
                                e.preventDefault();
                                if (typeof props.onSearch === 'function') {
                                    props.onSearch(keyword);
                                }
                            }}>{label.equipmentType.find.find}</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Search