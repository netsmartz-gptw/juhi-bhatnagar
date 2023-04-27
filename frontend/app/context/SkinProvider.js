import React, { createContext, useReducer } from 'react'

const initialState = {
        logo: undefined,
        skin: 7,
        providerName: ''
}
//this instance holds 2 components
// 1 - Provider -  component that is the parent to all needing access to context
// 2 - Consumer - your componenets
export const skin = createContext(initialState)

const { Provider } = skin

const SkinProvider = (props) => {
    const { children } = props

    // Example of sign in/sign out functionality
    const [state, dispatch] = useReducer((state, action) => {
        if (action.type === "set-skin") {
            return {
                    logo: action.payload.logo,
                    skin: action.payload.skin,
                    providerName: action.payload.providerName
            }
        }
    }, initialState)

    return (
        <Provider value={{ state, dispatch }}>
            {children}
        </Provider>
    )
}

export default SkinProvider