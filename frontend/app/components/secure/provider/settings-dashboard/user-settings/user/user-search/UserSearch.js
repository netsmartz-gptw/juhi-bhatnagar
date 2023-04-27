import React, { useEffect, useState } from 'react'
import Select from "react-select"
import EquipmentService from '../../../../../../../services/api/equipment.service'
import UserService from '../../../../../../../services/api/user.service'
import label from '../../../../../../../../assets/i18n/en.json'
import Search from '../../../../../../templates/components/Search'
import UserSearchTabs from '../../../../../../templates/components/UserSearchTabs'
import AppSetting from '../../../../../../../common/constants/appsetting.constant'
import CommonService from '../../../../../../../services/api/common.service'
import ModalBox from '../../../../../../templates/components/ModalBox'
import UserAdd from '../user-add/UserAdd'

const UserSearch = (props) => {
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    // const [list, setList] = useState([])
    const [userName, setUserName] = useState('')
    const [name ,setName] = useState('')
    const [email, setEmail] = useState('') 
    const [status,setStatus] =useState('')
    const [open,setOpen] = useState(false)
    
   
    const { embed, setKeyword, keyword ,list,setList} = (props)
    const reqObj={}
    const pager={}
    const options = [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
    ]
    const modalHandler =()=> {
        setOpen(true)
    }
    const searchHandler = (initiatePager=false) => {
        reqObj.userName =userName.toLocaleLowerCase()
        reqObj.email = email.toLocaleLowerCase()
        reqObj.FirstName = name
        reqObj.isActive = status
        reqObj.PageSize = AppSetting.resultsPerPage

        if (initiatePager === true) {
            pager = CommonService.initiatePager();
        }
        reqObj.StartRow = CommonService.calculatePageStartRow(pager.currentPage, pager.resultPerPage);
        console.log(reqObj)
        UserService.findUser(reqObj)
            .then((response) => {
                console.log(response)
                let array = response.data.map(item => {
                    console.log(item)
                    return (item)
                })
                console.log(array);
                props.setList(array);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })

    }
    const clearForm = () => {

        setName("")
        setUserName("")
        setEmail("")
        setStatus("")
        UserService.findUser(reqObj)
        .then((response) => {
            console.log(response)
            let array = response.data.map(item=>{
                return(item)
            }) 
            setList(array);
            setIsLoader(false);
        })
        .catch(error => {
            setIsLoader(false);
            console.log(error)
        })
    
    }

    useEffect(() => {
        setIsLoader(true);
        if (props.setKeyword) {
            props.setKeyword(keyword)
        }
        if (props.setList) {
            props.setList(list)
        }
        setIsLoader(false);
    }, [keyword])

    return (
        <>
           <UserSearchTabs> 
               <div label="Username">
                   {userName && 
                        <div className="ui segment selection-area">
                            <a className="ui label" >
                                {label.user.find.userName} : {userName}
                                <i className="delete icon" onClick={(e) => setUserName("")}></i>
                            </a>
                        </div>
                      
                    }
                <div className='field row'>
                    <div className='col-10'>
                    <input  placeholder="UserName" type="text" onChange={(e)=>{setUserName(e.target.value)}} value={userName}/>
                    </div>
                    <div className='col-2'>
                    <button className='btn btn-primary' title="Add User" onClick={modalHandler}><i className='icon plus'/></button>
                    </div>
                    
                </div>
                </div>

                <div label="Name">
                    {name ?
                        <div className="ui segment selection-area">
                            <a className="ui label" >
                                {label.user.find.name} : {name}
                                <i className="delete icon" onClick={(e) => setName("")}></i>
                            </a>
                        </div> : <div></div>
                    }
                  
                    <div className='field row'>
                        <div className='col-10'>    
                            <input placeholder="Name" type="text" onChange={(e)=>{setName(e.target.value)}} value={name}/>
                        </div>
                        <div className='col-2'>
                            <button className='btn btn-primary' title="Add User" onClick={modalHandler}><i className='icon plus'/></button>
                        </div>
                      
                    </div>               
                </div>
                <div label="Email">
                    {email ?
                        <div className="ui segment selection-area">
                            <a className="ui label" >
                                {label.user.find.email} : {email}
                                <i className="delete icon" onClick={(e) => setEmail("")}></i>
                            </a>
                        </div> : <div></div>
                    }
                   
                    <div className='field row'>
                        <div className='col-10'>  
                            <input placeholder="Email" type="text" onChange={(e)=>{setEmail(e.target.value)}} value={email}/>
                        </div>
                        <div className='col-2'>
                            <button className='btn btn-primary' title="Add User" onClick={modalHandler}><i className='icon plus'/></button>
                        </div>
                    </div>
                </div>
                <div label="Status">
                    <div className='field row'>
                        <div className='col-10'>
                            <Select className="selection"
                                components={{ DropdownIndicator: () => <i className="ui icon search m-2" onClick={searchHandler}></i>, IndicatorSeparator: () => null }}
                                name="EquipmentTypeName" aria-label='equipmentTypeId' onChange={(e) =>{console.log(e);setStatus(e.value)}} options={options}>
                            </Select>
                        </div> 
                        <div className='col-2'>
                            <button className='btn btn-primary' title="Add User" onClick={modalHandler}><i className='icon plus'/></button>
                        </div> 
                    </div>
                </div>
            </UserSearchTabs>
            {/* <button className='btn btn-primary' title="Add User" onClick={modalHandler}><i className='icon plus'/></button> */}
            <ModalBox  open ={open} onClose={() => { setOpen(false) }}>
                <UserAdd/>
            </ModalBox>
           
            <div className="ui clearing divider"></div>
            <button className='btn btn-primary' type="submit" onClick={searchHandler}>{label.equipmentType.find.find}</button>

        </>
    )
}

export default UserSearch