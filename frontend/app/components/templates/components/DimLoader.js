import React, { useState } from 'react'

const DimLoader = (props) => {
    return (
        <div className="ui active dimmer">
            <div className="ui indeterminate text loader">{props.loadMessage || "Loading..."}</div>
        </div>
    )
}

export default DimLoader