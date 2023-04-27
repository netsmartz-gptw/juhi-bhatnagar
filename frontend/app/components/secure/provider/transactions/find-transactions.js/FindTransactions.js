import React, { useState, useEffect } from 'react'
import PatientService from '../../../../../services/api/patient.service'
import List from '../../../../templates/components/List'
import label from '../../../../../../assets/i18n/en.json'
import moment from 'moment'
import ModalBox from '../../../../templates/components/ModalBox'
import NoteEdit from "../../note/note-edit/NoteEdit"
import NoteAdd from '../../note/note-add/NoteAdd'
import TransactionService from '../../../../../services/api/transaction.service'
import TransactionsCardList from '../transactions-card/TransactionsCardList'
import DimLoader from '../../../../templates/components/DimLoader'

const FindTransactions = (props) => {
    const [transactions, setTransactions] = useState()
    const [isLoader, setIsLoader] = useState(false)

    useEffect(() => {
        transactionLookup()
    }, [])


    const transactionLookup = () => {
        setIsLoader(true)
        let reqObj = {
            SortField: 'createdOn',
            Asc: 'false',
            StartRow: 0
        }
        TransactionService.findTransaction(reqObj)
            .then(res => {
                let results;
                if(Array.isArray(res.data.data)){
                    results=res.data.data
                }
                else (
                    results=[res.data.data]
                )
                let newArray = results.map(item => {
                    return (
                        { ...item, amount: item?.tenderInfo?.totalAmount }
                    )
                }
                )
                // console.log(newArray)
                setTransactions(newArray)
                return setIsLoader(false)
            })
    }


    return (
        <div>
            {isLoader &&
                <DimLoader />
            }
            <List noPaginate className="scroll-list" style={{ height: '80vh' }} isLoading={isLoader} noResultsMessage={<span>There are currently no Transactions for this user. <a href="#" onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add a Transaction</a></span>}>
                {transactions && transactions.map((tc, i) => {
                    // console.log(tc)
                    return (
                        <TransactionsCardList transaction={tc} onClick={(e) => { e.preventDefault(); console.log(tc) }} />
                    )
                })}
            </List >
        </div>
    )
}

export default FindTransactions
