import React, { useEffect, useContext, useState } from 'react'
import { store } from '../../../context/StateProvider'
import Select from 'react-select'
import AppointmentService from '../../../services/api/appointment.service'
import StorageService from '../../../services/session/storage.service'
import toast from 'react-hot-toast'

const PracticeLocationSelector = (props) => {
    // Context items
    const stateAndDispatch = useContext(store)
    const state = stateAndDispatch.state
    const dispatch = stateAndDispatch.dispatch
    const [locations, setLocations] = useState()
    const [locationId, setLocationId] = useState()

    const findLocations = () => {
        AppointmentService.practiceLocationLookup()
            .then((res) => {
                console.log(res)
                dispatch({ type: "setLocationIds", payload: res });
                setLocations(res)
                setLocationId(res[0].practiceLocationId)
                dispatch({
                    type: "setPracticeLocationId",
                    payload:
                        res[0].practiceLocationId
                    //  { practiceLocationId:res[0].practiceLocationId,
                    //   practiceLocation:res[0].practiceLocation}
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    useEffect(() => {
        if (!locations) {
            if (StorageService.get("session", "locale")) {
                let payload = JSON.parse(StorageService.get("session", "locale"))
                // dispatch({ type: "setLocationIds", payload: payload });
                setLocations(payload)
                setLocationId(payload[0].practiceLocationId)
                // dispatch({
                //     type: "setPracticeLocationId",
                //     payload: payload[0].practiceLocationId,
                // });
            }
            else {
                findLocations();
            }
        }
    }, [])
    return (
        <Select
            style={props.style}
            className="react-select-container"
            classNamePrefix="react-select"
            isDisabled={props.disabled}
            options={locations && locations}
            isLoading={!locations}
            loadingMessage="Locations are loading..."
            name="practiceLocationRoomId"
            value={locations && Array.isArray(locations) ? locations.find(obj => obj.practiceLocationId === locationId) : null}
            onChange={e => {
                console.log(e)
                dispatch({ type: 'setPracticeLocationId', payload: e.practiceLocationId })
                setLocationId(e.practiceLocationId)
            }}
            getOptionLabel={(option) => option.practiceLocation}
            getOptionValue={(option) => option.practiceLocationId}
        >
        </Select>
    )
}
export default PracticeLocationSelector