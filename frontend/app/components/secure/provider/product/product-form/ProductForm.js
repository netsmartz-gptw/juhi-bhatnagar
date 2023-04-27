import InputMask from 'react-input-mask';
import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import label from '../../../../../../assets/i18n/en.json'
import ProductService from '../../../../../services/api/product.service'

const ProductForm = (props) => {
    // Pull properties form parent
    const { initialData, messages, isEdit, submitHandler, loaded, exitHandler } = props;
    // Set states for form
    const [isLoader, setIsLoader] = useState(false)
    const [formData, setFormData] = useState(props.initialData || {})
    const [tagsList, setTagsList] = useState([])
    const [formErrors, setFormErrors] = useState(messages.errors)
    const [practiceLocation, setPracticeLocation] = useState([])

    useEffect(() => {
        setIsLoader(true);
        ProductService.getAllLookupTags()
            .then((response) => {
                console.log(response)
                setTagsList(response.data);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
            })
    }, [])

    useEffect(() => {
        setIsLoader(true);
        ProductService.practiceLocationLookup()
            .then((response) => {
                setPracticeLocation(response);
                setIsLoader(false);
            })
            .catch(error => {
                setIsLoader(false);
            })
    }, [])


    // formula for input change
    const inputChange = (e) => {
        if (e.target.name === 'taxPercent') {
            let newStateObject = { ...formData };
            newStateObject[e.target.name] = parseFloat(e.target.value);
            setFormData(newStateObject);
            return (console.log(formData))
        }
        else {
            let newStateObject = { ...formData };
            newStateObject[e.target.name] = e.target.value;
            setFormData(newStateObject);
            return (console.log(formData))
        }
    };

    const tagsHandler = (e) => {
        let newStateObject = { ...formData };
        if (newStateObject.tags) {
            newStateObject.tags.push({ id: e.id, name: e.name })
        } else {
            newStateObject['tags'] = [{ id: e.id, name: e.name }];
        }
        setFormData(newStateObject);
        return console.log(newStateObject)
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
                <div className="">
                    <div className="">
                        <div className="required field">
                            <label> {label.product.add.name}</label>
                            <input
                                onChange={(e) => {
                                    e.preventDefault();
                                    inputChange(e);
                                }}
                                placeholder="Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                required
                            />
                            {/* <span>{formErrors.name}</span> */}
                        </div>
                        <div className="required field">
                            <label> {label.product.add.quantity}</label>
                            <input
                                onChange={(e) => {
                                    e.preventDefault();
                                    inputChange(e);
                                }}
                                placeholder="0"
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                required
                            />
                            {/* <span>{formErrors.quantity}</span> */}
                        </div>
                        <div className="required field">
                            <label> {label.product.add.unitPrice}</label>
                            <input
                                onChange={(e) => {
                                    e.preventDefault();
                                    inputChange(e);
                                }}
                                placeholder="$0.00"
                                // mask="$9.99"
                                // unmask={true}
                                type="text"
                                name="unitPrice"
                                value={formData.unitPrice}
                            />
                            {/* <span>{formErrors.unitPrice}</span> */}
                        </div>
                        <div className="required field">
                            <label> {label.product.add.taxPercent}</label>
                            <input
                                onChange={(e) => {
                                    e.preventDefault();
                                    inputChange(e);
                                }}
                                // placeholder="6%"
                                // mask="9.99%"
                                // unmask={true}
                                type="number"
                                name="taxPercent"
                                value={formData.taxPercent}
                            />
                            {/* <span>{formErrors.taxPercent}</span> */}
                        </div>
                        <div className="required field">
                            <label> {label.product.add.discount}</label>
                            <input
                                onChange={(e) => {
                                    e.preventDefault();
                                    inputChange(e);
                                }}
                                // placeholder="6%"
                                // mask="9.99%"
                                // unmask={true}
                                type="number"
                                name="discount"
                                value={formData.discount}
                            />
                            {/* <span>{formErrors.taxPercent}</span> */}
                        </div>
                        <div className="required field">
                            <label> {label.product.add.practiceLocation}</label>
                            <Select
                                className="react-select-container"
                                classNamePrefix="react-select"
                                options={practiceLocation}
                                name="practiceLocationId"
                                value={practiceLocation && practiceLocation.find((obj) => obj.practiceLocationId === formData.practiceLocationId)}
                                onChange={(e) => {
                                    inputChange({
                                        target: {
                                            value: e.practiceLocationId,
                                            name: "practiceLocationId",
                                        },
                                    });
                                }}
                                getOptionLabel={(option) => option.practiceLocation}
                                getOptionValue={(option) => option.practiceLocationId}
                            ></Select>
                            {/* <span>{formErrors.practiceLocation}</span> */}
                        </div>
                        <div className="required field">
                            <label> {label.product.add.description}</label>
                            <textarea
                                onChange={(e) => {
                                    e.preventDefault();
                                    inputChange(e);
                                }}
                                placeholder={label.product.add.description}
                                type="text"
                                name="description"
                                value={formData.description}
                                rows="3"
                            ></textarea>
                            {/* <span>{formErrors.description}</span> */}
                        </div>
                        <div className="required field">
                            <label> {label.product.add.productTag}</label>
                            {formData.tags && formData.tags.map((tag, i) => {
                                return (
                                    <div className="chipX transition visible ui label mb-2" key={i}>
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
            <div className="mt-3 d-flex justify-content-between">
                <div className='col-auto'>
                    <button className="btn btn-secondary float-right" onClick={(e) => { e.preventDefault(); props.onClose() }}> Cancel </button>
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); submitHandler(formData) }}> {isEdit ? label.product.edit.save : label.product.add.save}</button>
                </div>
            </div>
        </div >
    )
}

export default ProductForm