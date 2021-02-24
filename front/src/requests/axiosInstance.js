/*
 * Created in février 2021
 * Written by Eden Cadagiani <e.cadagiani@gmail.com>
 */

import axios from "axios";


const axiosInstance = axios.create( {
    baseURL: process.env.REACT_APP_SERVER_HOST,
} );


export default axiosInstance;
