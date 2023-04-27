import React, { useEffect, useState } from 'react'
import AppointmentService from '../../../../../services/api/appointment.service'
import ModalBox from '../../../../templates/components/ModalBox'
import Select from "react-select"
import PracticeLocationRoomAdd from '../location-room-add/PracticeLocationRoomAdd'


const PracticeLocationRoomSearch = (props) => {
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [list, setList] = useState([])
    const [openModal,setOpenModal] = useState(false)
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
                        return({label: item.practiceLocationId, value: item.practiceLocation})
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
                  placeholder="Select Practice Location"
                  value={list.find(obj => obj.practiceLocation === keyword)}
                  options={list}  
                  onChange={e =>{e ? changeKeyword(e.label):changeKeyword('')}}
                  isClearable={true}
                  getOptionLabel={(option) => {return(option.value)}}
                  />
                   
                </div>
                <div className='col-2'>
                    <button className='btn btn-primary' title="Add Location" onClick={modalHandler}><i className='icon plus'/></button>
                </div>
            </div>
      
            <ModalBox open={openModal} onClose={() => {setOpenModal(false)}}>
              <PracticeLocationRoomAdd/>
            </ModalBox>
       
        </>
      
    )
}

export default PracticeLocationRoomSearch