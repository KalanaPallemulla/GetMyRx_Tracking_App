import {showMessage} from 'react-native-flash-message';

export function showAlert({message = '', type = 'success'}) {
  showMessage({
    message: message,
    type: type,
    duration: 2000,
    position: 'center',
    style: {
      width: '80%',
      minHeight: '10%',
      backgroundColor: type === 'success' ? '#35cc62' : '#e32b3e',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyle: {
      textAlign: 'center',
    },
  });
}
