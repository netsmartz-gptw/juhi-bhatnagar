import React, { useState } from 'react'

const Paginator = (props) => {
    const {pageClick} = props;
    // console.log(props.pagerInfo)
    const pager = props.pagerInfo
    let currentPage = pager.currentPage
    let endIndex = pager.endIndex
    let endPage = pager.endPage
    let pageSize = pager.pageSize
    let pages = pager.pages
    let startIndex = pager.startIndex
    let startPage = pager.startPage
    let totalItems = pager.totalItems
    let totalPages = pager.totalPages
    return (
        <div className='pagination'>
            {totalPages > 1 &&<ul className="pagination d-flex justify-content-center">
                <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
                    <button onClick={e=>{e.preventDefault();pageClick(currentPage-1)}} className="page-link" tabIndex="-1">Previous</button>
                </li>
                {pages && pages.map((page, i) => {
                    return (
                        <li className={currentPage === page ? 'page-item active' : 'page-item'}>
                            <button className="page-link" onClick={e=>{e.preventDefault();pageClick(page)}}>{page}</button>
                        </li>
                    )
                })}
                <li className={currentPage === totalPages ? 'page-item disabled' : 'page-item'}>
                    <button className='page-link' onClick={e=>{e.preventDefault();pageClick(currentPage+1)}}>Next</button>
                </li>
            </ul>}
        </div>
    )
}

export default Paginator