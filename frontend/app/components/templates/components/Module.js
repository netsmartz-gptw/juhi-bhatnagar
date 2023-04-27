import React, { Fragment, useState } from 'react'
import ModuleTitle from './ModuleTitle'
import { Dropdown, Popup, TransitionGroup } from 'semantic-ui-react'
import ModalBox from './ModalBox'

const Module = (props) => {
    const [collapse, setCollapse] = useState(false)
    const [showTools, setShowTools] = useState(false)
    const [showHelper, setShowHelper] = useState(false)
    const [open, setOpen] = useState(false)
    const { title, children, icon } = props
    const onPress = () => {
        if (collapse === true) {
            setCollapse(false)
        }
        else {
            setCollapse(true)
        }
    }
    return (
        <div className={`ui segment ${props.className}`}>
            {title && <ModuleTitle icon={props.icon} title={title}>{title.length>40?title.slice(0,40)+'...' : title}</ModuleTitle>}

            {props.tools &&
                <div
                    className={`row align-items-center btn btn-group p-0 p-1 px-2 me-0 ${showHelper ? 'btn-primary' : 'btn-transparent'}`}
                    style={{ float: 'right' }}
                    onMouseEnter={e => { e.preventDefault(); setShowHelper(true) }}
                    onClick={e => { e.preventDefault(); setShowHelper(!showHelper) }}
                    onMouseLeave={e => { e.preventDefault(); setShowHelper(false) }}
                    onDoubleClick={e => { e.preventDefault(); setOpen(true) }}>
                    {showHelper && <Fragment>
                        {props.minimize && <i className={collapse ? 'col icon m-1-5 plus small btn btn-primary m-1 p-0 me-3' : 'col icon m-1-5 minus small btn btn-primary  m-1 p-0 me-3'} title={collapse ? 'Expand' : 'Collapse'} onClick={(e) => { e.preventDefault(); onPress() }}></i>}
                        {props.modal && <i className='col icon m-1-5 small external alternate btn btn-primary m-1 p-0 me-3' title={props.modalTooltip || "Open in Pop-Up"} onClick={(e) => { e.preventDefault(); setOpen(true) }}></i>}
                        {props.helper &&
                            <Popup
                                size={props.toolTipSize || 'small'}
                                wide={props.wide}
                                on="click"
                                content={props.toolTip || 'tooltip'}
                                position={props.toolTipPosition || 'top center'}
                                open={showHelper}
                                onClose={e => { e.preventDefault(); setShowHelper(false) }}
                                onOpen={e => { e.preventDefault(); setShowHelper(true) }}
                                trigger={
                                    <i className={`col icon m-1-5 ${props.helperIcon || 'help'} small m-1 btn btn-primary m-1 p-0 me-3`} style={{ cursor: 'pointer' }} title={props.helperMessage ? props.helperMessage : `Click for Help`}></i>
                                } />}
                    </Fragment>
                    }
                    <i className={showHelper ? 'col icon m-1-5 cog small btn btn-primary m-0 p-0' : 'col icon m-1-5 cog small btn btn-transparent text-primary ms-3 p-0 m-0'} />
                </div>
            }

            {
                !props.tools && <div style={{ float: 'right' }}>
                    {props.minimize && <i className={collapse ? 'icon m-1-5 plus small btn btn-transparent text-primary p-0 m-0' : 'icon m-1-5 minus small btn btn-transparent text-primary m-0 p-0'} onClick={(e) => { e.preventDefault(); onPress() }}></i>}
                    {props.modal && <i className='icon m-1-5 small external alternate btn btn-transparent text-primary p-0 m-0' title={props.modalTooltip || "Open in Pop-Up"} onClick={(e) => { e.preventDefault(); setOpen(true) }}></i>}
                    {props.helperIcon &&
                        <Popup
                            size={props.toolTipSize || 'small'}
                            wide={props.wide}
                            on="click"
                            content={props.toolTip || 'tooltip'}
                            position={props.toolTipPosition || 'top center'}
                            open={showHelper}
                            onClose={e => { e.preventDefault(); setShowHelper(false) }}
                            onOpen={e => { e.preventDefault(); setShowHelper(true) }}
                            trigger={
                                <i className={`icon ${props.helperIcon} m-1-5 small btn btn-transparent text-secondary`} style={{ cursor: 'pointer' }} title={props.helperMessage ? props.helperMessage : `Click for Help`}></i>
                            } />
                    }
                </div>
            }
            {!collapse && <div className={`${props.className && props.className}`}>{children}</div>}
            {
                props.modal && <ModalBox open={open} onClose={() => { setOpen(false) }} size={props.size} title={props.title}  >
                    <div className={`${props.className && props.className}`}>
                        {children}
                    </div>
                </ModalBox>
            }
        </div >
    )
}

export default Module