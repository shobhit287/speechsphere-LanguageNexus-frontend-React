import axios from "axios";
import {toast} from 'react-toastify';
const BASE_URL = window.location.hostname === 'localhost' ? process.env.REACT_APP_BASE_URL : process.env.REACT_APP_IP_BASE_URL;;

export function verify_token() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token')
            debugger;
            axios.post(`${BASE_URL}/verifytoken`, {}, {
                    headers: {
                        'Authorization': `${token}`
                    }
                })
                .then(response => {
                    resolve(response.data.status);
                })
                .catch(error => {
                    toast.error("Error While Verifiying User")
                    // reject(error);
                });
              
        } else {
            resolve(false);
        }
    });
}
