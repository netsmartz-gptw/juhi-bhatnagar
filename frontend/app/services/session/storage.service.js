import StorageType from './storage.enum';
import {encode, decode} from 'base-64'

const StorageService = {

    prefix : 'nav',
    count : 0,

    setLoginCount() {
        this.count += 1;
    },
    setFirstLoginCount() {
        this.count = 0;
    },
    getLoginCount() {
        return this.count;
    },
    save(type, key, value) {
        // console.log(type, key, value)
        if (type === StorageType.local) {
            localStorage.setItem(this.prefix + key, this.encryptBase64(value));
        } else if (type === StorageType.session) {
            sessionStorage.setItem(this.prefix + key, this.encryptBase64(value));
        }
    },

    get(type, key) {
        if (type === StorageType.local) {
            if (localStorage.getItem(this.prefix + key)) {
                return this.decryptBase64(localStorage.getItem(this.prefix + key));
            }
            return;
        }
        if (type === StorageType.session) {
            if (sessionStorage.getItem(this.prefix + key)) {
                return this.decryptBase64(sessionStorage.getItem(this.prefix + key));
            }
            return null;
        }
    },

    remove(type, key) {
        if (type === StorageType.local) {
            localStorage.removeItem(this.prefix + key);
        }
        if (type === StorageType.session) {
            sessionStorage.removeItem(this.prefix + key);
        }
    },

    encryptBase64(stringData) {
        return encode(stringData);
    },
    decryptBase64(stringData) {
        return decode(stringData);
    }
}

export default StorageService
