import moment from "moment";
import React, { useEffect, useState, useContext } from "react";
import Utilities from "../../../../../services/commonservice/utilities";
import { store } from "../../../../../context/StateProvider";
import ReportService from "../../../../../services/api/report.service";
import DoctorService from "../../../../../services/api/doctor.service";
import Select from "react-select";
import Module from "../../../../templates/components/Module";
import Table from "../../../../templates/components/Table";

const EmployeeSalesTotal = (props) => {
  const [tickets, setTickets] = useState();
  const [startDate, setStartDate] = useState(Utilities.toDate(moment().startOf("D")));
  const [endDate, setEndDate] = useState(Utilities.toDate(moment().add(1, "d").startOf("D")));
  const [providerId, setProviderId] = useState();
  const [providerList, setProviderList] = useState();
  const stateAndDispatch = useContext(store);
  const [timePeriod, setTimePeriod] = useState("day")
  const [isLoader, setIsLoader] = useState(false)

  const state = stateAndDispatch.state;

  const columns = [
    // ["Name", "Equipment Type", "Room", "Actions"]
    {
      key: "date",
      text: "Date",
      align: "left",
      sortable: true,
      cell: (tc) => moment(tc.date).format("M-D-YYYY")
    },
    {
      key: "client",
      text: "Client",
      align: "left",
      sortable: true,
    },
    {
      key: "productOrService",
      text: "Inventory",
      align: "left",
      sortable: true,
    },
    // {
    //   key: "inventoryType",
    //   text: "Inventory Type",
    //   align: "left",
    //   sortable: true,
    // },
    {
      key: "invoiceNumber",
      text: "Invoice",
      align: "left",
      sortable: true,
    },
    {
      key: "quantity",
      text: "Qty",
      align: "left",
      sortable: true,
    },
    {
      key: "unitPrice",
      text: "Price",
      align: "left",
      sortable: true,
      cell: (tc) => Utilities.toDollar(tc.unitPrice)
    },
    {
      key: "subTotal",
      text: "Subtotal",
      align: "left",
      sortable: true,
      cell: (tc) => Utilities.toDollar(tc.subTotal)
    },
    {
      key: "discount",
      text: "Discount",
      align: "left",
      sortable: true,
      cell: (tc) => Utilities.toDollar(tc.discount)
    },
    {
      key: "total",
      text: "Total",
      align: "left",
      sortable: true,
      cell: (tc) => Utilities.toDollar(tc.total)
    },
  ]
  const config = {
    page_size: 10,
    length_menu: [10, 20, 50],
    show_filter: true,
    show_pagination: true,
    pagination: 'advance',
    filename: "Employee Sales Total",
    dynamic: true,
    button: {
      excel: true,
      print: true,
      csv: true,
      extra: true
    },
    language: {
      loading_text: "Please be patient while data loads..."
    }
  }
  const fetchReport = () => {
    let reqObj = {
      StartDate: moment(startDate).startOf("d").format("YYYY-MM-DD HH:MM:ss"),
      EndDate: moment(endDate).endOf("d").format("YYYY-MM-DD HH:MM:ss"),
      EmployeeIds: [providerId]
    };
    ReportService.getEmployeeSalesReport(reqObj)
      .then((res) => {
        console.log(res);
        setTickets(res);
      })
      .catch((err) => {
        console.log(err);
        setTickets();
      });
  };

  const changeStart = (date) => {
    if (timePeriod === "quarter") {
      setStartDate(moment(date).startOf("quarter"))
      setEndDate(moment(date).add(2, "M").endOf("M"))
    }
    else if (timePeriod !== "custom") {
      setStartDate(moment(date).startOf(timePeriod[0].toLocaleUpperCase()))
      setEndDate(moment(date).endOf(timePeriod[0].toLocaleUpperCase()))
    }
    fetchReport()
  }
  const changeRange = () => {
    if (timePeriod === "quarter") {
      setStartDate(moment(startDate).startOf("quarter"))
      setEndDate(moment(startDate).add(2, "M").endOf("M"))
    }
    else if (timePeriod !== "custom") {
      setStartDate(moment(startDate).startOf(timePeriod[0].toLocaleUpperCase()))
      setEndDate(moment(startDate).endOf(timePeriod[0].toLocaleUpperCase()))
    }
  }

  useEffect(() => {
    changeRange()
  }, [timePeriod])

  const providerLookup = () => {
    setIsLoader(true)
    let reqObj = {
      isRegistered: true,
      isActive: true,
      PracticeLocationId: state.practiceLocationId,
    };
    DoctorService.doctorLookup(reqObj)
      .then((res) => {
        console.log(res);
        setProviderList(res);
        setProviderId(res[0].id);
        setIsLoader(false)
      })
      .catch((err) => {
        console.log(err);
        setProviderList();
        setIsLoader(false)
      });
  };

  useEffect(() => {
    providerLookup();
  }, []);

  useEffect(() => {
    if (startDate && providerId) {
      setEndDate(moment(startDate).add(1, "d").startOf("d"));
      return fetchReport();
    }
  }, [providerId, state?.practiceLocationId]);

  return (
    <div className="row d-flex g-4">
      <div className='col-12'>
        <Module title="Filters">
          <div className='row d-flex'>
            <div className='col-12 row d-flex justify-content-center mx-0 align-items-end'>
              <div className='col'>
                <div className='ui field'>
                  <label>Time Period</label>
                  <select className='form-select' value={timePeriod} onChange={e => { e.preventDefault(); setTimePeriod(e.target.value) }}>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="quarter">Quarter</option>
                    <option value="year">Year</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              {timePeriod === 'quarter' || timePeriod === 'year' || timePeriod === 'month' ? <div className='col'>
                <div className='ui field'>
                  <label>Year</label>
                  <input type="number" value={moment(startDate).year()} onChange={e => { e.preventDefault(); console.log(e.target.value + 1); setStartDate(new Date(moment(startDate).year(e.target.value)).toISOString()); setEndDate(new Date(moment(endDate).year(e.target.value)).toISOString()); }} />
                </div>
              </div> : null}
              {timePeriod === 'quarter' && <div className='col'>
                <div className='ui field'>
                  <label>Quarter</label>
                  <select className="form-select" value={moment(startDate).quarter()} onChange={e => { e.preventDefault(); setStartDate(moment(startDate).quarter(e.target.value)); setEndDate(moment(endDate).quarter(e.target.value).endOf('quarter')); }}>
                    <option value={1}>Q1</option>
                    <option value={2}>Q2</option>
                    <option value={3}>Q3</option>
                    <option value={4}>Q4</option>
                  </select>
                </div>
              </div>}
              {timePeriod === 'month' && <div className='col'>
                <div className='ui field'>
                  <label>Month</label>
                  <select className="form-select" value={moment(startDate).month() + 1} onChange={e => { e.preventDefault(); console.log(moment(startDate).startOf("M").month(e.target.value - 1).toISOString()); setStartDate(new Date(moment(startDate).startOf("M").month(e.target.value - 1))); setEndDate(new Date(moment(endDate).month(e.target.value - 1).endOf('M'))); return fetchReport() }}>
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                  </select>
                </div>
              </div>}
              {timePeriod === 'week' || timePeriod === 'day' || timePeriod === 'custom' ? <div className='col'>
                <div className='ui field'>
                  <label>Start Date</label>
                  <input type="date" value={Utilities.toDate(startDate)} onChange={e => { e.preventDefault(); setStartDate(e.target.value) }} onBlur={e=>{e.preventDefault(); changeStart(startDate)}} disabled={timePeriod !== 'day' && timePeriod !== 'week' && timePeriod !== 'custom'} />
                </div>
              </div> : null}
              {timePeriod === 'custom' && <div className='col'>
                <div className='ui field'>
                  <label>End Date</label>
                  <input type="date" value={Utilities.toDate(endDate)} onChange={e => { e.preventDefault(); setEndDate(e.target.value); return fetchReport() }} disabled={timePeriod !== "custom"} />
                </div>
              </div>}
              <div className="col">
                <div className='field required'>
                  <label>Search Provider</label>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={providerList}
                    name="doctorId"
                    value={providerList && providerList.find(obj => obj.id === providerId) || null}
                    onChange={e => {
                      setProviderId(e.id)
                    }}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                </div>
              </div>
              <div className="col-auto"><button className="btn btn-primary" onClick={e => { e.preventDefault(); fetchReport() }} title="Pull Report"><i className="icon arrow circle right" /></button></div>
            </div>
          </div>
        </Module>
      </div>
      <div className="col-12">
        <Module title="Employee Sales Total">
          <Table config={config} columns={columns} records={tickets} loading={isLoader} />
        </Module>
      </div>
    </div>
  );
};

export default EmployeeSalesTotal;
