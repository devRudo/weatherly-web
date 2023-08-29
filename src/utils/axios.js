import axios from "axios";

let baseURL = "";
baseURL = process.env.REACT_APP_API_URL;

// console.log(process.env.REACT_APP_API_URL);
// if(processColor.env.REACT_APP_TARGET_ENV === 'development'){
//     baseURL = 'http://localhost:3000/'
// }

export default axios.create({
  baseURL,
});
