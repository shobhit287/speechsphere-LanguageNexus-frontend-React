import axios from "axios";
const BASE_URL = window.location.host === 'localhost:3000' ? process.env.REACT_APP_BASE_URL : process.env.REACT_APP_IP_BASE_URL;

export function verify_token() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token')
            axios.post(`${BASE_URL}/verifytoken`, {}, {
                    headers: {
                        'Authorization': `${token}`
                    }
                })
                .then(response => {
                    resolve(response.data.status);
                })
                .catch(error => {
                    // reject(error);
                });
              
        } else {
            resolve(false);
        }
    });
}
