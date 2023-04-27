import React, { useEffect, useState } from 'react'
import ProductUploadsService from '../../../../../../../services/api/product-uploads.service'

const ViewResultsUpload = (props) => {
    const [results, setResults] = useState()
    const getStatus = () => {
        ProductUploadsService.getUploadLog(props.id)
            .then(res => {
                if (res?.data) {
                    console.log(res.data)
                    setResults(res.data)
                }
            })
    }
    useEffect(() => {
        if (props.id) {
            getStatus()
        }
    }, [props.id])
    return (
        <div className='d-flex row'>
            {results?.totalCount}
            {results?.failedCount}
            {results?.successfulCount}
        </div>
    )
}

export default ViewResultsUpload