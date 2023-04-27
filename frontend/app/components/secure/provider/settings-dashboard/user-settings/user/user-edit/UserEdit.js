import React, {useState,useEffect} from 'react'
import CommonService from '../../../../../../../services/api/common.service'
import UserService from '../../../../../../../services/api/user.service'
import UserForm from '../user-form/UserForm'
import toast from 'react-hot-toast'
import MessageSetting from '../../../../../../../common/constants/message-setting.constant'
import APIResponse from '../../../../../../templates/components/APIResponse';



const UserEdit = (props) => {
    const {inputChange,userId}=props
    let loggedInUserData={}
    loggedInUserData=CommonService.getLoggedInData()
    const [userFormData, setUserFormData] = useState(props.initialData)
    const [apiResponse, setApiResponse] = useState()

    const onSuccess = (message) => {
        if (props.refresh) {props.refresh()}
        if (props.onClose) {props.onClose()}
        if (props.exitHandler) {props.exitHandler()}
    }

   
    useEffect(()=>{
        UserService.getUserById(userId)
        .then(res =>{
            console.log(res)
            setUserFormData(res)
        })
        .catch(err =>{
            console.log(err);setIsLoaded_form(true)
        })
    },[])
    
    // console.log(userFormData)
    const submitHandler=(data)=>{
        const reqObj ={
            userName:data?.userName,
            contact:{
                name:{ 
                    firstName:data?.contact?.name?.firstName,
                    lastName:data?.contact?.name?.lastName
                },
                phone:data?.contact?.phone?.includes("(")? data.contact.phone.replace("(","").replace(")","").replace("-","").replace(" ","") : data?.contact?.phone,
                mobile:data?.contact?.mobile?.includes("(")? data.contact.mobile.replace("(","").replace(")","").replace("-","").replace(" ","") : data?.contact?.mobile,
                email:data?.contact?.email,
                url:data?.contact?.url,
                address:{
                    addressLine1:data?.contact?.address?.addressLine1,
                    addressLine2:data?.contact?.address?.addressLine2,
                    city:data?.contact?.address?.city,
                    state:data?.contact?.address?.state,
                    country:data?.contact?.address?.country,
                    postalCode:data?.contact?.address?.postalCode,
                }
            },
            roleId:data?.roleId,
            userType:data?.userType,
            parentId:data?.parentId,
            id:data?.id,
            doctorId:data?.doctorId ? data?.doctorId : ''
        }
        UserService.editUser(reqObj)
        .then((res) => { 
            setApiResponse(res);
        })
        .catch((err) => { 
            setApiResponse(err);
            console.log(err) 
        });            

        // .then(response => {
        //     toast.success(MessageSetting.LoginServiceuser.edit)
        //     console.log('edit user')
        // })
    }
    return(
        <div>
           {userFormData && <UserForm submitHandler={submitHandler} initialFormData={userFormData} onClose={()=>{props.onClose()}} inputChange={inputChange}/>}
           <APIResponse apiResponse={apiResponse} onSuccess={onSuccess} toastOnSuccess={true}/>           
        </div>
      
    )
}

export default UserEdit