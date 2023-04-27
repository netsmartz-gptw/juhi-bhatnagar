const ThemeService = {
  skin7: {
    'primary-color': '#F36C21',
    'primary-light': '#FDECE3',
    'secondary-color': '#6C757D',
  },

  skin1: {
    'primary-color': '#4627CF',
    'primary-light': '#D4CDF5',
    'secondary-color': '#6C757D',
  },

  skin2: {
    'primary-color': '#1E9C40',
    'primary-light': '#F0FCF3',
    'secondary-color': '#6C757D',
  },
  skin3: {
    'primary-color': '#E72124',
    'primary-light': '#FBD9DA',
    'secondary-color': '#6C757D',
  },

  skin4: {
    'primary-color': '#21424F',
    'primary-light': '#BED9E4',
    'secondary-color': '#6C757D',
  },
  skin5: {
    'primary-color': '#182C4E',
    'primary-light': '#DEE4F8',
    'secondary-color': '#F9AE52',
  },

  skin6: {
    'primary-color': '#9A536A',
    'primary-light': '#E7D2D9',
    'secondary-color': '#6C757D',
  },
  skin8: {
    'primary-color': '#007C9D',
    'primary-light': '#BED9E4',
    'secondary-color': '#FDB913',
  },
  skin9: {
    'primary-color': '#6E479E',
    'primary-light': '#E2CBFF',
    'secondary-color': '#8CC63F',
  },
  changeTheme(data) {
    let selectedTheme
    switch (data) {
      case 7:
        selectedTheme = this.skin7;
        break;
      case 0:
        selectedTheme = this.skin7;
        break;
      case 1:
        selectedTheme = this.skin1;
        break;
      case 2:
        selectedTheme = this.skin2;
        break;
      case 3:
        selectedTheme = this.skin3;
        break;
      case 4:
        selectedTheme = this.skin4;
        break;
      case 5:
        selectedTheme = this.skin5;
        break;
      case 6:
        selectedTheme = this.skin6;
        break;
      case 8:
        selectedTheme = this.skin8;
        break;
      case 9:
        selectedTheme = this.skin9;
        break;
      default:
        break;
    }
    this.setTheme(selectedTheme);
    // document.getElementById('favicon').href = `../src/assets/images/skins/favicons/skin${data}.ico`;
  },

  setTheme(theme) {
    Object.keys(theme).forEach(k =>
      document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  },
}
export default ThemeService