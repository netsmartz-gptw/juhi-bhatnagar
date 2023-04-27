import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import defaultLogo from '../../../../assets/images/logo_login.png'
import label from '../../../../assets/i18n/en.json'
import { Transition } from 'semantic-ui-react';
import PasswordSettings from '../../secure/provider/settings-dashboard/account-settings/password-settings/PasswordSettings';
import ResetPasswordService from '../../../services/api/reset-password.service';
import ChangePasswordService from '../../../services/api/change-password.service';
import ForgotPasswordService from '../../../services/api/forgot-password.service';
import toast from 'react-hot-toast';

const ResetPassword = (props) => {
    const [show, setShow] = useState(false)
    const [isLoader, setIsLoader] = useState(false)
    const [username, setUsername] = useState()

    const navigate = useNavigate()
    const params = useParams()

const submitHandler = () =>{
    let reqObj = {}
    ForgotPasswordService.forgotPassword(username, reqObj)
    .then(res=>{
        toast.success("Password Reset Email has been sent")
        navigate('../login')
    })
    .catch(err=>{
        toast.error("Failed ot reset password")
    })
}


    useEffect(() => {
        setInterval(() => {
            setShow(true)
        }, 200)
    }, [])
    return (
        <div className="limiter">
            <div className="container-login100 img-bg">
                <Transition.Group animation="drop" duration={600}>
                    {show && <div className="wrap-login100">
                        <img className="logo-center" src={defaultLogo} />
                        <br />
                        {!isLoader && <div className="d-flex row card p-4">
                            <div className='col-12'>
                                <h4>Forgot Password</h4>
                                <p className='mt-3'>Please enter your Username. A temporary password will be sent to your registered email address.
                                </p>
                            </div>
                            <div className='col-12 mt-3'>
                                <div className='required field'>
                                    <label>Username</label>
                                    <input type="text" onChange={e=>{e.preventDefault(); setUsername(e.target.value)}} value={username}/>
                                </div>
                            </div>
                            <div className='d-flex justify-content-end mt-3'>
                                <button className='btn btn-primary' onClick={e=>{e.preventDefault(); submitHandler()}}>Reset Password</button>
                            </div>
                        </div >}
                    </div>}
                </Transition.Group>
            </div >
            {/* } */}
        </div>
    )
}

export default ResetPassword