import React, {useState, useEffect, useCallback} from 'react';
import Search from '../../../../templates/components/Search';
import CommonService from '../../../../../services/api/common.service';
import PatientService from '../../../../../services/api/patient.service';

const defaultState = {
    patientId: ''
}

const otherRequestParams = {
    PageSize: 10,
    StartRow: 0,
    SortField: 'CreatedOn',
    Asc: false
}

const NoteSearch = (props) => {
    const [patientList, setPatientList] = useState([]);
    const [inputData, setInputData] = useState({...defaultState});

    useEffect(() => {
        CommonService.patientLookup({ SearchTerm: '', isActive: true, isRegistered: true, SortField: 'firstName' }).then((data = []) => {
            setPatientList(data.data);
        }).catch(console.log);
    }, []);

    const findPatientNotes = useCallback(() => {
        if (inputData.patientId) {
            const data = {
                PatientIds: inputData.patientId,
                ...otherRequestParams
            }
            PatientService.findNotes(data).then(() => {
                console.log({data});
            }).catch(console.error);
        }
    }, [inputData]);

    const setKeyword = useCallback((value) => {
        setInputData({patientId: value});
    }, []);

    const onChange = useCallback((e) => {
        setInputData({patientId: e.id});
    }, []);


    console.log("onSearch called---", inputData);

    return (
        <Search
            value={patientList?.find(obj => obj.id === inputData.patientId) || ''}
            keyword={inputData.patientId}
            searchList={patientList}
            getOptionLabel={(option) => option.firstName + ' ' + option.lastName + ' | ' + option.mobile || option.patientPhone}
            getOptionValue={(option) => option.id}
            setKeyword={setKeyword}
            onSearch={findPatientNotes}
            onChange={onChange}
        />
    )
}

export default NoteSearch