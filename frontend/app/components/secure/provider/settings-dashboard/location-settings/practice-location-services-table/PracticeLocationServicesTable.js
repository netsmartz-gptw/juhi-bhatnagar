import React, { useEffect, useState, useContext } from 'react'
import Table from '../../../../../templates/components/Table';
import { store } from '../../../../../../context/StateProvider';
import PracticeLocationSelector from '../../../../../templates/components/PracticeLocationSelector';
import PracticeLocationServiceTypesService from '../../../../../../services/api/practice-ocation-service-types.service';
import ModalBox from '../../../../../templates/components/ModalBox';
import ServicesAdd from '../../../services/services-add/ServicesAdd';
import label from '../../../../../../../assets/i18n/en.json'
import AddPracticeServiceType from '../../../practice-service-type/add-practice-service-type/AddPracticeServiceType';

const PracticeLocationServiceTable = (props) => {
    const [isLoader, setIsLoader] = useState(false)
    const [locationServiceTypesList, setLocationServiceTypesList] = useState([])
    const [list, setList] = useState()
    const [addServiceType, setAddServiceType] = useState(false)
    const globalStateAndDispatch = useContext(store)
    const state = globalStateAndDispatch.state


    const getPracticeLocations = () => {
        setIsLoader(true);
        PracticeLocationServiceTypesService.getPossibleServiceTypes()
            .then((allServiceTypes) => {
                allServiceTypes.forEach(obj => {
                    obj.isActive = false
                    obj.practiceLocationServiceTypeId = 0
                })

                PracticeLocationServiceTypesService.getPossibleServiceTypesByLocation(state.practiceLocationId)
                .then((selectedServices) => {
                    console.log(selectedServices);
                    // loop thru each selected and find it in the practice list
                    selectedServices.forEach(selectedService => {
                        allServiceTypes.forEach(obj => {
                            if (obj.practiceServiceTypeId === selectedService.practiceServiceTypeId)
                            {
                                obj.isActive = true
                                obj.practiceLocationServiceTypeId = selectedService.practiceLocationServiceTypeId

                            }
                        })
                    })
    
                    setLocationServiceTypesList(selectedServices);
                    setList(allServiceTypes);
                    setIsLoader(false);

                })
                .catch(error => {
                    setIsLoader(false);
                    console.log(error)
                })
    

            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }


    useEffect(() => {
        if (state?.practiceLocationId) {
            getPracticeLocations()
        }
    }, [state?.practiceLocationId])


    const handleIsSelected = (e, i, id, wasSelected, practiceLocationServiceTypeId) => {
        if (!wasSelected) {
            selectLocationType(id)
        } else {
            unselectLocationType(practiceLocationServiceTypeId)
        }
    };


    const selectLocationType = (id) => {
        if (state.practiceLocationId) {
            setIsLoader(true);
            PracticeLocationServiceTypesService.selectLocationType({ practiceLocationId: state.practiceLocationId, practiceServiceTypeId: id })
                .then((response) => {
                    getPracticeLocations()
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
                getPracticeLocations()
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
            })
    }

    const columns = [
        {
            key: "practiceServiceType",
            text: "Practice Service Type",
            // className: "name",
            align: "left",
            sortable: true
        },
        {
            key: "appointmentFillColor",
            text: "Legend Color",
            // className: "name",
            align: "center",
            sortable: true,
            cell: (serviceType) => { return <div className='w-100 d-flex justify-content-center'><div style={{ width: '10px', height: '10px', backgroundColor: serviceType.appointmentFillColor }}></div></div> }
        },
        {
            key: "isActive",
            text: "Active",
            // className: "name",
            align: "center",
            sortable: true,
            cell: (serviceType, i) => { return <div className='w-100 d-flex justify-content-center'><input type="checkbox" checked={serviceType.isActive} onChange={e => { handleIsSelected(e, i, serviceType.practiceServiceTypeId, serviceType.isActive, serviceType.practiceLocationServiceTypeId) }} /></div> }
        },
    ]
    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "Practice Location Service Types",
        button: {
            excel: true,
            print: true,
            csv: true,
            extra: true
        },
        language: {
            loading_text: "Please be patient while data loads..."
        }
    }
    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.processing}</div>
                </div>
            </div>}

            {list ?
                <Table config={config} columns={columns} records={list} extraButtons={
                    [
                        { className: 'btn btn-transparent m-0 p-0', children: <div style={{ width: '250px' }}><PracticeLocationSelector /></div> },
                        {className: 'btn btn-primary', children:<i className='icon plus'/>, title:'Add Service Type', onClick: ()=>{setAddServiceType(true)}}
                        ]
                        } /> : null}

            <ModalBox open={addServiceType} onClose={() => { setAddServiceType(false) }}>
                <AddPracticeServiceType onClose={() =>  {getPracticeLocations(); return setAddServiceType(false) }} />
            </ModalBox>
        </div >
    )
}

export default PracticeLocationServiceTable