import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import defaultLogo from '../../../../assets/images/logo_login.png'
import { Accordion, Transition, Icon } from 'semantic-ui-react';
import TermsOfUse from './terms-and-conditions-modules/TermsOfUse';
import PrivacyPolicy from './terms-and-conditions-modules/PrivacyPolicy';
import HIPPAAuthorization from './terms-and-conditions-modules/HIPPAAuthorization';
import UserService from '../../../services/api/user.service';
import ChangePasswordService from '../../../services/api/change-password.service';
import ResetPasswordService from '../../../services/api/reset-password.service';
import toast from 'react-hot-toast';

const TermsAndConditions = (props) => {
    const [show, setShow] = useState(false)
    const [isLoader, setIsLoader] = useState(false)
    const [success, setSuccess] = useState(false)
    const [activeIndex, setActiveIndex] = useState()
    const [hipaaPolicy, setHipaaPolicy] = useState(false)
    const [privacyPolicy, setPrivacyPolicy] = useState(false)
    const [termsOfUse, setTermsOfUse] = useState(false)
    const params = useParams()
    const acceptTerms = () =>{
        let reqObj={
            hipaaPolicy: hipaaPolicy,
            privacyPolicy: privacyPolicy,
            termsOfUse: termsOfUse
        }
        ResetPasswordService.acceptTerms(params.userId, reqObj)
        .then(results=>{
            let res=results.data
            console.log(res)
            toast.success("Terms Accepted")
            return navigate(`../change-password/${res.parentId}/${res.userType}/${res.id}/${res.changePassword}/${params.providerName !== "undefined" ? params.providerName : ''}`)
        })
        .catch(err=>{
            toast.error("Failed to Accept Terms")
        })
    }

    const navigate = useNavigate()


    useEffect(() => {
        setInterval(() => {
            setShow(true)
        }, 200)
    }, [])

    useState(() => {
        if (success === true) {
            navigate('../login')
        }
    }
        , [success])
    return (
        <div className="limiter terms-condition-section">
            <div className="container-login100 img-bg">
                <Transition.Group animation="drop" duration={600}>
                    {show && <div className="wrap-login100">
                        <img className="logo-center" src={defaultLogo} />
                        <br />
                        {!isLoader && <div className="card p-4">
                            <div className='d-flex row'>
                                <div className='col-12'>
                                    <h4>Terms and Conditions</h4>
                                </div >
                                <div className='col-12 mt-3'>
                                    <Accordion fluid styled>
                                        <Accordion.Title
                                            active={activeIndex === 0}
                                            index={0}
                                            onClick={e => { e.preventDefault(); if (activeIndex === 0) { setActiveIndex() } else { setActiveIndex(0) } }}
                                        > <Icon name='dropdown' />Website Terms of Use</Accordion.Title>
                                        <Accordion.Content active={activeIndex === 0}>
                                            <TermsOfUse />
                                        </Accordion.Content>
                                        <Accordion.Title
                                            active={activeIndex === 1}
                                            index={1}
                                            onClick={e => { e.preventDefault(); if (activeIndex === 1) { setActiveIndex() } else { setActiveIndex(1) } }}
                                        > <Icon name='dropdown' /> Privacy Policy</Accordion.Title>
                                        <Accordion.Content active={activeIndex === 1}>
                                            <PrivacyPolicy />
                                        </Accordion.Content>
                                        <Accordion.Title
                                            active={activeIndex === 2}
                                            index={2}
                                            onClick={e => { e.preventDefault(); if (activeIndex === 2) { setActiveIndex() } else { setActiveIndex(2) } }}
                                        > <Icon name='dropdown' /> HIPAA Authorization (Marketing Authorization)
                                        </Accordion.Title>
                                        <Accordion.Content active={activeIndex === 2}>
                                            <HIPPAAuthorization />
                                        </Accordion.Content>
                                    </Accordion>
                                </div >
                                <div className='col-12 mt-3'>
                                    <div className='form-check'>
                                        <input type="checkbox" className='form-check-input' checked={termsOfUse} name="termsOfUse" onChange={e => { setTermsOfUse(e.target.checked) }} />
                                        <label className='form-check-label'>I agree to HelloPatients <a href="#" onClick={e=>{e.preventDefault(); setActiveIndex(0)}}>Terms of Use</a></label>
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <div className='form-check'>
                                        <input type="checkbox" className='form-check-input' checked={privacyPolicy} name="privacyPolicy" onChange={e => { setPrivacyPolicy(e.target.checked) }} />
                                        <label className='form-check-label'>I agree to HelloPatients <a href="#" onClick={e=>{e.preventDefault(); setActiveIndex(1)}}>Privacy Policy</a></label>
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <div className='form-check'>
                                        <input type="checkbox" className='form-check-input' checked={hipaaPolicy} name="hipaaPolicy" onChange={e => { setHipaaPolicy(e.target.checked) }} />
                                        <label className='form-check-label'>I agree to HelloPatients <a href="#" onClick={e=>{e.preventDefault(); setActiveIndex(2)}}>HIPPA Policy</a></label>
                                    </div>
                                </div>
                                <div className='col-12 d-flex justify-content-between mt-3'>
                                    <div className='col-auto'>
                                        <button className='btn btn-secondary' onClick={e=>{e.preventDefault(); navigate('../login')}}>Cancel</button>
                                    </div>
                                    <div className='col-auto'>
                                        <button disabled={!termsOfUse || !privacyPolicy || !hipaaPolicy} className='btn btn-primary' onClick={e=>{e.preventDefault(); acceptTerms()}}>Accept</button>
                                    </div>
                                </div>
                            </div >
                        </div >
                        }
                    </div>}
                </Transition.Group>
            </div >
            {/* } */}
        </div>
    )
}

export default TermsAndConditions