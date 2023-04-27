import React, { useEffect, useContext, useState, useLayoutEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import defaultLogo from '../../../../../assets/images/logo_login.png'
import label from '../../../../../assets/i18n/en.json'
import LoginService from '../../../../services/api/login.service';
import StorageService from '../../../../services/session/storage.service';


import { store } from '../../../../context/StateProvider';
import LoginLoader from '../LoginLoader/LoginLoader';
import { Transition } from 'semantic-ui-react';
import ThemeService from '../../../../services/api/theme.service';
import SettingsService from '../../../../services/api/settings.service';
import toast from 'react-hot-toast';
import CommonService from '../../../../services/api/common.service';

const PatientLogin = (props) => {
    const [isLoaderTheme, setIsLoaderTheme] = useState(false)
    const [isLoaderLogo, setIsLoaderLogo] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [loginType, setLoginType] = useState()

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
                }
                else {
                    navigate("../patientlogin")
                }
            })
    }
    useLayoutEffect(() => {
        if (params.providerName !== "" && params.providerName && params.providerName !== "undefined") {
            let results = getSkin(params.providerName)
            inputChange({ target: { name: 'providerUrl', value: params.providerName } })
            SettingsService.getProviderSettingsSkin(params.providerName)
                .then(res => {
                    if (res?.data?.skin) {
                        console.log(res.data.skin)
                        ThemeService.changeTheme(res.data.skin)
                    }
                    else {
                        navigate('../patientlogin')
                    }
                })
            if (results?.logo) {
                setLogo(results?.logo)
            }
            else {
                getLogoCall()
            }
        }
        else {
            setLogo(defaultLogo);
            ThemeService.changeTheme(7)
        }
    }, [params])

    const getLogo = () => {
        let settings = JSON.parse(StorageService.get('session', 'settingsData'));
        if (settings?.logo) {
            setLogo(settings.logo)
        }
    }

    // formula for input change
    const inputChange = (e) => {
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

    const sendOTP = () => {
        LoginService.patientLoginOTP(loginData)
            .then(res => {
                console.log(res)
            })
    }
    const login = () => {
        const data = loginData
        data.providerUrl =
            params?.providerName !== undefined &&
                params?.providerName != null &&
                params?.providerName !== ""
                ? params?.providerName
                : "";
        const username = loginData?.userName
        delete data["RememberMe"];
        setIsLoggingIn(true); // display loader
        LoginService.patientLogin(data)
            .then(
                loginResponse => {
                    StorageService.setFirstLoginCount();
                    if (loginResponse["termsConditions"] === false) {
                        router.navigate([
                            "/terms-conditions",
                            loginResponse["parentId"],
                            loginResponse["id"],
                            loginMethod,
                            params?.providerName
                        ]);
                    } else if (loginResponse["changePassword"] === true) {
                        // change payal back

                        // if (loginResponse["roleId"] == null) {
                        //   loginResponse["roleId"] = 0;
                        // }
                        navigate(`/reset-password/${loginResponse["parentId"]}/${loginResponse["userType"]}/${loginResponse["id"]}/${params?.providerName}`);
                    } else {
                        StorageService.save(
                            'session',
                            "auth",
                            JSON.stringify(loginResponse)
                        );
                        LoginService
                            .getloginUserData(
                                loginResponse["userType"],
                                username,
                                loginResponse["parentId"]
                            )
                            .then(
                                (userDataResponse) => {
                                    console.log(userDataResponse)
                                    StorageService.save(
                                        'session',
                                        "userDetails",
                                        JSON.stringify(userDataResponse)
                                    );
                                    handleNavigation(loginResponse, userDataResponse);
                                })
                            .catch(error => {
                                setIsLoggingIn(false); // hide loade
                            }
                            );
                    }
                })
            .catch(
                error => {
                    setIsLoggingIn(false); // hide loader
                }
            );
    }

    const loginViaOTP = () => {
        toast.success("login via otp")
        // const data = loginData;
        // data.otp = data.authCode;
        // data.providerUrl =
        //     params?.providerName !== undefined &&
        //         params?.providerName != null &&
        //         params?.providerName !== ""
        //         ? params?.providerName
        //         : "";
        setIsLoggingIn(true); // display loader
        let reqObj = {
            RememberMe: null,
            authCode: loginData?.authCode,
            otp: loginData?.authCode,
            password: "",
            providerUrl: "",
            sendCatalog: true,
            userName: loginData?.userName,
        }
        LoginService.patientLoginViaOTP(reqObj)
            .then(
                response => {
                    let loginResponse = response.data
                    console.log(loginResponse)
                    StorageService.setFirstLoginCount();
                    if (loginResponse.termsConditions === false) {
                        navigate("/terms-conditions",);
                    } else {
                        StorageService.save(
                            'session',
                            "auth",
                            JSON.stringify(loginResponse)
                        );
                        LoginService
                            .getloginUserData(
                                loginResponse?.userType,
                                loginResponse?.id,
                                loginResponse?.parentId
                            )
                            .then(
                                (res) => {
                                    let userDataResponse = res.data
                                    console.log(userDataResponse)
                                    StorageService.save(
                                        'session',
                                        "userDetails",
                                        JSON.stringify(userDataResponse)
                                    );
                                    handleNavigation(loginResponse, userDataResponse);
                                })
                            .catch(error => {
                                setIsLoggingIn(false) // hide loader
                            }
                            );
                    }
                })
            .catch(error => {
                setIsLoggingIn(false) // hide loader
            }
            );
    }
    // const login = (loginType) => {
    //     if (loginType == 1) {
    //         let reqObj = {
    //             RememberMe: null,
    //             authCode: loginData?.authCode,
    //             otp: loginData?.authCode,
    //             password: "",
    //             providerUrl: "",
    //             sendCatalog: true,
    //             userName: loginData?.userName,
    //         }
    //         LoginService.patientLoginViaOTP(reqObj)
    //             .then(res => {
    //                 console.log(res.data)
    //                 loginHandler(res.data)
    //             })
    //     }
    //     else if (loginType == 2) {
    //         LoginService.patientLogin(loginData)
    //             .then(res => {
    //                 console.log(res)
    //                 loginHandler(res)
    //             })
    //     }
    // }

    // const loginHandler = (loginResponse) => {
    //     toast.success("Login handler")
    //     StorageService.setFirstLoginCount();
    //     if (loginResponse?.termsConditions=== false) {
    //         StorageService.save('session', 'auth', JSON.stringify(loginResponse));
    //         return navigate(`/terms-conditions/${loginResponse.id}`)
    //     } else if (loginResponse?.changePassword === true) {
    //         StorageService.save('session', 'auth', JSON.stringify(res));
    //         return navigate(`/change-password/${loginResponse.parentId}/${loginResponse.userType}/${loginResponse.id}/${loginResponse.changePassword}/${params.providerName !== "undefined" ? params.providerName : ''}`)
    //     } else {
    //         StorageService.save('session', 'auth', JSON.stringify(loginResponse));

    //         LoginService.getloginUserData(loginResponse?.userType, loginData?.userName, loginResponse?.parentId)
    //             .then((userDataResponse) => {
    //                 console.log(userDataResponse)
    //                 StorageService.save('session', 'userDetails', JSON.stringify(userDataResponse.data));
    //                 return handleNavigation(loginResponse, userDataResponse);
    //             })
    //             .catch(error => {
    //                 setIsLoggingIn(false);  // hide loader
    //             }
    //             )
    //     }
    // }

    const getSelectedProviderByFilter = (url) => {
        return ProviderList.filter(x => x.providerUrlSuffix === url);
      }
    const handleNavigation = (loginResponse, userDataResponse) => {
        toast.success("handle navigation")
        if (loginData["RememberMe"] === true) {
            StorageService.save(
                'local',
                "userAuth",
                JSON.stringify(loginData)
            );
        } else {
            StorageService.remove('local', "userAuth");
        }

        if (loginResponse["changePassword"] === true) {
            router.navigate(["/change-password"]);
        }

        // providerLookUp for patient
        CommonService.providerLookup()
            .then(
                (response) => {
                    console.log(response.data.data)
                    let providerList = response.data.data;
                    StorageService.save(
                        'session',
                        "providerList",
                        JSON.stringify(response.data.data)
                    );
                    if (
                        params?.providerName !== undefined &&
                        params?.providerName != null &&
                        params?.providerName !== ""
                    ) {
                        const providerSelected = getSelectedProviderByFilter(
                            params?.providerName
                        );
                        StorageService.save(
                            'session',
                            "providerSelected",
                            JSON.stringify(providerSelected[0])
                        )

                        navigate("/patient");
                    } else {
                        StorageService.save(
                            'session',
                            "providerSelected",
                            JSON.stringify(providerList[0])
                        );
                        navigate("/patient");
                    }
                })
            .catch(
                error => {
                    setIsLoggingIn(false); // hide loader
                }
            )
    }
    return (
        <div className="limiter">
            {isLoggingIn &&
                <LoginLoader logo={logo} />
            }
            {/* {!isLoggingIn &&  */}
            <div className="container-login100 img-bg">
                <Transition.Group animation="drop" duration={600}>
                    {show && <div className="wrap-login100 d-flex row">
                        <img className="logo-center" src={logo ? logo : defaultLogo} />
                        <br />
                        {!isLoaderTheme && <div className="ui segment">
                            <h2>Patient Login</h2>
                            {/* {showGuestUserMessage & !showGuestUserErrorMessage && <h4>{label.login.emulateLoad}</h4>} */}
                            {showGuestUserErrorMessage && <h4> {label.login.emulateError} </h4>}
                            {!showGuestUserMessage && <div className="">
                                <div className="required field  row px-3">
                                    <label>Phone Number or Email Address</label>
                                    <div className="ui left icon input">
                                        <i className="user icon ms-2 my-0"></i>
                                        <input type="text" placeholder="Phone Number or Email" name="userName" value={loginData.userName} onChange={e => { inputChange(e) }} />
                                    </div>
                                    <span className="invalid-feedback">
                                        <span className="error-msg">
                                            {formErrors.userName && formErrors.userName}
                                        </span>
                                    </span>
                                </div>
                                {loginType == 2 ? <div className="required inline field row px-3">
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
                                    : loginType == 1 ?
                                        <div className="required inline field row px-3">
                                            <label>Enter OTP</label>
                                            <div className="ui left icon input">
                                                <i className="lock icon ms-2"></i>
                                                <input type={showPassword ? 'text' : 'password'} placeholder="One Time Password" name="authCode" value={loginData.authCode} onChange={e => { inputChange(e) }} />
                                                <a className="ui icon view-pw">
                                                    <i onClick={e => { e.preventDefault(); showPassword ? setShowPassword(false) : setShowPassword(true) }} className={showPassword ? 'eye icon text-decoration-none' : 'low vision icon text-decoration-none'}></i>
                                                </a>
                                            </div >
                                            <span className="error-msg text-start mt-2">
                                                {!loginData?.authCode && 'Please enter the auth code that has been emailed and texted to you'}
                                                {formErrors.password && formErrors.password}
                                            </span>
                                        </div > : null}

                                {!loginType ? <div className='d-flex align-items-center justify-content-center row px-3'>
                                    <div class="ui small buttons center col-12 d-flex g-0 px-3 mt-3">
                                        <button type="button" class="col btn btn-primary" onClick={e => { e.preventDefault(); setLoginType(1); sendOTP() }}>Send Code</button>
                                        <div class="or"></div>
                                        <button class="col btn btn-primary" type="button" onClick={e => { e.preventDefault(); setLoginType(2); }}>Use Password</button></div>
                                </div > :
                                    <div className='d-flex row px-3 mt-3 justify-content-between align-items-center'>
                                        <div className='col-auto'><button onClick={e => { e.preventDefault(); setLoginType() }} className="btn btn-primary">Back</button>
                                            <button onClick={e => { e.preventDefault(); if (loginType === 1) { loginViaOTP() } else { login() } }} className="btn btn-primary ms-3">Login</button></div>
                                        {loginType == 2 && <div className="col-auto">
                                            <Link to="/forgot-password" className="mx-3 col-auto mt-3">{label.login.forgotPassword} </Link>
                                        </div>}
                                    </div>}
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

export default PatientLogin