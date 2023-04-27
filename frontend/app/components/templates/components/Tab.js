import React, {useState} from 'react'

export default function Tab(props) {
    const { activeTab,label} = props
    const onClick = () => {
        const { label, onClick } = props;
        onClick(label);
      }
    
      const style ={

      }
    return (
        <div className="tiny ui secondary menu">
            <li className='tabList'
                onClick={onClick}
            >
            {label}
            </li>
        </div>
    )
}