import moment from "moment";
import React, { useState, useEffect } from "react";
import ModalBox from "./components/ModalBox";
import Table from "./components/Table";
import EmailTemplates from './EmailTemplates.json'
import TextTemplates from './TextTemplates.json'
import defaultLogo from '../../../assets/images/logo_login.png'
import Utilities from "../../services/commonservice/utilities";
const EmailSMSTemplates = (props) => {
    const [communicationList, setCommunicationList] = useState()
    const [isLoader, setIsLoader] = useState(false)
    const [view, setView] = useState(false)
    const [viewData, setViewData] = useState()
    const print = () => {
        Utilities.printWindow("preview", "Notification Preview")
    }
    const columnsSMS = [
        {
            key: "TemplateName",
            text: "Template",
            align: "left",
            sortable: true,
        },
        {
            key: "Description",
            text: "Description",
            align: "left",
            sortable: true,
        },
        {
            key: "action",
            text: "Actions",
            align: "left",
            sortable: true,
            cell: (cell) => {
                // console.log(cell);
                return (<span className="w-100 d-flex justify-content-center">
                    <div className="col-auto btn-group">
                        <button title="View Notification" className="btn btn-primary" onClick={e => { e.preventDefault(); setViewData(cell); return setView(true) }}><i className="icon eye" /></button>
                    </div>
                </span>)
            }
        },
    ]

    const configSMS = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "SMS List",
        button: {
            // excel: true,
            // print: true,
            // csv: true,
            // extra: true
        },
        language: {
            loading_text: "Please be patient while data loads..."
        }
    }
    const columnsEmail = [
        {
            key: "TemplateName",
            text: "Template",
            align: "left",
            sortable: true,
        },
        {
            key: "Description",
            text: "Description",
            align: "left",
            sortable: true,
        },
        {
            key: "Subject",
            text: "Subject",
            align: "left",
            sortable: true,
        },
        {
            key: "userType",
            text: "User Type",
            align: "left",
            sortable: true,
            cell: (cell)=> cell.UserType === 0?'Patient':cell.UserType===1?'Practice':cell.UserType===2?'Global':null
        },
        {
            key: "action",
            text: "Actions",
            align: "left",
            sortable: true,
            cell: (cell) => {
                // console.log(cell);
                return (<span className="w-100 d-flex justify-content-center">
                    <div className="col-auto btn-group">
                        <button title="View Notification" className="btn btn-primary" onClick={e => { e.preventDefault(); setViewData(cell); return setView(true) }}><i className="icon eye" /></button>
                    </div>
                </span>)
            }
        },
    ]

    const configEmail = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: "Email List",
        button: {
            // excel: true,
            // print: true,
            // csv: true,
            // extra: true
        },
        language: {
            loading_text: "Please be patient while data loads..."
        }
    }

    return (
        <div className="d-flex row justify-content-center m-5 p-3">
            <div className="card p-3 col-12 mb-3">
                <h5 className="primary-header d-flex align-items-center">Text Templates</h5>
                <Table records={TextTemplates} columns={columnsSMS} config={configSMS} />
            </div>
            <div className="card p-3 col-12">
                <h5 className="primary-header d-flex align-items-center">Email Templates</h5>
                <Table records={EmailTemplates} columns={columnsEmail} config={configEmail} />
            </div>
            <ModalBox open={view} onClose={() => { setView(false) }} title={viewData?.Subject || viewData?.Description}>
                <div className="row d-flex justify-content-end mb-3">
                    <div className="col-auto">
                        <button onClick={e => { e.preventDefault(); print() }} className="btn btn-primary" text="Print Preview"><i className="icon print" /></button>
                    </div>
                </div>
                <div className="card p-3" id="preview">
                    {viewData?.Subject && <h5 className="primary-header d-flex align-items-center">Subject: {viewData?.Subject}</h5>}
                    <div dangerouslySetInnerHTML={{ __html: viewData?.Body?.replace("https://s3.us-east-2.amazonaws.com/hellopaymentui/assets/images/bottom_bar.png", "https://admindev.hellopatients.com/assets/images/bottom_bar.png")?.replace("https://s3.us-east-2.amazonaws.com/hellopaymentui/assets/images/logo_header.png", defaultLogo)?.replace("[[providerLogoUrl]]", defaultLogo)?.replace('[[ProviderLogoUrl]]',defaultLogo) || viewData?.SMS }} />
                </div>
            </ModalBox>
        </div>
    );
};

export default EmailSMSTemplates;
