
const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from 'react-hot-toast';


export const getAllRequestPickups = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem('token');
    try {
 
      console.log(searchQuery, 'searchQuery')
      const res = await fetch(`${BASE_URL}/api/admin/requestPickup?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`, {
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
    const res = await fetch(`${BASE_URL}/api/admin/requestPickup/${id}`, {
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