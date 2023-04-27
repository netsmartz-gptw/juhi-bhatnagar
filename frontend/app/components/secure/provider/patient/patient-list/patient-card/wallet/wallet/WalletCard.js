import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Dropdown } from 'semantic-ui-react'
import PatientAccountService from '../../../../../../../../services/api/patient-account.service'
import ModalBox from '../../../../../../../templates/components/ModalBox'
import PatientAccountEdit from '../../../../../patient-account/patient-account-edit/PatientAccountEdit'

const WalletCard = (props) => {
    let detail = props.detail
    const [editCard, setEditCard] = useState(false)
    const [deactivate, setDeactivate] = useState(false)

    const deactivateCard = () => {
        PatientAccountService.inactivatePatientAccount(props.patientId, props.detail.id)
            .then(res => {
                console.log(res);
                setDeactivate(false)
                toast.success('Card deactivated')
                if (props.refresh()) {
                    props.refresh()
                }
            })
    }
    return (
        <div className="card p-3 justify-content-center">
            <div className="bg-white">
                <div className="row g-3">
                    <strong>
                        <h5 className="col-12 text-center pt-3 mb-3">
                            <span className='d-inline-block text-truncate'>
                                {detail.cardType === "VISA" && (
                                    <i className="icon cc visa"></i>
                                )}
                                {detail.cardType === "MASTERCARD" && (
                                    <i className="icon cc mastercard"></i>
                                )}
                                {detail.cardType === "DISCOVER" && (
                                    <i className="icon cc visa"></i>
                                )}
                                {detail.cardType === "AMEX" && (
                                    <i className="icon cc amex"></i>
                                )}
                                {detail.cardType === "blank" && (
                                    <i className="icon credit-card"></i>
                                )}
                                {detail.cardType === "DINERS" && (
                                    <i className="icon cc diners club"></i>
                                )}
                                {detail.cardType === "JCB" && (
                                    <i className="icon cc jcb"></i>
                                )}
                                {!detail.cardType && (
                                    <i className="icon money bill"></i>
                                )}
                                {detail.maskedCardNumber} {detail.maskedAccountNo}
                                <div className='col-md-6 col-12'>{detail.accountHolderName}</div>
                            </span>
                        </h5>
                    </strong>
                </div>
            </div>

            <div className="text-center">
                {detail.maskedCardNumber && <span className="mb-3">****-****-****-{detail.maskedCardNumber}</span>}
                {detail.maskedAccountNo && <span className="mb-3">Account Ending In {detail.maskedAccountNo}</span>}
                <br />
                {detail.cardExpiry && <span className="mb-3">Valid Through: {detail?.cardExpiry?.toString().substr(0, 2)}/{detail?.cardExpiry?.toString().substr(2, 2)}</span>}
                {detail.bankName && <span className="mb-3">{detail.bankName}</span>}
                <div className="col-12 row d-flex justify-content-center m-0 mt-3">
                    <div className="btn-group col-auto">
                        <div className='btn btn-secondary'>{props.detail.isActive === 0 ? 'Inactive' : 'Active'}</div>
                        {props.detail.isActive === 1 && <button className="btn btn-primary" title="Deactivate" onClick={e => { e.preventDefault(); setDeactivate(true) }}>
                            <i className="icon ban" />
                        </button>}
                        {props.detail.isActive === 1 && <button className="btn btn-primary" title="Change Card Info" onClick={e => { e.preventDefault(); setEditCard(true) }}>
                            <i className="icon pencil" />
                        </button>}
                    </div>
                </div>
            </div>
            <ModalBox open={editCard} onClose={() => { setEditCard(false) }} title="Edit Patient Account">
                <PatientAccountEdit account={props.detail} patientId={props.patientId} onClose={() => { setEditCard(false) }} />
            </ModalBox>
            <ModalBox open={deactivate} onClose={() => { setDeactivate(false) }} size="small" confirmButton="Yes" onCloseSuccess={() => { deactivateCard(); }}>
                Are you sure you want to deactivate this card?
            </ModalBox>
        </div>
    )
}

export default WalletCard