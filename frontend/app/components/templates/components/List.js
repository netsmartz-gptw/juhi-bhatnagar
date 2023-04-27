import React, { useState, useEffect } from 'react'
import ModuleTitle from './ModuleTitle'
import label from '../../../../assets/i18n/en.json'
import PagerService from '../../../services/commonservice/pager.service'
import Paginator from './Paginator'
import DimLoader from './DimLoader'
import NoResults from './NoResults'

const List = (props) => {
    const { isLoading, loadMessage, noResultsMessage, keyword, sortFunc, sortList, sortBy, refresh, pageSize, noPaginate } = props
    const [data, setData] = useState(props.children || [])
    const [list, setList] = useState(props.children || [])
    const [pager, setPager] = useState({ startIndex: 0, endIndex: 10, pageSize: 10 })
    const [page, setPage] = useState(1)

    const pageClick = (page) => {
        // console.log("page click: "+page)
        // let newItem = pager
        // newItem[pager.currentPage] = page
        // setPager(newItem)
        setPage(page)
        paginate(page)
    }

    useEffect(() => {
        setData(props.children)
        if (!noPaginate) {
            paginate(pager.currentPage)
        }
        else {
            return setList(props.children)
        }
    }, [props.children])

    // console.log(props.children)

    const paginate = (currentPage) => {
        if (!isLoading && props.children && props.children.length) {
            let pageSizeNumber = pageSize || 10
            let totalPageNumber = pager.totalItems || props.children && props.children.length || 0
            let currentPageNumber = currentPage || 1
            let pageInfo = PagerService.getPager(totalPageNumber, currentPageNumber, pageSizeNumber)
            setPager(pageInfo)
            // console.log("paginated: ",pager)
        }
        else {
            setList(props.children)
        }
    }

    useEffect(() => {
        paginate(page)
    }, [page])

    useEffect(() => {
        if (pager && !props.noPaginate) {
            if (list) {
                if (list.length > 0) {
                    if (Array.isArray(list)===true && pager) {
                        setList(data.slice(pager.startIndex, pager.endIndex + 1))
                    }
                    else {
                        setList(data)
                    }
                }
                else {
                    setList(data)
                }
            }
        }
    }, [pager])

    return (
        <div className={'container-fluid px-0'}>
            {props.isLoading && <DimLoader/>}
            {props.headerTitle && <div className={`accordion-style-header row-fluid d-flex align-items-center justify-content-between ${props.headerStyle}`}><span className='col'>{props.headerTitle}</span>
                {props.headerRight && <span className='col-auto'>{props.headerRight}</span>}</div>}
            {sortList && <div className="form mb-3">
                <div className="">
                    <div className="ui row sort justify-content-end">
                        <div className="field sort-dd col-lg-6 col-12">
                            <label>{label.common.sortBy}: </label>
                            <select className="form-control" name="EquipmentTypeName" aria-label='equipmentTypeId' value={sortBy} onBlur={e => { e.preventDefault(); sortFunc(e) }} onChange={e => { e.preventDefault(); sortFunc(e) }}>
                                {sortList && sortList.map((item, i) => {
                                    return (
                                        <option value={item.value} key={i}>{item.label}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </div>}

            {list === null  && !props.isLoading || !list && !props.isLoading  || list?.length < 1 && !props.isLoading ?
                <NoResults>{props.noResultsMessage}</NoResults> : props.isLoading? <NoResults>Loading...</NoResults>:
                <div className={`${props.className} list`} style={props.style}>
                    {!props.table && list}
                    {props.table &&
                        <table className={`table mb-0 ${props.tableStyle && props.tableStyle}`}>
                            {props.tableHeaders && <thead className={`primary-header ${props.tHeadStyle && props.tHeadStyle}`}>
                                <tr>
                                    {props.tableHeaders.map(header => {
                                        return <td>{header}</td>
                                    })}
                                </tr>
                            </thead>}
                            <tbody>
                                {list}
                            </tbody>
                        </table>
                    }
                </div>}
            {pager || !noPaginate ? <div className="row-fluid list mt-3">
                {!noPaginate && <Paginator pagerInfo={pager} pageClick={pageClick} />}
            </div> : null}
        </div>
    )
}

export default List