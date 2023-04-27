import React, { useState, useEffect } from "react";
import moment from 'moment'
import InvoiceService from "../../../../../../../../services/api/invoice.service";
import List from "../../../../../../../templates/components/List";

const Preview = (props) => {
  const [preview, setPreview] = useState();
  const [editAddress, setEditAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);

  useEffect(() => {
    if (props.autoPull) {
      pullPreview();
    } else if (props.pull) {
      pullPreview();
    }
  }, [props.autoPull, props.pull, props.keyword]);

  const pullPreview = () => {
    return InvoiceService.getInvoiceById(props.paymentPlanId)
      .then((res) => {
        console.log(res + " result from invoice preview api");
        setPreview(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {preview ? (
<table className='table table-borderless my-0'>
<thead>
        <tr>
            <th className='py-2'>Product Name</th>
            <th className='py-2'>Unit Rate</th>
            <th className='py-2'>Quantity Discount</th>
            <th className='py-2'>Percent(%)</th>
            <th className='py-2'>Discount Amount</th>
            <th className='py-2'>Tax Percent(%)</th>
            <th className='py-2'>Amount</th>
        </tr>
</thead>
<tbody>
            <tr>
                <td className='pb-0 pt-3'>{preview.id}</td>
                <td>
                    <div className='input-group align-items-center'>
                        <i className='icon dollar small' />
                        <input disabled value={preview.netAmount} type="text" name="unitPrice" onChange={e => { e.preventDefault(); changeProduct(e, i) }} />
                    </div>
                </td>
                <td><input disabled value={preview.discountType} type="number" name="quantity" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                <td><input disabled value={preview.discountPercent} type="number" name="discount" onChange={e => { e.preventDefault(); changeProduct(e, i) }} /></td>
                <td >
                    <input disabled value={preview.discountAmount} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeProduct(e, i) }} />
                </td>
                <td >
                    <input disabled value={preview.subtotal} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeProduct(e, i) }} />
                </td>
                <td >
                    <input disabled value={preview.finalAmount} type="number" name="taxPercent" onChange={e => { e.preventDefault(); changeProduct(e, i) }} />
                </td>
            </tr>
    <tr className='thead'>
        <th colSpan={4} className='text-end'>Sub Total</th>
        <th colSpan={3} className='text-end'>$ {preview.subTotal} </th>
    </tr> 
    <tr className="thead">
        <th colSpan={4} className='text-end'>Total Discount</th>
        <th colSpan={3} className='text-end'>$ {preview.discountAmount} </th>
    </tr> 
    <tr className="thead">
        <th colSpan={4} className='text-end'>Total Tax</th>
        <th colSpan={3} className='text-end'>$ {preview.taxAmount} </th>
    </tr>
    <tr className="thead">
        <th colSpan={4} className='text-end'>Total Amount</th>
        <th colSpan={3} className='text-end'>$ {preview.finalAmount}</th>
    </tr>
</tbody>
</table>

      ) : (
        <div>
          <List
            resultsMessage={
              <span>
                There are Currently no Previews for this user.{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAdd(true);
                  }}
                >
                  Add a Preview
                </a>
              </span>
            }
          ></List>
        </div>
      )}
    </div>
  );
};

export default Preview;
