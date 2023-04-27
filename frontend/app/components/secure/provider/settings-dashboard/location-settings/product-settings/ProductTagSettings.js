import React, { useEffect, useContext, useState } from 'react'
import ProductService from '../../../../../../services/api/product.service'
import ModalBox from '../../../../../templates/components/ModalBox'
import Table from '../../../../../templates/components/Table'
import AddProductTag from './AddProductTag'
import EditProductTag from './EditProductTag'

const ProductTagSettings = (props) => {
    const [isLoader, setIsLoader] = useState(false)
    const [tags, setTags] = useState()
    const [selectedTag, setSelectedTag] = useState()
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const findAllTags = () =>{
        ProductService.getAllLookupTags()
        .then(res=>{
            console.log(res.data)
            setTags(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const columns = [
        {
          key: "name",
          text: "Name",
          align: "left",
          sortable: true,
        },
        {
          key: "actionPracticePatient",
          text: "Action",
          align: "center",
          sortable: false,
          cell: (product, i) => {
            return (
              <div className="d-flex justify-content-center">
                <button
                  className="p-0 ps-1 btn btn-primary"
                  title="Edit Product"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTag(product);
                    return setEdit(true);
                  }}
                >
                  <i className="icon pencil" />
                </button>
              </div>
            );
          },
        },
      ];
    
      const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: "advance",
        filename: "Product Tags",
        button: {
          print: true,
          csv: true,
          extra: true,
        },
        language: {
          loading_text: "Please be patient while data loads...",
        },
      };
    useEffect(()=>{
        findAllTags()
    },[])
    return (
        <div className='d-flex row'>
            <Table records={tags} loading={isLoader} columns={columns} config={config}
            extraButtons={[
                {className:'btn btn-primary', children: <i className='icon plus'/>, title:'Add Tag', onClick:()=>{setAdd(true)}}
            ]}/>
            <ModalBox open={add} onClose={()=>{setAdd(false)}}>
               <AddProductTag onClose={()=>{findAllTags(); return setAdd(false)}}/>
            </ModalBox>
            <ModalBox open={edit} onClose={()=>{setEdit(false)}}>
               <EditProductTag initialData={selectedTag} onClose={()=>{findAllTags(); return setEdit(false)}}/>
            </ModalBox>
        </div>
    )
}
export default ProductTagSettings