import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";
import {
  updatePlatformSettingApi,
  getPlatformSettingByIdApi,
} from "../../Services/PlatformSettingApi"; // Assuming these services exist

const UpdatePlatformSetting = () => {
  const [formData, setFormData] = useState({
    platformCharge: "",
    handlingCharge: "",
    pickupCharge: "",
    minAmount: "",
    minWeight: "",
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchPlatformSetting = async () => {
        setLoading(true);
        try {
          const res = await getPlatformSettingByIdApi(id);
          if (res.status) {
            const {
              platformCharge,
              handlingCharge,
              pickupCharge,
              minAmount,
              minWeight,
            } = res.data;
            setFormData({
              platformCharge: platformCharge || "",
              handlingCharge: handlingCharge || "",
              pickupCharge: pickupCharge || "",
              minAmount: minAmount || "",
              minWeight: minWeight || "",
            });
            toast.success("Platform Setting fetched successfully!");
          }
        } catch (err) {
          console.error("Failed to fetch platform setting data:", err);
          toast.error("Failed to fetch platform setting data");
        } finally {
          setLoading(false);
        }
      };
      fetchPlatformSetting();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};

    if (!formData.platformCharge)
      errors.platformCharge = "Platform Charge is required.";
    if (!formData.handlingCharge)
      errors.handlingCharge = "Handling Charge is required.";
    if (!formData.pickupCharge)
      errors.pickupCharge = "Pickup Charge is required.";
    if (!formData.minAmount) errors.minAmount = "Minimum Amount is required.";
    if (!formData.minWeight) errors.minWeight = "Minimum Weight is required.";

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        platformCharge: parseFloat(formData.platformCharge),
        handlingCharge: parseFloat(formData.handlingCharge),
        pickupCharge: parseFloat(formData.pickupCharge),
        minAmount: parseFloat(formData.minAmount),
        minWeight: parseFloat(formData.minWeight),
      };

      const res = await updatePlatformSettingApi({ id, data: dataToSend });
      if (res.status) {
        toast.success("Platform Setting updated successfully!");
        navigate(-1);
      } else {
        toast.error(res.message || "Failed to update platform setting");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="">
      <div className=" bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Platform Charge */}
          <label className="ml-2 mt-4 font-normal block">
            Platform Charge:
          </label>
          <input
            name="platformCharge"
            value={formData.platformCharge}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="number"
            placeholder="Platform Charge"
            min="0"
            step="0.01"
          />
          {apiError.platformCharge && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.platformCharge}
            </p>
          )}

          {/* Handling Charge */}
          <label className="ml-2 mt-4 font-normal block">
            Handling Charge:
          </label>
          <input
            name="handlingCharge"
            value={formData.handlingCharge}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="number"
            placeholder="Handling Charge"
            min="0"
            step="0.01"
          />
          {apiError.handlingCharge && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.handlingCharge}
            </p>
          )}

          {/* Pickup Charge */}
          <label className="ml-2 mt-4 font-normal block">Pickup Charge:</label>
          <input
            name="pickupCharge"
            value={formData.pickupCharge}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="number"
            placeholder="Pickup Charge"
            min="0"
            step="0.01"
          />
          {apiError.pickupCharge && (
            <p className="text-red-500 text-sm ml-2">{apiError.pickupCharge}</p>
          )}

          {/* Minimum Amount */}
          <label className="ml-2 mt-4 font-normal block">Minimum Amount:</label>
          <input
            name="minAmount"
            value={formData.minAmount}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="number"
            placeholder="Minimum Amount"
            min="0"
            step="0.01"
          />
          {apiError.minAmount && (
            <p className="text-red-500 text-sm ml-2">{apiError.minAmount}</p>
          )}

          {/* Minimum Weight */}
          <label className="ml-2 mt-4 font-normal block">Minimum Weight:</label>
          <input
            name="minWeight"
            value={formData.minWeight}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="number"
            placeholder="Minimum Weight"
            min="0"
            step="0.01"
          />
          {apiError.minWeight && (
            <p className="text-red-500 text-sm ml-2">{apiError.minWeight}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Updating..." : "Update Platform Setting"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePlatformSetting;
