import React, { useState } from 'react'
import { Modal, Transition } from 'semantic-ui-react'
import ConfirmCloseModal from './ConfirmCloseModal'

const ModalBox = (props) => {
    const { open, onClose, onOpen, children } = (props)
    const [confirmModal, setConfirmModal] = useState(false)
    return (
        <div>
            <Transition.Group animation="drop" duration={600}>
                {props.open && <Modal
                    open={open}
                    centered={true}
                    size={props.size && props.size}
                    onClose={e => {
                        e.preventDefault(); if (props.requireConfirm) { setConfirmModal(true) }
                        else {
                            props.onClose()
                        }
                    }}
                    onOpen={e => { e.preventDefault(); onOpen() }}
                    closeOnEscape={true}
                    closeOnDimmerClick={true}
                    className='p-5'
                    closeIcon={!props.title && <i className="btn btn-transparent p-0 m-0 icon x text-primary float-right" />}>
                    {props.title && <span className='modal-header'> <i className="btn btn-transparent p-1 m-0 icon x text-primary mb-2" onClick={(e) => { e.preventDefault(); props.onClose() }} />
                        <span className='modal-title'>{props.title}</span>
                    </span>}
                    <Modal.Content>
                        <div className="scroll-list"  style={{ maxHeight: '80vh' }} >
                            {!props.onCloseSuccess && children}

                            {props.onCloseSuccess &&
                                <div className='row d-flex align-items-end justify-content-between'>
                                    <div className='col'>
                                        {children}
                                    </div>
                                    <div className="col-auto">
                                        {props.extraButton && props.extraButton}
                                        <button className='btn btn-secondary ms-3 col-auto' onClick={e => { e.preventDefault(); props.onClose() }}>{props.cancelButton || 'Cancel'}</button>
                                        <button className='btn btn-primary ms-3 col-auto' onClick={e => { e.preventDefault(); props.onCloseSuccess() }}>{props.confirmButton || 'Confirm'}</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </Modal.Content>
                </Modal>}
            </Transition.Group>
        </div >
    )
}

export default ModalBox