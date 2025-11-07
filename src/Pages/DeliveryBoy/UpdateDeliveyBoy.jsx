import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";
import {
  getDeliveryBoyById,
  updateDeliveryBoyApi,
} from "../../Services/DeliveryBoyApi";

const UpdateDeliveryBoy = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    countryCode: "+91",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isVerify: false,
    status: true,
    isDisabled: false,
    adharNumber: "",
    licenseNumber: "",
    vehicleType: "",
    vehicleNumber: "",
    vehicleModel: "",
    registerationNumber: "",
    insuranceNumber: "",
    beneficiaryName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    profileImage: null,
    licenseImages: [],
    adharImages: [],
    vehicleRcImage: [],
    insuranceImage: [],
    passbookImage: [],
  });

  const [imagePreviews, setImagePreviews] = useState({
    profileImage: null,
    licenseImages: [],
    adharImages: [],
    vehicleRcImage: [],
    insuranceImage: [],
    passbookImage: [],
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchDeliveryBoy = async () => {
      try {
        setLoading(true);
        const res = await getDeliveryBoyById(id);
        if (res.status) {
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            mobile: res.data.mobile || "",
            countryCode: res.data.countryCode || "+91",
            gender: res.data.gender || "",
            address: res.data.address || "",
            city: res.data.city || "",
            state: res.data.state || "",
            pincode: res.data.pincode || "",
            isVerify: res.data.isVerify || false,
            status: res.data.status || true,
            isDisabled: res.data.isDisabled || false,
            adharNumber: res.data.adharNumber || "",
            licenseNumber: res.data.licenseNumber || "",
            vehicleType: res.data.vehicleType || "",
            vehicleNumber: res.data.vehicleNumber || "",
            vehicleModel: res.data.vehicleModel || "",
            registerationNumber: res.data.registerationNumber || "",
            insuranceNumber: res.data.insuranceNumber || "",
            beneficiaryName: res.data.beneficiaryName || "",
            bankName: res.data.bankName || "",
            accountNumber: res.data.accountNumber || "",
            ifscCode: res.data.ifscCode || "",
            branchName: res.data.branchName || "",
            profileImage: null,
            licenseImages: [],
            adharImages: [],
            vehicleRcImage: [],
            insuranceImage: [],
            passbookImage: [],
          });
          setImagePreviews({
            profileImage: res.data.profileImage
              ? `${BASE_URL}/${res.data.profileImage}`
              : null,
            licenseImages: res.data.licenseImages
              ? res.data.licenseImages.map((img) => `${BASE_URL}/${img}`)
              : [],
            adharImages: res.data.adharImages
              ? res.data.adharImages.map((img) => `${BASE_URL}/${img}`)
              : [],
            vehicleRcImage: res.data.vehicleRcImage
              ? res.data.vehicleRcImage.map((img) => `${BASE_URL}/${img}`)
              : [],
            insuranceImage: res.data.insuranceImage
              ? res.data.insuranceImage.map((img) => `${BASE_URL}/${img}`)
              : [],
            passbookImage: res.data.passbookImage
              ? res.data.passbookImage.map((img) => `${BASE_URL}/${img}`)
              : [],
          });
        } else {
          toast.error(res.message || "Failed to fetch delivery boy data");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error.message || "Server error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryBoy();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, [fieldName]: fileArray }));
      setImagePreviews((prev) => ({ ...prev, [fieldName]: previews }));
    }
  };

  const handleSingleImageChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
      setImagePreviews((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};

    // Required field validations
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.mobile) errors.mobile = "Mobile number is required.";
    if (!formData.gender) errors.gender = "Gender is required.";
    if (!formData.address) errors.address = "Address is required.";
    if (!formData.city) errors.city = "City is required.";
    if (!formData.state) errors.state = "State is required.";
    if (!formData.pincode) errors.pincode = "Pincode is required.";
    if (!formData.adharNumber)
      errors.adharNumber = "Aadhar number is required.";
    if (!formData.licenseNumber)
      errors.licenseNumber = "License number is required.";
    if (!formData.vehicleType) errors.vehicleType = "Vehicle type is required.";
    if (!formData.vehicleNumber)
      errors.vehicleNumber = "Vehicle number is required.";
    if (!formData.vehicleModel)
      errors.vehicleModel = "Vehicle model is required.";
    if (!formData.registerationNumber)
      errors.registerationNumber = "Registration number is required.";
    if (!formData.insuranceNumber)
      errors.insuranceNumber = "Insurance number is required.";
    if (!formData.beneficiaryName)
      errors.beneficiaryName = "Beneficiary name is required.";
    if (!formData.bankName) errors.bankName = "Bank name is required.";
    if (!formData.accountNumber)
      errors.accountNumber = "Account number is required.";
    if (!formData.ifscCode) errors.ifscCode = "IFSC code is required.";
    if (!formData.branchName) errors.branchName = "Branch name is required.";
    if (formData.isVerify === "")
      errors.isVerify = "Verification status is required.";
    if (formData.status === "") errors.status = "Status is required.";
    if (formData.isDisabled === "")
      errors.isDisabled = "Disabled status is required.";
    if (!formData.licenseImages.length && !imagePreviews.licenseImages.length)
      errors.licenseImages = "At least one license image is required.";
    if (!formData.adharImages.length && !imagePreviews.adharImages.length)
      errors.adharImages = "At least one Aadhar image is required.";
    if (!formData.vehicleRcImage.length && !imagePreviews.vehicleRcImage.length)
      errors.vehicleRcImage = "At least one vehicle RC image is required.";
    if (!formData.insuranceImage.length && !imagePreviews.insuranceImage.length)
      errors.insuranceImage = "At least one insurance image is required.";
    if (!formData.passbookImage.length && !imagePreviews.passbookImage.length)
      errors.passbookImage = "At least one passbook image is required.";

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item) => dataToSend.append(key, item));
        } else if (formData[key] !== null && formData[key] !== "") {
          dataToSend.append(key, formData[key]);
        }
      });

      const res = await updateDeliveryBoyApi(id, dataToSend);
      if (res.status) {
        toast.success("Delivery boy updated successfully!");
        navigate(-1);
      } else {
        toast.error(res.message || "Failed to update delivery boy");
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
          Update Pickup Boy
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <div>
              <label className="ml-2 mt-4 font-normal block">Name:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="text"
                placeholder="Enter Name"
              />
              {apiError.name && (
                <p className="text-red-500 text-sm ml-2">{apiError.name}</p>
              )}

              <label className="ml-2 mt-4 font-normal block">Email:</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="email"
                placeholder="Enter Email"
              />
              {apiError.email && (
                <p className="text-red-500 text-sm ml-2">{apiError.email}</p>
              )}

              <label className="ml-2 mt-4 font-normal block">
                Country Code:
              </label>
              <input
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="text"
                placeholder="Enter Country Code (e.g., +91)"
              />
              {apiError.countryCode && (
                <p className="text-red-500 text-sm ml-2">
                  {apiError.countryCode}
                </p>
              )}

              <label className="ml-2 mt-4 font-normal block">Mobile:</label>
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="text"
                placeholder="Enter Mobile Number"
              />
              {apiError.mobile && (
                <p className="text-red-500 text-sm ml-2">{apiError.mobile}</p>
              )}

              <label className="ml-2 mt-4 font-normal block">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {apiError.gender && (
                <p className="text-red-500 text-sm ml-2">{apiError.gender}</p>
              )}
            </div>

            {/* Address Details */}
            <div>
              <label className="ml-2 mt-4 font-normal block">Address:</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="text"
                placeholder="Enter Address"
              />
              {apiError.address && (
                <p className="text-red-500 text-sm ml-2">{apiError.address}</p>
              )}

              <label className="ml-2 mt-4 font-normal block">City:</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="text"
                placeholder="Enter City"
              />
              {apiError.city && (
                <p className="text-red-500 text-sm ml-2">{apiError.city}</p>
              )}

              <label className="ml-2 mt-4 font-normal block">State:</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="text"
                placeholder="Enter State"
              />
              {apiError.state && (
                <p className="text-red-500 text-sm ml-2">{apiError.state}</p>
              )}

              <label className="ml-2 mt-4 font-normal block">Pincode:</label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                type="text"
                placeholder="Enter Pincode"
              />
              {apiError.pincode && (
                <p className="text-red-500 text-sm ml-2">{apiError.pincode}</p>
              )}
            </div>
          </div>

          {/* Verification Details */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-[#1F4926] mb-4">
              Verification Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ml-2 mt-4 font-normal block">
                  Aadhar Number:
                </label>
                <input
                  name="adharNumber"
                  value={formData.adharNumber}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter Aadhar Number"
                />
                {apiError.adharNumber && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.adharNumber}
                  </p>
                )}

                <label className="ml-2 mt-4 font-normal block">
                  License Number:
                </label>
                <input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter License Number"
                />
                {apiError.licenseNumber && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.licenseNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="ml-2 mt-4 font-normal block">
                  Aadhar Images:
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "adharImages")}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                />
                {apiError.adharImages && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.adharImages}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.adharImages.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Aadhar Preview ${index + 1}`}
                      className="h-16 w-24 object-cover rounded border border-gray-300"
                    />
                  ))}
                </div>

                <label className="ml-2 mt-4 font-normal block">
                  License Images:
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "licenseImages")}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                />
                {apiError.licenseImages && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.licenseImages}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.licenseImages.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`License Preview ${index + 1}`}
                      className="h-16 w-24 object-cover rounded border border-gray-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-[#1F4926] mb-4">
              Vehicle Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ml-2 mt-4 font-normal block">
                  Vehicle Type:
                </label>
                <input
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter Vehicle Type (e.g., Two-Wheeler)"
                />
                {apiError.vehicleType && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.vehicleType}
                  </p>
                )}

                <label className="ml-2 mt-4 font-normal block">
                  Vehicle Number:
                </label>
                <input
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter Vehicle Number"
                />
                {apiError.vehicleNumber && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.vehicleNumber}
                  </p>
                )}

                <label className="ml-2 mt-4 font-normal block">
                  Vehicle Model:
                </label>
                <input
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter Vehicle Model"
                />
                {apiError.vehicleModel && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.vehicleModel}
                  </p>
                )}
              </div>

              <div>
                <label className="ml-2 mt-4 font-normal block">
                  Registration Number:
                </label>
                <input
                  name="registerationNumber"
                  value={formData.registerationNumber}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter Registration Number"
                />
                {apiError.registerationNumber && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.registerationNumber}
                  </p>
                )}

                <label className="ml-2 mt-4 font-normal block">
                  Insurance Number:
                </label>
                <input
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter Insurance Number"
                />
                {apiError.insuranceNumber && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.insuranceNumber}
                  </p>
                )}

                <label className="ml-2 mt-4 font-normal block">
                  Vehicle RC Images:
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "vehicleRcImage")}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                />
                {apiError.vehicleRcImage && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.vehicleRcImage}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.vehicleRcImage.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`RC Preview ${index + 1}`}
                      className="h-16 w-24 object-cover rounded border border-gray-300"
                    />
                  ))}
                </div>

                <label className="ml-2 mt-4 font-normal block">
                  Insurance Images:
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "insuranceImage")}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                />
                {apiError.insuranceImage && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.insuranceImage}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.insuranceImage.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Insurance Preview ${index + 1}`}
                      className="h-16 w-24 object-cover rounded border border-gray-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-[#1F4926] mb-4">
              Bank Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="ml-2 mt-4 font-normal block">
                  Beneficiary Name:
                </label>
                <input
                  name="beneficiaryName"
                  value={formData.beneficiaryName}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter Beneficiary Name"
                />
                {apiError.beneficiaryName && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.beneficiaryName}
                  </p>
                )}

                <label className="ml-2 mt-4 font-normal block">
                  Bank Name:
                </label>
                <input
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter Bank Name"
                />
                {apiError.bankName && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.bankName}
                  </p>
                )}

                <label className="ml-2 mt-4 font-normal block">
                  Account Number:
                </label>
                <input
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter Account Number"
                />
                {apiError.accountNumber && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.accountNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="ml-2 mt-4 font-normal block">
                  IFSC Code:
                </label>
                <input
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter IFSC Code"
                />
                {apiError.ifscCode && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.ifscCode}
                  </p>
                )}

                <label className="ml-2 mt-4 font-normal block">
                  Branch Name:
                </label>
                <input
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  type="text"
                  placeholder="Enter Branch Name"
                />
                {apiError.branchName && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.branchName}
                  </p>
                )}

                <label className="ml-2 mt-4 font-normal block">
                  Passbook Images:
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "passbookImage")}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                />
                {apiError.passbookImage && (
                  <p className="text-red-500 text-sm ml-2">
                    {apiError.passbookImage}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.passbookImage.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Passbook Preview ${index + 1}`}
                      className="h-16 w-24 object-cover rounded border border-gray-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Status and Verification */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="ml-2 mt-4 font-normal block">Verified:</label>
              <select
                name="isVerify"
                value={formData.isVerify}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500"
              >
                <option value="">Select Verification Status</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
              {apiError.isVerify && (
                <p className="text-red-500 text-sm ml-2">{apiError.isVerify}</p>
              )}
            </div>

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

            <div>
              <label className="ml-2 mt-4 font-normal block">Disabled:</label>
              <select
                name="isDisabled"
                value={formData.isDisabled}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500"
              >
                <option value="">Select Disabled Status</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
              {apiError.isDisabled && (
                <p className="text-red-500 text-sm ml-2">
                  {apiError.isDisabled}
                </p>
              )}
            </div>
          </div>

          {/* Profile Image */}
          <div className="mt-6">
            <div className="flex justify-between">
              <label className="ml-2 mt-4 font-normal block">
                Profile Image (1440x650):
              </label>
              <label className="ml-2 mt-4 font-normal block">
                Image Format (JPEG, PNG, GIF, SVG)
              </label>
            </div>
            {imagePreviews.profileImage && (
              <img
                src={imagePreviews.profileImage}
                alt="Profile Preview"
                className="h-16 w-24 object-cover rounded mt-2 mb-2 ml-2 border border-gray-300"
              />
            )}
            <label
              htmlFor="profile-image-upload"
              className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
            >
              🖼️ Upload Profile Image
            </label>
            <input
              id="profile-image-upload"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleSingleImageChange}
            />
            {apiError.profileImage && (
              <p className="text-red-500 text-sm ml-2">
                {apiError.profileImage}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Updating..." : "Update Pickup Boy"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateDeliveryBoy;
