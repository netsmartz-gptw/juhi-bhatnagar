import React from 'react'
import ReactDatatable from '@ashvin27/react-datatable'
import NoResults from './NoResults'
const Table = (props) => {
    const fileName = props.fileName ? props.fileName : 'file';
    const defaultConfig = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        filename: fileName,
        button: {
            print: true,
            csv: true,
            extra: true
        },
        language: {
            loading_text: "Please be patient while data loads..."
        }
    }

    // Columns 
    // key: "name",
    // text: "Name",
    // className: "name",
    // align: "left",
    // sortable: true,

    // config
    // page_size: 10,
    // length_menu: [ 10, 20, 50 ],
    // button: {
    //     excel: true,
    //     print: true,
    //     extra: true,
    // }

    // const onSort = (column, records, sortOrder) => {
    //     return orderBy(records, [column], [sortOrder]);
    // }
    //     this.extraButtons =[
    //         {
    //             className:"btn btn-primary buttons-pdf",
    //             title:"Export TEst",
    //             children:[
    //                 <span>
    //                 <i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
    //                 </span>
    //             ],
    //             onClick:(event)=>{
    //                 console.log(event);
    //             },
    //         },
    //         {
    //             className:"btn btn-primary buttons-pdf",
    //             title:"Export TEst",
    //             children:[
    //                 <span>
    //                 <i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
    //                 </span>
    //             ],
    //             onClick:(event)=>{
    //                 console.log(event);
    //             },
    //             onDoubleClick:(event)=>{
    //                 console.log("doubleClick")
    //             }
    //         },
    //     ]
    // }
    return (
        <div className='table-responsive'>
            <div className='not-mobile-rotate'>
                <ReactDatatable
                    config={props.config || defaultConfig}
                    records={props.records}
                    // dynamic={true}
                    columns={props.columns}
                    loading={props.loading}
                    extraButtons={props.extraButtons || []}
                    onRowClicked={props.onRowClicked}
                />
            </div>
            <div className='mobile-rotate'>
               <NoResults><span className='w-100 d-flex justify-content-between align-items-center'><i className='sync loading icon'/> Rotate device to view table <i className='sync loading icon'/></span></NoResults>
            </div>
        </div>
    )
}

export default Table