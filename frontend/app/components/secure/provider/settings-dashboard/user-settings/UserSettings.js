import React from 'react'
import TabsTemplate from '../../../../templates/components/TabsTemplate'
import UserRolesTable from './user-roles/user-roles-table/UserRolesTable'
import UserList from './user/user-list/UserList'
import UserSettingsTable from './user/user-settings-table/UserSettingsTable'
import UserDashboard from './user/UserDashboard'

const UserSettings = (props) => {
    return (
        <TabsTemplate>
            <div title='Manage Users'>
                <UserSettingsTable />
                {/* <UserDashboard/> */}
            </div>
            {/* <div title="User Roles">
                <UserRolesTable/>
            </div> */}
        </TabsTemplate>
    )
}

export default UserSettings