import React, { useState } from 'react';

const ModuleTitle = (props) => {
    const {title, children} = (props)
    return (
        <div className="ui ribbon label mb-3">
            {props.icon && <i className={`ui icon ${props.icon}`}/>}
            {children && children}
        </div>
    )
}

export default ModuleTitle