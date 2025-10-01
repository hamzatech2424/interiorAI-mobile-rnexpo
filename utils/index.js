import Toast from 'react-native-toast-message';


const successToast = (message) => {
    Toast.show({
        type: 'success',
        text1: message,
    })
}


const errorToast = (message) => {
    Toast.show({
        type: "error",
        text1: message,
    });
}


export { errorToast, successToast };

