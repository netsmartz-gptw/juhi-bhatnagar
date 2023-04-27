import React, { useState, useEffect } from 'react'

import PatientService from '../../../../../../../services/api/patient.service'
import List from '../../../../../../templates/components/List'
import label from '../../../../../../../../assets/i18n/en.json'
import moment from 'moment'
import ModalBox from '../../../../../../templates/components/ModalBox'
import Module from '../../../../../../templates/components/Module'


const PatientContactDetails = (props) => {
    const [contactDetails, setContactDetails] = useState()
    const [showEdit, setShowEdit] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [editContactDetails, setEditContactDetails] = useState()
    const [showContactDetails, setShowContactDetails] = useState(false)

    useEffect(() => {
        if (props.autoPull) {
            pullContactDetails()
        }
        else if (props.pull) {
            pullContactDetails()
        }
    }, [props.autoPull, props.pull, props.keyword])

    const pullContactDetails = () => {
        return PatientService.getPatientById(props.patientId)
            .then(res => {
                console.log(res)
                setContactDetails(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            {contactDetails && contactDetails?.address && contactDetails.address.addressLine1 ? 

           
            <div className="row g-5 d-flex" 
            >
                <div className="col-6">
                    <Module side="left" title="Address Info">
                    <i class></i>
                    {contactDetails.address.addressLine1 && <span style={{display:'block'}}>{contactDetails.address.addressLine1}</span>}
                    {contactDetails.address.addressLine2 && <span style={{display:'block'}}>{contactDetails.address.addressLine2}</span>}
                    {contactDetails.address.city && <span>{contactDetails.address.city}, </span>}
                    {contactDetails.address.state && <span>{contactDetails.address.state}, </span>}
                    {contactDetails.address.zipCode || contactDetails.address.postalCode && <span>{contactDetails.address.zipCode || contactDetails.address.postalCode}</span>}
                    </Module>
                </div>

                {contactDetails.ssn ? <div className="col-6">
                    <Module className="col-6" side="right" title="Other Info">
                    <strong>Social Security Number</strong>
                    {contactDetails.ssn && <span style={{display:'block'}}>{contactDetails.ssn}</span>}
                    <br />

                    <strong>Respopnsible Party</strong><br />
                    {contactDetails.firstName && <span >{contactDetails.firstName} </span>}
                    {contactDetails.lastName && <span >{contactDetails.lastName} </span>}
                    </Module>
                </div> 
                
                : 
                
                <div className="col-6">
                    <Module className="col-6" side="right" title="Other Info">
                    <strong>Respopnsible Party</strong><br />
                    {contactDetails.firstName && <span >{contactDetails.firstName} </span>}
                    {contactDetails.lastName && <span >{contactDetails.lastName} </span>}
                    </Module>
                </div>}
                
                

           
            </div> : null}
            
                   
         
         {!contactDetails?.address || !contactDetails.address.addressLine1 ?
           <List><div>The is currently no additional contact information</div> </List> : null}
                
          
            
    

        </div>
    )
    
}

export default PatientContactDetails
