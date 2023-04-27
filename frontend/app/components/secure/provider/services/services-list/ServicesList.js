import React, { useEffect, useState } from 'react'
import label from '../../../../../../assets/i18n/en.json'
import ServicesService from '../../../../../services/api/services.service'
import List from '../../../../templates/components/List'
import { Dropdown } from 'semantic-ui-react'

const ServicesList = (props) => {
    const { keyword, refresh } = props
    const [isLoader, setIsLoader] = useState(false)
    const [sortBy, setSortBy] = useState('')

    const [servicesList, setServiceList] = useState([])
    const [serviceLookupList, setServiceLookupList] = useState([])

    const sortingItems = {
        date: [
            { 'label': 'Date: Sesc', 'columnName': 'createdOn', value: 'Desc' },
            { 'label': 'Date: Asc', 'columnName': 'createdOn', value: 'Asc' },
        ],
        order:
            [{ 'label': 'Name: A-Z', 'columnName': 'name', value: 'Desc' },
            { 'label': 'Name: Z-A', 'columnName': 'name', value: 'Asc' },]
    }

    const [noResultsMessage, setNoResultsMessage] = useState("Please select Service to begin search")
    const { embed, editService } = (props)

    const onSort = (e) => {
        setSortBy(e.target.value)
    }

    const changeStatus = (service) => {
        setIsLoader(true)
        let res = service.status == 1 ? ServicesService.deactivateService(service.id) : ServicesService.activateService(service.id);
        
        res.then(()=>{
            refresh()
            setIsLoader(false)
        }).catch(err => {
            setIsLoader(false)
        });
    }

    useEffect(() => {
        let arr;
        if (sortBy === 'Asc') {
            // arr = servicesList.sort((a, b) => a.name.localeCompare(b.name))
            setServiceLookupList(servicesList.sort((a, b) => a.name.localeCompare(b.name)))
        }
        else if (sortBy === 'Desc') {
            // arr = servicesList.sort((a, b) => b.name.localeCompare(a.name))
            setServiceLookupList(servicesList.sort((a, b) => b.name.localeCompare(a.name)))
        }
        else {
            // arr = servicesList
            setServiceLookupList(servicesList)
        }
        // console.log(arr)

    }, [sortBy])

    useEffect(() => {
        setIsLoader(true);
        ServicesService.serviceLookup({ItemType:props.itemType})
            .then((response) => {
                setServiceList(response.data);
                setServiceLookupList(response.data);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
                console.log(error)
                // setCheckException(error);
            })
    }, [])

    return (
        <div>
            {isLoader && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader"></div>
                </div>
            </div>}
            {!isLoader, serviceLookupList && <List
                listItemStyle='mb-2'
                sortFunc={onSort}
                sortList={sortingItems.order}
                // pageSize={3}
                isLoading={isLoader}
            >
                {serviceLookupList.length && serviceLookupList.filter((service) => {
                                    if (keyword === "" | null) {
                                        return service
                                    } else if (service.name.toLowerCase().includes(keyword.toLowerCase())) {
                                        return service
                                    }
                                }).map(src => {
                    return (
                        <div className="ui segment results" key={src.id}>
                            <div className="results-crsr">
                                <div className="ui right floated header">
                                    <div className='col-auto'>
                                        <div className='btn-group'>
                                            <Dropdown button direction="left" icon="ellipsis horizontal" className="btn-primary icon btn p-o">
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={e => { e.preventDefault(); editService(src) }}>Edit</Dropdown.Item>
                                                    <Dropdown.Item onClick={e => { e.preventDefault(); changeStatus(src) }}>{src.status == 0 ? 'Activate' : 'Deactivate'}</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ui horizontal list">
                                <div className="item">
                                    <div className="content">
                                        <div className="ui sub header">{src.name}
                                        </div>
                                        <div className="item">
                                            <strong> {label.services.find.creationDate}: </strong>{src.createdOn}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                }
                )}
            </List>}
        </div>
    )
}

export default ServicesList