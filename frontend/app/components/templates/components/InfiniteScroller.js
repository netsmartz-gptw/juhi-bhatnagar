import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller';

const InfiniteScroller = (props) => {
    const [viewList, setViewList] = useState()
    const [endSlice, setEndSlice] = useState(10)
    const loadMore = () => {
        setEndSlice((endSlice + 10))
        return setViewList(props.children.slice(0, endSlice))
    }
    useEffect(() => {
        if (props.children && Array.isArray(props.children)) {
            setViewList(props.children.slice(0, 10))
        }
    }, [props.children])

    return (
        <div className='container-fluid px-0'>
            {props.children && viewList ? <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={props.children.length == viewList.length ? false : true}>
                {viewList.map(child => {
                    return child
                })}
            </InfiniteScroll> : null}
        </div>
    )
}
export default InfiniteScroller