import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import defaultLogo from '../../../../assets/images/logo_login.png'
import label from '../../../../assets/i18n/en.json'
import { Transition } from 'semantic-ui-react';
import PasswordSettings from '../../secure/provider/settings-dashboard/account-settings/password-settings/PasswordSettings';

const ChangePassword = (props) => {
    const [show, setShow] = useState(false)
    const [isLoader, setIsLoader] = useState(false)
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()
    const params = useParams()



    // formula for input change
    const inputChange = (e) => {
        e.preventDefault()
        let newStateObject = { ...loginData };
        newStateObject[e.target.name] = e.target.value;
        setLoginData(newStateObject);
        // console.log("new data", loginData);
    };

    useEffect(() => {
        setInterval(() => {
            setShow(true)
        }, 200)
    }, [])

    useState(() => {
        if (success == true) {
            navigate('../login')
        }
    }, [success])
    return (
        <div className="limiter">
            {/* <div className='card'>
                parentId: {params.parentId}
                userType: {params.userType}
                userId: {params.userId}
                isReset: {params.isReset}
            </div> */}
            <div className="container-login100 img-bg">
                <Transition.Group animation="drop" duration={600}>
                    {show && <div className="wrap-login100">
                        <img className="logo-center" src={defaultLogo} />
                        <br />
                        {!isLoader && <div className="">
                            <PasswordSettings isLogin providerName={params.providerName && params.providerName} userId={params.userId} userType={params.userType} setSuccess={setSuccess} />
                        </div >}
                    </div>}
                </Transition.Group>
            </div >
        </div>
    )
}

export default ChangePassword