import './App.scss';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import StorageService from './app/services/session/storage.service';
import $ from 'jquery'
import toast, { ToastBar, Toaster, ToastIcon } from 'react-hot-toast'
import { store } from './app/context/StateProvider';
import TokenInterceptor from './app/services/api/token-interceptor';
import StateProvider from './app/context/StateProvider';
import Login from './app/components/public/login/Login';
import AppFrame from './app/components/layouts/AppFrame';
import CommonService from './app/services/api/common.service';
import FourOhFour from './app/components/public/FourOhFour';
import LoginService from './app/services/api/login.service';
import TermsAndConditions from './app/components/public/terms-and-conditions/TermsAndConditions';
import ResetPassword from './app/components/public/password/ResetPassword';
import ChangePassword from './app/components/public/password/ChangePassword';
import ThemeService from './app/services/api/theme.service';
import PatientLogin from './app/components/public/login/patient-login/PatientLogin';
import EmailSMSTemplates from './app/components/templates/EmailSMSTemplates';
// This provides us with context


function App() {

  const navigate = useNavigate()
  // TokenInterceptor()
  $("img").mousedown(function (e) {
    e.preventDefault()
  });
  $("img").on("contextmenu", function (e) {
    e.preventDefault()
    return false;
  });

  useEffect(() => {
    TokenInterceptor()
    setInterval(() => {
      let tempToken = CommonService.getLoggedInData()
      CommonService.getRefreshToken(tempToken)
        .then(res => {
          StorageService.save('session', "auth", JSON.stringify(res));
          // toast.success("Token Refreshed | Dev Environment")
        })
    },
      300000)

    return () => {
      let tempToken = CommonService.getLoggedInData()
      CommonService.getRefreshToken(tempToken)
        .then(res => {
          StorageService.save('session', "auth", JSON.stringify(res));
          // toast.success("Token Refreshed | Dev Environment")
        })
    }
  }, [])

  return (
    <StateProvider>
      <Toaster position="bottom center"
        toastOptions={{
          success: {
            className: "toaster-success"
          },
          error: {
            className: "btn btn-light",
          }
        }} />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="login/:providerName" element={<Login />} />
        <Route path="patientlogin" element={<PatientLogin />} />
        <Route path="patientlogin/:providerName" element={<PatientLogin />} />
        <Route path="terms-conditions" element={<TermsAndConditions />} />
        <Route path="terms-conditions/:userId" element={<TermsAndConditions />} />
        <Route path="change-password/:parentId/:userType/:userId/:isReset/:providerName" element={<ChangePassword />} />
        <Route path="forgot-password" element={<ResetPassword />} />
        <Route path="templates" element={<EmailSMSTemplates />} />
        <Route path="*" element={<AppFrame />} />
        <Route path="/" element={<Navigate to='login' />} />
        <Route path="/404" element={<FourOhFour />} />
      </Routes>
    </StateProvider>
  );
}



export default App;
