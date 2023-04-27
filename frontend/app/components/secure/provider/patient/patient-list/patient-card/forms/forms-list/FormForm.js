import React, { useState, useEffect, useRef, Fragment } from 'react'
import label from '../../../../../../../../../assets/i18n/en.json'
import PLFormService from '../../../../../../../../services/api/plforms.service'
import { Form } from '@formio/react';
import moment from 'moment';
import Utilities from '../../../../../../../../services/commonservice/utilities';


const FormForm = (props) => {
    const { onClose } = props;
    const [isLoading, setIsLoading] = useState(false)
    const [formIO, setFormIO] = useState()
    const [oldSubmission, setSubmission] = useState()
    const [newSubmission, setNewSubmission] = useState()
    const [options, setOptions] = useState({ readOnly: true })

    useEffect(() => {

        if (!newSubmission) { return; }

        let formId = "";
        if (props?.form?.formId) {
            formId = props?.form?.formId;
        }
        else if (props.formId)
            formId = props.formId
        else {
            formId = props.form.id;
        }

        let submissionPayload = {
            "formId": formId,
            "patientId": props.patientId,
            "submission": newSubmission,
        }


        if (oldSubmission && oldSubmission?.submission) {
            let submissionId = oldSubmission.id
            PLFormService.updateSubmission(submissionPayload, submissionId)
        }
        else {
            PLFormService.addSubmission(submissionPayload)
        }

        onClose()


    }, [newSubmission])


    useEffect(() => {

        if (!props.readOnly) {
            setOptions({ readOnly: false })
        }

        setIsLoading(true);
        let formId = "";
        if (props?.form?.formId) {
            formId = props?.form?.formId;
        }
        else if (props.formId)
            formId = props.formId
        else {
            formId = props.form.id;
        }

        PLFormService.getForm(formId)
            .then((response) => {
                console.log(response)
                if (props.readOnly) {
                    let i = 0;
                    while (i < response.fields.components.length) {
                        if (response.fields.components[i].key === "submit") {
                            response.fields.components.splice(i, 1);
                        } else {
                            ++i;
                        }
                    }
                }

                let newForm = {
                    type: 'form',
                    display: 'form',
                    components: response.fields.components
                }
                setFormIO(newForm)

                PLFormService.getSubmission({ PatientId: props.patientId, FormId: formId })
                    .then((response) => {
                        setSubmission(response.data.data[0])
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.log(error)
                        setIsLoading(false);
                    })

            })
            .catch(error => {
                console.log(error)
                setIsLoading(false);
            })

    }, [])

    const onSubmit = (newSubmission) => {
        setNewSubmission(newSubmission)
    }


    console.log(props.patient)
    return (
        <div>
            {isLoading && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.processing}</div>
                </div>
            </div>}
            <form className=''>
                <div className="ui content">
                    <div className='col-12'>
                        <div className='card p-3 d-flex row'>
                            <div className='col-12 mb-3'>
                                <h5 className='col-12'>
                                    <strong>{props.patient.firstName} {props.patient.lastName}</strong> | {props.formTitle}
                                </h5>
                            </div>
                            <div className='col-12 d-flex row mb-2'>
                                <div className='col-md-6 col-12'><span className='w-150px'><strong>DOB</strong></span>{moment(props.patient.dob).format("D MMMM YYYY")}</div>
                                <div className='col-md-6 col-12'><span className='w-150px'><strong>Email</strong></span>{props.patient.email}</div>
                            </div>
                            <div className='col-12 d-flex row'>
                                <div className='col-md-6 col-12'><span className='w-150px'><strong>Phone</strong></span>{Utilities.toPhoneNumber(props.patient.mobile)}</div>
                                <div className='col-md-6 col-12'><span className='w-150px'><strong>Creation Date</strong></span>{moment(props.patient.createdOn).format("MM-DD-YYY")}</div>
                            </div>
                        </div>
                    </div>
                    <div className='card p-3 d-flex row mt-3'>
                        <div className="col-12">
                            <Form
                                form={formIO}
                                options={options}
                                submission={oldSubmission?.submission}
                                onSubmit={onSubmit}
                            />
                        </div>
                    </div>
                </div>
            </form >
            {
                props.readOnly &&
                <div className='row d-flex justify-content-between'>
                    <div className='col-auto'>
                        <button className="btn btn-secondary ms-2 float-right" onClick={(e) => { e.preventDefault(); onClose() }}> Close </button>
                    </div>
                </div>
            }
        </div >
    )
}

export default FormForm
