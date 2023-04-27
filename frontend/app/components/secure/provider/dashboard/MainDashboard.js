import React, { useState, useEffect } from 'react'
import CommonService from '../../../../services/api/common.service'
import BookKeepingDashboard from './BookKeepingDashboard'
import CallCenterDashboard from './CallCenterDashboard'
import DefaultDashboard from './DefaultDashboard'
import FrontDeskDashboard from './FrontDeskDashboard'
import ProviderAdminDashboard from './ProviderAdminDashboard'
import ProviderDashboard from './ProviderDashboard'
import StorageService from '../../../../services/session/storage.service'
const MainDashboard = (props) => {
    const [role, setRole] = useState(0)

    useEffect(() => {
        const user = CommonService.getAuthData()
        console.log(user.masterRoleId)
        setRole(user?.masterRoleId)
    }, [])
    const Display = (props) => {
        switch (role) {
            case '0':
                return <DefaultDashboard />
            case '1':
                return <ProviderAdminDashboard />
            case '2':
                return <FrontDeskDashboard />
            case '3':
                return <ProviderDashboard />
            case '4':
                return <CallCenterDashboard />
            case '5':
                return <BookKeepingDashboard />
            default:
                return <DefaultDashboard />
        }
    }
    return (
        <div className='d-flex row'>
            {/* <div className='col-12 d-flex justify-content-end'>
                <div className='col-auto'>
                    <select onChange={e => { e.preventDefault(); setRole(e.target.value) }} value={role} className="form-select">
                        <option value={0}>Default</option>
                        <option value={1}>Admin</option>
                        <option value={2}>Front Desk</option>
                        <option value={3}>Provider</option>
                        <option value={4}>Call Center</option>
                        <option value={5}>Book Keeper</option>
                    </select>
                </div>
            </div> */}
            <div className='col-12'>
                <Display role={role} />
            </div>
        </div>
    )
    // let role = CommonService.getLoggedInData()?.masterRoleId

}
export default MainDashboard