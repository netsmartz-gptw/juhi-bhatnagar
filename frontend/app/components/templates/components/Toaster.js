
import React, { useState, useEffect } from 'react'
import $ from 'jquery'
const Toaster = (props) => {
    const [show, setShow] = useState(props.show)

    useEffect(() => {
        if (props.autoClose) {
            setInterval(() => {
                return onClose()
            }
                , 15000)
        }
        if (!props.show) {
            return onClose()
        }

    }, [props.show])

    const onClose = () => {
        $("#alert").fadeOut(1000);
        props.onClose()
        return setShow(false);
    }
    return (
        <div className="ui flex-container">
            {show && <div id="alert" className="ui alert segment notification bottom-left  bg-primary text-white pt-auto">
                {props?.children && props?.children} {props.message && props.message} <button className="p-0 btn btn-transparent text-white" style={{ float: 'left' }} onClick={e => { e.preventDefault(); setShow(false) }}><i className="ui icon x"></i></button>
            </div>}
        </div>
    )
}
export default Toaster