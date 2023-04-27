import React, { useEffect, useContext, useState, useLayoutEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import defaultLogo from '../../../../assets/images/logo_login.png'
// import defaultLogo from '../../../../assets/images/revitalized-logo.png'
import label from '../../../../assets/i18n/en.json'

import LoginService from '../../../services/api/login.service';
import StorageService from '../../../services/session/storage.service';
import ProviderService from '../../../services/api/provider.service';
import AccessRightsService from '../../../services/api/access-rights.service';
import ToasterService from '../../../services/api/toaster.service';

import StorageType from '../../../services/session/storage.enum';


import { store } from '../../../context/StateProvider';
import { skin } from '../../../context/SkinProvider';
import LoginLoader from './LoginLoader/LoginLoader';
import { Transition } from 'semantic-ui-react';
import toast from 'react-hot-toast';
import ThemeService from '../../../services/api/theme.service';
import SettingsService from '../../../services/api/settings.service';

const Login = (props) => {
    const [isLoaderTheme, setIsLoaderTheme] = useState(false)
    const [isLoaderLogo, setIsLoaderLogo] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const [provider, setProvider] = useState('')
    const [logo, setLogo] = useState()

    const [loginData, setLoginData] = useState({ 'sendCatalog': true, 'RememberMe': true })
    const [formErrors, setFormErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)

    const [showGuestUserMessage, setShowGuestUserMessage] = useState(false)
    const [showGuestUserErrorMessage, setShowGuestUserErrorMessage] = useState(false)

    const [toastData, setToastData] = useState({})
    const [toastMessage, setToastMessage] = useState("")

    const globalStateAndDispatch = useContext(store)
    const contextState = globalStateAndDispatch.state
    const contextDispatch = globalStateAndDispatch.dispatch
    const skinStateAndDispatch = useContext(skin)
    const skinState = skinStateAndDispatch.state
    const skinDispatch = skinStateAndDispatch.dispatch
    const [show, setShow] = useState(false)
    const params = useParams()

    const navigate = useNavigate()

    const getSkin = (provider) => {
        LoginService.getLogoTheme(provider)
            .then(res => { return res })
    }
    const getLogoCall = () => {
        SettingsService.getProviderSettingsLogo(params.providerName)
            .then(res => {
                if (res?.data?.logo) {
                    console.log(res.data.logo)
                    setLogo(res.data.logo)
                    setIsLoaderLogo(false)
                }
                else {
                    navigate("../login")
                    setIsLoaderLogo(false)
                }
            })
    }
    useLayoutEffect(() => {
        setIsLoaderLogo(true)
        if (params.providerName !== "" && params.providerName && params.providerName !== "undefined") {
            let results = getSkin(params.providerName)
            SettingsService.getProviderSettingsSkin(params.providerName)
                .then(res => {
                    if (res?.data?.skin) {
                        console.log(res.data.skin)
                        ThemeService.changeTheme(res.data.skin)
                    }
                    else {
                        navigate('../login')
                    }
                })
            if (results?.logo) {
                setLogo(results?.logo)
                setIsLoaderLogo(false)
            }
            else {
                getLogoCall()
            }
        }
        else { setLogo(defaultLogo);
        ThemeService.changeTheme(7) }
    }, [params])

    const getLogo = () => {
        let settings = JSON.parse(StorageService.get('session', 'settingsData'));
        if (settings?.logo) {
            setLogo(settings.logo)
        }
    }

    // useEffect(() => {
    //     getLogo()
    // }, [])

    // This function will decide landing page based on logged in userType (ie. Dashboard for GlobalAdmin/User/Patient/Provider/ChangePassword)
    const handleNavigation = (loginResponse) => {
        // toast.success("Handle Nav")
        if (loginData.RememberMe === true) {
            // this.loginForm.controls['password'].patchValue(null);
            StorageService.save(StorageType.local, 'userAuth', JSON.stringify(loginResponse));
        } else {
            StorageService.remove(StorageType.local, 'userAuth');
        }

        if (loginResponse.changePassword === true) {
            navigate('/change-password');
        }
        if (loginResponse.userType === 1) {
            let authData = JSON.parse(StorageService.get('session', 'auth'));
            if (!authData.isEmulated) {
                // CommonService.startCheckingIdleTime();
            }
            navigate('/provider');
        } else if (loginResponse.userType === 2) {
            // CommonService.startCheckingIdleTime();
            // resetThemeOptions();
            navigate('/admin');
        }
        else {
            navigate('/patient')
        }
    }
    useEffect(() => {
        if (StorageService.get('session', 'guestUser')) {
            setIsLoggingIn(true)
            let guestUser = JSON.parse(StorageService.get('session', 'guestUser'));
            if (guestUser !== undefined && guestUser !== null && guestUser !== '') {
                StorageService.remove('session', 'guestUser');
                handleLoginResponse(guestUser);
            }
        }
    }, [StorageService.get('session', 'guestUser')])

    const login = (e) => {
        setIsLoggingIn(true);
        e.preventDefault()
        LoginService.login(loginData)
            .then(res => {
                let loginResponse = res.data
                StorageService.setFirstLoginCount();
                if (loginResponse.userType == 0) {
                    toast.success("It looks like you are a patient. Please hold while we redirect you to the correct Login.")
                    setTimeout(() => {
                        window.location.assign('https://login.hellopatients.com/#/login')
                    }, 15000)
                }
                else {
                    if (loginResponse['termsConditions'] === false) {
                        StorageService.save('session', 'auth', JSON.stringify(res.data));
                        return navigate(`/terms-conditions/${res.data.id}`)
                    } else if (loginResponse['changePassword'] === true) {
                        StorageService.save('session', 'auth', JSON.stringify(res));
                        return navigate(`/change-password/${res.data.parentId}/${res.data.userType}/${res.data.id}/${res.data.changePassword}/${params.providerName !== "undefined" ? params.providerName : ''}`)
                    } else {
                        StorageService.save('session', 'auth', JSON.stringify(res.data));
                        if (loginResponse.userType == 1) {
                            let userDataResponse;
                            let providerSettings;
                            LoginService.getloginUserDetail(loginResponse['userType'], loginData['userName'], loginResponse['parentId'])
                                .then(result => {
                                    contextDispatch({ type: 'setProviderSelected', payload: result })
                                    StorageService.save('session', "userDetails", JSON.stringify(result));
                                    AccessRightsService.getModuleDetails(result)
                                    userDataResponse = result
                                    console.log(result)
                                    ProviderService.getProviderDetails(loginResponse.parentId)
                                        .then(result => {
                                            let details = result
                                            StorageService.save('session', 'providerSelected', JSON.stringify(result));
                                            contextDispatch({ type: 'setSettingsData', payload: result })
                                            setLogo(details.logo)
                                            providerSettings = {
                                                logo: details.logo,
                                                skin: details.skin,
                                                providerName: details.providerUrlSuffix
                                            }
                                            StorageService.save('session', "settingsData", JSON.stringify(providerSettings))

                                            SettingsService.getProviderSettingsSkin(details.providerUrlSuffix)
                                                .then(res => {
                                                    console.log(res.data)
                                                    ThemeService.changeTheme(res.data.skin)
                                                })
                                            setLogo(providerSettings.logo)
                                            console.log("skin is:", providerSettings)
                                            contextDispatch({ type: 'setSkin', payload: providerSettings })
                                            setIsLoggingIn(false);
                                            // navigate('../provider/context')
                                            handleNavigation(loginResponse)
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            setIsLoggingIn(false);
                                        })
                                })
                                .catch(err => {
                                    console.log(err)
                                    setIsLoggingIn(false)
                                })

                            // error => {
                            //   isLoggingIn = false; // hide loader
                            //   themeService.changeTheme(7);
                            //   const toastMessage = Exception.exceptionMessage(error);
                            //   toastData = ToasterService.error(toastMessage.join(", "));
                            //   setTimeout(() => {
                            //     toastData = ToasterService.closeToaster(
                            //       toastMessage.join(", ")
                            //     );
                            //   }, 5000);
                            // })
                        } else {
                            LoginService.getloginUserData(loginResponse['userType'], loginData['userName'], loginResponse['id'])
                                .then((userDataResponse) => {
                                    console.log(userDataResponse.data)
                                    StorageService.save('session', 'userDetails', JSON.stringify(userDataResponse.data));
                                    return handleNavigation(loginResponse);
                                })
                                .catch(error => {
                                    setIsLoggingIn(false);  // hide loader
                                }
                                )
                        }
                    }
                }
            })
            .catch(error => {
                // const toastMessage = Exception.exceptionMessage(error);
                setIsLoggingIn(false)  // hide loader
                setToastData(ToasterService.error(toastMessage))
                if (error.error != undefined && error.error.message != undefined && error.error.message == "Key_LockedAccount") {
                    setTimeout(() => {
                        toastData = ToasterService.closeToaster(toastMessage);
                    }, 10000);
                } else {
                    setTimeout(() => {
                        // toastData = ToasterService.closeToaster(toastMessage.join(', '));
                    }, 5000);
                }
            }
            );
    }

    const handleLoginResponse = (loginResponse) => {
        if (loginResponse.isEmulated === true) {
            contextDispatch({ type: 'setEmulate', payload: true })
        }
        if (loginResponse['termsConditions'] === false) {
            return;
        } else if (loginResponse['changePassword'] === true) {
            if (loginResponse.isEmulated === true) {
                return;
            }
        } else {
            StorageService.save('session', 'auth', JSON.stringify(loginResponse));
            LoginService.getloginUserDetail(loginResponse['userType'], loginResponse['userName'], loginResponse['parentId'])
                .then(userDataResponse => {
                    ProviderService.getProviderDetails(loginResponse['parentId'])
                        .then(
                            (response) => {
                                StorageService.save('session', 'userDetails', JSON.stringify(userDataResponse));
                                StorageService.save('session', "providerSelected", JSON.stringify(response));
                                AccessRightsService.getModuleDetails(userDataResponse);
                                let details = response;
                                let providerSettings = {
                                    logo: details.logo,
                                    skin: details.skin,
                                    providerName: details.providerUrlSuffix
                                };
                                StorageService.save('session', "settingsData", JSON.stringify(providerSettings)
                                );
                                return navigate('/provider')
                            })
                        .catch(
                            (error) => {
                                setIsLoggingIn(false); // hide loader
                                ThemeService.changeTheme(7);
                            }
                        )
                })
        }
    }

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
        // getLogo()
    }, [])
    return (
        <div className="limiter">
            {isLoggingIn &&
                <LoginLoader logo={logo} />
            }
            {/* {!isLoggingIn &&  */}
            <div className="container-login100 img-bg">
                <Transition.Group animation="drop" duration={600}>
                    {show && <div className="wrap-login100 d-flex row">
                       {!isLoaderLogo && <img className="logo-center" src={logo ? logo : defaultLogo} />}
                        <br />
                        {!isLoaderTheme && <div className="ui segment">
                            <h2>Login</h2>
                            {/* {showGuestUserMessage & !showGuestUserErrorMessage && <h4>{label.login.emulateLoad}</h4>} */}
                            {showGuestUserErrorMessage && <h4> {label.login.emulateError} </h4>}
                            {!showGuestUserMessage && <div className="">
                                <div className="required inline field">
                                    <label>{label.login.userName}</label>
                                    <div className="ui left icon input">
                                        <i className="user icon ms-2 my-0"></i>
                                        <input type="text" placeholder="username" name="userName" value={loginData.userName} onChange={e => { inputChange(e) }} />
                                    </div>
                                    <span className="invalid-feedback">
                                        <span className="error-msg">
                                            {formErrors.userName && formErrors.userName}
                                        </span>
                                    </span>
                                </div>
                                <div className="required inline field">
                                    <label>{label.login.password}</label>
                                    <div className="ui left icon input">
                                        <i className="lock icon ms-2"></i>
                                        <input type={showPassword ? 'text' : 'password'} placeholder="password" name="password" value={loginData.password} onChange={e => { inputChange(e) }} />
                                        <a className="ui icon view-pw">
                                            <i onClick={e => { e.preventDefault(); showPassword ? setShowPassword(false) : setShowPassword(true) }} className={showPassword ? 'eye icon text-decoration-none' : 'low vision icon text-decoration-none'}></i>
                                        </a>
                                    </div >
                                    <span className="error-msg">
                                        {formErrors.password && formErrors.password}
                                    </span>
                                </div >
                                <div className='row-fluid  d-flex align-items-center justify-content-left'>
                                    <button type="submit" onClick={e => { login(e) }} className="btn btn-primary mt-3 col-auto">
                                        {label.login.submit}
                                    </button>
                                    <Link to="/forgot-password" className="mx-3 col-auto mt-3">{label.login.forgotPassword} </Link>
                                </div >
                            </div >}
                        </div >}
                        <div style={{ textAlign: 'center', marginTop: '15%' }}>
                            <span><a href="https://hellopatients.com/privacy-policy/"
                                target="_blank">{label.login.privacyPolicy}</a></span>
                        </div>
                    </div >}
                </Transition.Group>
            </div >
            {/* } */}
        </div>
    )
}

export default Login