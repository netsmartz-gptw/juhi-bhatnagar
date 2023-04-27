import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ProductUploadsService from '../../../../../../../services/api/product-uploads.service'
import UploadDropZone from './UploadDropZone'

const ProductUpload = (props) => {
    const [file, setFile] = useState()
    const [description, setDescription] = useState()

    const handleChangeStatus = (e) => {
        setFile(e.file)
    }
    const handleSubmit = (e) => {
        ProductUploadsService.upload(file, description)
            .then(res => { 
                console.log(res.data.id);
                 props.setCurrentId(res.data.id); 
                setFile()
                return props.onClose()
             })
    }
    return (
        <div className='row d-flex'>
            <div className='col-12' onDragExit={e => { console.log(e) }}>
                <UploadDropZone handleChangeStatus={handleChangeStatus} acceptFileTypes=".csv" />
            </div>
            <div className='col-12'>
                <div className='field required'>
                    <label>Description</label>
                    <textarea value={description} onChange={e => { e.preventDefault(); setDescription(e.target.value) }} />
                </div>
            </div>
            <div className="d-flex justify-content-between mt-3">
                <div className='col-auto'>
                    <button className='btn btn-secondary' onClick={e => { e.preventDefault(); props.onClose() }}>Close</button>
                </div>
                <div className='col-auto'>
                    <button className='btn btn-primary' onClick={e => { e.preventDefault(); handleSubmit() }}>Upload</button>
                </div>
            </div>
        </div>
    )
}

export default ProductUpload