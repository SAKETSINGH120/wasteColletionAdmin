import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";
import { getAllCategory } from "../../Services/CategoryApi"; // Assuming these services exist
import {
  updateSubCategoryApi,
  getSubCategoryByIdApi,
} from "../../Services/SubCategoryApi"; // Assuming these services exist
const BASE_URL = import.meta.env.VITE_BASE_URL;

const UpdateSubCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "", // Will store category ID as a string
    priority: 1, // Default as per payload
    status: true, // Default as per payload
    measureBy: "",
    price: "",
    image: null, // Holds new image file
    existingImage: "", // Holds the URL of the existing image
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories on mount
    const fetchCategories = async () => {
      try {
        const result = await getAllCategory({
          page: 1,
          rowsPerPage: 100,
          searchQuery: "",
        });
        if (result && result.data) {
          setCategories(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchSubCategory = async () => {
        setLoading(true);
        try {
          const res = await getSubCategoryByIdApi(id);
          if (res.status) {
            const {
              name,
              category,
              priority,
              status,
              measureBy,
              price,
              image,
            } = res.data;
            setFormData({
              name: name || "",
              category: category?._id || "", // Extract category ID
              priority: priority || 1,
              status: status !== undefined ? status : true,
              measureBy: measureBy || "",
              price: price || "",
              image: null, // New file is null initially
              existingImage: image || "", // Store existing image URL
            });
            if (image) {
              setImagePreview(`${BASE_URL}/${image}`);
            }
            toast.success("Subcategory fetched successfully!");
          }
        } catch (err) {
          console.error("Failed to fetch subcategory data:", err);
          toast.error("Failed to fetch subcategory data");
        } finally {
          setLoading(false);
        }
      };
      fetchSubCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(files[0]);
      setFormData((prev) => ({ ...prev, image: files[0], existingImage: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};

    if (!formData.name) errors.name = "Name is required.";
    if (!formData.category) errors.category = "Category is required.";
    if (!formData.priority) errors.priority = "Priority is required.";
    if (formData.status === "") errors.status = "Status is required.";
    if (!formData.measureBy) errors.measureBy = "Measure By is required.";
    if (!formData.price) errors.price = "Price is required.";
    if (!formData.image && !formData.existingImage) {
      errors.image = "Image is required.";
    }

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "existingImage" && !formData.image && value) {
          // Send existing image URL if no new file is uploaded
          dataToSend.append("image", value);
        } else if (key !== "existingImage" && value !== null) {
          dataToSend.append(key, value);
        }
      });

      const res = await updateSubCategoryApi({ id, data: dataToSend });
      if (res.status) {
        toast.success("Subcategory updated successfully!");
        navigate(-1);
      } else {
        toast.error(res.message || "Failed to update subcategory");
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
          {/* Name */}
          <label className="ml-2 mt-4 font-normal block">Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            placeholder="Subcategory Name"
          />
          {apiError.name && (
            <p className="text-red-500 text-sm ml-2">{apiError.name}</p>
          )}

          {/* Category Dropdown */}
          <label className="ml-2 mt-4 font-normal block">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id || cat._id} value={cat.id || cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {apiError.category && (
            <p className="text-red-500 text-sm ml-2">{apiError.category}</p>
          )}

          {/* Priority */}
          <label className="ml-2 mt-4 font-normal block">Priority:</label>
          <input
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="number"
            placeholder="Priority"
            min="0"
          />
          {apiError.priority && (
            <p className="text-red-500 text-sm ml-2">{apiError.priority}</p>
          )}

          {/* Status */}
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

          {/* Measure By Dropdown */}
          <label className="ml-2 mt-4 font-normal block">Measure By:</label>
          <select
            name="measureBy"
            value={formData.measureBy}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500"
          >
            <option value="">Select Measure By</option>
            <option value="kg">kg</option>
            <option value="litre">litre</option>
            <option value="unit">unit</option>
          </select>
          {apiError.measureBy && (
            <p className="text-red-500 text-sm ml-2">{apiError.measureBy}</p>
          )}

          {/* Price */}
          <label className="ml-2 mt-4 font-normal block">Price:</label>
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="number"
            placeholder="Price"
            min="0"
            step="0.01"
          />
          {apiError.price && (
            <p className="text-red-500 text-sm ml-2">{apiError.price}</p>
          )}

          {/* Image Upload */}
          <div className="flex justify-between">
            <label className="ml-2 mt-4 font-normal block">
              Subcategory Image (1440x650):
            </label>
            <label className="ml-2 mt-4 font-normal block">
              Image Format (JPEG, PNG, GIF, SVG)
            </label>
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
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
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {apiError.image && (
            <p className="text-red-500 text-sm ml-2">{apiError.image}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Updating..." : "Update Subcategory"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSubCategory;
