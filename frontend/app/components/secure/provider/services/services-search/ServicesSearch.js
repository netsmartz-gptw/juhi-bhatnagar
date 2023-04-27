import React, { useEffect, useState } from 'react'
import ServicesService from '../../../../../services/api/services.service'
import Search from '../../../../templates/components/Search'

const ServicesSearch = (props) => {
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [list, setList] = useState([])
    const { embed, setKeyword, keyword } = (props)

    const searchHandler = (val) => {
        setKeyword(val)
    }

    useEffect(() => {
        setIsLoader(true);
        setKeyword(keyword)
        setIsLoader(false);
    }, [keyword])

    useEffect(() => {
        setIsLoader(true);
        ServicesService.serviceLookup({ItemType:2})
            .then(
                (response) => {
                    let array = response.data.map(item => {
                        return ({ label: item.name, value: item.name })
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

export default ServicesSearch