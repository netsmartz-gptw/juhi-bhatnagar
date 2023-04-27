import React, { useState, useEffect } from "react";
import Dashboard from "../../../templates/layouts/Dashboard";
import moment from "moment";
import Utilities from "../../../../services/commonservice/utilities";
import NotificationService from "../../../../services/api/notification.service";

const Notifications = (props) => {
  const [notifications, setNotifications] = useState();

  const getNotifications = () => {
    let reqObj = {
      IsPublicFormSubmission: true,
      SortField: "createdDate",
      Asc: false,
      IsNotified: false,
      StartRow: 0,
    };
    NotificationService.allNotifications(reqObj)
      .then((res) => {
        console.log(res);
        setNotifications(res);
      })
      .catch((err) => console.log(err));
  };

  //    note.id, note
  const dismissNotification = (id, obj) => {
    let reqObj = obj
    reqObj.isNotified = true
    reqObj.isPublicFormSubmission = true
    reqObj.submittedByUserType = 1
    delete reqObj.submittedBy
    delete reqObj.submittedByParentId
    NotificationService.dismiss(id, reqObj)
      .then(res => { console.log(res); return getNotifications() })
      .catch(err => { console.log(err) })
    //  const removeNotification=[...notifications.filter(note => note.id !== id)]
    //  setNotifications(removeNotification)
    //  console.log(notifications + " new set of notifications")
  };

  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <Dashboard
      title={
        <div className="row justify-content-center align-items-center">
          Alerts
          <span className="badge pill bg-primary ms-3">
            {notifications && notifications.length}
          </span>
        </div>
      }
    >
      <div className="container-fluid d-flex row column-flex g-3">
        {notifications &&
          notifications.map((note, i) => {
            return (
              <div className="col-4">
                <div>
                  <div className="ui segment h-100 h-100">
                    <div className="accordion-style-header text-center">
                      <h5 className="p-3 text-primary">
                        <strong>{note.submission.data.formTitle}</strong>
                      </h5>
                    </div>
                    <div className="list-group list-group-flush">
                      <div className="list-group-item p-3">
                        <div className="col-12 mb-3">
                          <strong className="me-3">Date</strong>{" "}
                          {moment(new Date()).format("dddd, MMMM, DD YYYY")}
                        </div>
                        <div className="col-12 mb-3">
                          <strong className="me-3">Patient</strong>{" "}
                          {note.submission.data.uqiFname}{" "}
                          {note.submission.data.uqiLname}
                        </div>
                        <div className="col-12 mb-3">
                          <strong>Submitted By</strong> {note.submittedBy}
                        </div>

                        <div className="col-12">
                          <strong className="me-3">Phone</strong>
                          {Utilities.toPhoneNumber(
                            note.submission.data.uqiPhone
                          )}
                        </div>
                      </div>
                      <span className="accordion-style-header py-3 text-end px-3 align-self-end">
                        <button className="btn btn-primary ms-3">
                          <i
                            className="icon x"
                            title="dismiss"

                            onClick={(e) => {
                              e.preventDefault();
                              dismissNotification(note.id, note);
                              console.log("clicked" + " note.id + " + note.id + " note " + note)
                            }}
                          />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Dashboard>
  );
};
export default Notifications;
