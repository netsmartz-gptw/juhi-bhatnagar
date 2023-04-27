import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import ChangePasswordService from '../../../../../../services/api/change-password.service'
import CommonService from '../../../../../../services/api/common.service'
import UserService from '../../../../../../services/api/user.service'
import Module from '../../../../../templates/components/Module'

const PasswordSettings = (props) => {
    const navigate = useNavigate()
    const [user, setUser] = useState()
    const [oldPassword, setOldPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [testPassword, setTestPassword] = useState()
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showTest, setShowTest] = useState(false)
    const [errorMessage, setErrorMessage] = useState()
    const [userType, setUserType] = useState(CommonService.getLoggedInData().userType)
    const getUser = () => {
        let user = CommonService.getLoggedInData()
        console.log(user)
        setUser(user)
    }
    const updatePassword = () => {
        let reqObj = {
            isReset: false,
            newPassword: newPassword,
            oldPassword: oldPassword,
            providerSuffix: user?.providerName || props.providerName,
            userType: parseInt(props.userType) || parseInt(userType)
        }
        if (!user?.providerName) {
            delete reqObj.providerSuffix
        }
        let userId = props.userId || user.id
        ChangePasswordService.changePassword(reqObj, userId, 1)
            .then(res => {
                toast.success("Password Succesfully Changed")
                setNewPassword()
                setOldPassword()
                setTestPassword()
                if (props.isLogin) {
                   navigate('./login')
                }
            }

            )
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        if (testPassword && testPassword !== "") {
            if (testPassword === newPassword) {
                setErrorMessage()
            }
            else {
                setErrorMessage("Passwords Do Not Match")
            }
        }
    }, [testPassword])
    return (
        <div className='col'>
            <Module title="Change Password">
                <div className='col-12 field required'>
                    <label>Current Password</label>
                    <div className="ui left icon input w-100">
                        <i className="lock icon ms-2"></i>
                        <input type={showOld ? 'text' : 'password'} placeholder="password" name="password" value={oldPassword} onChange={e => { setOldPassword(e.target.value) }} />
                        <a className="ui icon view-pw">
                            <i onClick={e => { e.preventDefault(); showOld ? setShowOld(false) : setShowOld(true) }} className={showOld ? 'eye icon text-decoration-none' : 'low vision icon text-decoration-none'}></i>
                        </a>
                    </div >
                </div>
                <div className='col-12 field required'>
                    <label>New Password</label>
                    <div className="ui left icon input w-100">
                        <i className="lock icon ms-2"></i>
                        <input type={showNew ? 'text' : 'password'} placeholder="password" name="password" value={newPassword} onChange={e => { setNewPassword(e.target.value) }} />
                        <a className="ui icon view-pw">
                            <i onClick={e => { e.preventDefault(); showNew ? setShowNew(false) : setShowNew(true) }} className={showNew ? 'eye icon text-decoration-none' : 'low vision icon text-decoration-none'}></i>
                        </a>
                    </div >
                </div>
                <div className='col-12 field required'>
                    <label>Confirm Password</label>
                    <div className="ui left icon input w-100">
                        <i className="lock icon ms-2"></i>
                        <input type={showTest ? 'text' : 'password'} placeholder="password" name="password" value={testPassword} onChange={e => { setTestPassword(e.target.value) }} />
                        <a className="ui icon view-pw">
                            <i onClick={e => { e.preventDefault(); showTest ? setShowTest(false) : setShowTest(true) }} className={showTest ? 'eye icon text-decoration-none' : 'low vision icon text-decoration-none'}></i>
                        </a>
                    </div >
                </div>
                <div className='requirement-text col-12 mt-1'>**Minimum eight characters, at least one letter, one number and one special character(&?#$_!@^%)</div>
                {errorMessage && <div className='col-12 mt-3 text-center'>
                    <span className='form-alert'>{errorMessage}</span>
                </div>}
                <div className='col-12 d-flex justify-content-between mt-3'>
                    <div className='col-auto'>
                        {props.onClose && <button className='btn btn-secondary' onClick={e => { e.preventDefault(); props.onClose() }} >Close</button>}
                        {props.isLogin && <button className='btn btn-secondary' onClick={e => { e.preventDefault(); navigate('/login')}} >Return to Login</button>}
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-primary' onClick={e => { e.preventDefault(); updatePassword() }} disabled={!newPassword || !oldPassword || !testPassword}>Change Password</button>
                    </div>
                </div>
            </Module>
        </div>
    )
}

export default PasswordSettings