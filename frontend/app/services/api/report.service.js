import axios from "axios"
import AppSetting from "../../common/constants/appsetting.constant"
import CommonService from "./common.service"

const ReportService = {
    getEmployeeWorkTicket(providerId, practiceLocationId, reqObj) {
        let loggedInUserData = this.getLoggedInData()
        let url = AppSetting.reports.getEmployeeWorkTicket.replace('{parentId}', loggedInUserData.parentId).replace('{providerId}', providerId).replace('{locationId}', practiceLocationId)
        if (reqObj !== {}) {
            url = `${url}${this.buildQuery(reqObj)}`
        }
        return axios.get(url)
            .then(res => {
                console.log(res)
                return res.data
            })
            .catch(err => {
                return err
            })
    },
    getEmployeeSalesReport(reqObj) {
        let loggedInUserData = this.getLoggedInData()
        let url = AppSetting.reports.getEmployeeSalesReport.replace('{parentId}', loggedInUserData.parentId)
        url = `${url}${this.buildQuery(reqObj)}`
        return axios.get(url)
        .then(res=>{
            return res.data
        })
        .catch(err=>{
            return err
        })
    },
    getReconciliationReport(reqObj){
        let loggedInUserData = this.getLoggedInData()
        let url = AppSetting.reports.getReconciliationReport.replace('{parentId}', loggedInUserData.parentId)
        url = `${url}${this.buildQuery(reqObj)}`
        return axios.get(url)
        .then(res=>{
            // console.log(res)
            return res.data
        })
        .catch(err=>{
            return err
        })
    },
    
    buildQuery(reqObj) {
        return CommonService.buildQuery(reqObj)
    },
    getLoggedInData() {
        return CommonService.getLoggedInData()
    }
}

export default ReportService