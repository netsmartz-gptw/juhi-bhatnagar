import React, { useEffect, useState } from 'react'
import AppointmentService from '../../../../../services/api/appointment.service'
import ModalBox from '../../../../templates/components/ModalBox'
import Select from "react-select"
import PracticeLocationAdd from '../location-add/PracticeLocationAdd'

const PracticeLocationSearch = (props) => {
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [list, setList] = useState([])
    const [openModal,setOpenModal] = useState(false)
    const [keyword,setKeyword] = useState('')

    const changeKeyword = (kw) => {
        console.log(kw)
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
                    console.log(response)
                    let array = response.map(item=>{
                        return({label: item.practiceLocation, value: item.practiceLocation})
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
                  getOptionLabel={(option) => {return(option.value)}}
                  />
                   
                </div>
                <div className='col-2'>
                    <button className='btn btn-primary' title="Add Location" onClick={modalHandler}><i className='icon plus'/></button>
                </div>
            </div>
            <ModalBox open={openModal} onClose={() => {setOpenModal(false)}}>
              <PracticeLocationAdd/>
            </ModalBox>
        </>
      
    )
}

export default PracticeLocationSearch