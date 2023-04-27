import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import PatientService from "../../../../../services/api/patient.service";
import List from "../../../../templates/components/List";
import label from "../../../../../../assets/i18n/en.json";
import moment from "moment";
import ModalBox from "../../../../templates/components/ModalBox";
import NoteEdit from "../../note/note-edit/NoteEdit";
import NoteAdd from "../../note/note-add/NoteAdd";

const PatientWalletList = (props) => {
  const [contactDetails, setContactDetails] = useState()
  const [walletDetails, setWalletDetails] = useState()
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editNote, setEditNote] = useState();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (props.autoPull) {
      pullContactDetails();
      pullWalletDetails();
    } else if (props.pull) {
      pullContactDetails();
      pullWalletDetails()
    }
  }, [props.autoPull, props.pull, props.keyword]);

  const pullContactDetails = () => {
    return PatientService.getPatientById(props.patientId)
      .then((res) => {
        console.log(res);
        setContactDetails(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const pullWalletDetails = () => {
    return PatientService.fetchPatientAccount(props.patientId)
      .then((res) => {
        console.log(res + "wallet details");
        setWalletDetails(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {contactDetails && contactDetails.firstName ? (
            <Row xs={1} md={3} className="g-5">
            {Array.from({ length: 4 }).map((_, idx) => (
            <Col>
                <Card className="row" style={{ width: '24rem', height: "14rem"}}>
            
                    <Card.Body style={{ paddingTop: '40px', display: "grid", placeItems: "center" }}>
                         <Card.Title>
                             card Numbers
                         </Card.Title>
                    {contactDetails && (
                        <Card.Title style={{ display: "block" }}>
                        Expo Date 
                        </Card.Title>
                    )} 
                    {contactDetails.firstName && (
                     <Card.Title style={{ display: "block" }}>
                       {contactDetails.firstName} {contactDetails.lastName}  <i className="icon big right cc visa icon"></i>
                     </Card.Title>
                   )} 
                     </Card.Body>
                     <Card.Footer style={{ display: "flex", flexDirection: "in-line", justifyContent: "center" }}>
                     <Card.Link href="#"><i className="icon dollar sign"></i></Card.Link>
                     <Card.Link href="#"><i className="icon pencil sign"></i></Card.Link>
                     <Card.Link href="#"><i className="icon trash alternate outline"></i></Card.Link>
                     </Card.Footer>
                 </Card>
            </Col>
            ))}
            </Row>
        
      ) : null}
      {!contactDetails?.address || !contactDetails.address.addressLine1 ? (
        <div>The is currently no additional contact information</div>
      ) : null}
    </div>
  );
};

export default PatientWalletList;
