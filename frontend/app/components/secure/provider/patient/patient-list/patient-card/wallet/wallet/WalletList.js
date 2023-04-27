import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PatientService from "../../../../../../../../services/api/patient.service";
import List from "../../../../../../../templates/components/List";
import ModalBox from "../../../../../../../templates/components/ModalBox";
import PatientAccountAdd from "../../../../../patient-account/patient-account-add/PatientAccountAdd";
import WalletCard from "./WalletCard";

const WalletList = (props) => {
  // const [cardType, setCardType] = useState()
  const [walletDetails, setWalletDetails] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addAccount, setAddAccount] = useState(false);
  const [editNote, setEditNote] = useState();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (props.autoPull) {
      pullWalletDetails();
    } else if (props.pull) {
      pullWalletDetails();
    }
  }, [props.autoPull, props.pull, props.keyword]);

  const pullWalletDetails = () => {
   PatientService.fetchPatientAccount(props.patientId)
      .then((res) => {
        console.log(res);
        if (res.length > 0) {
          setWalletDetails(res);
        }
        else {
          setWalletDetails()
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="row d-flex g-3">
      {walletDetails ?
            walletDetails.map((detail, idx) => {
              return (
                <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                <WalletCard patientId={props.patientId} detail={detail}  refresh={()=>{pullWalletDetails()}} />
                </div>
              )
            })
        :
        <div>
          <List
            noResultsMessage={
              <span>
                There are currently no cards on file for this user. &nbsp;
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setAddAccount(true);
                  }}
                >
                  Add Account Information
                </a>
              </span>
            }
          >{null}</List>
        </div>}
      <ModalBox open={addAccount} onClose={() => setAddAccount(false)}>
        <PatientAccountAdd patientId={props.patientId} onClose={() => setAddAccount(false)} refresh={()=>{pullWalletDetails()}}/>
      </ModalBox>
    </div>
  );
};

export default WalletList;
