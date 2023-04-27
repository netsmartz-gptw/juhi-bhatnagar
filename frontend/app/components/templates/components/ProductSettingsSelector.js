import React, { useEffect, useContext } from 'react'
import { store } from '../../../context/StateProvider'
import Select from 'react-select'

const ProductSettingsSelector = (props) => {
    // Context items 
    const stateAndDispatch = useContext(store)
    const state = stateAndDispatch.state
    const dispatch = stateAndDispatch.dispatch
    return (
        <Select
            style={props.style}
            className="react-select-container"
            classNamePrefix="react-select"
            options={state && state.practiceLocations}
            isLoading={state && !state.practiceLocations}
            loadingMessage="Locations are loading..."
            name="practiceLocationRoomId"
            value={state && state.practiceLocations && state.practiceLocations.find(obj => obj.practiceLocationId === state.practiceLocationId)}
            onChange={e => {
                dispatch({ type: 'setPracticeLocationId', payload: e.practiceLocationId })
            }}
            getOptionLabel={(option) => option.practiceLocation}
            getOptionValue={(option) => option.practiceLocationId}
        >
        </Select>
    )
}
export default ProductSettingsSelector