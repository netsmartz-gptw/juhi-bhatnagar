import AppSetting from '../../common/constants/appsetting.constant';
import axios from 'axios'
import StorageService from '../session/storage.service';
import StorageType from '../session/storage.enum';
let loggedInUserData = {};

const FeaturesAccessService = {

    getLoggedInData() {
        return JSON.parse(StorageService.get(StorageType.session, 'userDetails'));
    },

    getDefaultFeaturesAccess(userType) {

        let url;
        url = AppSetting.featuresaccess.getDefaultconfig
            .replace('{userType}', userType);

        return axios.get(url)
            .then((a => axios.log(`fetched`))
                .catch(error => { console.log(error) })
            );
    },

    getModuleAccessById(providerId) {
        this.loggedInUserData = this.getLoggedInData();
        let url;

        url = AppSetting.featuresaccess.addModuleConfig
            .replace('{parentId}', providerId);

        // return this.commonAPIFuncService.get(url)
        //     .pipe(
        //         tap(a => this.commonService.log(`fetched`)),
        //         catchError(this.commonService.handleError('', []))
        //     );
        return axios.get(url)
            .then((a => axios.log(`fetched`))
                .catch(error => { console.log(error) })
            );
    },

    postModuleAccess(data, providerId) {
        this.loggedInUserData = this.getLoggedInData();
        let url;
        url = AppSetting.featuresaccess.addModuleConfig
            .replace('{parentId}', providerId);

        return axios.post(url, data)
            .then((a => axios.log(`added  w/ id`))
                .catch(error => { console.log(error) })
            );
    },

    postFeatureAccess(data) {
        let loggedInUserData = this.getLoggedInData();
        let url;
        url = AppSetting.featuresaccess.addfeatureConfig
            .replace('{parentId}', loggedInUserData.parentId);
        return axios.post(url, data)
            .then(a => {
                console.log(a.data.data)
                a.data.data.forEach(element => {
                    element.isSmsEnabled = Boolean(JSON.parse(element.isSmsEnabled));
                    element.isEmailEnabled = Boolean(JSON.parse(element.isEmailEnabled));
                });
                const data = a.data.data;
                return data;
            })
                .catch(error => { console.log(error) })
    }

}

export default FeaturesAccessService
