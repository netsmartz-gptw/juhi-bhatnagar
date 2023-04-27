import moment from 'moment'
import React, { useEffect, useState } from 'react'
import PatientUploadsService from '../../../../../../services/api/patient-uploads.service'
import Table from '../../../../../templates/components/Table'
import Template from '../../../../../../../assets/csv-templates/patient-template.csv'
import {saveAs} from 'file-saver'
import ProductUpload from './PatientUpload'
import ModalBox from '../../../../../templates/components/ModalBox'
import UploadingStatus from './UploadingStatus'
const PatientUploadTable = (props) => {
    const [uploadList, setUploadList] = useState()
    const [isLoader, setIsLoader] = useState(false)
    const [selectedUpload, setSelectedUpload] = useState()
    const [viewDetails, setViewDetails] = useState(false)
    const [currentId, setCurrentId] = useState()
    const [viewLoader, setViewLoader]= useState(false)
    const [viewResults, setViewResults] = useState(false)
    const[upload, setUpload] = useState(false)
    const Status = { 1: 'Processing', 2: 'Processed', 3: 'Error' }

    const pullList = () =>{
        setIsLoader(true)
        let reqObj = { SortField: 'CreatedOn', Asc: false, FileStatuses: null, StartRow: 0 }
        PatientUploadsService.getAllUploadLogs(reqObj)
            .then(res => {
                console.log(res.data.data)
                setUploadList(res.data.data)
                return setIsLoader(false)
            })
    }
    useEffect(() => {
        pullList()
    }, [])

    const columns = [
        {
            key: "createdOn",
            text: "Uploaded Date",
            align: "left",
            sortable: true,
            cell: (file) => { return moment.utc(file.createdOn).format("M/D/YYYY") }
        },
        {
            key: "filePath",
            text: "Name",
            align: "left",
            sortable: true,
            cell: (file) => { return PatientUploadsService.getFilenNameFromPath(file) }
        },
        {
            key: "description",
            text: "Description",
            align: "left",
            sortable: true,
        },
        {
            key: "fileType",
            text: "Type",
            align: "left",
            sortable: false,
            cell: (file) => { return PatientUploadsService.getFileTypeFromPath(file) }
        },
        {
            key: "successfulCount",
            text: "Uploaded",
            align: "left",
            sortable: true,
            cell: file => file.successfulCount || 0
        },
        {
            key: "failedCount",
            text: "Failed",
            align: "left",
            sortable: true,
            cell: file => file.failedCount || 0
        },
        {
            key: "totalCount",
            text: "Total",
            align: "center",
            sortable: true,
            cell: file => file.totalCount || 0
        },
        {
            key: "fileStatus",
            text: "Status",
            align: "left",
            sortable: true,
            cell: (file) => {
                switch (file.fileStatus) {
                    case 1:
                        return <span className='badge bg-warning text-white'>{Status[file.fileStatus]}</span>
                    case 2:
                        return <span className='badge bg-success text-white'>{Status[file.fileStatus]}</span>
                    case 3:
                        return <span className='badge bg-danger text-white'>{Status[file.fileStatus]}</span>
                    default:
                        break
                }
            }
        },
    ];

    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: "advance",
        filename: "Patient Upload",
        button: {
            // print: true,
            csv: true,
            extra: true,
        },
        language: {
            loading_text: "Please be patient while data loads...",
        },
    };
    return (
        <div className='d-flex row'>
            <Table records={uploadList} config={config} columns={columns} loading={isLoader}
                extraButtons={[
                    {
                        className: 'btn btn-primary',
                        children: <i className='icon download' />,
                        title: 'Download Template',
                        onClick: e=> {e.preventDefault();saveAs(Template,"Patient Upload Template - HelloPatients")}
                    },
                    {
                        className: 'btn btn-primary',
                        children: <i className='icon upload' />,
                        title: 'Bulk Upload Template',
                        onClick: e=>{e.preventDefault(); setUpload(true)}
                    }
                ]} />
                {currentId}
                <ModalBox open={upload} onClose={()=>{pullList();return setUpload(false)}} title="Upload Products">
                    <ProductUpload onClose={()=>{setViewLoader(true); return setUpload(false)}} setCurrentId={setCurrentId}/>
                </ModalBox>
                <ModalBox open={viewLoader} onClose={()=>{pullList(); return setViewLoader(false)}} title="Upload Progress" size="fullscreen">
                    {viewLoader && currentId ? <UploadingStatus id={viewLoader?currentId:null} onClose={()=>{setViewLoader(false)}}/>:null}
                </ModalBox>
        </div>
    )
}

export default PatientUploadTable