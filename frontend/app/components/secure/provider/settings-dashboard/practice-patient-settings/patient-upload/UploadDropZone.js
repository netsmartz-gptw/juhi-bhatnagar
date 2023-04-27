import React, { useCallback } from 'react'
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'


const UploadDropZone = (props) => {

    return (
        <Dropzone
        onChangeStatus={props.handleChangeStatus}
        // accept="image/*,audio/*,video/*"
        inputContent="Browse or drop your file here. File type: *.csv, Max size: 5MB"
        accept={props.acceptFileTypes}
        multiple={false}
        maxFiles={1}
    />
    );
}

export default UploadDropZone