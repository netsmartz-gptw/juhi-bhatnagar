import React, { useState, useEffect, useContext } from "react";
import Utilities from "../../../../../services/commonservice/utilities";
import { store } from "../../../../../context/StateProvider";
import ModalBox from "../../../../templates/components/ModalBox";
import moment from 'moment'
import InvoiceService from "../../../../../services/api/invoice.service";
import InvoicePreview from "../../invoices/invoice-preview/InvoicePreview";
const TransactionReceipt = (props) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [open, setOpen] = useState(false)
  console.log(props.transaction);

  const globalStateAndDispatch = useContext(store);
  const state = globalStateAndDispatch.state;
  const dispatch = globalStateAndDispatch.dispatch;

  const channelTypes = {
    1: 'Not Defined',
    2: 'ACH',
    3: 'Credit',
    4: 'Debit',
    10: 'Check',
    9: 'Cash',
  }

  return (
    <div  className="card p-3">
      <div>
        {props.transaction && <div>
          <div className="row">
          <InvoicePreview invoiceId={props.transaction.invoiceId}/>
        </div>

        </div>
        }
        </div>
        </div>
  );
};
export default TransactionReceipt;

            //         {/* <div className="ustify-content-between card-header bg-white p-3 row-fluid d-flex align-items-center">
            //           <table className="table table-borderless table-responsive my-0">
            //             <thead>
            //               <tr className="thead">
            //                 <th className="py-2">Reference Number</th>
            //                 <th className="py-2">Patient Name</th>
            //                 <th className="py-2">Email</th>
            //                 <th className="py-2">Phone</th>
            //               </tr>
            //             </thead>
            //             <tbody>
            //               <tr >
            //                 {/* <td>referenceTransactionId</td> */}
            //                  {/* <td>{props.transaction.invoiceNumber}</td>  */}
            //                 {/* <td>firstName</td> */}
            //                  {/* <td>{props.transaction.firstName} {props.transaction.lastName}</td>  */}
            //                 {/* <td>email</td> */}
            //                  {/* <td>{props.transaction.email}</td>  */}
            //                 {/* <td>pdone</td> */}
            //                  {/* <td>{props.transaction.phone}</td>  */}
            //               {/* </tr> */}
            //             {/* </tbody> */}
            //           {/* </table> */}
            //         {/* </div> */} */}

            //         {/* // <div className="ustify-content-between card-header bg-white p-3 row-fluid d-flex align-items-center">
            //         //   <table className="table table-borderless table-responsive my-0">
            //         //     <thead>
            //         //       <tr className="thead">
            //         //         <th className="py-2">Product Name</th>
            //         //         <th className="py-2">Unit Rate(s)</th>
            //         //         <th className="py-2">Quantity</th>
            //         //         <th className="py-2">Discount</th>
            //         //         <th className="py-2">Tax Percent</th>
            //         //         <th className="py-2">Amount(s)</th>
            //         //       </tr>
            //         //     </thead>
            //         //     <tbody>
            //         //       <tr>
            //         //         <td>Not in Payload</td>
            //         //         <td>Not in Payload</td>
            //         //         <td>Not in Payload</td>
            //         //         <td>Not in Payload</td>
            //         //         <td>Not in Payload</td>
            //         //         <td>Not in Payload</td>
            //         //       </tr>
            //         //     </tbody>
            //         //   </table>
            //         // </div> */}


            //         <div className="ustify-content-between card-header bg-white p-3 row-fluid d-flex align-items-center">
            //           <table className="table table-borderless table-responsive my-0">
            //             <thead>
            //               <tr className="thead">
            //                 <th className="py-2">Provider Id</th>
            //                 <th className="py-2">Transaction Date</th>

            //               </tr>
            //             </thead>
            //             <tbody>
            //               <tr>
            //                  <td>{props.transaction.providerId}</td> 
            //                 {/* <td>{props.transaction.transactionDate}</td> */}
            //                  <td>{moment(props.transaction.transactionDate).format("MM/DD/YYYY")}</td> 
                          
            //               </tr>
            //             </tbody>
            //           </table>
            //         </div>


            //       </div>
            //     </div>
            //     <button className="btn btn-primary" onClick={() => { setShowDownloadModal(false) }}>Close</button>
            //   </div>
            // {/* </ModalBox> */}
