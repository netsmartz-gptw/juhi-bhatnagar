import React, { useState, useEffect, useContext } from 'react'
import ModalBox from './ModalBox'
import Exception from '../../../common/exceptions/exception';
import toast, { ToastBar } from 'react-hot-toast';


const APIResponse = (props) => {
    // const { onClose, refresh, exitHandler } = props;
    const [showDialog, setShowDialog] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])

    
    useEffect(() => {

      if (props.apiResponse)
      {

        let apiResult = Exception.processAPIResponse(props.apiResponse);
      
        if (apiResult.success)
        {
            if (apiResult.message && props.toastOnSuccess)
              toast.success(apiResult.message);

            if (props.onSuccess)
              props.onSuccess(apiResult.message)
        }        
        else {
          setErrorMessage(apiResult.message);
          setShowDialog(true);
        }

      }
      else
      {
        setShowDialog(false);
      }

    }, [props.apiResponse])

    

    return (
        <ModalBox open={showDialog} onClose={() => { setShowDialog(false) }} title="Error">

          <div className="field col-12">
              <span>
                <ul>
                  {errorMessage.map(error => <li key={error}> {error} </li>)}
                </ul>
              </span>
          </div>
          <div className="mt-3">
            <button className="btn btn-secondary ms-2 float-right" onClick={() => { setShowDialog(false) }}>Close</button>
          </div >
          <div>
            &nbsp;
          </div>

        </ModalBox>
    )
}

export default APIResponse