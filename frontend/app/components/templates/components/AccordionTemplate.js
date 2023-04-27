import React, { useState } from 'react'
import { Accordion } from 'react-bootstrap'

const AccordionTemplate = (props) => {
    return (
        <Accordion defaultActiveKey={props.defaultActiveKey || 0} className={props.className}>
            {props.children && [...props.children].map((child, i) => {
                return (
                    <Accordion.Item eventKey={i} key={i}>
                        <Accordion.Header>
                            {props.children[i].props ? props.children[i].props.title : ''}
                        </Accordion.Header>
                        <Accordion.Body className={props.bodyClassName}>
                            {props.children[i].props.children}
                        </Accordion.Body>
                    </Accordion.Item>
                )
            })
            }
        </Accordion>
    )
}
export default AccordionTemplate