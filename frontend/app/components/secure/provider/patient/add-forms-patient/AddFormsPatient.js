import React, { useState, useEffect } from "react";
import PlFormsService from "../../../../../services/api/plforms.service";

const AddFormsPatient = (props) => {
  const { submitHandler, initialData, toggleShowAddForms } = props
  const [formsList, setFormsList] = useState();
  const [forms, setForms] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [mappingId, setMappingId] = useState()


  useEffect(() => {
    pullForms();
  }, []);

  const handleIsSelected = (e) => {
    setIsSelected(!isSelected);
  };

  const inputChange = (e) => {
    let newStateObject = { ...formData };
    newStateObject[e.target.name] = e.target.value;
    console.log(newStateObject);
    return setFormData(newStateObject);
  };

  // useEffect(() => {
  //   if (forms) {
  //     return removeAssigned()
  //   }
  // }, [forms])

  const addForm = (id) => {
    let newArray = []
    if (Array.isArray(forms)) {
      newArray = [...forms]
    }
    else if (forms){
      newArray = [forms]
    }
    if(formsList.find(obj => obj.id === id)!==null){
    newArray.push(formsList.find(obj => obj.id === id))
    }
    setForms(newArray)
  }

  const removeForm = (id) => {
    let newArray = [...forms]
    let index = newArray.indexOf(newArray.find(obj => obj.formId === id))
    newArray.splice(index)
    setForms(newArray)
  }

  const pullPatientForms = () => {
    PlFormsService.getMapFormsWithPatient({ PatientIds: props.patientId })
      .then(res => {
        console.log(res)
        setMappingId(res.data[0]?.id)
        setForms(res.data[0]?.formIds)
      })
  }
  const pullForms = () => {
    let reqObj = { isRegistered: true }
    return PlFormsService.getLookupList(reqObj)
      .then((res) => {
        console.log(res, " forms are here from API2");
        if (
          res.data?.length !== 0 &&
          res.data !== undefined
        ) {
          if (Array.isArray(res.data) === true) {
            setFormsList(res.data)
          } else {
            setFormsList([res.data]);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (props.patientId) {
      pullPatientForms()
    }
  }, [props.patientId])


  // const removeAssigned = () => {
  //   if (formsList) {
  //     let newList = formsList
  //     let patientForms = forms.map(form => {form.formTitle
  //     })
  //     for (let i = 0; i < formsList.length; i++) {
  //       patientForms.includes(formsList[i].formTitle) === true ? toast.success("true") : toast.error("false")
  //       if (patientForms.includes(formsList[i].formTitle) == false) {
  //         delete newList[i]
  //       }
  //     }
  //     return setFormsList(newList)
  //   }
  // }
  return (
    <div className="row d-flex">
      {formsList ? <div className="col-12">
        {/* <div className="card"> */}
          {/* <div className="card-header">Available Forms</div> */}
          <div className="card-body d-flex row">
            {formsList.map((form, idx) => {
              // console.log(forms.includes(form),form)
              return (
                <div className="col-md-6 col-12 form-check d-flex align-items-center" title={forms && forms.find(obj => obj?.formId === form?.id || obj?.id === form?.id)?.status === 1 ? 'Form Already Completed' : 'Add/Remove Form'}>
                  <input
                    type="checkbox"
                    className="form-check-input me-3"
                    name="isSelected"
                    checked={forms && forms.find(obj => obj?.formId === form?.id || obj?.id === form?.id)}
                    disabled={forms && forms.find(obj => obj?.formId === form?.id || obj?.id === form?.id)?.status === 1 ? true : false}
                    onChange={(e) => {
                      handleIsSelected(e.target.checked);
                      if (e.target.checked) {
                        addForm(form?.id)
                      }
                      else {
                        removeForm(form?.id)
                      }
                    }}
                  />
                  <label className="form-check-label">{form.formTitle}</label>
                </div>
              )
            })}
          </div>
        {/* </div> */}
      </div> :
        <div className="ui warning message segment p-3 shadow-sm">
          <span className="">
            <p>No Forms Available at this Time</p>
          </span>
        </div>
      }
      {/* <div className="d-flex row mt-3">
        <div className="col-6">
          <div className="card">
            <div className="card-header">Pending Forms</div>
            <div className="card-body">
              {forms.filter(obj => obj.status == 0).map(form => {
                return (
                  <span className="badge bg-danger text-white me-1">{form.formTitle}</span>
                )
              })}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card">
            <div className="card-header">Completed Forms</div>
            <div className="card-body">
              {forms.filter(obj => obj.status == 1).map(form => {
                return (
                  <span className="badge bg-success text-white me-1">{form.formTitle}</span>
                )
              })}
            </div>
          </div>
        </div>
      </div> */}
      <div className="d-flex justify-content-between mt-3">
        <div className="col-auto">
          <button className="btn btn-secondary float-right" onClick={(e) => { e.preventDefault(); props.onClose() }} >Cancel</button>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault()
              props.submitHandler(forms, mappingId)
            }}
          >Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddFormsPatient;
