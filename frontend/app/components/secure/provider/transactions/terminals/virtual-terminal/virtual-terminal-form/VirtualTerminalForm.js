import React, { useState, useEffect } from 'react'
import InputMask from 'react-input-mask';
import TabsTemplate from '../../../../../../templates/components/TabsTemplate';
import Select from 'react-select'
import PatientService from '../../../../../../../services/api/patient.service';
import moment from 'moment';
import CommonService from '../../../../../../../services/api/common.service';
import Utilities from '../../../../../../../services/commonservice/utilities';
import ModalBox from '../../../../../../templates/components/ModalBox';
import PatientAccountAdd from '../../../../patient-account/patient-account-add/PatientAccountAdd';
import RecurringPaymentsService from '../../../../../../../services/api/recurring-payments.service';
import InvoiceService from '../../../../../../../services/api/invoice.service';
import TransactionService from '../../../../../../../services/api/transaction.service';
import DimLoader from '../../../../../../templates/components/DimLoader';
import toast from 'react-hot-toast';

const VirtualTerminalForm = (props) => {

    const [inputData, setInputData] = useState(props.initialData || { transactionDate: Utilities.toDate(new Date()), createdOn: Utilities.toDate(new Date()) })
    const [cardType, setCardType] = useState()
    const [accounts, setAccounts] = useState()
    const [channelType, setChannelType] = useState(2)
    const [selectedAccount, setSelectedAccount] = useState()
    const [selectedPatient, setSelectedPatient] = useState()
    const [patientList, setPatientList] = useState()
    const [accountType, setAccountType] = useState('credit')
    const [showAdd, setShowAdd] = useState(false)
    const [isLoader_ProcessTransaction, setIsLoader_ProcessTransaction] = useState(false)
    const [isLoader_Accounts, setIsLoader_Accounts] = useState(false)
    const [isLoader_Patients, setIsLoader_Patients] = useState(false)
    const [isLoader_PartialPayment, setIsLoader_PartialPayment] = useState(false)

    const handleEnter = (event) => {
        const form = document.getElementById('form')
        const index = [...form].indexOf(event.target);
        form.elements[index + 1].focus();
    }

    // plan one time transaction
    let minStartDate = new Date(new Date().setHours(0, 0, 0, 0));
    let maxStartDate = new Date(new Date().setHours(0, 0, 0, 0));

    // Cash/Check Collection Date
    let minCCStartDate = new Date(new Date().setHours(0, 0, 0, 0) - 90);
    let CCStartDate = new Date(new Date().setHours(0, 0, 0, 0));
    const TransactionStatusMapEnum = {
        Created: 'Created',  // 0
        Pending: 'Pending',  // 1
        Authorized: 'Authorized',  // 2
        Posted: 'Posted',  // 3
        Captured: 'Accepted',  // 4 (Earlier it was- Settled)
        Failed: 'Failed',  // 5
        Returned: 'Returned',  // 6
        Chargeback: 'Chargeback',  // 7
        Cancelled: 'Void',  // 8
        Refunded: 'Refunded',  // 9
        Approved: 'Approved',  // 10
        CancelAttempt: 'Void attempted',  // 11
        RefundAttempt: 'Refund attempted', // 12
        Hold: 'Hold',  // 13
        Denied: 'Denied',  // 14
        SettlementHold: 'Settlement hold', // 15
        Success: 'Success',  // 16
        ReprocessAttempt: 'Reprocess attempted',
        Reprocessed: 'Reprocessed',
        Unknown: 'Unknown',  // 100
        PartiallyCaptured: 'Partially accepted', // 101
        PartiallyReturned: 'Partially returned', // 102
        PartialReturnRequested: 'Partial return requested', // 103
        Closed: 'Closed', //30
        Deleted: 'Deleted' //25 where Recurring schdule table record is deleted
    }

    let loggedInUserData = CommonService.getLoggedInData();
    const icons = {
        blank: 'credit-card',
        AMEX: 'cc amex',
        DINERS: 'cc diners club',
        DISCOVER: 'cc discover',
        JCB: 'cc jcb',
        MASTERCARD: 'cc mastercard',
        VISA: 'cc visa'
    }

    const accountTypes = {
        // 0:'all',
        1: 'Credit',
        2: 'ACH',
        3: 'credit',
        4: 'debit',
        // 5:'cash',
        // 6:'check',
    }
    const updateTransaction = () => {
        const reqObj = {};
        reqObj.transactionId = transactionReceipt.id;
        reqObj.patientId = newlyAddedPatientData.id;
        reqObj.patientAccountId = newlyAddedPatientAccountData.id;
        transactionService.updateTransaction(reqObj).subscribe(
            (response) => {
            }, error => {
                setIsLoader_ProcessTransaction(false)
                checkException(error);
            });
    }
    // Preperation of type Fcs

    const prepareCCTransactionObject = () => {
        setIsLoader_ProcessTransaction(true)
        let transactionData = {};
        let billingContact = {};
        if (loggedInUserData.userType == 0 || selectedPatient !== undefined) {
            billingContact = {
                'name': {
                    'firstName': loggedInUserData.userType == 0 ? loggedInUserData.contact.name.firstName : selectedPatient.firstName,
                    'lastName': loggedInUserData.userType == 0 ? loggedInUserData.contact.name.lastName : selectedPatient.lastName,
                },
                'phone': loggedInUserData.userType == 0 ? loggedInUserData.contact.phone : selectedPatient.phone,
                'mobile': loggedInUserData.userType == 0 ? loggedInUserData.contact.mobile : selectedPatient.mobile,
                'email': inputData.transactionEmail,


            };
        } else {
            billingContact = {
                'email': inputData.email,
            };
        }
        if (inputData.address.addressLine1 != "") {
            billingContact.address = {
                'addressLine1': inputData.address.addressLine1,
                'addressLine2': inputData.address.addressLine2,
                'city': inputData.city,
                'state': inputData.state,
                'country': inputData.country,
                'postalCode': inputData.postalCode
            }
        }
        transactionData = {
            'referenceTransactionId': (inputData.retryTransactionId) ? inputData.retryTransactionId : null,
            'referencePatientId': loggedInUserData.userType == 0 ? loggedInUserData.parentId : ((selectedPatient !== undefined && selectedPatient.id) ? selectedPatient.id : inputData.patientId),
            'paymentAccountId': (selectedPatient != undefined && selectedPatient.id != undefined) ? selectedPatient.id : inputData.id,
            'providerId': loggedInUserData.userType == 0 ? findProviderForm.ProviderName : loggedInUserData.parentId,
            'firstName': loggedInUserData.userType == 0 ? loggedInUserData.contact.name.firstName : selectedPatient != undefined && selectedPatient.firstName != undefined && selectedPatient.firstName != null ? selectedPatient.firstName : inputData.firstName,
            'lastName': loggedInUserData.userType == 0 ? loggedInUserData.contact.name.lastName : selectedPatient != undefined && selectedPatient.lastName != undefined && selectedPatient.lastName != null ? selectedPatient.lastName : inputData.lastName,
            'phone': loggedInUserData.userType == 0 ? loggedInUserData.contact.mobile : selectedPatient != undefined && selectedPatient.mobile != undefined && selectedPatient.mobile != null ? selectedPatient.mobile : inputData.mobile,
            'email': inputData.transactionEmail,
            'transactionCode': 'TEL',
            'transactionOrigin': 1,
            'isDebit': true,
            'operationType': 0, //inputData.transactionType === false ? 0 : 1, // 0-Sale, 1-AuthOnly
            'channelType': channelType,  // channelType,
            // 'TrainingMode': (processorConfig.processorName.toUpperCase() === 'DUMMY' ) ? true : false,  // Dummy-->true, Other than dummy-->false
            'remarks': inputData.memo,
            'patientId': loggedInUserData.userType == 0 ? loggedInUserData.parentId : selectedPatient != undefined ? selectedPatient.id : inputData.patientId,
            'initiator': loggedInUserData.userType == 0 ? 0 : 1, //intiator 0= patient intiated the transaction, 1=provider initiated transaction
            'tenderInfo': {
                'channelType': channelType, // channelType,
                'NameOnCheck': null,
                'bankName': null,
                'routingNumber': null,
                'accountType': 1,
                'accountNumber': null,
                'checkType': null,
                'checkNumber': null,
                'cardExpiry': inputData.cardExpiry.toString().length == 5 ? inputData.cardExpiry.replace(new RegExp(/[^\d]/, 'g'), '') : inputData.cardExpiry,
                'amount': +inputData.subTotal,
                'taxPercent': +inputData.taxPercent,
                'taxAmount': +inputData.taxAmount,
                'discountType': inputData.discountList,
                'captureAmount': +inputData.finalAmount,
                'totalAmount': +inputData.finalAmount,
                'cardHolderName': inputData.cardHolderName,
                'cardNumber': +inputData.cardNumber,
                'cardType': inputData.cardType,
                'cvv': inputData.cvv,
                'cvData': inputData.cvv,
                'cvDataStatus': (inputData.cvv !== '' && inputData.cvv !== null) ? 'AV' : 'NS'
            }
        };
        if (inputData.address.addressLine1 != "") {
            transactionData.address = {
                'addressLine1': inputData.address.addressLine1,
                'addressLine2': inputData.address.addressLine2,
                'city': inputData.address.city,
                'state': inputData.address.state,
                'country': inputData.address.country,
                'postalCode': inputData.address.postalCode
            };
        }
        if (inputData.discountList == 1) {
            inputData.discountAmount = +inputData.discount;
        } else {
            inputData.discountRate = +inputData.discount;
            inputData.discountAmount = +inputData.discountAmount;
        }
        console.log(transactionData)
        return transactionData;
    }

    const prepareCashTransactionObject = () => {
        setIsLoader_ProcessTransaction(true)
        let transactionData = {};

        let startDate = null;
        if (inputData.transactionDate !== undefined &&
            inputData.transactionDate !== null &&
            inputData.transactionDate !== '') {
            startDate = moment(inputData.transactionDate)
                .add(moment().hour(), 'hour')
                .add(moment().minutes(), 'minute')
                .add(moment().seconds(), 'second')
                .toISOString();
        }
        console.log(inputData)
        transactionData = {
            'transactionId': inputData != undefined && inputData.isEdit ? inputData.transactionId : '',
            'firstName': patientData.firstName,
            'lastName': patientData.lastName,
            'phone': patientData.mobile,
            'email': patientData.email,
            'transactionCode': 'WEB',
            'transactionOrigin': 1,
            'transactionDate': startDate,
            'isDebit': true,
            'operationType': 0,
            'remarks': inputData.memo,
            'patientId': inputData.patientName,
            'initiator': loggedInUserData.userType === 0 ? 0 : 1, // intiator 0= patient , 1=provider
            'trainingMode': false,
            'tenderInfo': {
                'channelType': channelType,
                'NameOnCheck': null,
                'bankName': null,
                'routingNumber': null,
                'accountType': 1,
                'accountNumber': null,
                'checkType': null,
                'checkNumber': null,
                'amount': +inputData.subTotal,
                'taxPercent': +inputData.taxPercent,
                'taxAmount': +inputData.taxAmount,
                'captureAmount': +inputData.finalAmount,
                'totalAmount': +inputData.finalAmount,
                'discountType': inputData.discountList,
            }
        };
        // cash((TransactionDetailsForm.controls.DiscountList==1?inputData.discountAmount= +inputData.discount:inputData.discountRate= +inputData.discount;

        if (inputData.discountList == 1) {
            inputData.discountAmount = +inputData.discount;
        } else {
            inputData.discountRate = +inputData.discount;
            inputData.discountAmount = +inputData.discountAmount;
        }
        return transactionData;
    }

    const prepareChequeTransactionObject = () => {

        validator.validateAllFormFields(chequeTransactionDetailsForm);
        chequeTransactionDetailsFormErrors = validator.validate(chequeTransactionDetailsForm);

        if (loggedInUserData.userType === 0) {
            validator.validateAllFormFields(findProviderForm);
            findProviderFormErrors = validator.validate(findProviderForm);
        }

        if (chequeTransactionDetailsForm.invalid) {

            return;
        }

        isLoader_ProcessTransaction = true;

        let transactionData = {};

        let startDate = null;
        if (
            inputData.transactionDate !== undefined &&
            inputData.transactionDate !== null &&
            inputData.transactionDate !== ''
        ) {
            startDate = moment(inputData.transactionDate)
                .add(moment().hour(), 'hour')
                .add(moment().minutes(), 'minute')
                .add(moment().seconds(), 'second')
                .toISOString();
        }

        const patientData = selectedPatient
        transactionData = {
            'transactionId': inputData != undefined && inputData.isEdit ? inputData.transactionId : '',
            'firstName': patientData.firstName,
            'lastName': patientData.lastName,
            'phone': patientData.mobile,
            'email': patientData.email,
            'transactionCode': 'WEB',
            'transactionOrigin': 1,
            'transactionDate': startDate,
            'isDebit': true,
            'operationType': 0,
            'remarks': inputData.memo,
            'patientId': inputData.patientName,
            'initiator': loggedInUserData.userType === 0 ? 0 : 1, // intiator 0= patient , 1=provider
            'trainingMode': false,
            'tenderInfo': {
                'channelType': channelType,
                'NameOnCheck': null,
                'bankName': inputData.institutionName,
                'routingNumber': inputData.routingNumber,
                'accountType': 1,
                'accountNumber': inputData.accountNumber
                    .substr(inputData.accountNumber.length - 4),
                'checkType': null,
                'checkNumber': inputData.checkNumber,
                'amount': +inputData.subTotal,
                'taxPercent': +parseInt(inputData.taxPercent),
                'taxAmount': +parseInt(inputData.taxAmount),
                'captureAmount': +inputData.finalAmount,
                'totalAmount': +inputData.finalAmount,
                'discountType': inputData.discountList,
            }
        };
        if (inputData.discountList == 1) {
            inputData.discountAmount = +inputData.discount;
        } else {
            inputData.discountRate = +inputData.discount;
            inputData.discountAmount = +inputData.discountAmount;
        }
        return transactionData;
    }

    // Payment Prep FCs 
    const addRecurringPayment = () => {
        setIsLoader_ProcessTransaction(true)
        let startDate = null;
        const patientId = loggedInUserData.userType == 0 ?
            loggedInUserData.parentId : selectedPatient != undefined ? selectedPatient.id : inputData.patientId;
        const patientAccId = (selectedPatient != undefined && selectedPatient.id != undefined) ?
            selectedPatient.id : inputData.id;
        if (inputData.transactionDate !== undefined &&
            inputData.transactionDate !== null &&
            inputData.transactionDate !== '') {

            startDate = moment(inputData.transactionDate)
                .add(moment().hour(), 'hour')
                .add(moment().minutes(), 'minute')
                .add(moment().seconds(), 'second')
                .toISOString();
        }

        const reqObj = {
            'scheduleTransactionDate': startDate,
            'amount': +inputData.Amount,
            'taxPercent': +inputData.taxPercent,
            'totalAmount': +inputData.finalAmount,
            //'noOfPayments': 1,
            'discountType': inputData.discountList,
            //'initiator':loggedInUserData.userType==0?0:1, //intiator 0= patient intiated the transaction, 1=provider initiated transaction
            // 'accountType': patientAccType,
            'accountType': 1,
            'email': inputData.transactionEmail,
            'firstName': loggedInUserData.userType == 0 ? loggedInUserData.contact.name.firstName : selectedPatient == undefined ? inputData.firstName : selectedPatient.firstName,
            'lastName': loggedInUserData.userType == 0 ? loggedInUserData.contact.name.lastName : selectedPatient == undefined ? inputData.lastName : selectedPatient.lastName,
            'description': inputData.memo,
        };
        reqObj.patientId = patientId;
        reqObj.providerId = loggedInUserData.userType == 0 ? findProviderForm.ProviderName : loggedInUserData.parentId,
            reqObj.paymentAccountId = patientAccId;
        reqObj.recurringTransactionType = 2;
        inputData.discountList == 1 ?
            reqObj.discountAmount = +inputData.discount :
            reqObj.discountRate = +inputData.discount;
        setTimeout(() => {
            RecurringPaymentsService.addScheduleTransaction(reqObj).subscribe(
                (response) => {
                    successMessage = MessageSetting.recurring.addRecurringSuccess;
                    isRecurringCreated = true;
                    if (response.status == 0) {
                        response.statusMessage = "Cancelled";
                    } else if (response.status == 2) {
                        response.statusMessage = "Active";
                    } else if (response.status == 1) {
                        response.statusMessage = "Pending";
                    } else if (response.status == 3) {
                        response.statusMessage = "Paid";
                    }
                    cancelValue = 'Close';
                    inputDataForOperation.operationName = 'paymentPlanReceipt';
                    inputDataForOperation.recurringData = response;
                    transactionReceipt = response;

                    inputDataForOperation.recurringData.tenderInfo = selectedPatient;
                    showTransactionFailedReceipt = false;
                    showTransactionSuccessReceipt = true;
                    setIsLoader_ProcessTransaction(false)
                },
                error => {
                    setIsLoader_ProcessTransaction(false)
                    checkException2(error);
                });
        }, 5000);
    }

    const addInvoicePayment = () => {
        let reqObj = {};
        if (inputData.amountPaid < inputData.openBalance) {
            setIsLoader_PartialPayment(true)
        }
        else {
            setIsLoader_ProcessTransaction(true)
        }
        if (accountType === 'credit') {
            reqObj = {
                'paymentAccountId': (
                    selectedPatient != undefined &&
                    selectedPatient.id != undefined) ? selectedPatient.id : inputData.id,
                'channelType': channelType, // channelType,
                // 'cvData': inputData.cvv,
                'cvv': inputData.cvv,
                'email': inputData.email,
                'remarks': inputData.memo,
            };

        } else if (accountType === 'ach') {
            reqObj = {
                'paymentAccountId': (
                    selectedPatient != undefined &&
                    selectedPatient.id != undefined) ? selectedPatient.id : inputData.id,
                'channelType': channelType,
                // (selectedPatient == undefined ||
                //     selectedPatient.accountType == undefined ||
                //     selectedPatient.accountType == null ||
                //     selectedPatient.accountType == '' ||
                //     selectedPatient.accountType == '1') ? 3 : selectedPatient.accountType, // channelType,
                'email': inputData.transactionEmail,
                'remarks': inputData.memo,
            };

        } else if (accountType === 'cash') {

            let startDate = null;
            if (inputData.transactionDate !== undefined &&
                inputData.transactionDate !== null &&
                inputData.transactionDate !== '') {
                startDate = moment(inputData.transactionDate)
                    .add(moment().hour(), 'hour')
                    .add(moment().minutes(), 'minute')
                    .add(moment().seconds(), 'second')
                    .toISOString();
            }

            reqObj = {
                'transactionDate': moment(inputData.transactionDate).toISOString(),
                'channelType': channelType,
                'remarks': inputData.memo,
            };

        } else if (accountType === 'check') {
            let startDate = null;
            if (
                inputData.transactionDate !== undefined &&
                inputData.transactionDate !== null &&
                inputData.transactionDate !== ''
            ) {
                startDate = moment(inputData.transactionDate)
                    .add(moment().hour(), 'hour')
                    .add(moment().minutes(), 'minute')
                    .add(moment().seconds(), 'second')
                    .toISOString();
            }

            reqObj = {
                'transactionDate': moment(inputData.transactionDate).toISOString(),
                'channelType': channelType,
                'bankName': inputData.institutionName,
                // 'routingNumber': inputData.routingNumber,
                // 'accountNumber': inputData.accountNumber
                //     .substr(inputData.accountNumber.length - 4),
                'checkType': null,
                'checkNumber': inputData.checkNumber,
                'remarks': inputData.memo,
            };

        }

        if (loggedInUserData.userType === 1) {
            reqObj.providerId = loggedInUserData.parentId;
        } else if (loggedInUserData.userType === 0) {
            reqObj.patientId = loggedInUserData.parentId;
        }

        console.log(inputData)
        if (inputData.amountPaid) {
            reqObj.amountPaid = +inputData.amountPaid
        }
        InvoiceService.payment(props.initialData.id, reqObj)
            .then(
                (response) => {
                    response.statusMessage = TransactionStatusMapEnum[TransactionStatusEnum[response.transactionStatus]];
                    transactionReceipt = response;
                    cancelValue = 'Close';
                    if (accountType === 'credit' || accountType === 'ach') {
                        getTransactionStatusById(response.paymentId, response);
                    } else {
                        console.log(response)
                        OutputData.emit(response);
                    }
                    setIsLoader_ProcessTransaction(false)
                    setIsLoader_PartialPayment(false)
                    if (props.onClose && response.openBalance == 0) {
                        toast.success("Full Payment Made")
                        props.onClose()
                    }
                    else {
                        if (response.openBalance) {
                            inputChange({
                                target: {
                                    value: response.openBalance, name: 'openBalance'
                                }
                            })
                        }
                    }
                })
            .catch(error => {
                console.log(error)
                setIsLoader_ProcessTransaction(false)
                setIsLoader_PartialPayment(false)
                toast.error("Payment Failed")
            });
    }

    const addInvoiceRecurringPayment = () => {
        setIsLoader_ProcessTransaction(true)
        let startDate = null;
        const patientId = loggedInUserData.userType === 0 ?
            loggedInUserData.parentId : selectedPatient !== undefined ? selectedPatient.id : inputData.patientId;
        const patientAccId = (selectedPatient !== undefined && selectedPatient.id !== undefined) ?
            selectedPatient.id : inputData.id;
        if (inputData.transactionDate !== undefined &&
            inputData.transactionDate !== null &&
            inputData.transactionDate !== '') {

            startDate = moment(inputData.transactionDate)
                .add(moment().hour(), 'hour')
                .add(moment().minutes(), 'minute')
                .add(moment().seconds(), 'second')
                .toISOString();
        }

        const reqObj = {
            'scheduleTransactionDate': startDate,
            'channelType': channelType,
            // (selectedPatient === undefined ||
            //     selectedPatient.accountType === undefined ||
            //     selectedPatient.accountType === null ||
            //     selectedPatient.accountType === '' ||
            //     selectedPatient.accountType == 1) ? 3 : selectedPatient.accountType, // channelType,
            'email': inputData.transactionEmail,
            'remarks': inputData.memo,
        };

        if (loggedInUserData.userType === 1) {
            reqObj.providerId = loggedInUserData.parentId;
        } else if (loggedInUserData.userType === 0) {
            reqObj.patientId = loggedInUserData.parentId;
        }
        reqObj.paymentAccountId = patientAccId;

        // setTimeout(() => {
            InvoiceService.schedulePayment(inputData.id, reqObj)
            .then(
                (response) => {
                    setIsLoader_ProcessTransaction(false)
                    getScheduledPaymentById(response.paymentId);
                })
                .catch(error => {
                    setIsLoader_ProcessTransaction(false)
                    checkException2(error);
                });
        // }, 2000);
    }
    const processTransaction = () => {
        if (inputData.amountPaid < inputData.openBalance) {
            setIsLoader_PartialPayment(true)
        }
        else {
            setIsLoader_ProcessTransaction(true)
        }
        if (inputData.finalAmount !== undefined &&
            inputData.finalAmount &&
            inputData.transactionDate > minStartDate) {
            addInvoiceRecurringPayment();
        } else if (inputData.finalAmount !== undefined && inputData.finalAmount) {
            addInvoicePayment();
        } else if (inputData.transactionDate > minStartDate) {
            addRecurringPayment();
        } else {
            let reqObj = {};
            if (accountType === 'credit') {
                reqObj = prepareCCTransactionObject();
            } else if (accountType === 'cash') {
                reqObj = prepareCashTransactionObject();
            } else if (accountType === 'check') {
                reqObj = prepareChequeTransactionObject();
            }
            if (reqObj === null || reqObj === undefined) {
                return;
            }
            if (props.isEdit) {
                TransactionService.updateTransaction(reqObj)
                    .then(
                        (response) => {
                            response.isEdit = true;
                            setIsLoader_ProcessTransaction(false)
                            // OutputData.emit(response);
                            // if (props.onClose()) {
                            //     props.onClose()
                            // }
                        })
                    .catch(error => {
                        setIsLoader_ProcessTransaction(false)
                        // if (props.onClose()) {
                        //     props.onClose()
                        // }
                    });

            } else {
                console.log(reqObj)
                TransactionService.processTransaction(reqObj)
                    .then(
                        (response) => {
                            response.statusMessage = TransactionStatusMapEnum[TransactionStatusEnum[response.transactionStatus]];
                            transactionReceipt = response;
                            cancelValue = 'Close';
                            if (accountType === 'credit') {
                                getTransactionStatusById(response.id, response);
                            } else {

                                OutputData.emit(response);
                                // toastData = toasterService.success(MessageSetting.transaction.submit);
                                // setTimeout(() => {
                                //   toastData = toasterService.closeToaster(MessageSetting.transaction.submit);
                                // }, 5000);
                            }
                            // if (props.onClose()) {
                            //     props.onClose()
                            // }
                            setIsLoader_ProcessTransaction(false)
                        })
                    .catch(error => {
                        setIsLoader_ProcessTransaction(false)
                        console.log(error)
                        // if (props.onClose()) {
                        //     props.onClose()
                        // }
                    })
            }
        }

    }

    // useEffect(() => {
    //     setTimeout(() => {
    //         if (isLoader_ProcessTransaction) {
    //             setIsLoader_ProcessTransaction(false)
    //             if (props.onClose()) {
    //                 props.onClose()
    //             }
    //         }
    //     }, 90000)
    // }, [isLoader_ProcessTransaction])

    const updateChannelType = (account) => {
        console.log("update to ", account)
        switch (account) {
            case 'credit':
                // channelType = 3
                inputChange({
                    target: {
                        name: 'channelType', value: 3
                    }
                })
                setChannelType(3)
                break
            case 'ach':
                // channelType = 2
                inputChange({
                    target: {
                        name: 'channelType', value: 2
                    }
                })
                setChannelType(2)
                break
            case 'check':
                // channelType = 10
                inputChange({
                    target: {
                        name: 'channelType', value: 10
                    }
                })
                setChannelType(10)
                break
            case 'cash':
                // channelType = 9
                inputChange({
                    target: {
                        name: 'channelType', value: 9
                    }
                })
                setChannelType(9)
                break
            default:
                break;
        }
    }

    const findAccounts = () => {
        setIsLoader_Accounts(true)
        console.log(inputData.patientId)
        PatientService.fetchPatientAccount(inputData.patientId)
            .then(res => {
                console.log(res)
                setAccounts(res)
                setIsLoader_Accounts(false)
            })
    }
    // formula for input change
    const inputChange = (e) => {
        let newStateObject = { ...inputData };
        newStateObject[e.target.name] = e.target.value
        setInputData(newStateObject);
        return console.log(inputData)
    };
    const patientLookup = () => {
        setIsLoader_Patients(true)
        if (props.patientId || props.initialData.patientId) {
            let patientId = props.patientId || props.initialData.patientId
            PatientService.getPatientById(patientId)
                .then(res => {
                    console.log(res.data)
                    setPatientList([res.data])
                    setIsLoader_Patients(false)
                })
        }
        else {
            let reqObj = { SearchTerm: '', isActive: true, isRegistered: true, SortField: 'firstName' }
            CommonService.patientLookup(reqObj)
                .then(res => {
                    if (res) {
                        setPatientList(res)
                        if (inputData.patientId) {
                            setSelectedPatient(res.data.find(obj => obj.id === inputData.patientId))
                        }
                    }
                    setIsLoader_Patients(false)
                }
                )
                .catch(err => {
                    console.log(err)
                    setIsLoader_Patients(false)
                })

        }
    }
    useEffect(() => {
        patientLookup()
    }, [])
    useEffect(() => {
        if (inputData.patientId) {
            findAccounts()
        }
        if (selectedPatient) {
            inputChange({ target: { name: 'email', value: selectedPatient.email } })
        }
    }, [selectedPatient])

    useEffect(() => {
        let account = { ...selectedAccount }
        delete account.createdOn
        if (selectedAccount) {
            setAccountType(accountTypes[account.accountType].toLowerCase())
            updateChannelType(accountTypes[account.accountType].toLowerCase())
        }
        setInputData({ ...inputData, ...account, ...selectedPatient })
    }, [selectedAccount])

    useEffect(() => {
        if (inputData?.amountPaid || props.initialData.amountPaid) {
            inputChange({ target: { value: inputData.finalAmount - inputData.amountPaid || props.initialData.finalAmount - props.initialData.amountPaid, name: 'openBalance' } })
            // return inputChange({ target: { value: inputData.openBalance, name: 'openBalance' } })
        }
        else {
            inputChange({ target: { value: inputData.finalAmount || props.initialData.finalAmount, name: 'openBalance' } })
            return inputChange({ target: { value: inputData.finalAmount || props.initialData.finalAmount, name: 'amountPaid' } })
        }
    }, [props.initialData?.amountPaid])

    useEffect(()=>{
        if(inputData.amountPaid){
            inputChange({ target: { value: inputData.finalAmount - inputData.amountPaid,name:'openBalance'}})
        }
    },[inputData.amountPaid])
    // useEffect(() => {
    //     if (props.initialData?.openBalance == null) {
    //         inputChange({ target: { value: inputData.finalAmount, name: 'openBalance' } })

    //     }

    // }, [props.initialData])
    console.log(props.initialData)
    return (
        <div className='m-0 p-0'>
            <div className='card-body'>
                {isLoader_ProcessTransaction && <DimLoader />}
                {isLoader_PartialPayment && <DimLoader loadMessage="Partial Payment Processing. Please wait to process additional payments." />}
                <form id="form">
                    <div className='row'>
                        <div className='col-3 card m-0 p-0 bg-light'>
                            <div className='card-body p-3'>
                                {/* {accountType} */}
                                {/* {channelType} */}
                                {/* <h5 className='mb-3'>Payment Summary</h5> */}
                                {/* {props.initialData.id} */}
                                <div>
                                    <div className='field'>
                                        <label>Reference No</label>
                                        <input name="refNo" type="text" value={inputData.invoiceNumber || inputData.refNo} />
                                    </div>
                                    <div className='field'>
                                        <label>Amount</label>
                                        <div className='input-group align-items-center'>
                                            <input name="subTotal" type="text" disabled value={Utilities.toDollar(inputData.finalAmount)} />
                                        </div>
                                    </div>
                                    {/*  <div className='field'>
                                        <label>Tax Amount</label>
                                        <div className='input-group align-items-center'>
                                            <input name="taxAmount" type="text" value={Utilities.toDollar(inputData.taxAmount)} disabled />
                                        </div>
                                    </div> */}
                                    <div className='field'>
                                        <label>Payment Amount</label>
                                        <div className='input-group align-items-center'>
                                            <input name="amountPaid" type="text" value={inputData.amountPaid} onChange={e => { e.preventDefault(); inputChange(e) }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='card-footer m-0 align-items-end bg-dark mt-3 text-white p-3'>
                                {/* Total Amount: {Utilities.toDollar(inputData.subTotal + inputData.taxAmount) || '0.00'} */}
                                <label className='text-white text-end'>Total Amount</label>
                                <input name="finalAmount" className='text-white text-end' type="text" value={Utilities.toDollar(inputData.finalAmount)} disabled />
                                {/* Total Amount: {Utilities.toDollar(inputData.subTotal + inputData.taxAmount) || '0.00'} */}
                                <label className='text-white text-end'>Remainder</label>
                                <input name="openBalance" className='text-white text-end' type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={Utilities.toDollar(inputData.openBalance)} disabled />
                            </div>
                        </div>
                        <div className='col-9 card m-0 p-3'>
                            <h5 className='card-title '>Search Patient</h5>
                            <div className='field mb-3'>
                                <div className='col-12 input-group'>
                                    <Select
                                        options={patientList}
                                        name="patientId"
                                        value={patientList && patientList.find(obj => obj.id === inputData.patientId)}
                                        isSearchable
                                        isLoading={isLoader_Patients}
                                        placeholder="Loading Patient..."
                                        classNamePrefix="react-select"
                                        className="react-select-container"
                                        isDisabled={inputData.patientId}
                                        onChange={e => {
                                            inputChange({
                                                target:
                                                    { value: e.id, name: 'patientId' }
                                            })
                                            setSelectedPatient(e)
                                        }}
                                        getOptionLabel={(option) => {
                                            option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                                            return (
                                                option.firstName + ' ' + option.lastName + ' | ' + moment.utc(option.dob).format("M/D/YYYY") + ' | ' + Utilities.toPhoneNumber(option.mobile) || Utilities.toPhoneNumber(option.patientPhone)
                                            )
                                        }
                                        }
                                        getOptionValue={(option) => option.id}
                                        noOptionsMessage={(e) => { return <button className='btn btn-primary form-control'>Add Patient</button> }}
                                    />
                                    {/* <button className='btn btn-primary' title="Add Patient" onClick={e => { e.preventDefault(); setShowAdd(true) }}><i className='icon plus' /></button> */}
                                </div>
                            </div>
                            {accountType === 'check' || accountType === 'cash' ? null : <div className='field mb-3 input-group'>
                                <Select
                                    classNamePrefix="react-select"
                                    className="react-select-container"
                                    options={accounts}
                                    name="paymentAccountId"
                                    isLoading={isLoader_Accounts}
                                    isClearable
                                    value={accounts ? accounts.find(obj => obj.id === inputData.account?.id) : null}
                                    onChange={e => {
                                        inputChange({
                                            target: {
                                                name: 'paymentAccountId', value: e?.id || null
                                            }
                                        })
                                        setSelectedAccount(e)
                                        console.log(e)
                                    }}
                                    placeholder="Select Account"
                                    isDisabled={props.isDisabled}
                                    getOptionLabel={(option) => {
                                        let label = ""
                                        if (option.accountType === 1) {
                                            label = accountTypes[option.accountType] + ' | ' + option.cardType + ' ' + option.maskedCardNumber + ' | ' + option.accountHolderName
                                        }
                                        else if (option.accountType === 2) {
                                            label = accountTypes[option.accountType] + ' | ' + option.bankName + ' ' + option.maskedAccountNo + ' | ' + option.accountHolderName
                                        }
                                        return label
                                    }
                                    }
                                    getOptionValue={(option) => option.id}
                                    noOptionsMessage={() => { return <button className='btn btn-primary form-control' onClick={e => { e.preventDefault(); setShowAdd(true) }}>Add Account</button> }}
                                />
                                {!props.isDisabled && <button className='btn btn-primary col-auto' title="Add Account" onClick={e => { e.preventDefault(); setShowAdd(true) }}><i className='icon plus' /></button>}
                            </div>}
                            <TabsTemplate activeKey={accountType} onSelect={k => { console.log(k); setAccountType(k); return updateChannelType(k) }}>
                                <div eventKey="credit" disabled={selectedAccount && selectedAccount.accountType !== 1} title={<span><i className='icon credit card' />Card</span>}>
                                    <div className="row align-items-end">
                                        <div className='field required col-12'>
                                            <label>Name on Card</label>
                                            <input name="accountHolderName" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.accountHolderName} />
                                        </div>
                                        <div className='field required col-5'>
                                            <label>Last 4 of Card</label>
                                            <div className='input-group'>
                                                <input name="maskedCardNumber" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.maskedCardNumber} />

                                                <span className="input-group-text bg-transparent" id="basic-addon1">
                                                    <i className={`mx-auto icon bg-transparent text-primary large ${cardType ? icons[inputData.cardType] : 'credit card'}`} ></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className='field required col-2'>
                                            <label>CVV</label>
                                            <input name="cvv" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.cvv} />
                                        </div>
                                        <div className='field required col-5'>
                                            <label>Exp.</label>
                                            <input name="cardExpiry" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.cardExpiry} />
                                        </div>
                                        <div className='field required col'>
                                            <label>Schedule On</label>
                                            <input name="createdOn" type="date" onChange={e => { inputChange(e) }} onChangeCapture={e => { e.preventDefault(); handleEnter(e) }} value={Utilities.toDate(inputData.createdOn) || Utilities.toDate(new Date())} />
                                        </div>
                                        <div className='field col-12'>
                                            <label>Email</label>
                                            <input name="email" type="email" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.email} />
                                        </div>
                                        <div className='field col-12'>
                                            <label>Memo</label>
                                            <textarea className='form-control' name="memo" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.memo} defaultValue="Thank you for your business" />
                                        </div>
                                    </div>
                                </div>
                                <div eventKey="ach" disabled={selectedAccount && selectedAccount.accountType !== 2} title={<span><i className='icon credit card' />ACH</span>}>
                                    <div className='row align-items-end'>
                                        <div className="field col-6">
                                            <label>Routing Number</label>
                                            <input name="routingNumber" placeholder='Routing/Transit Number' type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.routingNumber} />
                                        </div>
                                        <div className="field col-6">
                                            <label>Account Number</label>
                                            <input name="maskedAccountNo" placeholder='Routing/Transit Number' type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.maskedAccountNo} />
                                        </div>
                                        <div className="field col-6">
                                            <label>Account Name</label>
                                            <input name="accountHolderName" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.accountHolderName} />
                                        </div>
                                        <div className="field required col-6">
                                            <label>Account Type</label>
                                            <select name="nameOfInstitution" className='form-select' type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.nameOfInstitution}>
                                                <option value="checking">Checking</option>
                                                <option value="savings">Savings</option>
                                            </select>
                                        </div>
                                        <div className="field col-12">
                                            <label>Email</label>
                                            <input name="email" type="email" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.email} />
                                        </div>
                                        <div className="field col-12">
                                            <label>Memo</label>
                                            <textarea name="memo" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.memo || "Thank you for your business"} />
                                        </div>
                                    </div>
                                </div>
                                <div eventKey="check" disabled={selectedAccount && selectedAccount.accountType !== 3} title={<span><i className='icon money bill alternate outline' />Check</span>}>
                                    <div className='row align-items-end'>
                                        <div className="field required col-6">
                                            <label>Date Collected</label>
                                            <input name="createdOn" type="date" onChange={e => { inputChange(e); }} value={inputData.createdOn} nChangeCapture={e => { e.preventDefault(); handleEnter(e) }} />
                                        </div>
                                        <div className="col-6">
                                            <label>Check Number</label>
                                            <input name="checkNumber" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.checkNumber} />
                                        </div>
                                        <div className="field col-12">
                                            <label>Name of Institution</label>
                                            <input name="nameOfInstitution" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.nameOfInstitution} />
                                        </div>
                                        <div className="field col-12">
                                            <label>Memo</label>
                                            <textarea name="memo" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.memo || "Thank you for your business"} />
                                        </div>
                                    </div>
                                </div>
                                <div eventKey="cash" disabled={selectedAccount && selectedAccount.accountType !== 4} title={<span><i className='icon money bill alternate outline' />Cash</span>}>
                                    <div className='row align-items-end'>
                                        <div className="field required col-auto">
                                            <label>Date Collected</label>
                                            <input name="createdOn" type="date" onChange={e => { inputChange(e) }} value={inputData.createdOn || Utilities.toDate(moment())} nChangeCapture={e => { e.preventDefault(); handleEnter(e) }} />
                                        </div>
                                        <div className="field col-12">
                                            <label>Memo</label>
                                            <textarea name="memo" type="text" onChange={e => { e.preventDefault(); inputChange(e) }} value={inputData.memo || "Thank you for your business"} />
                                        </div>
                                    </div>
                                </div>
                            </TabsTemplate>
                        </div>
                    </div >
                </form>
            </div >
            <div className='d-flex justify-content-between'>
                <div className='col-auto'>
                    {props.isModal && <button className="btn btn-secondary" onClick={e => { e.preventDefault(); props.onClose() }}>Cancel</button>}
                </div>
                <div className='col-auto'>
                    <button className="btn btn-primary" onClick={e => { e.preventDefault(); processTransaction(inputData); }}>{props.submitLabel || 'Collect Payment'}</button>
                </div>
            </div>
            <ModalBox open={showAdd} onClose={() => { setShowAdd(false) }}>
                <PatientAccountAdd patientId={inputData.patientId} onClose={() => { setShowAdd(false); findAccounts() }} />
            </ModalBox>
        </div >
    )
}

export default VirtualTerminalForm