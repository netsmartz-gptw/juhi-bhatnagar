import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import RoleService from '../../../../../../../services/api/role.service';
import UserRolesForm from '../user-roles-form/UserRolesForm';

const UserRolesEdit = (props) => {
    const [isLoader, setIsLoader] = useState(false)
    const [initialData, setInitialData] = useState(props.initialData)
    // function for input change

    const getRole = () => {
        setIsLoader(true)
        RoleService.getById(props.id)
            .then(res => {
                setIsLoader(false)
                console.log(res.data)
                setInitialData(res.data)
            })
            .catch(err=>{
                console.log(err)
                setIsLoader(false)
            })
    }
    const submitHandler = (data) => {
        RoleService.update(data,props.id)
            .then(res => {
                toast.success("Role was successfully Added")
                if (props.onClose) {
                    props.onClose()
                }
            }
            )
            .catch(err => {
                console.log(err)
                toast.error("There was an error submitting your Role")
            })
    };

    useEffect(() => {
        if (props.id) {
            getRole()
        }
    }, [props.id])
    return (
        <div className='row d-flex'>
           {!isLoader&& initialData ? <UserRolesForm initialData={initialData} onClose={props.onClose} submitHandler={submitHandler} submitButton="Update" />:null}
        </div>
    )
}
export default UserRolesEdit