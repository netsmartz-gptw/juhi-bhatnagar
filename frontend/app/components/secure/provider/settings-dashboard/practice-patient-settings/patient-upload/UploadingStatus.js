import React, { useEffect, useState } from 'react'
import { Progress } from 'semantic-ui-react'
import PatientUploadsService from '../../../../../../services/api/patient-uploads.service'
import TabsTemplate from '../../../../../templates/components/TabsTemplate'

const UploadingStatus = (props) => {
    const [status, setStatus] = useState()
    const [complete, setComplete] = useState(false)
    const [showFail, setShowFail] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const getStatus = () => {
        PatientUploadsService.getUploadLog(props.id)
            .then(res => {
                if (res?.data?.fileStatus) {
                    console.log(res.data)
                    setStatus(res.data)
                    if (res.data.fileStatus === (2 || 3)) {
                        setComplete(true)
                    }
                }
            })
    }
    const Status = { 1: 'Processing', 2: 'Processed', 3: 'Error' }
    useEffect(() => {
        if (props.id) {
            setTimeout(() => {
                if (status?.fileStatus == 1) {
                    getStatus()
                }
            }, 15000)
        }
    }, [props.id, status])
    useEffect(() => {
        if (props.id) {

        }
        getStatus()
    }, [props.id])
    return (
        <div>
            {status && <div className='d-flex row justify-content-center'>
                <div className='col-12'><Progress percent={complete ? 100 : status.successfulCount / status.totalCount * 100} error={status.failedCount === status.totalCount} warning={complete && status.failedCount > 0} indicating /></div>
                <div className='col-12 d-flex row justify-content-center align-items-center'>
                    <div className='col-auto'>
                        {complete ? <span><i className="icon check me-2" />Upload {Status[status.fileStatus]} | <small>Total Files: {status.totalCount} </small></span> : <span><i className='notched circle loading icon me-2' />Upload {Status[status.fileStatus]} | <small>Total Files: {status.totalCount} </small></span>}
                    </div>
                    <div className='col-12 d-flex justify-content-around row mt-3'>
                        {/* <div className='col-auto'><small>Total Files: {status.totalCount} </small></div> */}
                        {/* <div className='col-auto text-success'><small>Successful: {status.successfulCount} </small></div>
                        <div className='col-auto text-danger'><small>Failed: {status.failedCount}</small></div> */}
                    </div>
                </div>
                <TabsTemplate>
                    <div title={`Successful: ${status.successfulCount}`} className="scroll-list">
                        <table className="table table-borderless" style={{ maxHeight: '60vh' }}>
                            <thead>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>MRN</th>
                                <th>DOB</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Opt In for Text Message(Y/N)</th>
                                <th>Address Line 1</th>
                                <th>Address Line 2</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Country(USA/CANADA)</th>
                                <th>Postal Code</th>
                            </thead>
                            {status.patientBulkUploadDetail.filter(obj => obj.recordStatus == 0).map(patients => {
                                let patient = JSON.parse(patients.record)
                                return (<tr>
                                    <td>{patient['First Name']}</td>
                                    <td>{patient['Last Name']}</td>
                                    <td>{patient['MRN']}</td>
                                    <td>{patient['DOB(MM/DD/YYYY)']}</td>
                                    <td>{patient['Phone']}</td>
                                    <td>{patient['Email']}</td>
                                    <td>{patient['Opt In for Text Message(Y/N)']}</td>
                                    <td>{patient['Address Line 1']}</td>
                                    <td>{patient['Address Line 2']}</td>
                                    <td>{patient['City']}</td>
                                    <td>{patient['State']}</td>
                                    <td>{patient['Country(USA/CANADA)']}</td>
                                    <td>{patient['Postal Code']}</td>
                                </tr>)
                            })}
                        </table>
                    </div>

                    <div title={`Failed: ${status.failedCount}`} className="scroll-list" style={{ height: '150px' }}>
                        <table className="table table-borderless">
                            <thead>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>MRN</th>
                                <th>DOB</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Opt In for Text Message(Y/N)</th>
                                <th>Address Line 1</th>
                                <th>Address Line 2</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Country(USA/CANADA)</th>
                                <th>Postal Code</th>
                            </thead>
                            {status.patientBulkUploadDetail.filter(obj => obj.recordStatus == 1).map(patients => {
                                let patient = JSON.parse(patients.record)
                                return (<tr>
                                    <td>{patient['First Name']}</td>
                                    <td>{patient['Last Name']}</td>
                                    <td>{patient['MRN']}</td>
                                    <td>{patient['DOB(MM/DD/YYYY)']}</td>
                                    <td>{patient['Phone']}</td>
                                    <td>{patient['Email']}</td>
                                    <td>{patient['Opt In for Text Message(Y/N)']}</td>
                                    <td>{patient['Address Line 1']}</td>
                                    <td>{patient['Address Line 2']}</td>
                                    <td>{patient['City']}</td>
                                    <td>{patient['State']}</td>
                                    <td>{patient['Country(USA/CANADA)']}</td>
                                    <td>{patient['Postal Code']}</td>
                                </tr>)
                            })}
                        </table>
                    </div>
                </TabsTemplate>
            </div>}
        </div>
    )
}

export default UploadingStatus