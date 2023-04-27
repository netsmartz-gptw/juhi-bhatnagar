import React, { useState, useEffect } from "react";
import UnavailableBlockForm from "../unavailable-block-form/UnavailableBlockForm";
import ModalBox from "../../../../templates/components/ModalBox";
import label from "../../../../../../assets/i18n/en.json";
import Select from "react-select";

const AddUnavailableBlock = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    useEffect(() => {
        setShowModal(props.openModal);
    }, [props.openModal]);

    const findUnavailableBlock = () => {
        if (search && typeof props.onSuccess === 'function') {
            props.onSuccess({
                description: search
            });
        }
    }

    const onSearchCancel = () => {
        if(search){
            setSearch('');
            if (typeof props.onSuccess === 'function') {
                props.onSuccess();
            }
        }
    }

    return <>
        <div className="required field col-12">
            <label>Find Unavailable Block</label>
            <div className='input-group col-12'>
                <div className="col-xl-6 col-lg-8 col-12 d-flex row">
                    <div className="col">
                        <input
                            type='text'
                            name="search"
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value);
                            }}
                        />
                        <div className='col-12 m-3'>
                            <button className='btn btn-primary me-2' onClick={findUnavailableBlock}>Find</button>
                        </div>
                    </div>
                    <div className="col-auto">
                        <button className='btn btn-primary' title="Add Patient" onClick={e => {
                            e.preventDefault();
                            setShowModal(true);
                        }}><i className='icon plus' /></button>
                    </div>
                </div>
            </div>
        </div>
        <ModalBox open={showModal} onClose={() => {
            setShowModal(false);
            if (typeof props.onModalClose === 'function') {
                props.onModalClose();
            }
        }} size='small'>
            <UnavailableBlockForm
                cb={() => {
                    setShowModal(false);
                    if (typeof props.onModalClose === 'function') {
                        props.onModalClose();
                    }
                }}
                {...props}
            />
        </ModalBox>
    </>
}

export default AddUnavailableBlock;