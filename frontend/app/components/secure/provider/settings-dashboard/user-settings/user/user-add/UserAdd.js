import React, { useState} from 'react'
import MessageSetting from '../../../../../../../common/constants/message-setting.constant'
import UserForm from '../user-form/UserForm'
import UserService from '../../../../../../../services/api/user.service'
import CommonService from '../../../../../../../services/api/common.service'
import toast from 'react-hot-toast'
import APIResponse from '../../../../../../templates/components/APIResponse';

const UserAdd = (props) => {
    const {inputChange} = props;
    let loggedInUserData={}
    loggedInUserData=CommonService.getLoggedInData()
    const [userFormData, setUserFormData] = useState({
        userName:'',
        contact:{
            name:{
                firstName:'',
                lastName:''
            },
            phone:'',
            mobile:'',
            email:'',
            url:'',
            address:{
                addressLine1:'',
                addressLine2:'',
                city:'',
                state:'',
                country:'',
                postalCode:'',
            }
        },
        roleId:'',
        userType:null,
        parentId:loggedInUserData.parentId,
        doctorId:''
    })
    
    const [isLoader, setIsLoader] = useState(false)
    const [apiResponse, setApiResponse] = useState()

    const onSuccess = (message) => {
        if (props.refresh) {props.refresh()}
        if (props.onClose) {props.onClose()}
        if (props.exitHandler) {props.exitHandler()}
    }
    
    const submitHandler = (data) => {
        setIsLoader(true)
        let reqObj = {...data}
        reqObj.contact.phone= reqObj?.contact?.phone?.includes("(")? reqObj?.contact?.phone.replace("(","").replace(")","").replace("-","").replace(" ","") : reqObj.contact.phone
        reqObj.contact.mobile= reqObj?.contact?.mobile?.includes("(")? reqObj?.contact?.mobile.replace("(","").replace(")","").replace("-","").replace(" ","") : reqObj.contact.mobile
        if(data.doctorId===""|| data.doctorId===null){
            delete reqObj.doctorId
        }
        reqObj.userType = 1
        return UserService.addUser(data)
            .then((res) => { 
                clearForm()
                setIsLoader(false)
                setApiResponse(res);
            })
            .catch((err) => { 
                setIsLoader(false)
                setApiResponse(err);
                console.log(err) 
            });    
            // .then(response => {
            //     clearForm()
            //     setIsLoader(false)
            //     toast.success(MessageSetting.LoginServiceuser.add)
            //     if(props.onClose){
            //         props.onClose()
            //     }
            // })
            // .catch(error => {
            //     setIsLoader(false)
            //     console.log(error)
            // })


    }

    const clearForm = () => {
        setUserFormData({})
    }
    return (
        <div>
            <UserForm submitHandler={submitHandler}  onClose={()=>{props.onClose()}}  initialFormData={userFormData} inputChange={inputChange}/>
            <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>           
        </div>
    )
}

export default UserAdd