import React, { useEffect, useState } from 'react'
import { Accordion, Icon } from 'semantic-ui-react';
import AccessRightsService from '../../../../../../../services/api/access-rights.service';

const UserRolesForm = (props) => {
    const [inputData, setInputData] = useState(props.initialData)
    const [isLoader, setIsLoader] = useState(false)
    const [featureList, setFeatureList] = useState()
    const [activeIndex, setActiveIndex] = useState()
    // function for input change
    const inputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value;
        console.log(newStateObject);
        return setInputData(newStateObject);
    };

    const ModuleEnum = {
        1: 'Patient Management',
        2: 'Patient Checkout',
        3: 'Claims Management',
        4: "Transactions",
        5: "Payment Plans",
        6: "Settings",
        7: "Insurance Management",
        8: "User Management",
        9: "Provider Management",
        10: "Forms Management",
        11: "Training Videos",
        12: "SMS Notifications",
        13: "Email Notifications",
        14: "Appointment Management",
        15: "Reports",
        16: "Eligibility Management",
        17: "Role Management"
    }
    const pullFeatureList = () => {
        setIsLoader(true)
        let reqObj = {}
        if(props.practiceId){
            reqObj.practiceId = props.practiceId
        }
        AccessRightsService.getfeatureConfig(reqObj)
            .then(res => {
                setIsLoader(false)
                console.log(res)
                setFeatureList(res)
                return console.log(featureList)
            })
    }

    const grantAll = () => {

    }

    useEffect(() => {
        pullFeatureList()
    }, [])

    useEffect(() => {
        if (props.initialData) {
            setInputData(props.initialData)
        }
    }, [props.initialData])
    return (
        <div className='row d-flex'>
            <div className='col-12'>
                <div className='field required'>
                    <label>Name</label>
                    <input type="text" name="roleName" value={inputData.roleName} onChange={e => { e.preventDefault(); inputChange(e) }} />
                </div>
            </div>
            <div className='col-12'>
                <div className='field'>
                    <label>Description</label>
                    <textarea name="description" value={inputData.description} onChange={e => { e.preventDefault(); inputChange(e) }} />
                </div>
            </div>
            <div className='col-12 mt-3'>
                <Accordion fluid styled>
                    {featureList && AccessRightsService.parseModules(featureList).map((feature, idx) => {
                        if (feature.data.length > 0)
                            return (<>
                                <Accordion.Title
                                    active={activeIndex === idx}
                                    index={idx}
                                    onClick={e => { e.preventDefault(); if (activeIndex === idx) { setActiveIndex() } else { setActiveIndex(idx) } }}
                                > <Icon name='dropdown' />{ModuleEnum[feature.key]
                                    } ({feature.data.length})
                                    {/* <a className="float-right" href="#" onClick={e => { e.preventDefault(); grantAll(idx) }}>Grant All</a> */}
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === idx}>
                                    <table className='table table-borderless'>
                                        <thead>
                                            <th>Feature ID</th>
                                            <th>Feature Name</th>
                                            {/* <th>Email Access</th>
                                            <th>SMS Access</th>
                                            <th>Email Opt-In</th>
                                            <th>SMS Opt-In</th> */}
                                            <th>Active</th>
                                        </thead>
                                        <tbody>
                                            {feature.data.map(mod => {
                                                return (
                                                    <tr>
                                                        <td> {mod.featureId}</td>
                                                        <td> {mod.featureName}</td>
                                                        {/* <td className='form-switch form-check'><span className='w-100 d-flex justify-content-center'><input type="checkbox" role="switch" checked={inputData && inputData.featuresList.find(obj => obj.formId === mod.formId).hasEmail === 1 ? true : false} className='form-check-input' /></span></td>

                                                        <td className='form-switch form-check'><span className='w-100 d-flex justify-content-center'><input type="checkbox" role="switch" checked={inputData && inputData.featuresList.find(obj => obj.formId === mod.formId).hasSms === 1 ? true : false} className='form-check-input' /></span></td>

                                                        <td className='form-switch form-check'><span className='w-100 d-flex justify-content-center'><input type="checkbox" role="switch" checked={inputData && inputData.featuresList.find(obj => obj.formId === mod.formId).isEmailEnabled}  className='form-check-input' /></span></td>

                                                        <td className='form-switch form-check'><span className='w-100 d-flex justify-content-center'><input type="checkbox" role="switch" checked={inputData && inputData.featuresList.find(obj => obj.formId === mod.formId).isSmsEnabled}  className='form-check-input' /></span></td> */}

                                                        <td className='form-switch form-check'><span className='w-100 d-flex justify-content-center'><input type="checkbox" role="switch" checked={inputData && inputData.featuresList?.find(obj => obj.formId === mod.formId)}  className='form-check-input' /></span></td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </Accordion.Content>
                            </>)
                    })}
                </Accordion>
            </div>
            <div className='col-12 d-flex justify-content-between mt-3'>
                <div className='col-auto'>
                    <button className='btn btn-secondary' onClick={e => { e.preventDefault(); props.onClose() }}>Close</button>
                </div>
                <div className='col-auto'>
                    <button className='btn btn-primary' onClick={e => { e.preventDefault(); props.submitHandler(inputData) }}>{props.submitButton || "Save"}</button>
                </div>
            </div>
        </div>
    )
}
export default UserRolesForm