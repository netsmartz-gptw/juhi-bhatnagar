import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Module from "../../../templates/components/Module";
import SideTabs from "../../../templates/layouts/SideTabs";
import FindAllTransactionsList from "../transactions/find-all-transactions/FindAllTransactionsList";
import ProviderPatientDashboard from "../patient/patient-dashboard/ProviderPatientDashboard";
import NoShow from "./no-show/NoShow";
import TodaysAppointments from "../appointment/todays-appointments/TodaysAppointments";
import TabsTemplate from "../../../templates/components/TabsTemplate";
import TransactionSummary from "./transaction-summary/TransactionSummary";
import FindAllTransactionsDashboard from '../transactions/transactions-dashboard/FindAllTransactionsDashboard'
import EmployeeSalesTotal from './employee-sales-total/EmployeeSalesTotal'
import EmployeeWorkTicket from './employee-work-ticket/EmployeeWorkTicket'
import TaxReport from "./tax-report/TaxReport";
import TransactionReportTable from "./transactions-report-table/TransactionReportTable";
import TransactionList from "../transactions/transactions-list/TransactionList";
import PaymentReconciliationReport from "./payment-reconciliation-report/PaymentReconciliationReport";
import PaymentPlanTable from "./payment-plan-table/PaymentPlanTable";
import AppointmentsTable from "./appointments-table/AppointmentsTable";

const ProviderReportDashboard = (props) => {
  const [reloader, setReloader] = useState(false);
  const [activeTab, setActiveTab] = useState(false);

  const navigate = useNavigate();
  // To Link Report Lists to Search
  const [reports, setReports] = useState([]);

  useEffect(() => {
    changeTab(props.tab);
  }, [props.tab]);

  const changeTab = (tab) => {
    if (tab === "payment") {
      navigate("/provider/reports");
      setActiveTab(tab);
    } else {
      navigate(`/provider/reports/${tab}`);
      setActiveTab(tab);
    }
  };
  return (
    <SideTabs
      title="Report Dashboard"
      menuTitle="Reports Menu"
      activeKey={activeTab}
      onSelect={(k) => changeTab(k)}
    >
      <Module title="Payment" eventKey="payment">
        <TabsTemplate>
          <div title="Transaction Summary">
            <TransactionSummary />
          </div>
          <div title="Payment Reconciliation">
            <PaymentReconciliationReport />
          </div>

          <div title="Payment Plans">
            <PaymentPlanTable />
          </div>

          <div title="Tax Reports">
            <TaxReport />
          </div>
          <div title="Appointments">
            <AppointmentsTable />
          </div>
          <div title="All Transactions">
            <TransactionReportTable />
            {/* <FindAllTransactionsList /> */}
          </div>
          {/* <div title="Membership" disabled>
            <div>Membership Stuff</div>
          </div>
          <div title="Account Balance" disabled>
            <div>Account Balance Stuff</div>
          </div> */}
        </TabsTemplate>
      </Module>
      <Module title="Patient" eventKey="patient">
        <div>
          <TabsTemplate>
            <div title="No Show">
              <NoShow />
            </div>
            {/* <div title="Patient List">
              <ProviderPatientDashboard />
            </div> */}
            {/* <div title="Patient Demographics" disabled>
              <div> Patient Demographics Stuff</div>
            </div>
            <div title="Patient Activity/Frequency" disabled>
              <div> Patient Activity/Frequency Stuff</div>
            </div>
            <div title="Notifications" disabled>
              <div> Notifications Stuff</div>
            </div> */}
          </TabsTemplate>
        </div>
      </Module>
      <Module title="Provider" eventKey="provider">
        <div>
          <TabsTemplate>
            <div title="Employee Sales Total">
              <EmployeeSalesTotal />
            </div>
            <div title="Employee Work Ticket">
              <EmployeeWorkTicket />
            </div>
            {/* <div title="Provider/Client" disabled>
              <div> Provider/Client Stuff</div>
            </div>
            <div title="Provider Metrics" disabled>
              <div> Provider Metrics</div>
            </div>
            <div title="Provider Specifics" disabled>
              <div> Provider Specifics</div>
            </div> */}
          </TabsTemplate>
        </div>
      </Module>
      {/* <Module title="Practice" eventKey="practice" disabled>
        <div>
          <TabsTemplate>
            <div title="Daily Practice">
            </div>
            <div title="Equipment Utilization">
              <div> Equipment Utilization Stuff</div>
            </div>
            <div title="Room Utilization">
              <div> Room Utilization Stuff</div>
            </div>
            <div title="Service to Retail Product">
              <div> Service to Retail Product</div>
            </div>
          </TabsTemplate>
        </div>
      </Module>
      <Module title="Product/Inventory" eventKey="product-inventory" disabled>
        <div>
          <TabsTemplate>
            <div title="Audit">
            </div>
            <div title="Inventory on Hand">
              <div> Inventory on Hand Stuff</div>
            </div>
            <div title="Product Sales">
              <div> Product Sales Stuff</div>
            </div>
            <div title="Purchase Order">
              <div> Purchase Order Stuff</div>
            </div>
            <div title="Product Trigger Notification">
              <div> Product Trigger Notification Stuff</div>
            </div>
          </TabsTemplate>
        </div>
      </Module> */}
    </SideTabs>
  );
};

export default ProviderReportDashboard;

/* possibly needed for payment plan 

 <div title="Payment Plans" eventKey="paymentplans">
        {/* <Module
          id="transactionHistory"
          accordianId="transactionHistory"
          icon="chart pie"
          title="Payment Plans"
        >
          <div className="col-12 row-fluid g-4 d-flex">

    </SideTabs>
   
    
    <SideTabs>
      <div title="Provider"></div>
    <div title="Employee Sales Totals"></div>
    <div title="Employee Work Ticket"></div>
    <div title="Provider/Client"></div>
    <div title="Provider Metrics"></div>
    <div title="Provider Specific"></div>

    </SideTabs>

    
    <SideTabs>
    <div title="Practice"></div>
    <div title="Daily Practice"></div>
    <div title="Equipment Utilization"></div>
    <div title="Room Utilization"></div>
    <div title="Service to Retail Product"></div>

    </SideTabs>

    
    <SideTabs>
      <div title="Product/Inventory"></div>
    <div title="Audit"></div>
    <div title="Inventory on Hand"></div>
    <div title="Product Sales"></div>
    <div title="Purchase Order"></div>
    <div title="Product Trigger Notifications"></div>

                <div className="col-12 d-flex row ms-3 mb-3">
                  <div className="col-12">
                    <span>$5.61 - CCD</span>
                    <br />
                    <span>1 Transactions @ Average $5.61</span>
                  </div>
                </div>
                <hr />
              </div>
              <div className="col-12 d-flex row">
                <div className="col-12 d-flex mb-3">
                  <div className="col">
                    <h5>CASH - $0.00</h5>
                  </div>
                </div>
                <hr />
              </div>
              <div className="col-12 d-flex row">
                <div className="col-12 d-flex mb-3">
                  <div className="col">
                    <h5>CHECK - $0.00</h5>
                  </div>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </Module> 
        <Module title="Payment Plans">
          <PaymentPlanList />
        </Module>
      </div>

*/
