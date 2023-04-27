import React, { useEffect, useState } from 'react'
import AppointmentService from '../../../../services/api/appointment.service'
import Select from "react-select"

const PracticeLocationServiceTypesSearch = (props) => {
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [list, setList] = useState([])
    const [keyword,setKeyword] = useState('')

    const changeKeyword = (kw) => {
        setKeyword(kw)
        if (props.setKeyword) {
            if (kw !== {}) {
                props.setKeyword(kw)
            }
            else {
                props.setKeyword('')
            }
        }
    }
   
    const modalHandler =() => {
        setOpenModal(true)
    }

    useEffect(() => {
        setIsLoader(true);
        AppointmentService.practiceLocation()
            .then(
                (response) => {
                    let array = response.map(item=>{
                        return({label: item.practiceLocation, value: item.practiceLocationId})
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
        <>
            <div className='field row'>
                <div className='col-10'>
                  <Select 
                  className="react-select-container"
                  classNamePrefix="react-select"
                  value={list.find(obj => obj.practiceLocation === keyword)}
                  options={list}  
                  onChange={e =>{e ? changeKeyword(e.value):changeKeyword('')}}
                  isClearable={true}
                  getOptionLabel={(option) => {return(option.label)}}
                  />
                   
                </div>
            </div>
        </>
      
    )
}

export default PracticeLocationServiceTypesSearch