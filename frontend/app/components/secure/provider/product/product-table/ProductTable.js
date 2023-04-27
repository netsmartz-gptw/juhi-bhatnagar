import React, { useEffect, useState } from "react";
import ProductService from "../../../../../services/api/product.service";
import toast from "react-hot-toast";
import label from "../../../../../../assets/i18n/en.json";
import Table from "../../../../templates/components/Table";
import moment from "moment";
import MessageSetting from "../../../../../common/constants/message-setting.constant";
import ModalBox from "../../../../templates/components/ModalBox";
import ProductAdd from "../product-add/ProductAdd";
import ProductEdit from "../product-edit/ProductEdit";
import ProductList from "../product-list/ProductList";
import Utilities from "../../../../../services/commonservice/utilities";

const ProductTable = (props) => {
  const [isLoader, setIsLoader] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [productLookupList, setProductLookupList] = useState([]);
  const [filter, setFilter] = useState()

  const findProduct = () => {
    let reqObj = { ItemType: 1 }
    setIsLoader(true);
    ProductService.findProduct(reqObj)
      .then((response) => {
        console.log(response.data);
        setProductList(response.data.filter(prod=>prod.itemType===1));
        setProductLookupList(response.data);
        setIsLoader(false);
      })
      .catch((error) => {
        setIsLoader(false);
        console.log(error);
      });
  };
  const statusHandler = () => {
    if (selectedProduct.status == 1) {
      ProductService.deactivateProduct(selectedProduct.id).then((response) => {
        toast.success(MessageSetting.LoginServiceuser.deactivate);
        console.log("deactivate");
        setStatusModal(false);
        findProduct();
      });
    } else {
      ProductService.activateProduct(selectedProduct.id).then((response) => {
        toast.success(MessageSetting.LoginServiceuser.activate);
        console.log("activate");
        setStatusModal(false);
        findProduct();
      });
    }
  };

  useEffect(() => {
    findProduct();
  }, []);

  const columns = [
    {
      key: "name",
      text: "Name",
      align: "left",
      sortable: true,
    },
    {
      key: "quantity",
      text: "Quantity",
      align: "left",
      sortable: true,
     },
    {
      key: "unitPrice",
      text: "Unit Price",
      align: "left",
      sortable: true,
      cell: product=>{return Utilities.toDollar(product.unitPrice)}
     },
    {
      key: "taxPercent",
      text: "Tax Percent",
      align: "left",
      sortable: true,
     },
    {
      key: "discount",
      text: "Discount",
      align: "left",
      sortable: true,
      cell: product=>{return Utilities.toDollar(product.discount)}
     },
    {
      key: "description",
      text: "Description",
      align: "left",
      sortable: true,
     },
    {
      key: "createdOn",
      text: "Created On",
      align: "left",
      sortable: true,
      cell: (product) => moment(product.createdOn).format("MM/DD/YYYY"),
    },
    {
      key: "isActive",
      text: "Active",
      align: "center",
      sortable: true,
      cell: (product, i) =>
        product.status === 1 ? (
          <span className="btn btn-success text-white w-100">Active</span>
        ) : (
          <span className="btn btn-danger text-white w-100">Inactive</span>
        ),
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
                setSelectedProduct(product);
                return setOpenModal(true);
              }}
            >
              <i className="icon pencil" />
            </button>
            <button
              className="p-0 ps-1 btn btn-primary ms-1"
              title={
                product.status === 1 ? "Deactivate Product" : "Activate Product"
              }
              onClick={(e) => {
                e.preventDefault();
                setSelectedProduct(product);
                return setStatusModal(true);
              }}
            >
              {product.status === 1 ? <i className="icon dont" /> : <i className="icon check" />}
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
    filename: "Products",
    button: {
      // print: true,
      csv: true,
      extra: true,
    },
    language: {
      loading_text: "Please be patient while data loads...",
    },
  };

  return (
    <div>
      {productList ? (
        <div className="row d-flex col-12 mb-3">
          <div>{productList ? (
              <Table
                loading={isLoader}
                config={config}
                columns={columns}
                records={productList.filter(obj=>{if(filter===''|| filter===null || !filter|| filter==='All'){return obj} else {return obj.status===parseInt(filter)}})}
                extraButtons={[
                  {
                    className: 'btn btn-primary',
                    children: <i className="icon plus" />,
                    title: "Add Product",
                    onClick: (e) => { e.preventDefault(); setShowAdd(true) }
                  },
                {className:'p-0 btn btn-transparent',
              children:<select className="form-select" value={filter} onChange={e=>{setFilter(e.target.value)}}>
                <option value={null} selected>All</option>
                <option value={1}>Active Only</option>
                <option value={0}>Inactive Only</option>
              </select>}
              ]}
              />
            ) : // <ProductList />
              null}
          </div>
        </div>
      ) : null}
      <ModalBox open={openModal} onClose={() => setOpenModal(false)}>
        {selectedProduct && <ProductEdit
          id={selectedProduct.id}
          onClose={() => {
            findProduct();
            return setOpenModal(false);
          }}
        />}
      </ModalBox>

      <ModalBox open={statusModal} onClose={() => setStatusModal(false)}>
        <div className="row d-flex justify-content-between align-items-center">
          <div className="col">
            {selectedProduct?.status === 1 ? (
              <p>Would you like to deactivate {selectedProduct?.name}</p>
            ) : (
              <p>Would you like to activate {selectedProduct?.name} </p>
            )}
          </div>
          <div className="col-auto">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                statusHandler();
              }}
            >
              OK
            </button>
            <button
              className="btn btn-secondary ms-3"
              onClick={(e) => {
                e.preventDefault();
                setStatusModal(false);
              }}
            >
              {label.common.cancel}
            </button>
          </div>
        </div>
      </ModalBox>
      <ModalBox
        open={showAdd}
        onClose={() => {
          setShowAdd(false);
        }}
      >
        <ProductAdd
          onClose={() => {
            findProduct();
            return setShowAdd(false);
          }}
        />
      </ModalBox>
    </div>
  );
};

export default ProductTable;
