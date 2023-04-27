import React, { useEffect, useState } from "react";
import AddPatient from "../add-patient/AddPatient";
import CommonService from "../../../../../services/api/common.service";
import Dashboard from "../../../../templates/layouts/Dashboard";
import PatientList from "../patient-list/PatientList";

const ProviderPatientDashboard = (props) => {

  return (
    <div className="">
      <Dashboard Modules stacked title="Patient Management">
              <PatientList title="Patient List" icon="bars" side="right"/>
      </Dashboard>
    </div>
  );
};

export default ProviderPatientDashboard;
