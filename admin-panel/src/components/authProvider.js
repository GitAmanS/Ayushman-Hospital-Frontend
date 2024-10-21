import axios from "axios";

const apiUrl = "/api/admin";
const authProvider = {
  login: async ({ username, password }) => {
    const response = await axios.post(`${apiUrl}/login`, { username, password }, { withCredentials: true });
    console.log("Login response:", response);
    if (response.status === 200) {
        console.log("Login successful");
        return Promise.resolve(); // Login successful
    }
    return Promise.reject(); // Handle failure
  },
  logout: async() => {
    // Typically, the logout action may not require special handling for cookies.
    const response = await axios.post(`${apiUrl}/logout`,{}, { withCredentials: true });
    if(response.status ===200){
      return Promise.resolve();
    }
    return Promise.reject();
    
  },
  checkAuth: async () => {
    try {
        // Make a request to the backend to verify the token
        const response = await axios.get(`${apiUrl}/check-auth`, { withCredentials: true });
        if (response.status === 200) {
            return Promise.resolve(); // User is authenticated
        }
    } catch (error) {
        console.error("Authentication check failed", error);
        return Promise.reject(); // User is not authenticated
    }
},

GetUserRole: async()=>{
  try {
    console.log("get user role is executed")
    // Make a request to the backend to verify the token
    const response = await axios.get(`${apiUrl}/checkRole`, { withCredentials: true });
    if (response.status === 200) {
      console.log("resposne:", response)
            return response.data.role; // User is authenticated
        }
    } catch (error) {
        console.error("Authentication check failed", error);
        return Promise.reject(); // User is not authenticated
    }
},

  checkError: (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  
  getPermissions: () => Promise.resolve(),
};


export default authProvider;