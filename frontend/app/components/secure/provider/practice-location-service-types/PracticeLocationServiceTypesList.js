import React, { useEffect, useState } from 'react'
import List from '../../../templates/components/List'
import PracticeLocationServiceTypesService from '../../../../services/api/practice-ocation-service-types.service'

const PracticeServiceTypesLocationList = (props) => {
    const { keyword } = props;
    // Temp var holders
    const [isLoader, setIsLoader] = useState(false)
    const [sortBy, setSortBy] = useState('')
    const [list, setList] = useState([])
    const [locationServiceTypesList, setLocationServiceTypesList] = useState([])

    const sortingItems = {
        date: [
            { 'label': 'Date: Sesc', 'columnName': 'createdOn', value: 'Desc' },
            { 'label': 'Date: Asc', 'columnName': 'createdOn', value: 'Asc' },
        ],
        order:
            [{ 'label': 'Name: A-Z', 'columnName': 'equipmentType', value: 'Desc' },
            { 'label': 'Name: Z-A', 'columnName': 'equipmentType', value: 'Asc' },]
    }


    const onSort = (e) => {
        setSortBy(e.target.value)
        console.log(e.target.value)
    }

    const editModal = () => {
        setOpenModal(true)
    }

    useEffect(() => {
        if (sortBy === 'Asc') {
            setLocationServiceTypesList(list.sort((a, b) => a.practiceServiceType.localeCompare(b.practiceServiceType)))
        }
        else if (sortBy === 'Desc') {
            setLocationServiceTypesList(list.sort((a, b) => b.practiceServiceType.localeCompare(a.practiceServiceType)))
        }
        else {
            setLocationServiceTypesList(list)
        }
    }, [sortBy])

    useEffect(() => {
        console.log(keyword);
        getPracticeLocationsByLocationId()
    }, [keyword])

    const getPracticeLocations = () => {
        setIsLoader(true);
        PracticeLocationServiceTypesService.getPossibleServiceTypes()
            .then((response) => {
                setList(response);
                setLocationServiceTypesList(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }

    const getPracticeLocationsByLocationId = () => {
        setIsLoader(true);
        PracticeLocationServiceTypesService.getPossibleServiceTypesByLocation(keyword)
            .then((response) => {
                // console.log(response);
                response.forEach(res => {
                    res.isSelected = false;
                });
                setList(response);
                setLocationServiceTypesList(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }

    useEffect(() => {
        getPracticeLocations()
    }, [])

    const handleIsSelected = (e, i, id) => {
        locationServiceTypesList[i].isSelected = e;
        setLocationServiceTypesList(locationServiceTypesList);
        if(e){
            selectLocationType(id)
        }else{
            unselectLocationType(id)
        }
    };

    
    const selectLocationType = (id) => {
        if(keyword){
            setIsLoader(true);
            PracticeLocationServiceTypesService.selectLocationType({practiceLocationId:keyword,practiceServiceTypeId:id})
                .then((response) => {
                    // console.log(response);
                    setIsLoader(false);
                })
                .catch(error => {
                    setIsLoader(false);
                    console.log(error)
                })
        }
    }

    const unselectLocationType = (id) => {
        setIsLoader(true);
        PracticeLocationServiceTypesService.unselectLocationType(id)
            .then((response) => {
                // console.log(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }

    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader"></div>
                </div>
            </div>}
            {!isLoader, locationServiceTypesList && <List
                listItemStyle='mb-2'
                sortFunc={onSort}
                sortList={sortingItems.order}
                isLoading={isLoader}
            >
                {locationServiceTypesList.length && locationServiceTypesList.map((practiceLocation, i) => {
                        return (
                            <div className="ui segment results">
    
                                <div className="d-flex row align-items-center justify-content-between">
                                    <div className='col-auto'>
                                    <input
                                        type="checkbox"
                                        className="form-check-input me-3"
                                        name="isSelected"
                                        checked={practiceLocation.isSelected}
                                        onChange={(e) => {
                                        handleIsSelected(e.target.checked, i, practiceLocation.practiceServiceTypeId);
                                        }}
                                    />
                                    </div>
                                    <div className='col'>
                                        <div className="ui sub header">{practiceLocation.practiceServiceType}
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>)
                    }
                    )}
            </List>}
        </div >
    )
}

export default PracticeServiceTypesLocationList