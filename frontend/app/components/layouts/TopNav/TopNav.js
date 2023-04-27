import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import defaultLogo from "../../../../assets/images/logo_login.png";
// import defaultLogo from "../../../../assets/images/revitalized-logo.png";
import ProviderMenu from "../../../menus/ProviderMenu";
import LoginService from "../../../services/api/login.service";
import StorageService from "../../../services/session/storage.service";
import { store } from "../../../context/StateProvider";
import { skin } from "../../../context/SkinProvider";
import AppointmentService from "../../../services/api/appointment.service";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import context from "react-bootstrap/esm/AccordionContext";

import IdleTimer from "react-idle-timer";
import LogoutModal from "../../templates/components/LogoutModal";
import ModalBox from "../../templates/components/ModalBox";
import PatientMenu from "../../../menus/PatientMenu.js";
import AdminMenu from "../../../menus/AdminMenu";
import CommonService from "../../../services/api/common.service";
import SettingsService from "../../../services/api/settings.service";
import ThemeService from "../../../services/api/theme.service";
import toast from "react-hot-toast";

const TopNav = (props) => {
  const [viewSub, setViewSub] = useState(false);
  const [subData, setSubData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const globalStateAndDispatch = useContext(store);
  const contextState = globalStateAndDispatch.state;
  const contextDispatch = globalStateAndDispatch.dispatch;
  const [logo, setLogo] = useState(defaultLogo);
  const [menu, setMenu] = useState()

  const [expanded, setExpanded] = useState(false);

  // Initial data formulas
  const practiceLocationLookup = () => {
    let data = JSON.parse(StorageService.get('session', 'userDetails'))
    if (data.userType === 1) {
      AppointmentService.practiceLocationLookup()
        .then((res) => {
          console.log(res)
          contextDispatch({ type: "setLocationIds", payload: res });
          contextDispatch({
            type: "setPracticeLocationId",
            payload: res[0].practiceLocationId,
          });
          StorageService.save("session", "locale", JSON.stringify(res))
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const getLogo = () => {
    let settings = JSON.parse(StorageService.get('session', 'settingsData'));
    if (settings?.logo) {
      setLogo(settings.logo)
    }
  }
  // useEffect(() => {
  //   let location = window.location.pathname;
  //   let paths = location.split("/").filter((path) => path !== "");
  //   let pathIndex = ProviderMenu.findIndex((menu) => menu.path === paths[1]);
  //   setCurrentIndex(pathIndex);
  //   if (pathIndex > 0) {
  //     let subDataTemp = ProviderMenu[pathIndex].children;
  //     if (subDataTemp && subDataTemp.length >= 1) {
  //       setViewSub(true);
  //       setSubData(subDataTemp);
  //     } else {
  //       setViewSub(false);
  //       setSubData();
  //     }
  //   } else {
  //     setViewSub(false);
  //     setSubData();
  //   }
  // }, [window.location.pathname]);

  const logout = () => {
    toast.success("Logout")
    let res = LoginService.logOut("")
    contextDispatch({ type: 'reset' })
    if (res !== false) {
      navigate(`/login/${res}`);
    }
    else {
      navigate("/login");
    }

  };

  const logoutEmulate = () => {
    StorageService.remove('session', 'guestUser');
    contextDispatch({ type: 'reset' })
    LoginService.logOut("")
    return navigate("/");

  };

  useEffect(() => {
    if (StorageService.get("session", "locale")) {
      contextDispatch({ type: "setLocationIds", payload: JSON.parse(StorageService.get("session", "locale")) });
    }
    else {
      practiceLocationLookup();
    }
    getLogo()
  }, []);

  useEffect(() => {
    if (window.location.pathname != '/provider/settings/practice') {
      let check = JSON.parse(StorageService.get('session', 'settingsData'))
      if (check) {
        getLogo()
        if (check.skin) {
          ThemeService.changeTheme(check.skin)
        }
      }
    }
  }, [JSON.parse(StorageService.get('session', 'settingsData'))])
  useEffect(() => {
    let data = JSON.parse(StorageService.get('session', 'userDetails'))
    // let data = CommonService.getLoggedInData()
    console.log(data)
    setUserType(data.userType)
    switch (data.userType) {
      case 0:
        setMenu(PatientMenu)
        break
      case 1:
        setMenu(ProviderMenu)
        break
      case 2:
        setMenu(AdminMenu)
        break
      default:
        setMenu(ProviderMenu)
        break
    }
  }, [])

  const [showModal, setShowModal] = useState(false);
  const [idleTimer, setIdleTimer] = useState();
  const [logoutTimer, setLogoutTimer] = useState();
  const [userType, setUserType] = useState(1)
  const [seconds, setSeconds] = useState(600); // 10 min total 2 min warning in nav bar to auto log out in 


  useEffect(() => {
    const timer = setTimeout(() => {
      setSeconds(seconds - 1);
    }, 1000);
    // clearing interval
    // return () => clearInterval(timer);
  });

  // const newTime = () => {
  //   let timeOut = new Date(seconds)
  //   setSeconds(timeOut)
  // }

  // const millisToMinutesAndSeconds = ({seconds
  // }) => {
  //   var minutes = Math.floor(seconds / 60000);
  //   var seconds = (({seconds} % 60000) / 1000).toFixed(0);
  //   return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  // }

  const handleAutoLogout = () => {
    // e.preventDefault();
    let user = CommonService.getLoggedInData()
    let res = LoginService.logOut(true);
    if (user?.userType === 0) {
      if (res) {
        navigate(`../patientlogin/${res}`)
      }
      else {
        navigate("../patientlogin")
      }
    }
    else {
      if (res) {
        navigate(`../login/${res}`)
      }
      else {
        navigate("../login")
      }
    }
  };

  const onIdle = () => {
    togglePopUp();
    setLogoutTimer(
      setTimeout(() => {
        handleAutoLogout();
      }, 30000) // 30 seconds till auto log out
    );
    // millisToMinutesAndSeconds()

  };

  const togglePopUp = () => {
    setShowModal((prevState) => ({ showModal: !prevState.showModal }));
    // alert(`${newTime.getMinutes()}:${newTime.getSeconds()}`)
  };

  const handleStayLoggedIn = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      setLogoutTimer();
    }
    // clearInterval(timer);
    idleTimer.reset();
    togglePopUp();
  };
  // useEffect(() => {

  //     if (contextState.settingsData.hasOwnProperty('logo')) {
  //         setLogo(contextState.settingsData.logo)
  //     }
  // }, [contextState.settingsData])

  return (
    <div>
      <IdleTimer
        className="d-block"
        ref={(ref) => {
          setIdleTimer(ref);
        }}
        element={document}
        stopOnIdle={true}
        onIdle={onIdle}
        // timeout={3000}
      timeout={570000}
      // modalbax pops up at 9.5 min
      />
      <ModalBox
        open={showModal}
        togglePopup={togglePopUp}
        handleStayLoggedIn={handleStayLoggedIn}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <LogoutModal />
        <div className="col-auto mt-3" onMouseMove={() => { handleStayLoggedIn(); return setShowModal(false) }}>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              handleStayLoggedIn(e);
              setShowModal(false);
            }}
          >
            Stay Logged In
          </button>
        </div>

      </ModalBox>
      <div>
        <div className="navbar-wrap">
          <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" fixed="top" expanded={expanded} onToggle={() => { setExpanded(!expanded) }}>
            <Container fluid className="bg-primary">
              <Navbar.Brand className="navbar-brand "><NavLink to={`./${userType === 1 ? 'provider' : userType === 2 ? 'admin' : 'patient'}/`}>
                <img className="nav-image" width="150px" src={
                  // contextState && contextState.skinData && contextState.skinData.logo ? contextState.skinData.logo : 
                  logo || defaultLogo} alt="" /></NavLink></Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="col-lg-12">
                  <div className="col-12 d-flex row justify-content-between align-items-center g-3">
                    {menu && menu.map((routes, i) => {
                      // if (routes.children) {
                      //     return (
                      //         <Nav.Item className="col nav-item text-center mx-auto">
                      //             <NavDropdown aria-labelledby={routes.title} title={

                      //                 <NavLink className="nav-link" style={{ display: 'inline-block', zIndex:"14" }} to={`provider/` + routes.path} id={routes.title}>
                      //                     {routes.icon ? <i className={`ui icon large ${routes.icon} mb-1`}></i> : <i className="ui icon circle large mb-1"></i>}
                      //                     {/* <br />
                      //                     {routes.title}
                      //                 </NavLink>

                      //             }>
                      //                 {routes.children.map(route => {
                      //                     return (
                      //                         <NavDropdown.Item className="dropdown-item">
                      //                             <NavLink className="nav-link text-primary text-decoration-none text-start" to={`provider/${route.path}`}>
                      //                                 {route.icon && <i className={`ui icon large text-primary ${route.icon}`} />}{route.title}
                      //                             </NavLink>
                      //                         </NavDropdown.Item>
                      //                     )
                      //                 })
                      //                 }
                      //             </NavDropdown>
                      //         </Nav.Item>
                      //     )
                      // }


                      {/* else { */ }
                      return (
                        <Nav.Item className="col-lg-auto col-4 nav-item text-center" key={i} onClick={() => { setExpanded(false) }}>
                          <NavLink className="nav-link menu-link" to={`${userType === 1 ? 'provider' : userType === 2 ? 'admin' : 'patient'}/` + routes.path}>
                            <div>
                              {routes.icon ? <i className={`ui icon large ${routes.icon} mb-1`}></i> : <i className="ui icon circle large mb-1"></i>}
                              <br />
                              <span className="d-inline-block">{routes.title}</span>
                            </div>
                          </NavLink>
                        </Nav.Item>)
                      {/* } */ }
                    })
                    }
                    <Nav.Item className="col-lg-auto col-4 nav-item text-center align-items-center">
                      <NavLink href="" className="nav-link menu-link btn-group" to={`${userType === 1 ? 'provider' : userType === 2 ? 'admin' : 'patient'}/notification`}>
                        <div> <i className="ui icons ms-2 mb-1">
                          <i className="icon large bell" />
                          <i className="icon p-0 pe-1 text-primary">3</i>
                        </i>
                          <br />
                          <span>Alerts</span>
                        </div>
                      </NavLink>
                    </Nav.Item>
                    {contextState?.isEmulate ?
                      <Nav.Item className="col-lg-auto col-4 nav-item text-center point">
                        <a className="nav-link menu-link" onClick={e => { e.preventDefault(); logoutEmulate(e) }}>
                          <div>
                            <i className="ui icon lock large mb-1"></i>
                            <br />
                            <span>
                              Leave Emulation
                            </span>
                          </div>
                        </a>
                      </Nav.Item>
                      : <Nav.Item className="col-lg-auto col-4 nav-item text-center point">
                        <a className="nav-link menu-link" onClick={e => { e.preventDefault(); logout() }}>
                          <div>
                            <i className="ui icon lock large mb-1"></i>
                            <br />
                            <span>
                              Logout
                            </span>
                          </div>
                        </a>
                      </Nav.Item>}
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </div>
    </div >
  );
};

export default TopNav;
