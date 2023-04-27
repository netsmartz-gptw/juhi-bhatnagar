import React, { useState, useEffect } from "react";
import { Dropdown, DropdownHeader } from "semantic-ui-react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PatientService from "../../../../../../../services/api/patient.service";
import EditPatient from "../../../edit-patient/EditPatient"
import List from "../../../../../../templates/components/List";
import label from '../../../../../../../../assets/i18n/en.json'
import moment from 'moment'
import ModalBox from '../../../../../../templates/components/ModalBox'
import Module from "../../../../../../templates/components/Module";
// import Module from '../../../../templates/components/Module'

const ContactDetails = (props) => {
  const [contactDetails, setContactDetails] = useState();
  const [editAddress, setEditAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);


  // useEffect(() => {
  //   if (props.autoPull) {
  //     pullContactDetails();
  //   } else if (props.pull) {
  //     pullContactDetails();
  //   }
  // }, [props.autoPull, props.pull, props.keyword]);

  const pullContactDetails = () => {
    return PatientService.getPatientById(props.patientId)
      .then((res) => {
        console.log(res);
        setContactDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeShowDetails = (id) => {
    if (id === showDetails) {
      setShowAddress()
    }
    else (
      setShowAddress(id)
    )
  }
  useEffect(() => {
    setContactDetails(props.patient)
  }, [props.patient])

  return (
    <div className="">
      {contactDetails ? (
        <div className="row d-flex justify-content-around g-3">
          <div className="col-xl-3 col-md-6 col-12">
            {contactDetails.address && <Module title="Address">
              {contactDetails.address.addressLine1 ? <>
                {contactDetails.address.addressLine1 ? <> {contactDetails.address.addressLine1}<br /></> : null}
                {contactDetails.address.addressLine2 ? <> {contactDetails.address.addressLine2}<br /></> : null}
                {contactDetails.address.city ? <> {contactDetails.address.city},</> : null}
                {contactDetails.address.state ? <> {contactDetails.address.state},</> : null}
                {/* {contactDetails.address.country ? <> {contactDetails.address.country}</> : null} */}
                {contactDetails.address.postalCode ? <> {contactDetails.address.postalCode}</> : null}
              </> : 'No Address Listed'}
            </Module>}
          </div>
          <div className="col-xl-3 col-md-6 col-12">
            {['isOptIn'] in contactDetails ? <Module title="Notifications">
              <div className="d-flex justify-content-center">
                <div className="col-4">Mobile</div>
                <div className="col-8">  {contactDetails.isOptIn === 1 ? <span className="badge bg-success text-white">Opted In</span> : <span className="badge bg-danger text-white">Opted Out</span>}</div>
              </div>
              {/* <div className="d-flex justify-content-center mt-3">
                <div className="col-4">Email</div>
                <div className="col-8">
                  <span className="badge bg-warning text-white">Coming Soon</span>
                </div>
              </div> */}
            </Module> : null}
          </div>
          <ModalBox open={showEditAddress} onClose={() => { setEditAddress(false) }}>
            <EditPatient initialData={editAddress} closeModal={setEditAddress} />
          </ModalBox>
        </div>

      ) : (
        <div>
          <List
            resultsMessage={
              <span>
                There is currently no contact information for this user.{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAdd(true);
                  }}
                >
                  Add Contact Information
                </a>
              </span>
            }
          ></List>
        </div>
      )}
    </div>
  );
};

export default ContactDetails;

/*  <i class></i>
{contactDetails.address.addressLine1 && <span style={{display:'block'}}>{contactDetails.address.addressLine1}</span>}
{contactDetails.address.addressLine2 && <span style={{display:'block'}}>{contactDetails.address.addressLine2}</span>}
{contactDetails.address.city && <span>{contactDetails.address.city}, </span>}
{contactDetails.address.state && <span>{contactDetails.address.state}, </span>}
{contactDetails.address.zipCode || contactDetails.address.postalCode && <span>{contactDetails.address.zipCode || contactDetails.address.postalCode}</span>}
*/
