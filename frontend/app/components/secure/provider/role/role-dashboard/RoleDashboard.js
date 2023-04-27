import React, {useState} from 'react'
import Dashboard from '../../../../templates/layouts/Dashboard'
import RoleForm from '../note-form/RoleForm'
import RoleList from '../note-list/RoleList'
import RoleSearch from '../note-search/RoleSearch'

const RoleDashboard = (props) => {
    return(
        <Dashboard title="Roles Dashboard" Modules>
            <RoleSearch title="Role Search" side="left"/>
            <RoleForm title="Role Form" side="left"/>
            <RoleList title="Role List" side="right"/>
        </Dashboard>
    )
}

export default RoleDashboard