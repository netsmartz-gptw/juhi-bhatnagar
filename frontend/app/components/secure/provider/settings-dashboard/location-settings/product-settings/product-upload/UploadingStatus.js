import React, { useEffect, useState } from 'react'
import { Accordion, Progress } from 'semantic-ui-react'
import ProductUploadsService from '../../../../../../../services/api/product-uploads.service'
import TabsTemplate from '../../../../../../templates/components/TabsTemplate'

const UploadingStatus = (props) => {
    const [status, setStatus] = useState()
    const [complete, setComplete] = useState(false)
    const [showFail, setShowFail] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const getStatus = () => {
        ProductUploadsService.getUploadLog(props.id)
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
        if(props.id){
        setTimeout(() => {
            if (status?.fileStatus == 1) {
                getStatus()
            }
        }, 15000)
    }
    }, [props.id, status])
    useEffect(() => {
        if(props.id){

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
                        <table className="table table-borderless"  style={{maxHeight: '60vh'}}>
                            <thead>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Tax Percent</th>
                                <th>Description</th>
                            </thead>
                            {status.itemUploadLogDetail.filter(obj => obj.recordStatus == 0).map(items => {
                                let item = JSON.parse(items.record)
                                return (<tr>
                                    <td>{item?.Name}</td>
                                    <td>{item?.Quantity}</td>
                                    <td>{item['UnitPrice']}</td>
                                    <td>{item['Tax Percent']}</td>
                                    <td>{item?.Description}</td>
                                </tr>)
                            })}
                        </table>
                    </div>

                    <div title={`Failed: ${status.failedCount}`} className="scroll-list" style={{height: '150px'}}>
                        <table className="table table-borderless">
                            <thead>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Tax Percent</th>
                                <th>Description</th>
                            </thead>
                            {status.itemUploadLogDetail.filter(obj => obj.recordStatus == 1).map(items => {
                                let item = JSON.parse(items.record)
                                return (<tr>
                                    <td>{item?.Name}</td>
                                    <td>{item?.Quantity}</td>
                                    <td>{item['UnitPrice']}</td>
                                    <td>{item['Tax Percent']}</td>
                                    <td>{item?.Description}</td>
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