import axios from "axios";

const APPLICATIONS_URL = "http://localhost:8080/applications";
const COMPANIES_URL = "http://localhost:8080/companies";
 
// Applications
export const getApplications = () => axios.get(APPLICATIONS_URL);
export const createApplication = (application) => axios.post(APPLICATIONS_URL, application);
export const updateApplication = (id, application) => axios.put(`${APPLICATIONS_URL}/${id}`, application);
export const deleteApplication = (id) => axios.delete(`${APPLICATIONS_URL}/${id}`);
 
// Companies
export const getCompanies = () => axios.get(COMPANIES_URL);
export const createCompany = (company) => axios.post(COMPANIES_URL, company);
 