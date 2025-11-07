
const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from 'react-hot-toast';


export const getAllPlatformSettings = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem('token');
    try {
 
      console.log(searchQuery, 'searchQuery')
      const res = await fetch(`${BASE_URL}/api/admin/platformSetting?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`, {
        method: 'GET', // Change method to POST
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      if (!res.status) throw new Error(result.message);
      return result;
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
      throw new Error(err.message);
    }
  };

  export const getPlatformSettingLogsApi = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem('token');
    try {
 
      console.log(searchQuery, 'searchQuery')
      const res = await fetch(`${BASE_URL}/api/admin/platformSettingLog?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`, {
        method: 'GET', // Change method to POST
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      if (!res.status) throw new Error(result.message);
      return result;
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
      throw new Error(err.message);
    }
  };
  export const createDailyTipsApi = async (data) => {
    const token = localStorage.getItem('token');
    console.log(data, ' data for send in the api');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/platformSetting`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Required for JSON data
        },
        body: JSON.stringify(data), // Convert JS object to JSON string
      });
  
      const result = await res.json();
      return result;
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
      throw new Error(err.message);
    }
  };
  
  // Or use a secure auth provider
  
  export const updatePlatformSettingApi = async ({ id, data }) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/platformSetting/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // token must be defined
        },
        body: JSON.stringify(data),
      });
  
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Update failed');
      return result;
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
      console.error(err.message || 'Something went wrong!');
      throw err;
    }
  };
  
  
  
export const getPlatformSettingByIdApi = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/platformSetting/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw new Error(err.message);
  }
};


export const PlatformSettingDelete = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/platformSetting/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const result = await res.json();
    if (!res.status) throw new Error(result.message);
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw new Error(err.message || 'Something went wrong!');
  }
};

export const getPlatformSettingLogByIdApi = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/platformSettingLog/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw new Error(err.message);
  }
};