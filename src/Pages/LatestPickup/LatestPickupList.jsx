import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import { getUnassignedPickupsApi } from "../../Services/LatestPickupApi";
import { EyeIcon } from "@heroicons/react/24/outline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import xlsx from "json-as-xlsx";

export default function UnassignedPickupList() {
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
      const result = await getUnassignedPickupsApi({
        page,
        rowsPerPage,
        searchQuery,
      });
      if (result?.status) {
        toast.success("Unassigned pickup requests fetched successfully!");
        const transformedData = (result.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
        setData(transformedData);
        setTotalPages(result.totalPage || 0);
        setTotalRecord(result.totalResult || 0);
      } else {
        toast.error(
          result?.message || "Failed to fetch unassigned pickup requests."
        );
      }
    } catch (error) {
      console.error("Error fetching unassigned pickup requests:", error);
      toast.error("Error fetching unassigned pickup requests.");
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

  const exportFunc = async (allRequestsData) => {
    if (allRequestsData.length < 1) {
      return toast.error("Unassigned pickup requests list is empty!");
    }
    setIsExporting(true);
    const settings = {
      fileName: "WasteCollection_UnassignedPickupRequests",
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };
    const data = [
      {
        sheet: "Unassigned Pickup Requests",
        columns: [
          { label: "ID", value: (row) => row?._id || "" },
          { label: "User Name", value: (row) => row?.user?.name || "N/A" },
          { label: "User Mobile", value: (row) => row?.user?.mobile || "N/A" },
          { label: "Address", value: (row) => row?.address?.address || "N/A" },
          {
            label: "Pickup Date",
            value: (row) =>
              row?.pickupDate
                ? new Date(row.pickupDate).toLocaleDateString()
                : "N/A",
          },
          { label: "Pickup Time", value: (row) => row?.pickupTime || "N/A" },
          {
            label: "Waste Types",
            value: (row) =>
              row?.wasteType
                ?.map((wt) => `${wt.notes} (Qty: ${wt.quantity})`)
                .join(", ") || "N/A",
          },
          { label: "Total Amount", value: (row) => row?.totalAmount || "0" },
          { label: "Status", value: (row) => row?.requestStatus || "N/A" },
          {
            label: "Created At",
            value: (row) =>
              row?.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A",
          },
        ],
        content: allRequestsData,
      },
    ];
    try {
      xlsx(data, settings);
      toast.success("Exported to Excel successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export to Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Breaker />
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search unassigned pickup requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            aria-label="Search unassigned pickup requests"
          />
          <button
            onClick={() => {
              setSearchQuery(search);
              setPage(1);
            }}
            className="bg-gradient-to-r from-[#45d85e] to-[#1F4926] text-white px-5 py-2.5 rounded-lg font-medium hover:from-[#3cc752] hover:to-[#1a3b20] transition-all duration-300"
          >
            Search
          </button>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => exportFunc(data)}
          className="bg-gradient-to-r from-[#45d85e] to-[#1F4926] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg hover:from-[#3cc752] hover:to-[#1a3b20] transition-all duration-300"
          aria-label="Export unassigned pickup requests to Excel"
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
          className="w-full min-w-[700px]"
          aria-label="unassigned pickup requests table"
        >
          <thead>
            <tr className="bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white text-sm font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 text-left">S.No</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Pickup Date</th>
              <th className="py-3 px-4 text-left">Pickup Time</th>
              {/* <th className="py-3 px-4 text-left">Waste Types</th> */}
              <th className="py-3 px-4 text-left">Total Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center text-gray-500 text-lg"
                >
                  No unassigned pickup requests found
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
                  <td className="py-3 px-4 text-gray-600">
                    {row.user?.name || row.user?.mobile || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {row.address?.address
                      ? `${row.address.address}, ${row.address.city}, ${row.address.state}`
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {row.pickupDate
                      ? new Date(row.pickupDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {row.pickupTime || "N/A"}
                  </td>
                  {/* <td className="py-3 px-4 text-gray-600">
                    {row.wasteType
                      ?.map((wt) => `${wt.notes} (Qty: ${wt.quantity})`)
                      .join(", ") || "N/A"}
                  </td> */}
                  <td className="py-3 px-4 text-gray-600">
                    {row.totalAmount || "0"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <Chip
                      label={row.requestStatus || "N/A"}
                      color={
                        row.requestStatus === "Pending" ? "warning" : "success"
                      }
                      size="small"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => handleMenuOpen(e, row.id)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={`Actions for pickup request ${row.id}`}
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
                          navigate(`requestPickupView/${row.id}`);
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
          <nav aria-label="Pagination for unassigned pickup requests">
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
