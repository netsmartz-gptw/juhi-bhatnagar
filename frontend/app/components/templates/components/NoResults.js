import React from 'react'

const NoResults = (props) => {

    return (
        <div className="warning">
                <p>{props.children || 'No Results'}</p>
        </div>
    )
}
export default NoResults