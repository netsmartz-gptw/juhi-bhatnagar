// Nodes
import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import InputMask from "react-input-mask";
import moment from "moment";

// Constants
import label from "../../../../../../assets/i18n/en.json";
import States from "../../../../../common/constants/states.constant";

// Templates
import AccordionTemplate from "../../../../templates/components/AccordionTemplate";

// Services
import StorageService from "../../../../../services/session/storage.service";
import StorageType from "../../../../../services/session/storage.enum";
import PracticePatientService from '../../../../../services/api/patient-type.service'
import { store } from '../../../../../context/StateProvider'
import FormValidatorService from "../../../../../services/validator/form-validator.service";
import PatientFormConfig from "./patient-form-config";
import toast from "react-hot-toast";
import Utilities from "../../../../../services/commonservice/utilities";


const PatientForm = (props) => {
  const globalStateAndDispatch = useContext(store)
  const contextState = globalStateAndDispatch.state
  //Form Variables
  // Other Variables

  const required = ['firstName', 'lastName', 'dob', 'email', 'patientTypeId']

  const { submitLabel, submitHandler, initialData } = props;
  const [formData, setFormData] = useState(initialData);
  const [ssnShowEye, setSsnShowEye] = useState(false);
  const [errors, setErrors] = useState({})


  const [isLoader_EditPatient, setIsLoader_EditPatient] = useState(false);

  const [isOptIn, setIsOptIn] = useState(props.initialData.isOptIn);
  const [patientTypes, setPatientTypes] = useState([])


  // Loaders
  const getLoggedInData = () => {
    return JSON.parse(StorageService.get(StorageType.session, "userDetails"));
  };

  const handleIsOptIn = () => {
    setIsOptIn(!isOptIn);
  };

  const handleClearForm = () => {
    setFormData({ firstName: '', lastName: '', ssn: '', email: '', phone: '', address: { addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: '' } });
  };

  // mount onInit
  useEffect(() => {
    // onInit();
    // insuranceLookup();
    patientTypeLookup();
  }, []);


  const patientTypeLookup = () => {
    PracticePatientService.practicePatientLookup(contextState.practiceLocationId)
      .then((response) => {
        console.log("######", response.data.selectResponse);
        setPatientTypes(response.data.selectResponse)
      })
      .catch(error => {
        console.log(error)
      })
  }


  // function for input change
  const inputChange = (e) => {
    let newStateObject = { ...formData };
    newStateObject[e.target.name] = e.target.value;
    console.log(newStateObject);
    setErrors(FormValidatorService.setErrors(e, errors, PatientFormConfig.config))
    return setFormData(newStateObject);
  };

  // function for address change
  const addressChange = (e) => {
    let newStateObject = { ...formData };
    newStateObject.address[e.target.name] = e.target.value;
    setErrors(FormValidatorService.setErrors(e, errors, PatientFormConfig.config))
    return setFormData(newStateObject);
  };
  
  useEffect(() => {
    if (formData.secondaryIns) {
      let newStateObject = { ...formData };
      newStateObject.insuranceDetails.push({ address: {} });
      return setFormData(newStateObject);
    }
  }, [formData.secondaryIns]);

  useEffect(() => {
    if (props.initialData) {
      let initialData= props.initialData
      initialData.dob = Utilities.toDate(moment.utc(props.initialData.dob))
      setFormData(initialData)
    }
  }, [props.initialData])

  return (
    <div className="ui">
      {isLoader_EditPatient && (
        <div className="ui active dimmer">
          <div className="ui indeterminate text loader">{label.common.loading}</div>
        </div>
      )}
      {!isLoader_EditPatient && (
        <AccordionTemplate id="patientForm" accordionId="patientForm">
          {/* Basic Details Form Portion */}
          {/* Todo: add masking, error messages, and address validation */}
          <div title={label.patient.add.basicDetails.toString()}>
            <div className=" row d-flex align-items-start">
              <div className="col-md-6 col-12 required field">
                <label> {label.patient.add.firstName}</label>
                <input
                  placeholder="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => {
                    e.preventDefault();
                    inputChange(e);
                  }}
                  required
                />
                <span className="error-message">{errors.firstName}</span>
              </div>

              <div className="col-md-6 col-12 required field">
                <label> {label.patient.add.lastName}</label>
                <input
                  placeholder="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => {
                    e.preventDefault();
                    inputChange(e);
                  }}
                  required
                />
                <span className="error-message">{errors.lastName}</span>
              </div>
              {/* Validate birthday input vales */}
              <div className="col-md-6 col-12 required field">
                <label>{label.patient.add.dob}</label>
                <div className="ui">
                  <input
                    onChange={(e) => {
                      e.preventDefault();
                      inputChange(e);
                    }}
                    placeholder="MM/DD/YYYY"
                    type="date"
                    // pattern="\d{4}-\d{2}-\d{2}"
                    min="1900-01-01"
                    max={moment().format("YYYY-MM-DD")}
                    name="dob"
                    value={formData.dob}
                    required
                  />
                </div>
                <span className="error-message">{errors.dob}</span>
              </div>

              {/* Have masked with stars */}
              <div className="col-md-6 col-12 field">
                <label> {label.patient.add.ssn}</label>
                <div className="ui right icon input w-100">
                  <input
                    placeholder="SSN"
                    type={ssnShowEye ? "text" : "password"}
                    // type="text"
                    alwaysShowMask={false}
                    // maskChar="*"
                    className="form-control"
                    name="ssn"
                    minLength="9"
                    maxLength="9"
                    unmask={true}
                    value={formData.ssn}
                    onChange={(e) => {
                      e.preventDefault();
                      inputChange(e);
                    }}
                  />
                  <a className="ui icon view-pw">
                    <i
                      className={
                        ssnShowEye
                          ? "eye icon text-decoration-none"
                          : "low vision icon text-decoration-none"
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        ssnShowEye ? setSsnShowEye(false) : setSsnShowEye(true);
                      }}
                    ></i>
                  </a>
                </div>
                <span className="error-message">{errors.ssn}</span>
              </div>
              <div className="col-md-6 col-12 required field">
                <label> {label.patient.add.phone}</label>
                <InputMask
                  placeholder="Phone"
                  type="text"
                  name="phone"
                  mask="(999) 999-9999"
                  unmask={true}
                  onUnmask
                  value={formData.phone}
                  onChange={(e) => {
                    e.preventDefault();
                    inputChange(e);
                  }}
                  editable
                />
                <span className="error-message">{errors.phone}</span>
              </div>
              <div
                className="col-md-6 col-12 required field"
              >
                <label> {label.patient.add.email}</label>
                <input
                  placeholder="yourEmail@email.com"
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => {
                    e.preventDefault();
                    inputChange(e);
                  }}
                />
                <span className="error-message">{errors.email}</span>
              </div>
              <div className="col-md-6 col-12">
                <div className="field">
                  <label>Text Messaged Notifications</label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="isOptIn"
                      checked={isOptIn}
                      disabled
                      onInputCapture={(e) => {
                        handleIsOptIn(e.target.checked);
                        inputChange({
                          target: {
                            value: !isOptIn,
                            name: "isOptIn",
                          },
                        });
                      }}
                    />
                    <label className="form-check-label">
                      {isOptIn ? 'Opted-In to' : 'Opted-Out of'} text messages
                    </label>
                  </div>
                </div>
              </div>
              <div
                className="col-md-6 col-12 field"
              >
                <label> {label.patient.add.patientType}</label>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={patientTypes}
                  name="patientTypeId"
                  value={patientTypes && patientTypes.find(obj => obj.practicePatientTypeId === formData.patientTypeId)}
                  onChange={e => {
                    inputChange({
                      target:
                        { value: e.practicePatientTypeId, name: 'patientTypeId' }
                    })
                  }}
                  getOptionLabel={(option) => option.patientType}
                  getOptionValue={(option) => option.practicePatientTypeId}
                />
                <span className="error-message">{errors?.pracitcePatientTypeId}</span>
              </div>

              {formData.isOptIn === "false" && (
                <span style={{ color: "red" }}>
                  * If opted out of text notifications, email address is
                  required.
                </span>
              )}
            </div>
          </div>
          {/* Address Details Form Portion */}
          <div title={label.patient.add.addressDetails.toString()}>
            <div className="row d-flex">
              <div className="field">
                <label> {label.patient.add.addressLine1}</label>
                <input
                  placeholder="Address Line 1"
                  type="text"
                  name="addressLine1"
                  value={formData.address?.addressLine1}
                  onChange={(e) => {
                    e.preventDefault();
                    addressChange(e);
                  }}
                />
                <span className="error-message">{errors.addressLine1}</span>
              </div>
              <div className="field">
                <label> {label.patient.add.addressLine2}</label>
                <input
                  placeholder="Address Line 2"
                  type="text"
                  name="addressLine2"
                  value={formData.address?.addressLine2}
                  onChange={(e) => {
                    e.preventDefault();
                    addressChange(e);
                  }}
                />
                <span className="error-message">{errors.addressLine2}</span>
              </div>
              <div className="field col-12">
                <label> {label.patient.add.city}</label>
                <input
                  placeholder="City"
                  type="text"
                  name="city"
                  value={formData.address?.city}
                  onChange={(e) => {
                    e.preventDefault();
                    addressChange(e);
                  }}
                />
                {/* // <span>{addPatientFormErrors.City}</span> */}
              </div>
              <div className="field col-md-4 col-12">
                <label> {label.patient.add.country}</label>
                {/* <Select
                    className="selection"
                    options={Countries}
                    name="country"
                    value="USA"
                    onChange={(e) => {
                      addressChange({
                        target: {
                          value: e.countryId,
                          name: "country",
                        },
                      });
                    }}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.countryId}
                    disable
                  ></Select> */}
                <input
                  name="country"
                  placeholder="USA"
                  type="text"
                  value="USA"
                  disable
                />
                {/* // <span>{addPatientFormErrors.Country}</span> */}
              </div>
              <div className="field col-md-4 col-12">
                <label>{label.patient.add.state}</label>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={
                    formData.address?.country === "CANADA"
                      ? States[2]
                      : States[1]
                  }
                  name="state"
                  value={
                    formData.address?.country === "CANADA"
                      ? States[2].find(
                        (obj) =>
                          obj.abbreviation === formData.address?.state
                      )
                      : States[1].find(
                        (obj) =>
                          obj.abbreviation === formData.address?.state
                      )
                  }
                  onChange={(e) => {
                    addressChange({
                      target: {
                        value: e.abbreviation,
                        name: "state",
                      },
                    });
                  }}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.abbreviation}
                />
                <span className="error-message">{errors.state}</span>
              </div>
              <div className="field col-md-4 col-12">
                <label> {label.patient.add.postalCode}</label>
                <input
                  placeholder="Postal Code"
                  type="text"
                  name="postalCode"
                  value={formData.address?.postalCode}
                  onChange={(e) => {
                    e.preventDefault();
                    addressChange(e);
                  }}
                />
                <span className="error-message">{errors.postalCode}</span>
              </div>
            </div>
          </div>
          {/* Insurance Details Form Portion */}
          {/* <div title={label.patient.add.insuranceDetails.toString()}>
            <div className="">
              <div className="required field">
                <label for="HasInsurance">
                  {label.patient.add.hasInsurance}
                </label>
                <div className="fields ms-2 my-3">
                  <div className="ui radio checkbox">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="isInsured"
                      value={formData.isInsured}
                      onInputCapture={(e) => {
                        e.preventDefault();
                        inputChange({
                          target: {
                            value: true,
                            name: "isInsured",
                          },
                        });
                        setStateOfFirstInsurance(true);
                      }}
                    />
                    <label className="form-check-label">
                      {label.patient.add.yes}
                    </label>
                  </div>
                  <div className="ui radio checkbox ms-5">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="isInsured"
                      value={!formData.isInsured}
                      onInputCapture={(e) => {
                        e.preventDefault();
                        setStateOfFirstInsurance(false);
                        inputChange({
                          target: {
                            value: false,
                            name: "isInsured",
                          },
                        });
                      }}
                    />
                    <label className="form-check-label">
                      {label.patient.add.no}
                    </label>
                  </div>
                </div>
                
              </div>

              {
                (stateOfFirstInsurance,
                formData.insuranceDetails && (
                  <div>
                    <TabsTemplate style="pills">
                      <div title="Primary Insurance">
                        <div
                          className="tab-pane fade show active ui bottom attached"
                          id="primary"
                          role="tabpanel"
                          aria-labelledby="primary-tab"
                        >
                          <div className="two fields">
                            <div className="required field">
                              <label>
                                {label.patient.add.insurancePartner}
                              </label>
                              <Select
                                className="selection"
                                options={insurancePartnerList}
                                name="insurancePartnerId"
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                searchable={true}
                                value={
                                  formData.insuranceDetails &&
                                  insurancePartnerList.find(
                                    (obj) =>
                                      obj.id ===
                                      formData?.insuranceDetails[0]
                                        ?.insurancePartnerId
                                  )
                                }
                                onChange={(e) =>
                                  insuranceDetailsChange({
                                    target: {
                                      value: e.id,
                                      name: "insurancePartnerId",
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="required field">
                              <label>{label.patient.add.policyNo}</label>
                              <input
                                type="text"
                                placeholder={label.patient.add.policyNo}
                                name="policyNo"
                                value={formData?.insuranceDetails[0]?.policyNo}
                                onChange={(e) => {
                                  e.preventDefault();
                                  insuranceDetailsChange(e);
                                }}
                              />
                            </div>
                          </div>
                          <div className="two fields">
                            <div className="field">
                              <label>{label.patient.add.groupNo}</label>
                              <input
                                type="text"
                                placeholder={label.patient.add.groupNo}
                                name="groupNo"
                                value={formData?.insuranceDetails[0]?.GroupNo}
                                onChange={(e) => {
                                  e.preventDefault();
                                  insuranceDetailsChange(e);
                                }}
                              />
                            </div>
                            <div className="field">
                              <label>{label.patient.add.binNo}</label>
                              <input
                                type="text"
                                placeholder={label.patient.add.binNo}
                                name="binNo"
                                value={formData?.insuranceDetails[0]?.binNo}
                                onChange={(e) => {
                                  e.preventDefault();
                                  insuranceDetailsChange(e);
                                }}
                              />
                            </div>
                          </div>
                                                    <div className="two fields">
                            <div className="required field">
                              <label>{label.patient.add.relation}</label>
                              <Select
                                options={PatientEnum.RelationEnum}
                                name="relation"
                                getOptionLabel={(option) => option.type}
                                getOptionValue={(option) => option.value}
                                searchable={true}
                                value={PatientEnum.RelationEnum.find(
                                  (obj) => obj.id === formData.relation
                                )}
                                onChange={(e) =>
                                  insuranceDetailsChange({
                                    target: {
                                      value: e.value,
                                      name: "relation",
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="two fields">
                            <div className="required field">
                              <label> {label.patient.add.firstName}</label>
                              <input
                                placeholder="Last Name"
                                type="text"
                                name="firstName"
                                value={formData?.insuranceDetails[0]?.firstName}
                                onChange={(e) => {
                                  e.preventDefault();
                                  insuranceDetailsChange(e);
                                }}
                              />
                            </div>
                            <div className="required field">
                              <label> {label.patient.add.lastName}</label>
                              <input
                                placeholder="First Name"
                                type="text"
                                name="lastName"
                                value={formData?.insuranceDetails[0]?.lastName}
                                onChange={(e) => {
                                  e.preventDefault();
                                  insuranceDetailsChange(e);
                                }}
                              />
                            </div>
                          </div>
                          <div className="two fields">
                            <div className="required field">
                              <label> {label.patient.add.phone}</label>
                              <input
                                placeholder="Phone"
                                type="text"
                                mask="000-000-0000"
                                unmask={true}
                                validation="false"
                                name="phone"
                                value={formData?.insuranceDetails[0]?.phone}
                                onChange={(e) => {
                                  e.preventDefault();
                                  insuranceDetailsChange(e);
                                }}
                              />
                            </div>
                            <div className="field">
                              <label> {label.patient.add.email}</label>
                              <input
                                placeholder="Email"
                                type="text"
                                name="email"
                                value={formData?.insuranceDetails[0]?.email}
                                onChange={(e) => {
                                  e.preventDefault();
                                  insuranceDetailsChange(e);
                                }}
                              />
                            </div>
                          </div>
                          <div className="field ui checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="sameAsPatientAddress"
                              value={
                                formData?.insuranceDetails[0]
                                  ?.samePatientAddress === "true"
                                  ? true
                                  : false
                              }
                              onInputCapture={(e) => {
                                let newData = e;
                                newData.target.value = newData.target.checked;
                                console.log(e);
                                e.preventDefault();
                                insuranceDetailsChange(newData);
                                setSameAddress(true); 
                              }}
                            />
                            <label className="form-check-label">
                              {label.patient.add.sameAsInsurerAddress}
                            </label>
                          </div>
                          <div className="field">
                            <label>{label.patient.add.addressLine1}</label>
                            <input
                              placeholder="Address Line 1"
                              type="text"
                              name="insureAddressLine1"
                              value={
                                formData?.insuranceDetails[0]
                                  ?.insureAddressLine1
                              }
                              onChange={(e) => {
                                e.preventDefault();
                                insuranceAddressDetailsChange(e);
                              }}
                              disabled={
                                formData?.insuranceDetails[0]
                                  ?.sameAsPatientAddress === "true"
                                  ? true
                                  : null
                              }
                            />
                          </div>
                          <div className="field">
                            <label>{label.patient.add.addressLine2}</label>
                            <input
                              placeholder="Address Line 2"
                              type="text"
                              name="insureAddressLine2"
                              value={
                                formData?.insuranceDetails[0]
                                  ?.insureAddressLine2
                              }
                              onChange={(e) => {
                                e.preventDefault();
                                insuranceAddressDetailsChange(e);
                              }}
                              disabled={
                                formData?.insuranceDetails[0]
                                  ?.sameAsPatientAddress === "true"
                                  ? true
                                  : null
                              }
                            />
                          </div>
                          <div className="two fields">
                            <div className="field">
                              <label>{label.patient.add.city}</label>
                              <input
                                placeholder="City"
                                type="text"
                                name="insureCity"
                                value={
                                  formData?.insuranceDetails[0]?.insureCity
                                }
                                onChange={(e) => {
                                  e.preventDefault();
                                  insuranceAddressDetailsChange(e);
                                }}
                                disabled={
                                  formData?.insuranceDetails[0]
                                    ?.sameAsPatientAddress === "true"
                                    ? true
                                    : null
                                }
                              />
                            </div>
                            <div className="field">
                              <label>{label.patient.add.country}</label>
                              <Select
                                options={Countries}
                                name="country"
                                value={Countries.find(
                                  (obj) =>
                                    obj.name ===
                                    formData?.insuranceDetails[0]?.insureCountry
                                )}
                                onChange={(e) => {
                                  insuranceAddressDetailsChange({
                                    target: {
                                      value: e.name,
                                      name: "insureCountry",
                                    },
                                  });
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.countryId}
                                disabled={
                                  formData?.insuranceDetails[0]
                                    ?.sameAsPatientAddress === "true"
                                    ? true
                                    : null
                                }
                              >
                                <div className="ui icon search input">
                                  <i className="search icon"></i>
                                </div>
                                <div className="divider"></div>
                              </Select>
                            </div>
                          </div>
                          <div className="two fields">
                            <div className="field">
                              <label>{label.patient.add.state}</label>
                              <Select
                                className="selection"
                                options={
                                  formData?.insuranceDetails[0]
                                    ?.insureCountry === "CANADA"
                                    ? States[2]
                                    : States[1]
                                }
                                name="insureState"
                                value={
                                  formData?.insuranceDetails[0]
                                    ?.insureCountry === "CANADA"
                                    ? States[2].find(
                                        (obj) =>
                                          obj.abbreviation ===
                                          formData?.insuranceDetails[0]
                                            ?.insureState
                                      )
                                    : States[1].find(
                                        (obj) =>
                                          obj.abbreviation ===
                                          formData?.insuranceDetails[0]
                                            ?.insureState
                                      )
                                }
                                onChange={(e) => {
                                  insuranceAddressDetailsChange({
                                    target: {
                                      value: e.abbreviation,
                                      name: "state",
                                    },
                                  });
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.abbreviation}
                                disabled={
                                  formData?.insuranceDetails[0]
                                    ?.sameAsPatientAddress === "true"
                                    ? true
                                    : null
                                }
                              >
                                <div className="ui icon search input">
                                  <i className="search icon"></i>
                                </div>
                                <div className="divider"></div>
                              </Select>
                            </div>
                            <div className="field">
                              <label> {label.patient.add.postalCode}</label>
                              <input
                                placeholder="Postal (Zip) Code"
                                mask="00000-0000"
                                unmask={true}
                                validation="false"
                                type="text"
                                name="insurePostalCode"
                                value={
                                  formData?.insuranceDetails[0]
                                    ?.insurePostalCode
                                }
                                onChange={(e) => {
                                  e.preventDefault();
                                  insuranceAddressDetailsChange(e);
                                }}
                                disabled={
                                  formData?.insuranceDetails[0]
                                    ?.sameAsPatientAddress === "true"
                                    ? true
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="required field">
                            <label for="SecondInsurance">
                              {label.patient.add.secondInsurance}
                            </label>
                            <div className="inline fields ms-2 my-3">
                              <div className="ui radio checkbox">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="secondInsurance"
                                  value="1"
                                  onInputCapture={(e) => {
                                    e.preventDefault();
                                    setStateOfSecondInsurance(true);
                                    inputChange({
                                      target: {
                                        value: true,
                                        name: "secondInsurance",
                                      },
                                    });
                                  }}
                                />
                                <label className="form-check-label">
                                  {label.patient.add.yes}
                                </label>
                              </div>
                              <div className="ui radio checkbox ms-3">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="secondInsurance"
                                  value="0"
                                  onInputCapture={(e) => {
                                    e.preventDefault();
                                    setStateOfSecondInsurance(false);
                                    inputChange({
                                      target: {
                                        value: false,
                                        name: "secondInsurance",
                                      },
                                    });
                                  }}
                                />
                                <label className="form-check-label">
                                  {label.patient.add.no}
                                </label>
                              </div>
                            </div>
                          </div>

                          {
                            (stateOfSecondInsurance,
                            formData.secondInsurance && (
                              <div title="Primary Insurance">
                                <div
                                  className="tab-pane fade show active ui bottom attached"
                                  id="secondary"
                                  role="tabpanel"
                                  aria-labelledby="secondary-tab"
                                >
                                  <div className="two fields">
                                    <div className="required field">
                                      <label>
                                        {label.patient.add.insurancePartner}
                                      </label>
                                      <Select
                                        className="selection"
                                        options={insurancePartnerList}
                                        name="insurancePartnerId"
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        searchable={true}
                                        value={insurancePartnerList.find(
                                          (obj) =>
                                            obj.id ===
                                            formData.insuranceDetails[1]
                                              ?.insurancePartnerId
                                        )}
                                        onChange={(e) =>
                                          insuranceDetails2Change({
                                            target: {
                                              value: e.id,
                                              name: "insurancePartner",
                                            },
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="required field">
                                      <label>
                                        {" "}
                                        {label.patient.add.policyNo}
                                      </label>
                                      <input
                                        type="text"
                                        placeholder={label.patient.add.policyNo}
                                        name="policyNo"
                                        value={
                                          formData?.insuranceDetails[1]
                                            ?.policyNo
                                        }
                                        onInputCapture={(e) => {
                                          e.preventDefault();
                                          insuranceDetails2Change(e);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="two fields">
                                    <div className="field">
                                      <label>{label.patient.add.groupNo}</label>
                                      <input
                                        type="text"
                                        placeholder={label.patient.add.groupNo}
                                        name="groupNo2"
                                        value={
                                          formData?.insuranceDetails[1]
                                            ?.groupNo2
                                        }
                                        onInputCapture={(e) => {
                                          e.preventDefault();
                                          insuranceDetails2Change(e);
                                        }}
                                      />
                                    </div>
                                    <div className="field">
                                      <label>{label.patient.add.binNo}</label>
                                      <input
                                        type="text"
                                        placeholder="Bin No"
                                        name="binNo2"
                                        value={
                                          formData?.insuranceDetails[1]?.binNo2
                                        }
                                        onInputCapture={(e) => {
                                          e.preventDefault();
                                          insuranceDetails2Change(e);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="two fields">
                                    <div className="required field">
                                      <label>
                                        {label.patient.add.relation}
                                      </label>
                                      <Select
                                        options={PatientEnum.RelationEnum}
                                        name="relation"
                                        getOptionLabel={(option) => option.type}
                                        getOptionValue={(option) =>
                                          option.value
                                        }
                                        searchable={true}
                                        value={PatientEnum.RelationEnum.find(
                                          (obj) =>
                                            obj.type ===
                                            formData?.insuranceDetails[1]
                                              ?.relation
                                        )}
                                        onChange={(e) =>
                                          insuranceDetails2Change({
                                            target: {
                                              value: e.value,
                                              name: "relation",
                                            },
                                          })
                                        }
                                      ></Select>
                                    </div>
                                  </div>
                                  <div className="two fields">
                                    {formData.Relation2 == 0 && (
                                      <div className="required field">
                                        <label>
                                          {" "}
                                          {label.patient.add.firstName}
                                        </label>
                                        <input
                                          placeholder="Subscriber First Name"
                                          type="text"
                                          name="firstName"
                                          value={
                                            formData?.insuranceDetails[1]
                                              ?.firstName
                                          }
                                          onChange={(e) => {
                                            e.preventDefault();
                                            insuranceDetails2Change(e);
                                          }}
                                        />
                                      </div>
                                    )}
                                    {formData.Relation2 != 0 && (
                                      <div className="required field">
                                        <label>
                                          {
                                            label.patient.add
                                              .subscriberFirstName
                                          }
                                        </label>
                                        <input
                                          placeholder="Subscriber First Name"
                                          type="text"
                                          name="firstName"
                                          value={
                                            formData?.insuranceDetails[1]
                                              ?.firstName
                                          }
                                          onChange={(e) => {
                                            e.preventDefault();
                                            insuranceDetails2Change(e);
                                          }}
                                        />
                                      </div>
                                    )}
                                    {formData.Relation2 == 0 && (
                                      <div className="required field">
                                        <label>
                                          {" "}
                                          {label.patient.add.lastName}
                                        </label>
                                        <input
                                          placeholder="Subscriber Last Name"
                                          type="text"
                                          name="lastName"
                                          value={
                                            formData?.insuranceDetails[1]
                                              ?.lastName
                                          }
                                          onChange={(e) => {
                                            e.preventDefault();
                                            insuranceDetails2Change(e);
                                          }}
                                        />
                                      </div>
                                    )}
                                    {formData.Relation2 != 0 && (
                                      <div className="required field">
                                        <label>
                                          {label.patient.add.subscriberLastName}
                                        </label>
                                        <input
                                          placeholder="Subscriber Last Name"
                                          type="text"
                                          name="lastName"
                                          value={
                                            formData?.insuranceDetails[1]
                                              ?.lastName
                                          }
                                          onChange={(e) => {
                                            e.preventDefault();
                                            insuranceDetails2Change(e);
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="two fields">
                                    <div className="required field">
                                      <label> {label.patient.add.phone}</label>
                                      <input
                                        placeholder="Phone"
                                        type="text"
                                        name="phone"
                                        mask="000-000-0000"
                                        unmask={true}
                                        value={
                                          formData?.insuranceDetails[1]?.phone
                                        }
                                        validation="false"
                                        onChange={(e) => {
                                          e.preventDefault();
                                          insuranceDetails2Change(e);
                                        }}
                                      />
                                    </div>
                                    <div className="field">
                                      <label> {label.patient.add.email}</label>
                                      <input
                                        placeholder="Email"
                                        type="text"
                                        name="insureEmail2"
                                        value={
                                          formData?.insuranceDetails[1]
                                            ?.insureEmail2
                                        }
                                        onInputCapture={(e) => {
                                          e.preventDefault();
                                          insuranceDetails2Change(e);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="field ui checkbox">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="sameAsPatientAddress2"
                                      value={
                                        formData?.insuranceDetails[1]
                                          ?.samePatientAddress2 === "true"
                                          ? true
                                          : false
                                      }
                                      onInputCapture={(e) => {
                                        let newData = e;
                                        newData.target.value =
                                          newData.target.checked;
                                        console.log(e);
                                        e.preventDefault();
                                        insuranceDetails2Change(newData);
                                        setSameAddress2(true);
                                      }}
                                    />
                                    <label className="form-check-label">
                                      {label.patient.add.sameAsInsurerAddress}
                                    </label>
                                  </div>
                                  <div className="field">
                                    <label>
                                      {label.patient.add.addressLine1}
                                    </label>
                                    <input
                                      placeholder="Address Line 1"
                                      type="text"
                                      name="secInsureAddressLine1"
                                      value={
                                        formData?.insuranceDetails[1]
                                          ?.secInsureAddressLine1
                                      }
                                      onChange={(e) => {
                                        e.preventDefault();
                                        insuranceAddressDetails2Change(e);
                                      }}
                                      disabled={
                                        formData?.insuranceDetails[1]
                                          ?.sameAsPatientAddress2 === "true"
                                          ? true
                                          : null
                                      }
                                    />
                                  </div>
                                  <div className="field">
                                    <label>
                                      {label.patient.add.addressLine2}
                                    </label>
                                    <input
                                      placeholder="Address Line 2"
                                      type="text"
                                      name="secInsureAddressLine2"
                                      value={
                                        formData?.insuranceDetails[1]
                                          ?.secInsureAddressLine2
                                      }
                                      onChange={(e) => {
                                        e.preventDefault();
                                        insuranceAddressDetails2Change(e);
                                      }}
                                      disabled={
                                        formData?.insuranceDetails[1]
                                          ?.sameAsPatientAddress2 === "true"
                                          ? true
                                          : null
                                      }
                                    />
                                  </div>
                                  <div className="two fields">
                                    <div className="field">
                                      <label>{label.patient.add.city}</label>
                                      <input
                                        placeholder="City"
                                        type="text"
                                        name="insureCity2"
                                        value={
                                          formData?.insuranceDetails[1]
                                            ?.insureCity2
                                        }
                                        onChange={(e) => {
                                          e.preventDefault();
                                          insuranceAddressDetails2Change(e);
                                        }}
                                        disabled={
                                          formData?.insuranceDetails[1]
                                            ?.sameAsPatientAddress2
                                            ? true
                                            : null
                                        }
                                      />
                                    </div>
                                    <div className="field">
                                      <label>{label.patient.add.country}</label>
                                      <Select
                                        className="selection"
                                        options={Countries}
                                        name="insureCountry2"
                                        value={Countries.find(
                                          (obj) =>
                                            obj.name ===
                                            formData?.insuranceDetails[1]
                                              ?.insureCountry
                                        )}
                                        onChange={(e) => {
                                          insuranceAddressDetails2Change({
                                            target: {
                                              value: e.name,
                                              name: "insureCountry",
                                            },
                                          });
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) =>
                                          option.countryId
                                        }
                                        InsureCountry2
                                        disabled={
                                          formData?.insuranceDetails[1]
                                            ?.sameAsPatientAddress2
                                            ? true
                                            : null
                                        }
                                      >
                                        <div className="ui icon search input">
                                          <i className="search icon"></i>
                                        </div>
                                        <div className="divider"></div>
                                      </Select>{" "}
                                    </div>
                                  </div>
                                  <div className="two fields">
                                    <div className="field">
                                      <label>{label.patient.add.state}</label>
                                      <Select
                                        className="selection"
                                        options={
                                          formData?.insuranceDetails[1]
                                            ?.insureCountry === "CANADA"
                                            ? States[2]
                                            : States[1]
                                        }
                                        name="insureState2"
                                        value={
                                          formData?.insuranceDetails[1]
                                            ?.insureCountry === "CANADA"
                                            ? States[2].find(
                                                (obj) =>
                                                  obj.abbreviation ===
                                                  formData?.insuranceDetails[1]
                                                    ?.insureState2
                                              )
                                            : States[1].find(
                                                (obj) =>
                                                  obj.abbreviation ===
                                                  formData?.insuranceDetails[1]
                                                    ?.insureState2
                                              )
                                        }
                                        onChange={(e) => {
                                          insuranceDetails2Change({
                                            target: {
                                              value: e.abbreviation,
                                              name: "state",
                                            },
                                          });
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) =>
                                          option.abbreviation
                                        }
                                        onChange={(e) => {
                                          // e.preventDefault();
                                        }}
                                        disabled={
                                          formData?.insuranceDetails[1]
                                            ?.sameAsPatientAddress2 === "true"
                                            ? true
                                            : null
                                        }
                                      />
                                      <div className="ui icon search input">
                                        <i className="search icon"></i>
                                      </div>
                                      <div className="divider"></div>{" "}
                                    </div>
                                    <div className="field">
                                      <label>
                                        {" "}
                                        {label.patient.add.postalCode}
                                      </label>
                                      <input
                                        placeholder="Postal (Zip) Code"
                                        type="text"
                                        mask="00000-0000"
                                        unmask={true}
                                        validation="false"
                                        name="insurePostalCode2"
                                        value={
                                          formData?.insuranceDetails[1]
                                            ?.insurePostalCode2
                                        }
                                        onChange={(e) => {
                                          e.preventDefault();
                                          insuranceDetails2Change(e);
                                        }}
                                        disabled={
                                          formData?.insuranceDetails[1]
                                            ?.sameAsPatientAddress2 === "true"
                                            ? true
                                            : null
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </TabsTemplate>
                  </div>
                ))
              }
            </div>
          </div> */}
        </AccordionTemplate>
      )}
      <div className="mt-3 row d-flex justify-content-between">
        <div className="col-auto">
          {props.isModal && <button
            className="btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              if (props.onClose()) {
                props.onClose();
              }
            }}
          >
            Close
          </button>}
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              if (!FormValidatorService.checkForm(errors, formData, required)) {
                toast.error("Please make sure the form is complete")
              }
              else {
                props.submitHandler(formData);
              }
              // validateEmail(e)
            }}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PatientForm;
