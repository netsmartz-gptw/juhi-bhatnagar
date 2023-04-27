import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import ProviderService from '../../../../../services/api/provider.service'
import StorageService from '../../../../../services/session/storage.service'
import DimLoader from '../../../../templates/components/DimLoader'
import InfiniteScroller from '../../../../templates/components/InfiniteScroller'
import Dashboard from '../../../../templates/layouts/Dashboard'
import AdminPracticeCard from './admin-practice-card/AdminPracticeCard'

const PracticeManagement = (props) => {
    const [practices, setPractices] = useState()
    const [keyword, setKeyword] = useState("")

    const pullPractices = () => {
        let data = JSON.parse(StorageService.get('session', 'userDetails'))
        let reqObj = {
            ParentId: data.parentId,
            PageSize: 100,
            StartRow: 0,
            SortField: 'createdOn',
            Asc: false
        }
        ProviderService.findProvider(reqObj)
            .then(res => {
                if (res?.data?.data) {
                    console.log(res.data.data)
                    setPractices(res.data.data.sort((a, b) => a.providerAdminUser.localeCompare(b.providerAdminUser)))
                }
            })
    }
    useEffect(() => {
        pullPractices()
    }, [])
    return (
        <Dashboard title="Practice Management" Modules stacked>
            <div className='p-3' title="Practice Users">
                <div className='row mb-3'>
                    <div className='field'>
                        <label>Search Practice</label>
                        <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            isDisabled={!practices}
                            options={practices && practices}
                            isSearchable
                            isClearable
                            placeholder="Search Practices"
                            isLoading={!practices}
                            loadingMessage="Practices are loading..."
                            name="providerAdminUser"
                            value={practices && Array.isArray(practices) ? practices.find(obj => obj.providerAdminUser === keyword) : null}
                            onChange={e => {
                                if (e?.providerAdminUser) {
                                    setKeyword(e.providerAdminUser)
                                }
                                else {
                                    setKeyword()
                                }
                            }}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.providerAdminUser}
                        >
                        </Select>
                    </div>
                </div>
                {!practices && <DimLoader />}
                <div className='row card m-0 p-3'>
                    <InfiniteScroller>
                        {practices && practices.filter(obj => {
                            if (!keyword || keyword == "") {
                                return obj
                            }
                            else if (obj.providerAdminUser === keyword) {
                                return obj
                            }
                        }).map(practice => {
                            return (
                                <div className='row-fluid mb-3'>
                                    <AdminPracticeCard practice={practice? practice:null} />
                                </div>
                            )
                        })}
                    </InfiniteScroller>
                </div>
            </div>
        </Dashboard>
    )
}

export default PracticeManagement