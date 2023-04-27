import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import RoleService from '../../../../../../../services/api/role.service';
import UserRolesForm from '../user-roles-form/UserRolesForm';

const UserRolesAdd = (props) => {
    // function for input change
    const submitHandler = (data) => {
        RoleService.add(data)
        .then(res=>{
            toast.success("Role was successfully Added")
            if(props.onClose){
                props.onClose()
            }
        }
        )
        .catch(err=>{
            console.log(err)
            toast.error("There was an error submitting your Role")
        })
    };
    return (
        <div className='row d-flex'>
      <UserRolesForm practiceId={props.practiceId} initialData={{}} submitHandler={submitHandler} onClose={props.onClose} submitButton="Save"/>
        </div>
    )
}
export default UserRolesAdd