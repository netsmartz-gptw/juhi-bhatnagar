import React, { useState, useEffect } from 'react'
import defaultLogo from '../../../../../../../assets/images/logo_login.png'
import tinycolor from 'tinycolor2'
import ProviderService from '../../../../../../services/api/provider.service'
import ThemeService from '../../../../../../services/api/theme.service'
import LoginService from '../../../../../../services/api/login.service'
import SettingsService from '../../../../../../services/api/settings.service'
import StorageService from '../../../../../../services/session/storage.service'
const BrandSettings = (props) => {
    const [brandImage, setBrandImage] = useState(defaultLogo)
    const [primaryColor, setPrimaryColor] = useState("#FF6B07")
    const [logo, setLogo] = useState(defaultLogo)
    const [secondaryColor, setSecondaryColor] = useState("#8D94AB")
    const [tempLogo, setTempLogo] = useState()
    const [fadeColor, setFadeColor] = useState(tinycolor('#FF6B07').lighten(40))

    useEffect(() => {
        setFadeColor(tinycolor(primaryColor).lighten(40))
    }, [primaryColor])

    let defaultColors = [
        "#FF6B07",
        "#8D94AB"
    ]
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
                    <div className='card-header text-center p-3' style={{ backgroundColor: fadeColor, color: primaryColor }}>Select a Theme</div>
                    <div className='row d-flex g-3 m-0'>
                        <div className='col text-center row justify-content-around'>
                            <label for="primaryColor" className="form-label">Select Primary Color</label>
                            <input type="color" className="form-control form-control-color" id="primaryColor" value={primaryColor} onChange={e => { e.preventDefault(); setPrimaryColor(e.target.value) }} title="Select Primary Color" />
                        </div>
                        <div className='col text-center row justify-content-around'>
                            <label for="secondaryColor" className="form-label">Select Primary Color</label>
                            <input type="color" className="form-control form-control-color" id="secondaryColor" value={secondaryColor} onChange={e => { e.preventDefault(); setSecondaryColor(e.target.value) }} title="Select Secondary Color" />
                        </div>
                        <div className='col text-center row justify-content-around'>
                            <label for="fadeColor" className="form-label">Fade Color</label>
                            <input type="color" className="form-control form-control-color" id="fadeColor" value={fadeColor} onChange={e => { e.preventDefault(); setFadeColor(e.target.value) }} title="Calculated Fade Color" disable />
                        </div>
                        <hr className='p-0' />
                        <div className='col-12 row d-flex justify-content-between m-0 p-x3 pb-3'>
                            <button className='btn text-white col-auto' style={{ backgroundColor: primaryColor }}>
                                Update
                            </button>
                            <button className='btn col-auto text-white' style={{ backgroundColor: secondaryColor }}
                                onClick={e => { e.preventDefault(); setPrimaryColor(defaultColors[0]); setSecondaryColor(defaultColors[1]) }}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BrandSettings