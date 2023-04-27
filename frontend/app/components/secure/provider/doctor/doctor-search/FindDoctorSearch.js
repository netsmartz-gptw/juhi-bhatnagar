import React, { useEffect, useState } from 'react'

import DoctorService from '../../../../../services/api/doctor.service'

import Search from '../../../../templates/components/Search'

const FindDoctorSearch = (props) => {
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
        DoctorService.doctorLookup()
            .then(
                (response) => {
                    let array = response.map(item => {
                        return ({ label: item.name, value: item.name })
                    })
                    setList(array);
                    setIsLoader(false);
                })
            .catch(error => {
                setIsLoader(false);
            })
    }, [])
    return (
        <Search setKeyword={setKeyword} keyword={keyword} searchList={list} onSearch={searchHandler} isLoader={isLoader}></Search>
    )
}

export default FindDoctorSearch