import React, { useEffect, useState } from 'react'
import { Accordion, Icon } from 'semantic-ui-react';
import AccessRightsService from '../../../../../../../services/api/access-rights.service';
import RoleService from '../../../../../../../services/api/role.service';

const ViewAccess = (props) => {
    const [featureList, setFeatureList] = useState()
    const [givenPermissions, setGivenPermissions] = useState()
    const [loader, setLoader] = useState(false)
    const [activeIndex, setActiveIndex] = useState()
    const pullFeatureList = () => {
        setLoader(true)
        let reqObj = {}
        AccessRightsService.getfeatureConfig(reqObj)
            .then(res => {
                setLoader(false)
                console.log(res)
                setFeatureList(AccessRightsService.parseModules(res))
                // return pullRolePermissions()
            })
    }

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
    const pullRolePermissions = () => {
        setLoader(true)
        RoleService.getById(props.id)
            .then(res => {
                console.log(res.data.featuresList)
                setGivenPermissions(res.data.featuresList)
                setLoader(false)
            })
            .catch(err => {
                console.log(err)
                setLoader(false)
            })
    }

    useEffect(() => {
        pullFeatureList()
    }, [])
    return (
        <div className='col-12 mt-3'>
            <Accordion fluid styled>
                {featureList && featureList.map((feature, idx) => {
                    if (feature.data.length > 0)
                        return (<>
                            <Accordion.Title
                                active={activeIndex === idx}
                                index={idx}
                                onClick={e => { e.preventDefault(); if (activeIndex === idx) { setActiveIndex() } else { setActiveIndex(idx) } }}
                            > <Icon name='dropdown' />{ModuleEnum[feature.key]
                                }</Accordion.Title>
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
                                                    {/* <td className='form-switch form-check'><span className='w-100 d-flex justify-content-center'><input type="checkbox" role="switch" checked={mod.hasEmail === 1 ? true : false} className='form-check-input' disabled /></span></td>

                                                    <td className='form-switch form-check'><span className='w-100 d-flex justify-content-center'><input type="checkbox" role="switch" checked={mod.hasSms === 1 ? true : false} className='form-check-input' disabled /></span></td>

                                                    <td className='form-switch form-check'><span className='w-100 d-flex justify-content-center'><input type="checkbox" role="switch" checked={mod.isEmailEnabled} className='form-check-input' disabled /></span></td>

                                                    <td className='form-switch form-check'><span className='w-100 d-flex justify-content-center'><input type="checkbox" role="switch" checked={mod.isSmsEnabled} className='form-check-input' disabled /></span></td> */}
                                                    <td className='form-switch form-check'><span className='w-100 d-flex justify-content-center'><input type="checkbox" role="switch" checked={mod.hasAccess === 1 ? true : false} className='form-check-input' disabled /></span></td>
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
    )
}
export default ViewAccess