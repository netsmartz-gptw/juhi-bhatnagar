import React, { useState } from 'react';

const PageTitle = (props) => {
    const { title, icon, children } = (props)
    return (
        <h1 className="ui header text-center mb-4">
            {icon && <i className={`ui icon large ${icon} me-3`}></i>}{children && children}{title && title}
        </h1>
    )
}

export default PageTitle