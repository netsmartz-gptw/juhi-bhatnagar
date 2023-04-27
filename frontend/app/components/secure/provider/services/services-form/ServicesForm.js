import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import label from '../../../../../../assets/i18n/en.json'
import ServicesService from '../../../../../services/api/services.service'

const ServicesForm = (props) => {
    // Pull properties form parent
    const { initialData, messages, isEdit, submitHandler, loaded, exitHandler } = props;

    // Set states for form
    const [isLoader, setIsLoader] = useState(false)
    const [formData, setFormData] = useState(initialData)
    const [diagnosisCodesList, setDiagnosisCodesList] = useState([])
    const [proceduralCodesList, setProceduralCodesList] = useState([])
    const [tagsList, setTagsList] = useState([])
    const [formErrors, setFormErrors] = useState(messages.errors)
    const codeType = [
        { 'label': 'Diagonosis Code', 'id': 2 },
        { 'label': 'Procedural Code', 'id': 1 },
    ];


    useEffect(() => {
        setIsLoader(true);
        ServicesService.getServicesCptCodes({ Type: 2 })
            .then((response) => {
                console.log(response)
                setDiagnosisCodesList(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
            })
    }, [])

    useEffect(() => {
        setIsLoader(true);
        ServicesService.getServicesCptCodes({ Type: 1 })
            .then((response) => {
                setProceduralCodesList(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
            })
    }, [])

    useEffect(() => {
        setIsLoader(true);
        ServicesService.getAllLookupTags()
            .then((response) => {
                setTagsList(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
            })
    }, [])

    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...formData };
        newStateObject[e.target.name] = e.target.value;
        if (e.target.name == 'serviceType') {
            newStateObject['icd10Code'] = '';
            newStateObject['cptCode'] = '';
        }
        setFormData(newStateObject);
        if (e.target.isName == true) {
            updateIcd(newStateObject, e.target.value)
        } else if (e.target.isName == false) {
            updateCpt(newStateObject, e.target.value)
        }
    };

    const updateCpt = (newStateObject, id) => {
        const cpt = proceduralCodesList.find(obj => obj.id === id);
        newStateObject['cptCode'] = cpt.id;
        setFormData(newStateObject);
    }

    const updateIcd = (newStateObject, id) => {
        const icd = diagnosisCodesList.find(obj => obj.id === id);
        newStateObject['icd10Code'] = icd.id;
        setFormData(newStateObject);
    }

    const tagsHandler = (e) => {
        let newStateObject = { ...formData };
        if (newStateObject.tags) {
            newStateObject.tags.push({ id: e.id, name: e.name })
        } else {
            newStateObject['tags'] = [{ id: e.id, name: e.name }];
        }
        setFormData(newStateObject);
    }

    const removeTag = (index) => {
        let newStateObject = { ...formData };
        newStateObject.tags.splice(index, 1);
        setFormData(newStateObject);
    }


    return (
        <div>
            {isLoader, !loaded && <div className="ui">
                <div className="ui active dimmer">
                    <div className="ui indeterminate text loader">{label.common.processing}</div>
                </div>
            </div>}
            <form className=''>
                <div className="ui content">
                    <div className="">

                        <div className="required field">
                            <label> {label.services.add.codeType}</label>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={codeType}
                                name="serviceType"
                                value={codeType.find(
                                    (obj) => obj.id === formData.serviceType
                                )}
                                onChange={(e) => {
                                    inputChange({
                                        target: {
                                            value: e.id,
                                            name: "serviceType",
                                        },
                                    });
                                }}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.id}
                            ></Select>
                            {/* <span>{formErrors.serviceType}</span> */}
                        </div>
                        {formData.serviceType == 2 && <div className="required field">
                            <label> {label.services.add.name}</label>
                            <Select
                                options={diagnosisCodesList}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                name="codeName"
                                value={diagnosisCodesList.find(obj => obj.id === formData.codeName)}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.id, name: 'codeName', isName: true }
                                    })
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                            {/* <span>{formErrors.codeName}</span> */}
                        </div>}
                        {formData.serviceType == 1 && <div className="required field">
                            <label> {label.services.add.shortName}</label>
                            <Select
                                options={proceduralCodesList}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                name="codeName"
                                value={proceduralCodesList.find(obj => obj.id === formData.codeName)}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.id, name: 'codeName', isName: false }
                                    })
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                            {/* <span>{formErrors.codeName}</span> */}
                        </div>}
                        {formData.serviceType == 2 && <div className="required field">
                            <label> {label.services.add.Icd10Code}</label>
                            <Select
                                options={diagnosisCodesList}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                name="icd10Code"
                                value={diagnosisCodesList.find(obj => obj.id === formData.icd10Code)}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.id, name: 'icd10Code' }
                                    })
                                }}
                                getOptionLabel={(option) => option.code}
                                getOptionValue={(option) => option.id}
                            />
                            {/* <span>{formErrors.icd10Code}</span> */}
                        </div>}
                        {formData.serviceType == 1 && <div className="required field">
                            <label> {label.services.add.CptCode}</label>
                            <Select
                                options={proceduralCodesList}
                                name="cptCode"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                value={proceduralCodesList.find(obj => obj.id === formData.cptCode)}
                                onChange={e => {
                                    inputChange({
                                        target:
                                            { value: e.id, name: 'cptCode' }
                                    })
                                }}
                                getOptionLabel={(option) => option.code}
                                getOptionValue={(option) => option.id}
                            />
                            {/* <span>{formErrors.cptCode}</span> */}
                        </div>}
                        <div className="required field">
                            <label> {label.services.add.productAlias}</label>
                            <input
                                onChange={(e) => {
                                    e.preventDefault();
                                    inputChange(e);
                                }}
                                type="text"
                                name="productAlias"
                                value={formData.productAlias}
                                required
                            />
                            {/* <span>{formErrors.productAlias}</span> */}
                        </div>
                        <div className='col-12 pb-3'>
                            <small className='py-3'>If you do not see a code that you need, please email <a href="mailto:helpdesk@hellopatients.com">helpdesk@hellopatients.com </a>
                                with the Name & Code and we will add it for you.</small>
                        </div>
                        <div className="required field">
                            <label> {label.services.add.unitPrice}</label>
                            <input
                                onChange={(e) => {
                                    e.preventDefault();
                                    inputChange(e);
                                }}
                                placeholder="0.00"
                                type="text"
                                name="unitPrice"
                                value={formData.unitPrice}
                                required
                            />
                            {/* <span>{formErrors.cptCode}</span> */}
                        </div>
                        <div className="required field">
                            <label> {label.services.add.taxPercent}</label>
                            <input
                                onChange={(e) => {
                                    e.preventDefault();
                                    inputChange(e);
                                }}
                                placeholder="0.00"
                                type="text"
                                name="taxPercent"
                                value={formData.taxPercent}
                                required
                            />
                            {/* <span>{formErrors.taxPercent}</span> */}
                        </div>
                        <div className="required field">
                            <label> {label.services.add.description}</label>
                            <textarea
                                onChange={(e) => {
                                    e.preventDefault();
                                    inputChange(e);
                                }}
                                placeholder={label.services.add.description}
                                type="text"
                                name="description"
                                value={formData.description}
                                rows="3"
                            ></textarea>
                            {/* <span>{formErrors.description}</span> */}
                        </div>
                        <div className="required field">
                            <label> {label.services.add.serviceTag}</label>
                            {formData.tags && formData.tags.map((tag, i) => {
                                return (
                                    <div className="chipX transition visible ui label" key={i}>
                                        <span>{tag.name}</span>
                                        <span className="prodtg-close" onClick={i => removeTag(i)}>&nbsp;<i className="close icon"></i></span>
                                    </div>
                                );
                            })}

                            <Select
                                options={tagsList}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                name="tags"
                                value=""
                                onChange={e => {
                                    tagsHandler(e)
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                        </div>
                    </div>
                </div >
            </form >
            <div className='mt-3 d-flex justify-content-between'>
                <div className='col-auto'>
                    <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); if(props.onClose){props.onClose() }}}> Cancel </button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); submitHandler(formData, proceduralCodesList, diagnosisCodesList) }}> {isEdit ? label.services.edit.save : label.services.add.save}</button>
                </div>
            </div>
        </div >
    )
}

export default ServicesForm