
const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from 'react-hot-toast';


export const getUnassignedPickupsApi = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem('token');
    try {
 
      console.log(searchQuery, 'searchQuery')
      const res = await fetch(`${BASE_URL}/api/admin/getUnassingPickup?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`, {
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

  export const getRequestPickupByIdApi = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/getUnassingPickup/${id}`, {
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


  export const AssignPickupBoy = async (data) => {
    const token = localStorage.getItem('token');
    console.log(data, ' data for send in the api');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/assignPickup`, {
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