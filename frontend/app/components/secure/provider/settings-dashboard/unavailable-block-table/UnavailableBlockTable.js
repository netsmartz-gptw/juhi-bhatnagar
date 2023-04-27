import React, { useEffect, useState, useContext } from 'react'
import Table from "../../../../templates/components/Table"
import ProviderService from "../../../../../services/api/provider.service";
import moment from "moment";
import PracticeLocationSelector from '../../../../templates/components/PracticeLocationSelector';
import { store } from '../../../../../context/StateProvider';
import Module from '../../../../templates/components/Module';
import Utilities from '../../../../../services/commonservice/utilities';
import DoctorService from '../../../../../services/api/doctor.service';
import ModalBox from '../../../../templates/components/ModalBox';
import AddUnavailableBlock from '../../unavailable-block/add-unavailable-block/AddUnavailableBlock';
import UnavailableBlockForm from '../../unavailable-block/unavailable-block-form/UnavailableBlockForm';
import toast from 'react-hot-toast';

const UnavailableBlockTable = (props) => {
  const [isLoader, setIsLoader] = useState(false);
  const [unavailableBlockList, setUnavailableBlockList] = useState([]);
  const [providerList, setProviderList] = useState()
  const [startDate, setStartDate] = useState(new Date().toISOString())
  const [endDate, setEndDate] = useState(new Date(moment().endOf("D").toISOString()))
  const [timePeriod, setTimePeriod] = useState("day")
  const [selectedBlock, setSelectedBlock] = useState()
  const [show, setShow] = useState(false)
  const [wholePractice, setWholePractice] = useState(false)
  const [deleteModal,setDeleteModal] = useState(false)

  const deleteBlock = (id) => {
    return ProviderService.deleteUnavailableBlock(id)
      .then(res => {
        console.log(res)
        toast.success("Block Deleted")
        getUnavailableBlocks()
      })
  }
  const state = useContext(store).state
  const doctorLookup = () => {
    const reqObj = { isActive: true, PracticeLocationId: state.practiceLocationId };
    DoctorService.doctorLookup(reqObj)
      .then(
        (response) => {
          if (response) {
            setProviderList(response)
          }
        })
      .catch((error) => {
        console.log(error);
      })
  }

  const getUnavailableBlocks = () => {

    let reqObj = { 
      PracticeLocationId: state.practiceLocationId, 
      FromDate: moment.utc(new Date(startDate)).startOf('day').toISOString(),
      ToDate: moment.utc(new Date(endDate)).endOf('day').toISOString(),
      WholePractice: wholePractice
    }

    if (wholePractice)
    {
      delete reqObj.PracticeLocationId
    }
    if (!wholePractice)
    {
      delete reqObj.wholePractice
    }

    ProviderService.getUnavailableBlock(reqObj).then(res => {
      console.log(res?.data?.selectResponse)
      setUnavailableBlockList(res?.data?.selectResponse);
    }).catch(() => {
      toast.error('Oops! Something went wrong');
      if (typeof cb === 'function') {
        cb();
      }
    });
  }
  useEffect(() => {
    getUnavailableBlocks();
    doctorLookup()
  }, [state, startDate, endDate, wholePractice]);

  const changeStart = (date) => {
    if (timePeriod === "quarter") {
      setStartDate(moment(date).startOf("quarter"))
      setEndDate(moment(date).add(2, "M").endOf("M"))
    }
    else if (timePeriod !== "custom") {
      setStartDate(moment(date).startOf(timePeriod[0].toLocaleUpperCase()))
      setEndDate(moment(date).endOf(timePeriod[0].toLocaleUpperCase()))
    }
    getUnavailableBlocks()
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

  const columns = [
    {
      key: "description",
      text: "Description",
      align: "left",
      sortable: true,
    },
    {
      key: "startDate",
      text: "From",
      align: "left",
      sortable: true,
      cell: (block) => moment(block.startDate).utc().format("MM/DD/YYYY")
    },
    {
      key: "endDate",
      text: "To",
      align: "left",
      sortable: true,
      cell: (block) => moment(block.endDate).utc().format("MM/DD/YYYY")
    },
    {
      key: "doctorId",
      text: "Provider",
      align: "left",
      sortable: true,
      cell: (block) => { return block.wholePractice === 1 ? 'Whole Practice' : providerList && providerList.find(obj => obj.id === block.doctorId)?.name || 'Provider Only' }
    },
    {
      key: "actions",
      text: "Actions",
      align: "center",
      sortable: false,
      cell: (block) => {
        console.log(block)
        return (<div className='d-flex justify-content-center'>
          <div className='btn-group'>
            <button className='p-0 ps-1 btn btn-primary' title="Edit Block" onClick={e => { e.preventDefault(); setSelectedBlock(block); return setShow(true) }}><i className='icon pencil' /></button>
            <button className="p-0 ps-1 btn btn-primary ms-1" title="Delete Block" onClick={e=>{e.preventDefault(); setSelectedBlock(block) ;return setDeleteModal(true)}}><i className="icon trash" /></button>
            {/* <button className='btn btn-primary' title="Delete Block" onClick={e => { e.preventDefault(); setSelectedBlock(block); return deleteBlock(block.unavailableBlockId) }}><i className='icon trash' /></button> */}
          </div>
        </div>
        )
      }
    },
  ];
  const config = {
    page_size: 10,
    length_menu: [10, 20, 50],
    show_filter: true,
    show_pagination: true,
    pagination: "advance",
    filename: "Unavailable Block ",
    dynamic: true,
    button: {
      print: true,
      csv: true,
      extra: true,
    },
    language: {
      loading_text: "Please be patient while data loads...",
    },
  };

  return (

    <div className="row d-flex g-4">
      <div className='col-12'>
        <Module title="Filters">
          <div className='row d-flex'>
            <div className='col-12 row d-flex justify-content-center mx-0'>
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
                  <select
                      className="form-select"
                      value={moment(startDate).month() + 1}
                      onChange={(e) => {
                        e.preventDefault();
                        console.log(
                            moment(startDate)
                                .startOf("M")
                                .month(e.target.value - 1)
                                .toISOString()
                        );
                        setStartDate(
                            new Date(
                                moment(startDate)
                                    .startOf("M")
                                    .month(e.target.value - 1)
                            )
                        );
                        setEndDate(
                            new Date(
                                moment(endDate)
                                    .month(e.target.value - 1)
                                    .endOf("M")
                            )
                        );
                      }}
                  >
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
                  <input type="date" value={Utilities.toDate(startDate)} onChange={e => { e.preventDefault(); changeStart(e.target.value) }} disabled={timePeriod !== 'day' && timePeriod !== 'week' && timePeriod !== 'custom'} />
                </div>
              </div> : null}
              {timePeriod === 'custom' && <div className='col'>
                <div className='ui field'>
                  <label>End Date</label>
                  <input type="date" value={Utilities.toDate(endDate)} onChange={e => { e.preventDefault(); setEndDate(e.target.value); }} disabled={timePeriod !== "custom"} />
                </div>
              </div>}
              <div className='col'>
                <div className='ui field'>
                  <label>Practice Location</label>
                  <PracticeLocationSelector disabled={wholePractice} />
                </div>
              </div>
              <div className='col'>
                <div className='ui field'>
                  <label>Whole Practice</label>
                  <input
                      type="checkbox"
                      className="form-check-input"
                      name="wholePractice"
                      checked={wholePractice}
                      onChange={e => {
                        setWholePractice(e.target.checked)                        
                      }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Module>
      </div>
      <div className='col-12'>
        <Module title="Unavailable Blocks">
          <Table
            loading={isLoader}
            config={config}
            columns={columns}
            records={unavailableBlockList}
            extraButtons={[
              {
                className: 'btn btn-primary',
                onClick: (e) => { e.preventDefault(); setSelectedBlock({}); return setShow(true) },
                children: <i className="icon add" title="Add Block" />
              },
            ]}

          />
        </Module>
      </div>
      <ModalBox open={show} onClose={() => { setShow(false) }}>
        <UnavailableBlockForm
            initialData={selectedBlock}
            onClose={() => {
              getUnavailableBlocks();
              return setShow(false)
            }}
            {...props}
        />
      </ModalBox>
      <ModalBox open={deleteModal} onClose={() => { setDeleteModal(false) }} title="Delete Block">
            {selectedBlock?.unavailableBlockId && <div className='row d-flex align-items-center justify-content-between'>
                    <div className='col'>
                        Are you sure you want to delete {selectedBlock.description} ?
                    </div>
                    <div className='col-auto'>
                        <button className='btn btn-secondary' onClick={e => { e.preventDefault();setSelecetdBlock(); return setDeleteModal(false) }}>No</button>
                        <button className='btn btn-primary ms-3' onClick={e => { e.preventDefault(); deleteBlock(selectedBlock?.unavailableBlockId); setDeleteModal(false) }}>Yes</button>
                    </div>
                </div>}
            </ModalBox>
    </div>

  );
};

export default UnavailableBlockTable;

