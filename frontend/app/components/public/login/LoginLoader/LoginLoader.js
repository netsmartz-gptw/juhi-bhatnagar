
import defaultLogo from '../../../../../assets/images/logo_login.png'
// import defaultLogo from '../../../../../assets/images/revitalized-logo.png'
import loader from '../../../../../assets/images/loader.gif'
import React, { useContext, useEffect, useState } from 'react'
import { skin } from '../../../../context/SkinProvider'
import { Transition } from 'semantic-ui-react'
import { Image } from 'react-bootstrap'
import StorageService from '../../../../services/session/storage.service'
const LoginLoader = (props) => {
    const [logo, setLogo] = useState(defaultLogo)
    const [show, setShow] = useState(false)

    const getLogo = () => {
        let settings = JSON.parse(StorageService.get('session', 'settingsData'));
        if (settings?.logo) {
            setLogo(settings.logo)
        }
    }
    useEffect(() => {
        if(!props.logo){
            getLogo()
        }
        else{
            setLogo(props.logo)
        }
        setInterval(() => {
            setShow(true)
        }, 200)
    }, [])

    return (
        <div>

            <div className="login-loader">
                {/* <Transition animation="slide down" duration={500} visible={show}> */}
                <div className='row d-flex justify-content-center'>

                    <div className="col-auto row d-flex justify-content-center col-lg-3  col-md-6 col-12">
                        <div className='col-auto row d-flex justify-content-center'>
                            <div className='col-12 d-flex justify-content-center'>
                                <img src={logo ? logo: defaultLogo} className='col-auto' width={{ width: '300px' }} />
                            </div>
                            <img src={loader} style={{ width: '150px' }} className='col-12 my-3' />
                            {/* <i className="spinner-border col-12 m-4" role="status"></i> */}
                            <span className="col-12 text-center text-primary">Logging In...</span></div></div>
                </div>
                {/* </Transition> */}
            </div>
        </div>

    )
}

export default LoginLoader