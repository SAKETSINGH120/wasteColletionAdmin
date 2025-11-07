import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;



export const getAllDeliveryBoys = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem('token');
    try {
      
      console.log(searchQuery, 'searchQuery')
      const res = await fetch(`${BASE_URL}/api/admin/pickupBoy?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`, {
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

  export const getPickupBoyLogsApi = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem('token');
    try {
      
      console.log(searchQuery, 'searchQuery')
      const res = await fetch(`${BASE_URL}/api/admin/pickupBoyLog?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`, {
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
  export const DeliveryBoyDelete = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/pickupBoy/${id}`, {
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
export const createDeliveryBoyApi = async (data) => {
    console.log(data, ' data for send in the api');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/pickupBoy`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
          // 'Content-Type': 'application/json'
        },
        body: data // Send the data as JSON
      });
      const result = await res.json();

  
      return result;
     
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
      throw new Error(err.message);
    }
  };
    
export const updateDeliveryBoyApi = async ( id, dataToSend ) => {
  const token = localStorage.getItem('token');
  console.log(dataToSend, 'data');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/pickupBoy/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: dataToSend
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw new Error(err.message);
  }
};
export const getDeliveryBoyById = async (id) => {

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/pickupBoy/${id}`, {
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


export const getPickupBoyLogByIdApi = async (id) => {

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/pickupBoyLog/${id}`, {
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