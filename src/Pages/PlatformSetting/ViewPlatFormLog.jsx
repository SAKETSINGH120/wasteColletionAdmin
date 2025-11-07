import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import { getPlatformSettingLogByIdApi } from "../../Services/PlatformSettingApi";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import SettingsIcon from "@mui/icons-material/Settings";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ScaleIcon from "@mui/icons-material/Scale";
import HistoryIcon from "@mui/icons-material/History";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Chip from "@mui/material/Chip";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ViewPlatformSettingLog() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getPlatformSettingLogByIdApi(id);
      if (result?.status) {
        toast.success(
          result.message || "Platform setting log fetched successfully!"
        );
        setData(result.data);
      } else {
        toast.error(result?.message || "Failed to fetch platform setting log.");
      }
    } catch (error) {
      console.error("Error fetching platform setting log:", error);
      toast.error("Error fetching platform setting log.");
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

  // Helper: format currency
  const fmtCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value || 0));

  // Helper: format weight
  const fmtWeight = (value) => `${Number(value || 0)} kg`;

  const StatusChip = ({ status }) => {
    const color = status
      ? "bg-green-200 text-green-800"
      : "bg-red-200 text-red-800";
    return (
      <span className={`px-3 py-1 rounded-full font-semibold text-sm `}>
        {/* {status ? "Success" : "Failed"} */}
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

  const ChangeRow = ({ field, oldValue, newValue }) => {
    const isCurrency = [
      "platformCharge",
      "handlingCharge",
      "pickupCharge",
      "minAmount",
    ].includes(field);
    const isWeight = field === "minWeight";
    const formatValue = (val) => {
      if (val === undefined) return "N/A";
      if (isCurrency) return fmtCurrency(val);
      if (isWeight) return fmtWeight(val);
      return String(val);
    };

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <p className="font-medium text-gray-800 capitalize">{field}</p>
        <div className="text-right">
          <p className="text-sm text-gray-600">Old: {formatValue(oldValue)}</p>
          <p className="text-sm font-semibold text-gray-900">
            New: {formatValue(newValue)}
          </p>
        </div>
      </div>
    );
  };

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
              Platform Setting Log #{String(data._id).slice(-6)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Updated:{" "}
              {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "-"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusChip status={data.status} />
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
          {/* Left: Platform Setting Details */}
          <div className="col-span-1 bg-white p-4 rounded-xl shadow-md">
            <div className="flex flex-col items-center text-center gap-3">
              <h3 className="text-xl font-bold text-gray-800">
                Platform Setting Details
              </h3>
              <div className="w-full mt-3 space-y-3">
                <InfoRow
                  IconComp={SettingsIcon}
                  title="Setting ID"
                  value={data.platformSetting?._id?.slice(-6) || "-"}
                />
                <InfoRow
                  IconComp={MonetizationOnIcon}
                  title="Platform Charge"
                  value={
                    fmtCurrency(data.platformSetting?.platformCharge) || "-"
                  }
                />
                <InfoRow
                  IconComp={MonetizationOnIcon}
                  title="Handling Charge"
                  value={
                    fmtCurrency(data.platformSetting?.handlingCharge) || "-"
                  }
                />
                <InfoRow
                  IconComp={MonetizationOnIcon}
                  title="Pickup Charge"
                  value={fmtCurrency(data.platformSetting?.pickupCharge) || "-"}
                />
                <InfoRow
                  IconComp={MonetizationOnIcon}
                  title="Minimum Amount"
                  value={fmtCurrency(data.platformSetting?.minAmount) || "-"}
                />
                <InfoRow
                  IconComp={ScaleIcon}
                  title="Minimum Weight"
                  value={fmtWeight(data.platformSetting?.minWeight) || "-"}
                />
              </div>
            </div>
          </div>

          {/* Middle: Updated By and Changes */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[#1F4926] mb-3">
                <PersonIcon sx={{ fontSize: 24, color: "#45d85e" }} />
                Updated By
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  IconComp={PersonIcon}
                  title="Name"
                  value={data.updatedBy?.name || "-"}
                />
                <InfoRow
                  IconComp={EmailIcon}
                  title="Email"
                  value={data.updatedBy?.email || "-"}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="flex items-center gap-3 text-xl font-bold text-[#1F4926] mb-3">
                <HistoryIcon sx={{ fontSize: 24, color: "#45d85e" }} />
                Change History
              </h2>
              <div className="space-y-3">
                {Array.isArray(data.changes) && data.changes.length > 0 ? (
                  data.changes.map((change, i) => (
                    <ChangeRow
                      key={change._id}
                      field={change.field}
                      oldValue={change.oldValue}
                      newValue={change.newValue}
                    />
                  ))
                ) : (
                  <p className="text-gray-600">No changes recorded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
