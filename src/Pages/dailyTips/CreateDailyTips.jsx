import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";
import { createDailyTipsApi } from "../../Services/DailyTipsApi";

const CreateDailyTips = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    videoFile: null,
    url: "",
    status: true,
    showDate: "",
  });

  const [previews, setPreviews] = useState({
    image: null,
    videoFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [fieldName]: files[0] }));
      if (fieldName === "image") {
        setPreviews((prev) => ({
          ...prev,
          [fieldName]: URL.createObjectURL(files[0]),
        }));
      } else if (fieldName === "videoFile") {
        setPreviews((prev) => ({ ...prev, [fieldName]: files[0].name }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};

    if (!formData.title) errors.title = "Title is required.";
    if (!formData.showDate) errors.showDate = "Show Date is required.";

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          dataToSend.append(key, formData[key]);
        }
      });

      const res = await createDailyTipsApi(dataToSend);
      if (res.status) {
        toast.success("Daily Tip created successfully!");
        navigate(-1);
      } else {
        toast.error(res.message || "Failed to create daily tip");
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
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-[#1F4926] mb-6">
          Create Daily Tip
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="ml-2 mt-4 font-normal block">Title:</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="text"
                placeholder="Enter Daily Tip Title"
              />
              {apiError.title && (
                <p className="text-red-500 text-sm ml-2">{apiError.title}</p>
              )}
            </div>

            {/* Show Date */}
            <div>
              <label className="ml-2 mt-4 font-normal block">Show Date:</label>
              <input
                name="showDate"
                value={formData.showDate}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="date"
                placeholder="Select Show Date"
              />
              {apiError.showDate && (
                <p className="text-red-500 text-sm ml-2">{apiError.showDate}</p>
              )}
            </div>

            {/* URL */}
            <div>
              <label className="ml-2 mt-4 font-normal block">URL:</label>
              <input
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="url"
                placeholder="Enter URL (optional)"
              />
              {apiError.url && (
                <p className="text-red-500 text-sm ml-2">{apiError.url}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="ml-2 mt-4 font-normal block">Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500"
              >
                <option value="">Select Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
              {apiError.status && (
                <p className="text-red-500 text-sm ml-2">{apiError.status}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <div className="flex justify-between">
              <label className="ml-2 mt-4 font-normal block">
                Image (optional, 1440x650):
              </label>
              <label className="ml-2 mt-4 font-normal block">
                Image Format (JPEG, PNG, GIF, SVG)
              </label>
            </div>
            {previews.image && (
              <img
                src={previews.image}
                alt="Image Preview"
                className="h-16 w-24 object-cover rounded mt-2 mb-2 ml-2 border border-gray-300"
              />
            )}
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
            >
              🖼️ Upload Image
            </label>
            <input
              id="image-upload"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
            />
            {apiError.image && (
              <p className="text-red-500 text-sm ml-2">{apiError.image}</p>
            )}
          </div>

          {/* Video File Upload */}
          <div className="mt-6">
            <div className="flex justify-between">
              <label className="ml-2 mt-4 font-normal block">
                Video File (optional):
              </label>
              <label className="ml-2 mt-4 font-normal block">
                Video Format (MP4, AVI, MOV)
              </label>
            </div>
            {previews.videoFile && (
              <p className="ml-2 mt-2 text-sm text-gray-600">
                Selected: {previews.videoFile}
              </p>
            )}
            <label
              htmlFor="video-upload"
              className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
            >
              🎥 Upload Video
            </label>
            <input
              id="video-upload"
              className="hidden"
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, "videoFile")}
            />
            {apiError.videoFile && (
              <p className="text-red-500 text-sm ml-2">{apiError.videoFile}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Creating..." : "Create Daily Tip"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDailyTips;
