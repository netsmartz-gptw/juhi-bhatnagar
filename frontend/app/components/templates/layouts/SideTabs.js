import React, { useEffect, useState } from 'react'
import { Nav, Tab } from 'react-bootstrap'
import { Dropdown } from 'semantic-ui-react'
import Module from '../components/Module'
import PageTitle from '../components/PageTitle'

const SideTabs = (props) => {
    const [activeTab, setActiveTab] = useState(props.defaultActiveKey || props.children[0].props.eventKey || 'nav-0')
    let items = Array.isArray(props.children) === false ? [props.children] : props.children
    return (
        <Tab.Container id={props.id || 'side-menu'} defaultActiveKey={props.defaultActiveKey || 'nav-0'} activeKey={props.activeKey || activeTab} mountOnEnter unmountOnExit onSelect={(k) => { if (props.onSelect) { props.onSelect(k) } else { setActiveTab(k) } }}>
            <div className='container-fluid'>
                {props.title && <PageTitle title={props.title} />}
                <div className='row d-flex'>
                    <div className='col-lg-2 col-12 mb-3'>
                        <Module title={props.menuTitle || null}>
                            <Nav className='row d-flex align-items-center justify-content-between' variant="pills" collapseOnSelect expand="lg">
                                {items && items.map((item, idx) => {
                                    // if (Array.isArray(item.children)) {
                                    //     <Nav.Item className='col-lg-12 col'>
                                    //         <Dropdown trigger={
                                    //             <Nav.Link className="btn" eventKey={item.props.eventKey || `nav-${idx}`}>{item.props?.title}</Nav.Link>
                                    //         }>
                                    //             {item.children.map((nav, idx) => {
                                    //                 return (<Nav.Item className='col-lg-12 col'>
                                    //                     <Nav.Link className="btn" eventKey={item.props.eventKey || `nav-${idx}`}>{item.props?.title}</Nav.Link>
                                    //                 </Nav.Item>
                                    //                 )
                                    //             })
                                    //             }
                                    //         </Dropdown>
                                    //     </Nav.Item>
                                    // }
                                    // else {
                                        return (
                                            <Nav.Item className='col-lg-12 col'>
                                                <Nav.Link className="btn" eventKey={item.props.eventKey || `nav-${idx}`} disabled={item.props.disabled}>{item.props?.title}</Nav.Link>
                                            </Nav.Item>
                                        )
                                    // }
                                })}
                            </Nav>
                        </Module>
                    </div>
                    <div className='col-lg-10 col-12'>
                        <Tab.Content>
                            {items && items.map((item, idx) => {
                                // console.log(item)
                                return (
                                    <Tab.Pane eventKey={item.props.eventKey || `nav-${idx}`}>
                                        {item}
                                    </Tab.Pane>
                                )
                            })
                            }
                        </Tab.Content>
                    </div>
                </div>
            </div>
        </Tab.Container >
    )
}

export default SideTabs