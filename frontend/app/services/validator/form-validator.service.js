import toast from "react-hot-toast"

const FormValidatorService = {
    checkErrors(e, config) {
        let key = this.camelToPascalCase(e.target.name)
        // toast.error(config[key]?.pattern?.regex && config[key].pattern?.regex.test(e.target.value) === false ? 'false' : 'true')
        let value = e.target.value
        if (config[key]?.required && value == null || !value || value=="") {
            let keyName = this.camelCaseConverter(e.target.name)
            return `${keyName} is required`
        }
        else if (config[key]?.minlength && value.length < config[key].minlength.min && value.length !==0) {
            let keyName = this.camelCaseConverter(e.target.name)
            return `${keyName}  must be ${config[key].minlength.min} characters long`
        }
        else if (config[key]?.pattern?.regex && config[key].pattern?.regex.test(e.target.value) === false) {
            let keyName = this.camelCaseConverter(e.target.name)
            return `${keyName} is invalid`
        }
        else if (config[key]?.maxlength && value.length > config[key].maxlength.max) {
            let keyName = this.camelCaseConverter(e.target.name)
            return `${keyName} must be ${config[key].maxlength.max} characters or less`
        }
        else {
            return false
        }

    },
    setErrors(e, errors, config) {
        let newObj = errors
        let newError = this.checkErrors(e, config)
        if (newError === false) {
            delete newObj[e.target.name]
        }
        else {
            newObj[e.target.name] = newError
        }
        return newObj
    },
    camelCaseConverter(string) {
        let newString = []
        for (let i = 0; i < string.length; i++) {
            if (i === 0) {
                newString.push(string[i].toUpperCase())
            }
            else if (string[i].toUpperCase() == string[i]) {
                newString.push(" " + string[i])
            }
            else {
                newString.push(string[i])
            }
        }
        return newString.join("")
    },
    camelToPascalCase(string) {
        let newString = string
        if (typeof newString !== "string") {
            newString = newString.toString()
        }
        return newString[0]?.toUpperCase() + newString.substr(1)
    },
    checkForm(errors, data, required) {
        let confirmed = true
        let keys = Object.keys(errors)
        let dataKeys = Object.keys(data)
        console.log(dataKeys)
        if(dataKeys.length<1){
            console.log("no data keys")
            confirmed=false
        }
        else {
            dataKeys.map(key => {
                if (required.includes(key) && data[key] ==null) {
                    console.log("no data for ",key)
                    confirmed = false
                }
            })
        }
        if(required.map(key=>{
            if(!data[key]){
                console.log('No ',key)
                confirmed=false
            }
        }))
        return confirmed
    }
}
export default FormValidatorService