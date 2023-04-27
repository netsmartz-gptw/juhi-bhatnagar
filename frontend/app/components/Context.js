import React, { useState, useEffect, useContext } from 'react'
import { store } from '../context/StateProvider'
import Dashboard from './templates/layouts/Dashboard'

const Context = (props) => {
    const globalStateAndDispatch = useContext(store)
    const contextState = globalStateAndDispatch.state
    const contextDispatch = globalStateAndDispatch.dispatch
    console.log(contextState)
    return (
        <Dashboard title="Context Dashboard">
            <div className='States'>
                <ul>
                    <li> skinData: {JSON.stringify(contextState.skinData)}</li>
                    <li> settingsData: {JSON.stringify(contextState.settingsData)}</li>
                    <li> providerSelected: {JSON.stringify(contextState.providerSelected)}</li>
                    <li>practiceLocationId: {contextState.practiceLocationId}</li>
                    <li>practiceLocations: <ol>
                        {Array.isArray(contextState?.practiceLocations) && contextState?.practiceLocations?.map((loc, i) => { return <li>{loc.practiceLocationId} - {loc.practiceLocation}</li> })}
                    </ol>
                    </li>
                    <li>userData: {JSON.stringify(contextState.userData)}</li>
                </ul>
            </div>
        </Dashboard>
    )
}

export default Context