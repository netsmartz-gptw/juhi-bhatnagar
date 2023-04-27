import React, { Fragment, useEffect, useState } from 'react'
import PageTitle from './PageTitle';
import { Tab, Tabs } from 'react-bootstrap';

const TabsTemplate = (props) => {
    const { style } = props;
    const [selectedTab, setSelectedTab] = useState(props.defaultActiveKey || "nav-0")
    useEffect(() => {
        if (props.activeKey) {
            setSelectedTab(props.activeKey)
        }
    }, [props.activeKey])
    return (
        <nav>
            <div className="not-mobile">
                {Array.isArray(props.children) &&
                    <Tabs className="tabs" variant={props.style && props.style} id={props.id} defaultActiveKey={props.defaultActiveKey || 'nav-0'} activeKey={props.activeKey || selectedTab} onSelect={k => { if (props.onSelect) { props.onSelect(k) }; setSelectedTab(k) }} mountOnEnter unmountOnExit>
                        {props.headerTitle && <PageTitle>{props.headerTitle}</PageTitle>}
                        {props.children.map((body, i) => {
                            let active = false
                            if ('nav-' + i === selectedTab || props.activeKey === selectedTab) { active = true }
                            return (
                                <Tab className="tab-content" onTabChange={e => { e.preventDefault(); props.onTabChange() }} eventKey={props.children[i].props.eventKey || `nav-${i}`} title={props.children[i].props.title} disabled={props.children[i].props.disabled || false}>
                                    {/* {props.activeKey === props.children[i].props.eventKey || `nav-${i}` ?  */}
                                    <div className={active ? 'tab-pane fade show active p-3' : 'tab-pane fade p-3'} role="tabpanel" aria-labelledby={props.children[i].props.eventKey + "-tab" || `nav-${i}-tab`}>
                                        {props.children[i].props ? props.children[i].props.children : ''}
                                    </div>
                                    {/* : null } */}
                                </Tab>
                            )
                        }
                        )}
                    </Tabs>}

                {Array.isArray(props.children) === false && <Tabs className="tabs" varient={props.style && props.style} id={props.id} activeKey={selectedTab || null} onSelect={k => setSelectedTab(k)}>
                    <Tab className="tab-content" eventKey={`nav-0`} title={props.children.props.title}>
                        <div className='tab-pane fade show active p-3' eventKey={`nav-0`} role="tabpanel" aria-labelledby={`nav-0-tab`}>
                            {props.children.props.children}
                        </div>
                    </Tab>
                </Tabs>}
            </div>
            <div className='mobile'>
            {Array.isArray(props.children) ?  <div className='field mb-3'>
                    <label>Select Report</label>
                    <select className='form-select' value={props.activeKey || selectedTab} onChange={e => { e.preventDefault(); setSelectedTab(e.target.value) }}>
                        {Array.isArray(props.children) &&
                            props.children.map((child, i) => {
                                return (
                                    <option value={props.children[i].props.eventKey || `nav-${i}`}>{props.children[i].props.title}</option>
                                )
                            })
                        }
                    </select>
                </div>:null}
                {Array.isArray(props.children) ?
                    props.children.map((child, i) => {
                        let active = false
                        if ('nav-' + i === selectedTab || props.children[i].props.eventKey === selectedTab) { active = true }
                        return (
                            active===true && <div className='col-12'>
                                {props.children[i].props ? props.children[i].props.children : ''}
                            </div>

                        )
                    }) :
                    <div className='col-12'>
                        {props.children.props.children}
                    </div>
                }
            </div>
        </nav>
    )
}

export default TabsTemplate