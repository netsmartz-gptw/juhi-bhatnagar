import React, { useEffect, useState, useContext } from 'react'
import { useRoutes } from 'react-router-dom'
import SecureRoutes from '../../routes/SecureRoutes/SecureRoutes'
import TopNav from './TopNav/TopNav'
import { store } from '../../context/StateProvider'
import StorageService from '../../services/session/storage.service'


const AppFrame = (props) => {
  let routes = useRoutes(SecureRoutes)
  const globalStateAndDispatch = useContext(store)
  const state = globalStateAndDispatch.state
  const dispatch = globalStateAndDispatch.dispatch

  useEffect(() => {
    let userDetails = JSON.parse(StorageService.get("session", "userDetails"))
    let providerSelected = JSON.parse(StorageService.get("session", "providerSelected"))
    let settingsData = JSON.parse(StorageService.get("session", "settingsData"))
    let locations = JSON.parse(StorageService.get("session", "locale"))
    let skinData = providerSelected && { logo: providerSelected.logo, skin: providerSelected.skin, providerName: providerSelected.providerUrlSuffix } || null
    if (skinData && settingsData && providerSelected && userDetails && locations) {
      return dispatch({
        type: 'setAll', payload:
        {
          skinData: skinData,
          settingsData: settingsData,
          providerSelected: userDetails,
          practiceLocations: locations,
          practiceLocationId: locations[0].practiceLocationId
        }
      })
    }
  }, []);

  return (
    <div>
      <TopNav />
      <div className="appframe">{routes}</div>
    </div>
  )
}

export default AppFrame