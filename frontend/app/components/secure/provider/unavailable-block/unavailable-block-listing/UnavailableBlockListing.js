import moment from 'moment';
import React, { useEffect, useState } from 'react'
import DoctorService from '../../../../../services/api/doctor.service';
import ProviderService from '../../../../../services/api/provider.service';
import List from "../../../../templates/components/List";

const UnavailableBlockCard = (props) => {
    const [providerList, setProviderList] = useState()

    useEffect(() => {
        const reqObj = { isRegistered: true, isActive: true };
        DoctorService.doctorLookup(reqObj)
            .then(
                (response) => {
                    console.log(response)
                    if(response){
                    setProviderList(response)
                    }
                })
            .catch((error) => {
                console.log(error);
            })
    }, [])
    const { onEdit, item } = props;
    // console.log(props.item)
    return <div className='row d-flex p-3'>
        <div className='col-12 row-fluid d-flex justify-content-between card p-3'>
            <div className='col row d-flex align-items-center'>
                <div className='col btn text-start' onClick={e => {
                    e.preventDefault();
                }}>
                    <h5 className='mt-2'><strong>{item.description || 'N/A'}</strong></h5>
                </div>
                <div className='col'>
                    <div className='row'>
                        {item?.startDate && item?.startTime && <div className='col'><strong>from: </strong>{moment(item.startDate).format("dddd, MMM, DD YYYY")} {item.startWholeDay !== 1 && `at ${moment(item.startDate)?.hours(item?.startTime?.slice(0, 2) || 0)?.minutes(item?.startTime?.slice(2, 2))?.format("h:mm a")}`} </div>}
                        {item?.endDate && item?.endTime && <div className='col'><strong>to: </strong>{moment(item.endDate).format("dddd, MMM, DD YYYY")} {item.endWholeDay !== 1 && `at ${moment(item.endDate)?.hours(item?.endTime?.slice(0, 2))?.minutes(item?.endTime?.slice(2, 2))?.format("h:mm a")}`}</div>}
                    </div>
                </div>
                <div className='col'>
                    {item.wholePractice ? 'Whole Practice' : providerList&&  providerList.find(obj => obj.id === item.doctorId)?.name}
                </div>
                <div className='col-auto'>
                    <div className='btn-group'>
                        <button className='btn btn-primary' title="Edit Patient" onClick={e => {
                            e.preventDefault();
                            onEdit(item);
                        }}><i className={`icon pencil`} /></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

const UnavailableBlockListing = () => {
    const [list,setList] = useState()

    const getUnavailableBlocks = () => {
        ProviderService.getUnavailableBlock({}).then(res => {
            console.log(res)
            // setList(res?.data?.selectResponse);
        }).catch(() => {
            toast.error('Oops! Something went wrong');
            if (typeof cb === 'function') {
                cb();
            }
        });
    }
    useEffect(() => {
        getUnavailableBlocks();
    }, []);
    return <List
        noPaginate
        className="ui segment mt-3 row d-flex scroll-list p-3 container-fluid"
        style={{ maxHeight: '60vh' }}
    >
        {list&&list.map((item) => {
            
            return (
                <UnavailableBlockCard item={item}/>
            )
        })}
    </List>
}

export default UnavailableBlockListing;