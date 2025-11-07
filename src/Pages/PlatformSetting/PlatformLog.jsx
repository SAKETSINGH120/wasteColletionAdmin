import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import { getPlatformSettingLogsApi } from "../../Services/PlatformSettingApi";
import { EyeIcon } from "@heroicons/react/24/outline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import xlsx from "json-as-xlsx";

export default function PlatformSettingLog() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getPlatformSettingLogsApi({
        page,
        rowsPerPage,
        searchQuery,
      });
      if (result?.status) {
        toast.success("Platform setting logs fetched successfully!");
        const transformedData = (result.data || []).map((item) => ({
          ...item,
          id: item._id,
          settingId: item.platformSetting?._id,
          platformCharge: item.platformSetting?.platformCharge,
          handlingCharge: item.platformSetting?.handlingCharge,
          pickupCharge: item.platformSetting?.pickupCharge,
          minAmount: item.platformSetting?.minAmount,
          minWeight: item.platformSetting?.minWeight,
          updatedByName: item.updatedBy?.name,
          updatedByEmail: item.updatedBy?.email,
          updatedAtFormatted: item.updatedAt
            ? new Date(item.updatedAt).toLocaleString()
            : "N/A",
          changesSummary:
            item.changes
              ?.map(
                (change) =>
                  `${change.field}: ${change.oldValue} → ${change.newValue}`
              )
              .join("; ") || "No changes",
        }));
        setData(transformedData);
        setTotalPages(result.totalPage || 0);
        setTotalRecord(result.totalResult || 0);
      } else {
        toast.error(
          result?.message || "Failed to fetch platform setting logs."
        );
      }
    } catch (error) {
      console.error("Error fetching platform setting logs:", error);
      toast.error("Error fetching platform setting logs.");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const exportFunc = async (allLogsData) => {
    if (allLogsData.length < 1) {
      return toast.error("Platform setting logs list is empty!");
    }
    setIsExporting(true);
    const settings = {
      fileName: "PlatformSetting_Logs",
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };
    const data = [
      {
        sheet: "Platform Setting Logs",
        columns: [
          { label: "Log ID", value: (row) => row?._id || "" },
          { label: "Setting ID", value: (row) => row?.settingId || "N/A" },
          {
            label: "Platform Charge",
            value: (row) => row?.platformCharge || "N/A",
          },
          {
            label: "Handling Charge",
            value: (row) => row?.handlingCharge || "N/A",
          },
          {
            label: "Pickup Charge",
            value: (row) => row?.pickupCharge || "N/A",
          },
          { label: "Min Amount", value: (row) => row?.minAmount || "N/A" },
          { label: "Min Weight", value: (row) => row?.minWeight || "N/A" },
          {
            label: "Updated By",
            value: (row) => row?.updatedByName || row?.updatedByEmail || "N/A",
          },
          {
            label: "Updated At",
            value: (row) => row?.updatedAtFormatted || "N/A",
          },
          {
            label: "Changes Summary",
            value: (row) => row?.changesSummary || "No changes",
          },
          {
            label: "Detailed Changes",
            value: (row) => JSON.stringify(row?.changes || []),
          },
        ],
        content: allLogsData,
      },
    ];
    try {
      xlsx(data, settings);
      toast.success("Platform setting logs exported to Excel successfully!");
    } catch (error) {
      console.error("Error exporting platform setting logs to Excel:", error);
      toast.error("Failed to export platform setting logs to Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  const renderChanges = (changes) => {
    if (!changes || changes.length === 0) return "No changes recorded";

    return (
      <div className="space-y-1 text-xs">
        {changes.map((change, index) => (
          <div
            key={change._id || index}
            className="flex justify-between bg-gray-50 p-2 rounded"
          >
            <span className="font-medium">{change.field}:</span>
            <span className="text-gray-600">
              {change.oldValue} →{" "}
              <span className="font-semibold text-green-600">
                {change.newValue}
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Breaker />
      <div className="flex justify-between items-center mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchQuery(search);
            setPage(1);
          }}
        >
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search platform setting logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              aria-label="Search platform setting logs"
            />
            <button className="bg-gradient-to-r from-[#45d85e] to-[#1F4926] text-white px-5 py-2.5 rounded-lg font-medium hover:from-[#3cc752] hover:to-[#1a3b20] transition-all duration-300">
              Search
            </button>
          </div>
        </form>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => exportFunc(data)}
          className="bg-gradient-to-r from-[#45d85e] to-[#1F4926] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg hover:from-[#3cc752] hover:to-[#1a3b20] transition-all duration-300"
          aria-label="Export platform setting logs to Excel"
        >
          {isExporting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Exporting...
            </span>
          ) : (
            "Export Excel"
          )}
        </motion.button>
      </div>

      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        data-aos="fade-up"
      >
        <table
          className="w-full min-w-[900px]"
          aria-label="platform setting logs table"
        >
          <thead>
            <tr className="bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white text-sm font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 text-left">S.No</th>
              {/* <th className="py-3 px-4 text-left">Setting ID</th> */}
              <th className="py-3 px-4 text-left">Platform Charge</th>
              <th className="py-3 px-4 text-left">Handling Charge</th>
              <th className="py-3 px-4 text-left">Pickup Charge</th>
              <th className="py-3 px-4 text-left">Min Amount</th>
              <th className="py-3 px-4 text-left">Min Weight</th>
              <th className="py-3 px-4 text-left">Updated By</th>
              <th className="py-3 px-4 text-left">Updated Date</th>
              {/* <th className="py-3 px-6 text-left">Changes</th> */}
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="py-8 text-center text-gray-500 text-lg"
                >
                  No platform setting logs found
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors duration-200`}
                >
                  <td className="py-3 px-4 text-gray-600">
                    {(page - 1) * rowsPerPage + index + 1}
                  </td>
                  {/* <td className="py-3 px-4 text-gray-600">
                    {row.settingId || "N/A"}
                  </td> */}
                  <td className="py-3 px-4 text-gray-600">
                    <Chip
                      label={row.platformCharge || "N/A"}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <Chip
                      label={row.handlingCharge || "N/A"}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <Chip
                      label={row.pickupCharge || "N/A"}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <Chip
                      label={row.minAmount || "N/A"}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <Chip
                      label={row.minWeight || "N/A"}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {row.updatedByName || row.updatedByEmail || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {row.updatedAtFormatted}
                  </td>
                  {/* <td className="py-3 px-6">
                    <div className="max-w-xs max-h-20 overflow-y-auto">
                      {renderChanges(row.changes)}
                    </div>
                  </td> */}
                  {/* <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => handleMenuOpen(e, row.id)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={`Actions for banner log ${row.id}`}
                    >
                      <MoreVertIcon />
                    </button>
                    <div
                      className={`${
                        anchorEl && selectedRowId === row.id
                          ? "block"
                          : "hidden"
                      } absolute bg-white shadow-lg rounded-lg z-10`}
                    >
                      <button
                        onClick={() => {
                          navigate(`PlatformSettingLogView/${row.id}`); // Adjust route as needed for detailed view
                          handleMenuClose();
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <EyeIcon className="h-5 w-5 text-blue-600" />
                        View
                      </button>
                    </div>
                  </td> */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => handleMenuOpen(e, row.id)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={`Actions for banner log ${row.id}`}
                    >
                      <MoreVertIcon />
                    </button>
                    <div
                      className={`${
                        anchorEl && selectedRowId === row.id
                          ? "block"
                          : "hidden"
                      } absolute bg-white shadow-lg rounded-lg z-10`}
                    >
                      <button
                        onClick={() => {
                          navigate(`PlatformSettingLogView/${row.id}`); // Adjust route as needed for detailed view
                          handleMenuClose();
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <EyeIcon className="h-5 w-5 text-blue-600" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalRecord > rowsPerPage && (
        <div className="mt-6 flex justify-center">
          <nav aria-label="Pagination for platform setting logs">
            <ul className="inline-flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <li key={p}>
                  <button
                    onClick={() => handlePageChange(null, p)}
                    className={`px-4 py-2 rounded-lg ${
                      page === p
                        ? "bg-gradient-to-r from-[#45d85e] to-[#1F4926] text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                    } transition-colors duration-200`}
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
