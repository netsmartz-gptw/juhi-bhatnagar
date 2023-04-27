import moment from 'moment'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Modal } from 'semantic-ui-react'
import LoginService from '../../../../../../../services/api/login.service'
import PatientAccountService from '../../../../../../../services/api/patient-account.service'
import PatientService from '../../../../../../../services/api/patient.service'
import RoleService from '../../../../../../../services/api/role.service'
import ModalBox from '../../../../../../templates/components/ModalBox'
import Table from '../../../../../../templates/components/Table'
import UserRolesAdd from '../user-roles-add/UserRolesAdd'
import UserRolesEdit from '../user-roles-edit/UserRolesEdit'
import ViewAccess from '../view-access/ViewAccess'


const UserRolesTable = (props) => {
    const [roles, setRoles] = useState()
    const [isLoader, setIsLoader] = useState(false)
    const [viewEdit, setViewEdit] = useState()
    const [selectedRole, setSelectedRole] = useState()
    const [statusModal, setStatusModal] = useState(false)
    const [viewAdd, setViewAdd] = useState()
    const [viewPerm, setViewPerm] = useState()

    const getRoles = () => {
        setIsLoader(true)
        let reqObj = {}
        if(props.practiceId){
            reqObj.practiceId = props.practiceId
        }
        RoleService.find(reqObj)
            .then(res => {
                if (res?.data?.data) {
                    console.log(res.data.data)
                    setRoles(res.data.data)
                }
                setIsLoader(false)
            })
    }

    const activateRole = () => {
        RoleService.activateRole(selectedRole.id)
            .then(res => {
                toast.success("Role is Activated")
                return getRoles()
            })
    }
    const deactivateRole = () => {
        RoleService.deactivateRole(selectedRole.id)
            .then(res => {
                toast.success("Role is Inactive")
                return getRoles()
            })
    }

    useEffect(() => {
        getRoles()
    }, [])
    const columns = [
        {
            key: "roleName",
            text: "Name",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "description",
            text: "Description",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "isActive",
            text: "Status",
            // className: "name",
            align: "center",
            sortable: true,
            cell: (role, i) => role.isActive ? <span className='btn btn-success text-white w-100'>Active</span> : <span className='btn btn-danger text-white w-100'>Inactive</span>
        },
        {
            key: "actionPracticePatient",
            text: "Action",
            // className: "name",
            align: "center",
            sortable: false,
            cell: (role, i) => {
                return (

                    <div className='d-flex justify-content-center'>
                        <button className="p-0 ps-1 btn btn-primary" title="Edit role" onClick={e => { e.preventDefault(); setSelectedRole(role); return setViewEdit(true) }}><i className="icon pencil" /></button>
                        <button className="p-0 ps-1 btn btn-primary ms-1" title={role.isActive ? 'Deactivate role' : 'Activate role'} onClick={e => { e.preventDefault(); setSelectedRole(role); return setStatusModal(true) }}>{role.isActive ? <i className="icon dont" /> : <i className="icon check" />}</button>
                        <button className="p-0 ps-1 btn btn-primary ms-1" title='View Permissions' onClick={e => { e.preventDefault(); setSelectedRole(role); return setViewPerm(true) }}><i className="icon horizontal bars" /></button>
                    </div>
                )
            }
        }
    ]

    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "User Roles",
        button: {
            excel: true,
            print: true,
            csv: true,
            extra: true
        },
        language: {
            loading_text: "Please be patient while data loads..."
        }
    }
    return (
        <div>
            <Table records={roles} config={config} columns={columns} loading={isLoader}
                extraButtons={[
                    {
                        className: 'btn btn-primary',
                        children: <i className='icon plus' />,
                        onClick: () => { setViewAdd(true) },
                        title: 'Add User Role'
                    }
                ]} />
            <ModalBox open={statusModal} onClose={() => setStatusModal(false)}>
                <div className='row d-flex justify-content-between align-items-center'>
                    <div className='col'>
                        {selectedRole?.isActive == 1 ? <p>Are you sure you want to deactivate role?</p> : <p>Are you sure you want to Activate this role?</p>}
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-primary' onClick={(e) => { e.preventDefault(); selectedRole?.isActive == 1 ? deactivateRole() : activateRole() }} >OK</button>
                        <button className="btn btn-secondary ms-3" onClick={(e) => { e.preventDefault(); setStatusModal(false) }}>Cancel</button>
                    </div>
                </div>
            </ModalBox>
            <ModalBox open={viewAdd} onClose={() => { setViewAdd(false) }} title="Add a User role">
                <UserRolesAdd practiceId={props.practiceId} onClose={() => { getRoles(); return setViewAdd(false) }} />
            </ModalBox>
            <ModalBox open={viewEdit} onClose={() => { setViewEdit(false) }} title="Edit a User role">
                <UserRolesEdit id={selectedRole?.id} onClose={() => { getRoles(); return setViewEdit(false) }} />
            </ModalBox>
            <ModalBox open={viewPerm} onClose={() => { setViewPerm(false) }} title={`Features for ${selectedRole?.roleName} role`}>
                {selectedRole && viewPerm ? <ViewAccess id={selectedRole?.id} onClose={() => { setViewPerm(false) }} /> : null}
            </ModalBox>
        </div>
    )
}

export default UserRolesTable