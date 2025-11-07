/**
 * ViewRequestPickup.jsx
 * Enhanced request pickup view:
 * - Renders user, address, pickup, waste types and charges with improved layout
 * - Formats currency (INR) and dates
 * - Handles 'public' prefix in image paths and falls back to /defaultUser.jpg
 * Assumptions: images under public are served from root (Vite default).
 */
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import { getRequestPickupByIdApi } from "../../Services/RequestPickupApi";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import TransgenderIcon from "@mui/icons-material/Transgender";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import PinDropIcon from "@mui/icons-material/PinDrop";
import StairsIcon from "@mui/icons-material/Stairs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import Chip from "@mui/material/Chip";
import WarningIcon from "@mui/icons-material/Warning";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function RequestPickupView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getRequestPickupByIdApi(id);
      if (result?.status) {
        toast.success("Pickup request fetched successfully!");
        setData(result.data);
      } else {
        toast.error(result?.message || "Failed to fetch pickup request.");
      }
    } catch (error) {
      console.error("Error fetching pickup request:", error);
      toast.error("Error fetching pickup request.");
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
  // helper: format currency
  const fmt = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value || 0));

  const getImageUrl = (path) => {
    if (!path) return "/defaultUser.jpg"; // fallback in public
    // stored paths sometimes include 'public' prefix; remove it for Vite public dir
    return path.startsWith("public") ? path.replace(/^public/, "") : path;
  };

  const StatusChip = ({ status }) => {
    const color =
      status === "Pending"
        ? "bg-yellow-200 text-yellow-800"
        : status === "Cancelled"
        ? "bg-red-200 text-red-800"
        : "bg-green-200 text-green-800";
    return (
      <span className={`px-3 py-1 rounded-full font-semibold text-sm ${color}`}>
        {status || "N/A"}
      </span>
    );
  };

  const InfoRow = ({ IconComp, title, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      {IconComp && <IconComp sx={{ fontSize: 24, color: "#1F4926" }} />}
      <div>
        <p className="font-semibold text-gray-800 text-lg">{title}</p>
        <p className="text-gray-600">{value ?? "N/A"}</p>
      </div>
    </div>
  );

  const ChargeRow = ({ label, amount }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <p className="font-medium text-gray-800">{label}</p>
      <p className="font-semibold text-gray-900">{fmt(amount)}</p>
    </div>
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
              Pickup Request #{String(data._id).slice(-6)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Created:{" "}
              {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusChip status={data.requestStatus} />
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
          {/* Left: User card */}
          <div className="col-span-1 bg-white p-4 rounded-xl shadow-md">
            <div className="flex flex-col items-center text-center gap-3">
              <img
                src={`${BASE_URL}/${data.user?.profileImage}`}
                // src={getImageUrl(data.user?.profileImage)}
                alt={data.user?.name || "User"}
                onError={(e) => (e.target.src = "/defaultUser.jpg")}
                className="w-28 h-28 object-cover rounded-full shadow-sm"
              />
              <h3 className="text-xl font-bold text-gray-800">
                {data.user?.name || "-"}
              </h3>
              <p className="text-sm text-gray-500">{data.user?.email || "-"}</p>
              <div className="w-full mt-3 grid grid-cols-2 gap-2">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="text-sm font-medium">
                    {data.user?.mobile || "-"}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-sm font-medium">
                    {data.user?.gender || "-"}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Wallet</p>
                  <p className="text-sm font-medium">
                    {fmt(data.user?.wallet?.balance)}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Locked</p>
                  <p className="text-sm font-medium">
                    {fmt(data.user?.wallet?.lockedBalance)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Pickup & Address */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[#1F4926] mb-3">
                <EventIcon sx={{ fontSize: 24, color: "#45d85e" }} />
                Pickup Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  IconComp={CalendarTodayIcon}
                  title="Pickup Date"
                  value={
                    data.pickupDate
                      ? new Date(data.pickupDate).toLocaleDateString()
                      : "-"
                  }
                />
                <InfoRow
                  IconComp={AccessTimeIcon}
                  title="Pickup Time"
                  value={data.pickupTime || "-"}
                />
                <div className="col-span-2">
                  <p className="font-semibold text-gray-800">Waste Types</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Array.isArray(data.wasteType) &&
                    data.wasteType.length > 0 ? (
                      data.wasteType.map((wt, i) => (
                        <Chip
                          key={i}
                          label={
                            typeof wt === "string" && wt.length === 24
                              ? `ID: ${wt.slice(0, 6)}...`
                              : String(wt)
                          }
                          size="small"
                        />
                      ))
                    ) : (
                      <p className="text-gray-600">N/A</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[#1F4926] mb-3">
                <LocationOnIcon sx={{ fontSize: 24, color: "#45d85e" }} />
                Address
              </h2>
              {typeof data.address === "string" ? (
                <p className="text-gray-600">
                  Address ID:{" "}
                  <span className="font-mono text-sm text-gray-800">
                    {data.address}
                  </span>{" "}
                  — full details not available.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoRow
                    IconComp={HomeIcon}
                    title="Address"
                    value={data.address?.address || "-"}
                  />
                  <InfoRow
                    IconComp={LocationCityIcon}
                    title="City"
                    value={data.address?.city || "-"}
                  />
                  <InfoRow
                    IconComp={MapIcon}
                    title="State"
                    value={data.address?.state || "-"}
                  />
                  <InfoRow
                    IconComp={PinDropIcon}
                    title="Pincode"
                    value={data.address?.pincode || "-"}
                  />
                  <InfoRow
                    IconComp={StairsIcon}
                    title="Floor"
                    value={data.address?.floor || "-"}
                  />
                  <InfoRow
                    IconComp={PersonIcon}
                    title="Receiver"
                    value={data.address?.reciverName || "-"}
                  />
                  <InfoRow
                    IconComp={PhoneIcon}
                    title="Receiver Mobile"
                    value={data.address?.reciverMobile || "-"}
                  />
                  <InfoRow
                    IconComp={PinDropIcon}
                    title="Landmark"
                    value={data.address?.landmark || "-"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="flex items-center gap-3 text-xl font-bold text-[#1F4926] mb-3">
              <MonetizationOnIcon sx={{ fontSize: 24, color: "#45d85e" }} />
              Charges Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ChargeRow label="Platform Charge" amount={data.platformCharge} />
              <ChargeRow label="Pickup Charge" amount={data.pickUpCharge} />
              <ChargeRow label="Handling Charge" amount={data.handlingCharge} />
              <ChargeRow label="Waste Charge" amount={data.wasteCharge} />
              <div className="md:col-span-3 p-3 bg-gradient-to-r from-[#45d85e] to-[#1F4926] text-white rounded-lg flex items-center justify-between">
                <p className="font-semibold">Total Amount</p>
                <p className="text-lg font-bold">{fmt(data.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
