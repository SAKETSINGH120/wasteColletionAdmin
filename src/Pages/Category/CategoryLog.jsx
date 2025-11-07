import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import { getCategoryLogsApi } from "../../Services/CategoryApi";
import { EyeIcon } from "@heroicons/react/24/outline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import xlsx from "json-as-xlsx";

export default function CategoryLog() {
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
      const result = await getCategoryLogsApi({
        page,
        rowsPerPage,
        searchQuery,
      });
      if (result?.status) {
        toast.success("Category logs fetched successfully!");
        const transformedData = (result.data || []).map((item) => ({
          ...item,
          id: item._id,
          categoryId: item.category?._id,
          categoryName: item.category?.name,
          imagePath: item.category?.image,
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
        toast.error(result?.message || "Failed to fetch category logs.");
      }
    } catch (error) {
      console.error("Error fetching category logs:", error);
      toast.error("Error fetching category logs.");
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
      return toast.error("Category logs list is empty!");
    }
    setIsExporting(true);
    const settings = {
      fileName: "Category_Logs",
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };
    const data = [
      {
        sheet: "Category Logs",
        columns: [
          { label: "Log ID", value: (row) => row?._id || "" },
          { label: "Category ID", value: (row) => row?.categoryId || "N/A" },
          {
            label: "Category Name",
            value: (row) => row?.categoryName || "N/A",
          },
          { label: "Image Path", value: (row) => row?.imagePath || "N/A" },
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
      toast.success("Category logs exported to Excel successfully!");
    } catch (error) {
      console.error("Error exporting category logs to Excel:", error);
      toast.error("Failed to export category logs to Excel.");
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
              placeholder="Search category logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              aria-label="Search category logs"
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
          aria-label="Export category logs to Excel"
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
          className="w-full min-w-[800px]"
          aria-label="category logs table"
        >
          <thead>
            <tr className="bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white text-sm font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 text-left">S.No</th>
              {/* <th className="py-3 px-4 text-left">Category ID</th> */}
              <th className="py-3 px-4 text-left">Category Name</th>
              <th className="py-3 px-4 text-left">Image</th>
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
                  colSpan={8}
                  className="py-8 text-center text-gray-500 text-lg"
                >
                  No category logs found
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
                    {row.categoryId || "N/A"}
                  </td> */}
                  <td className="py-3 px-4 text-gray-600">
                    {row.categoryName || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      {row.imagePath ? (
                        <img
                          src={row.imagePath}
                          alt="Category"
                          className="w-10 h-6 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <span
                        className="text-xs truncate max-w-32"
                        title={row.imagePath}
                      >
                        {row.imagePath
                          ? row.imagePath.split("/").pop()
                          : "No image"}
                      </span>
                      <span
                        style={{ display: "none" }}
                        className="text-gray-400"
                      >
                        No image
                      </span>
                    </div>
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
                          navigate(`category-log-view/${row.id}`); // Adjust route as needed for detailed view
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
          <nav aria-label="Pagination for category logs">
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
