import axios from "axios";
import * as helper from "./serviceHelpers";
import debug from "sabio-debug";


const endpoint =  `${helper.API_HOST_PREFIX}/api/loanapplications`;
const _logger = debug.extend("LoanAppService")


const getLoanApps = (pageIndex, pageSize) =>{
    const config = {
      method: "GET",
      url: `${endpoint}/paginated/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }
    };
  
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  };


  const searchByType = (pageIndex, pageSize, typeId) =>{
    const config = {
      method: "GET",
      url: `${endpoint}/type/?pageIndex=${pageIndex}&pageSize=${pageSize}&loanTypeId=${typeId}`,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  };

  const searchByUser = (query,pageIndex, pageSize) =>{
    const config = {
      method: "GET",
      url: `${endpoint}/search/?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  };

  const add = (payload) => {
    _logger("AddLoanApps Service executing", payload)
    const config = {
      method: "POST", 
      url: `${endpoint}`,
      data: payload,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };

    return axios(config)
    .then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  }; 

  const getCurrent = (Id,pageIndex, pageSize) =>{
    const config = {
      method: "GET",
      url: `${endpoint}/current?pageIndex=${pageIndex}&pageSize=${pageSize}&userId=${Id}`,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  };

  const loanAppsService = {getLoanApps, searchByType, add,searchByUser, getCurrent};


  export default loanAppsService;