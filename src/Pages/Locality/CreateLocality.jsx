import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";
import { createLocality } from "../../Services/LocalityApi";

const CreateLocality = () => {
  const [formData, setFormData] = useState({
    pincode: "",
    availablePincodes: [],
    locality: "",
    status: true,
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "availablePincodes") {
      // Split comma-separated pincodes into array
      const pincodesArray = value
        .split(",")
        .map((pin) => pin.trim())
        .filter((pin) => pin);
      setFormData((prev) => ({ ...prev, [name]: pincodesArray }));
    } else if (name === "status") {
      setFormData((prev) => ({ ...prev, [name]: value === "Active" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};

    if (!formData.pincode) errors.pincode = "Pincode is required.";
    if (!formData.locality) errors.locality = "Locality is required.";
    if (formData.availablePincodes.length === 0) {
      errors.availablePincodes = "At least one available pincode is required.";
    }

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        pincode: formData.pincode,
        availablePincodes: formData.availablePincodes,
        locality: formData.locality,
        status: formData.status,
      };

      const res = await createLocality(dataToSend);
      if (res.status) {
        toast.success("Locality created successfully!");
        navigate(-1);
      } else {
        toast.error(res.message || "Failed to create locality");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="">
      <div className="bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Pincode */}
          <label className="ml-2 mt-4 font-normal block">Pincode:</label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            placeholder="Enter Pincode"
            maxLength="6"
          />
          {apiError.pincode && (
            <p className="text-red-500 text-sm ml-2">{apiError.pincode}</p>
          )}

          {/* Available Pincodes */}
          <label className="ml-2 mt-4 font-normal block">
            Available Pincodes:
          </label>
          <input
            name="availablePincodes"
            value={formData.availablePincodes.join(", ")}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            placeholder="Enter Pincodes (comma-separated)"
          />
          {apiError.availablePincodes && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.availablePincodes}
            </p>
          )}

          {/* Locality */}
          <label className="ml-2 mt-4 font-normal block">Locality:</label>
          <input
            name="locality"
            value={formData.locality}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            placeholder="Enter Locality"
          />
          {apiError.locality && (
            <p className="text-red-500 text-sm ml-2">{apiError.locality}</p>
          )}

          {/* Status */}
          <label className="ml-2 mt-4 font-normal block">Status:</label>
          <select
            name="status"
            value={formData.status ? "Active" : "Inactive"}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Creating..." : "Create Locality"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLocality;
