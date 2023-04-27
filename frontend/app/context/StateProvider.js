import React, { createContext, useReducer, useEffect } from 'react'
import StorageService from '../services/session/storage.service'

const initialState = {
    skinData: {},
    settingsData: {},
    providerSelected: {},
    practiceLocationId: undefined,
    practiceLocations: [],
    isEmulate: false
}
//this instance holds 2 components
// 1 - Provider -  component that is the parent to all needing access to context
// 2 - Consumer - your componenets
export const store = createContext(initialState)

const { Provider } = store

const StateProvider = (props) => {
     
    const { children } = props

    // Example of sign in/sign out functionality
    const [state, dispatch] = useReducer((state, action) => {
        if (action.type === "sign-out") {
            return initialState
        }
        if (action.type === "setSkin") {
            let newState = { ...state }
            newState.skinData = action.payload
            return { ...newState }
        }
        if (action.type === "setProviderSelected") {
            let newState = { ...state }
            newState.providerSelected = action.payload
            return { ...newState }
        }
        if (action.type === "setSettingsData") {
            let newState = { ...state }
            newState.settingsData = action.payload
            return { ...newState }
        }
        if (action.type === "setLocationIds") {
            let newState = { ...state }
            newState.practiceLocations = action.payload
            // console.log(newState)
            return { ...newState }
        }
        if (action.type === "setPracticeLocationId") {
            let newState = { ...state }
            newState.practiceLocationId = action.payload
            // console.log(newState)
            return { ...newState }
        }
        if (action.type === "setEmulate") {
            let newState = { ...state }
            newState.isEmulate = action.payload
            return { ...newState }
        }
        if (action.type === "setAll") {
            let newState = action.payload
            return { ...newState }
        }
        if (action.type === "reset") {
            return { initialState}
        }
    }, initialState)

    return (
        <Provider value={{ state, dispatch }}>
            {children}
        </Provider>
    )
}

export default StateProvider