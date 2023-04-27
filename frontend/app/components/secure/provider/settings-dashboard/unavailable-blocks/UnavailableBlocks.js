import React, {useEffect, useState} from 'react'
import TabsTemplate from '../../../../templates/components/TabsTemplate'
import UnavailableBlock from '../../unavailable-block/UnavailableBlockListing';
import UnavailableBlockTable from "../unavailable-block-table/UnavailableBlockTable"
import UnavailableBlockListing from '../../unavailable-block/unavailable-block-listing/UnavailableBlockListing';
import ProviderService from "../../../../../services/api/provider.service";
import toast from "react-hot-toast";
import moment from "moment";

const UnavailableBlockSettings = (props) => {
    // const [unavailableBlockList, setUnavailableBlockList] = useState([]);
    // const [initialData, setInitialData] = useState();
    // const [openModal, setOpenModal] = useState(false);

    // const onModalClose = () => {
    //     setInitialData(null);
    //     setOpenModal(false);
    // }

    // const onSuccess = (payload = {}) => {
    //     getUnavailableBlocks(payload);
    // }

    // useEffect(() => {
    //     getUnavailableBlocks();
    // }, []);

    // const getUnavailableBlocks = (payload) => {
    //     ProviderService.getUnavailableBlock(payload).then(res => {
    //         setUnavailableBlockList(res?.data?.selectResponse);
    //     }).catch(() => {
    //         toast.error('Oops! Something went wrong');
    //         if (typeof cb === 'function') {
    //             cb();
    //         }
    //     });
    // }

    return (
        <div>
            <div title='Unavailable Block'>
                <UnavailableBlockTable {...props} />
                {/* <UnavailableBlock
                    onModalClose={onModalClose}
                    initialData={initialData}
                    openModal={openModal}
                    onSuccess={onSuccess}
                />
                <UnavailableBlockListing list={unavailableBlockList} onEdit={(data) => {
                    data.startDate = moment(data.startDate).format("YYYY-MM-DD");
                    data.endDate = moment(data.endDate).format("YYYY-MM-DD");
                    setInitialData(data);
                    setOpenModal(true);
                }}/> */}
            </div>
        </div>
            
    )
}

export default UnavailableBlockSettings
