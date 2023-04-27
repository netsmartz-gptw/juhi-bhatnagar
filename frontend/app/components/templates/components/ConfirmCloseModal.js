import React, {useState, useEffect} from 'react'

const ConfirmCloseModal = (props) =>{
    return(
        <div className='d-flex justify-content-between row'>
            <div className='col-12'>
                Are you sure you want to exit without saving?
            </div>
            <div className='col-auto'><button className='btn btn-secondary' onClick={e=>{e.preventDefault(); props.onClose()}}>Cancel</button></div>
            <div className='col-auto'><button className='btn btn-primary' onClick={e=>{e.preventDefault(); props.onConfirm()}}>Confirm</button></div>
        </div>
    )
}

export default ConfirmCloseModal