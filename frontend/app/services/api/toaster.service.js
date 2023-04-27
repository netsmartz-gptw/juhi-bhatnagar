import {MessageType} from '../../common/enum/storage.enum';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ToasterService = {
  data : {},
  message : {
    isOnline: true,
    message: ''
  },

  successRedirect(message, redirectLink) {
    this.data = {
      message: message,
      messageType: MessageType.success,
      isShow: true,
      redirectLink: redirectLink
    };
    return this.data;
  },
  errorRedirect(message, redirectLink) {
    this.data = {
      message: message,
      messageType: MessageType.error,
      isShow: true,
      redirectLink: redirectLink
    };
    return this.data;
  },
  warningRedirect(message, redirectLink) {
    this.data = {
      message: message,
      messageType: MessageType.warning,
      isShow: true,
      redirectLink: redirectLink
    };
    return this.data;
  },
   closeToasterRedirect(message, redirectLink) {
    this.data = {
      message: message,
      messageType: MessageType.closed,
      isShow: false,
      redirectLink: redirectLink
    };
    return this.data;
  },


  success(message) {
    this.data = {
      message: message,
      messageType: MessageType.success,
      isShow: true,
    };
    toast.success(message)
    return this.data;
  },
  error(message) {
    this.data = {
      message: message,
      messageType: MessageType.error,
      isShow: true
    };
    toast.error(message)
    return this.data;
  },
  warning(message) {
    this.data = {
      message: message,
      messageType: MessageType.warning,
      isShow: true
    };
    toast.warning(message)
    return this.data;
  },
   closeToaster(message) {
    this.data = {
      message: message,
      messageType: MessageType.closed,
      isShow: true
    };
    return this.data;
  },

  checkOnlineStatus() {
    this.message.isOnline = navigator.onLine;
    this.message.message = 'Please check internet connection.';
    return this.message;
  },
  isServerDown() {
    Navigate(['/comingsoon']);
    return false;
  }
}

export default ToasterService
