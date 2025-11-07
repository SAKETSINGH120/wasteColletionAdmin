import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import { getDeliveryBoyById } from "../../Services/DeliveryBoyApi";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import TransgenderIcon from "@mui/icons-material/Transgender";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import PinDropIcon from "@mui/icons-material/PinDrop";
// import MotorcycleIcon from "@mui/icons-material/Motorcycle";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VerifiedIcon from "@mui/icons-material/Verified";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Chip from "@mui/material/Chip";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ViewPickupBoy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getDeliveryBoyById(id);
      if (result?.status) {
        toast.success("Pickup boy details fetched successfully!");
        setData(result.data);
      } else {
        toast.error(result?.message || "Failed to fetch pickup boy details.");
      }
    } catch (error) {
      console.error("Error fetching pickup boy:", error);
      toast.error("Error fetching pickup boy details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) return <Loader />;

  if (!data) {
    return (
      <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <p className="text-center text-red-600 text-xl font-semibold">
          No data available
        </p>
      </div>
    );
  }

  // Helper: Format currency
  const fmt = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value || 0));

  // Helper: Get image URL, removing 'public' prefix for Vite
  const getImageUrl = (path) => {
    // if (!path) return "/defaultUser.jpg";
    return path.startsWith("public") ? path.replace(/^public/, "") : path;
  };

  // Helper: Status chip for verification and disabled status
  const StatusChip = ({ status, isVerified }) => {
    const color = isVerified
      ? "bg-green-200 text-green-800"
      : status
      ? "bg-yellow-200 text-yellow-800"
      : "bg-red-200 text-red-800";
    const label = isVerified ? "Verified" : status ? "Active" : "Disabled";
    return (
      <span className={`px-3 py-1 rounded-full font-semibold text-sm ${color}`}>
        {label}
      </span>
    );
  };

  // Helper: Info row component
  const InfoRow = ({ IconComp, title, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      {IconComp && <IconComp sx={{ fontSize: 24, color: "#1F4926" }} />}
      <div>
        <p className="font-semibold text-gray-800 text-lg">{title}</p>
        <p className="text-gray-600">{value ?? "N/A"}</p>
      </div>
    </div>
  );

  // Helper: Image chip for displaying images
  const ImageChip = ({ src, alt }) => (
    <img
      src={`${BASE_URL}/${src}`}
      alt={alt}
      //   onError={(e) => (e.target.src = "/defaultUser.jpg")}
      className="w-16 h-16 object-cover rounded-md shadow-sm"
    />
  );

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Breaker />
      <div
        className="mx-auto max-w-9xl rounded-2xl shadow-2xl bg-gradient-to-br mt-5 from-white to-gray-50 overflow-hidden relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-2 before:bg-gradient-to-r before:from-[#45d85e] before:to-[#1F4926]"
        data-aos="zoom-in"
      >
        <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-200 px-6 pt-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1F4926] tracking-wide">
              Pickup Boy #{String(data._id).slice(-6)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Created:{" "}
              {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusChip status={data.status} isVerified={data.isVerify} />
            <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
              <button
                onClick={handleBackClick}
                className="bg-gradient-to-r from-[#45d85e] to-[#1F4926] text-white px-5 py-2 rounded-xl font-semibold hover:from-[#3cc752] hover:to-[#1a3b20] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                Back
              </button>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-6">
          {/* Left: Personal Info Card */}
          <div className="col-span-1 bg-white p-4 rounded-xl shadow-md">
            <div className="flex flex-col items-center text-center gap-3">
              <img
                src={`${BASE_URL}/${data.profileImage}`}
                alt={data.name || "Pickup Boy"}
                // onError={(e) => (e.target.src = "/defaultUser.jpg")}
                className="w-28 h-28 object-cover rounded-full shadow-sm"
              />
              <h3 className="text-xl font-bold text-gray-800">
                {data.name || "-"}
              </h3>
              <div className="w-full mt-3 grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="text-sm font-medium">
                    {data.countryCode} {data.mobile || "-"}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-sm font-medium">
                    {data.gender
                      ? data.gender.charAt(0).toUpperCase() +
                        data.gender.slice(1)
                      : "-"}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Wallet Balance</p>
                  <p className="text-sm font-medium">
                    {fmt(data.wallet?.balance)}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Locked Balance</p>
                  <p className="text-sm font-medium">
                    {fmt(data.wallet?.lockedBalance)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Address & Verification Details */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[#1F4926] mb-3">
                <HomeIcon sx={{ fontSize: 24, color: "#45d85e" }} />
                Address Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  IconComp={HomeIcon}
                  title="Address"
                  value={data.address || "-"}
                />
                <InfoRow
                  IconComp={LocationCityIcon}
                  title="City"
                  value={data.city || "-"}
                />
                <InfoRow
                  IconComp={MapIcon}
                  title="State"
                  value={data.state || "-"}
                />
                <InfoRow
                  IconComp={PinDropIcon}
                  title="Pincode"
                  value={data.pincode || "-"}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[#1F4926] mb-3">
                <VerifiedIcon sx={{ fontSize: 24, color: "#45d85e" }} />
                Verification Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  IconComp={CardMembershipIcon}
                  title="Aadhar Number"
                  value={data.adharNumber || "-"}
                />
                <InfoRow
                  IconComp={CardMembershipIcon}
                  title="License Number"
                  value={data.licenseNumber || "-"}
                />
                <div className="col-span-2">
                  <p className="font-semibold text-gray-800">Aadhar Images</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Array.isArray(data.adharImages) &&
                    data.adharImages.length > 0 ? (
                      data.adharImages.map((img, i) => (
                        <ImageChip key={i} src={img} alt={`Aadhar ${i + 1}`} />
                      ))
                    ) : (
                      <p className="text-gray-600">N/A</p>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold text-gray-800">License Images</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Array.isArray(data.licenseImages) &&
                    data.licenseImages.length > 0 ? (
                      data.licenseImages.map((img, i) => (
                        <ImageChip key={i} src={img} alt={`License ${i + 1}`} />
                      ))
                    ) : (
                      <p className="text-gray-600">N/A</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="flex items-center gap-3 text-xl font-bold text-[#1F4926] mb-3">
              <n sx={{ fontSize: 24, color: "#45d85e" }} />
              Vehicle Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow
                // IconComp={MotorcycleIcon}
                title="Vehicle Type"
                value={data.vehicleType || "-"}
              />
              <InfoRow
                IconComp={CardMembershipIcon}
                title="Vehicle Number"
                value={data.vehicleNumber || "-"}
              />
              <InfoRow
                // IconComp={MotorcycleIcon}
                title="Vehicle Model"
                value={data.vehicleModel || "-"}
              />
              <InfoRow
                IconComp={CardMembershipIcon}
                title="Registration Number"
                value={data.registerationNumber || "-"}
              />
              <InfoRow
                IconComp={CardMembershipIcon}
                title="Insurance Number"
                value={data.insuranceNumber || "-"}
              />
              <div className="col-span-2">
                <p className="font-semibold text-gray-800">Vehicle RC Images</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(data.vehicleRcImage) &&
                  data.vehicleRcImage.length > 0 ? (
                    data.vehicleRcImage.map((img, i) => (
                      <ImageChip key={i} src={img} alt={`RC ${i + 1}`} />
                    ))
                  ) : (
                    <p className="text-gray-600">N/A</p>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-gray-800">Insurance Images</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(data.insuranceImage) &&
                  data.insuranceImage.length > 0 ? (
                    data.insuranceImage.map((img, i) => (
                      <ImageChip key={i} src={img} alt={`Insurance ${i + 1}`} />
                    ))
                  ) : (
                    <p className="text-gray-600">N/A</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="flex items-center gap-3 text-xl font-bold text-[#1F4926] mb-3">
              <AccountBalanceIcon sx={{ fontSize: 24, color: "#45d85e" }} />
              Bank Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow
                IconComp={PersonIcon}
                title="Beneficiary Name"
                value={data.beneficiaryName || "-"}
              />
              <InfoRow
                IconComp={AccountBalanceIcon}
                title="Bank Name"
                value={data.bankName || "-"}
              />
              <InfoRow
                IconComp={CardMembershipIcon}
                title="Account Number"
                value={data.accountNumber || "-"}
              />
              <InfoRow
                IconComp={CardMembershipIcon}
                title="IFSC Code"
                value={data.ifscCode || "-"}
              />
              <InfoRow
                IconComp={AccountBalanceIcon}
                title="Branch Name"
                value={data.branchName || "-"}
              />
              <div className="col-span-2">
                <p className="font-semibold text-gray-800">Passbook Images</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(data.passbookImage) &&
                  data.passbookImage.length > 0 ? (
                    data.passbookImage.map((img, i) => (
                      <ImageChip key={i} src={img} alt={`Passbook ${i + 1}`} />
                    ))
                  ) : (
                    <p className="text-gray-600">N/A</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
