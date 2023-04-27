import React, { useState, useEffect, useContext } from 'react'
import defaultLogo from '../../../../../../../assets/images/logo_login.png'
import ThemeService from '../../../../../../services/api/theme.service'
import LoginService from '../../../../../../services/api/login.service'
import SettingsService from '../../../../../../services/api/settings.service'
import StorageService from '../../../../../../services/session/storage.service'
import toast from 'react-hot-toast'
import { store } from '../../../../../../context/StateProvider'

const skins = [
    { key: 1, colors: ['#4627CF', '#6C757D'] },
    { key: 2, colors: ['#1E9C40', '#6C757D'] },
    { key: 3, colors: ['#E72124', '#6C757D'] },
    { key: 4, colors: ['#21424F', '#6C757D'] },
    { key: 5, colors: ['#182C4E', '#F9AE52'] },
    { key: 6, colors: ['#9A536A', '#6C757D',] },
    { key: 7, colors: ['#F36C21', '#6C757D'] }
]
const otherSkins = [{ key: 1, ...ThemeService.skin1 }, { key: 2, ...ThemeService.skin2 }, { key: 3, ...ThemeService.skin3 }, { key: 4, ...ThemeService.skin4 }, { key: 5, ...ThemeService.skin5 }, { key: 6, ...ThemeService.skin6 }, { key: 7, ...ThemeService.skin7 }, { key: 8, ...ThemeService.skin8 },{key:9,...ThemeService.skin9}]
const BrandSettingsBeta = (props) => {
    const [brandImage, setBrandImage] = useState(defaultLogo)
    const [logo, setLogo] = useState(defaultLogo)
    const state = useContext(store).state
    const [selectedTheme, setSelectedTheme] = useState(JSON.parse(StorageService.get('session', 'settingsData')).skin)
    const [defaultTheme, setDefaultTheme] = useState(JSON.parse(StorageService.get('session', 'settingsData')).skin)

    useEffect(() => {
        if (typeof selectedTheme === 'number') {
            ThemeService.changeTheme(selectedTheme)
        }
    }, [selectedTheme])
    const saveTheme = (theme) => {
        if (typeof selectedTheme === 'number') {
            SettingsService.putProviderSettingsSkin({ skin: selectedTheme })
                .then(res => {
                    console.log(res)
                    toast.success("Theme is updated")
                    let settings = JSON.parse(StorageService.get('session', 'settingsData'))
                    settings.skin = selectedTheme
                    return StorageService.save('session', "settingsData", JSON.stringify(settings))
                })
        }
    }
    const fetchLogo = () => {
        let settings = JSON.parse(StorageService.get('session', 'settingsData'))
        return LoginService.getLogoTheme(settings.providerName)
            .then(res => {
                console.log(res)
                setLogo(res.logo)
                settings.logo = res.logo
                return StorageService.save('session', "settingsData", JSON.stringify(settings))
            })
    }
    const getLogo = () => {
        let settings = JSON.parse(StorageService.get('session', 'settingsData'));
        if (settings?.logo) {
            setLogo(settings.logo)
        }
    }
    const submitLogo = (e) => {
        setLogo()
        SettingsService.putProviderSettingsLogo(e.target.files[0])
            .then(res => {
                console.log(res)
                fetchLogo()
            })
    }
    useEffect(() => {
        if (!logo) {
            fetchLogo()
        }
    }, [logo])
    useEffect(() => {
        getLogo()
    }, [])
    return (
        <div className='row d-flex justify-content-around'>
            <div className='col-xl-4 col-12'>
                <div className='card m-3'>
                    <div className='card-header text-center primary-header pt-3'>Upload Your Brand Logo</div>
                    <img src={logo || brandImage} className="card-img-top p-3" />
                    <hr className='p-0 mb-0' />
                    <div className="card-body">
                        {/* <label for="formFile" className="form-label">Upload Your Brand Logo</label> */}
                        <input className="form-control" type="file" id="formFile" onChange={e => { e.preventDefault(); submitLogo(e) }} />
                    </div>
                </div>
            </div>
            <div className='col-xl-8 col-12'>
                <div className='card m-3'>
                    <div className='card-header text-center primary-header pt-3'>Select a Theme </div>
                    <div className="card-body d-flex row justify-content-start">
                        {otherSkins.map((skin, i) => {
                            return (
                                <div className='col-12 mb-3 d-flex justify-content-center align-items-center' title={skin.key} onClick={e => { e.preventDefault(); setSelectedTheme(skin.key) }}>
                                    <span className='me-5 w-150px text-end'>{skin.key === selectedTheme ? <i className='icon check' /> : null} Theme {skin.key}</span>
                                    <button className='col-auto btn-group btn p-0'>
                                        <span className="btn" style={{ backgroundColor: skin['primary-color'] }}><span style={{ color: 'white' }}>Primary</span></span>
                                        <span className='btn' style={{ backgroundColor: skin['primary-light'] }}><span style={{ color: 'black' }}>Primary Light</span></span>
                                        <span className='btn' style={{ backgroundColor: skin['secondary-color'] }}><span style={{ color: 'white' }}>Secondary</span></span>
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    <div className='d-flex justify-content-between p-3'>
                        <div className='col-auto'>
                            <button className='btn btn-secondary' onClick={e => { e.preventDefault(); setSelectedTheme(defaultTheme) }}>Reset</button>
                        </div>
                        <div className='col-auto'>
                            <button className='btn btn-primary' onClick={e => { e.preventDefault(); saveTheme(selectedTheme) }}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BrandSettingsBeta