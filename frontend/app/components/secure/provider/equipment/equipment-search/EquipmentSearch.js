import React, { useEffect, useState } from 'react'

import EquipmentService from '../../../../../services/api/equipment.service'

import Search from '../../../../templates/components/Search'

const EquipmentSearch = (props) => {
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [list, setList] = useState([])
    const { embed, setKeyword, keyword } = (props)


    const searchHandler = (val) => {
        console.log(val)
        setKeyword(val)
    }

    useEffect(() => {
        setIsLoader(true);
        setKeyword(keyword)
        console.log(keyword)
        setIsLoader(false);
    }, [keyword])

    useEffect(() => {
        setIsLoader(true);
        EquipmentService.equipmentTypeLookup()
            .then(
                (response) => {
                    console.log(response)
                    let array = response.map(item=>{
                        return({label: item.equipmentType, value: item.equipmentType})
                    })
                    setList(array);
                    setIsLoader(false);
                })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }, [])
    return (
        <Search setKeyword={setKeyword} keyword={keyword} searchList={list} onSearch={searchHandler} isLoader={isLoader}></Search>
    )
}

export default EquipmentSearch