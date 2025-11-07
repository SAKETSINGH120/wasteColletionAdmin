import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import { getAllRequestPickups } from "../../Services/RequestPickupApi";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(to top, #45d85e, #1F4926)",
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: "0.95rem",
    padding: "12px 16px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.9rem",
    color: "#374151",
    padding: "12px 16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9fafb",
  },
  "&:hover": {
    backgroundColor: "#f1f5f9",
    transition: "background-color 0.2s ease",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function RequestPickupList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllRequestPickups({
        page,
        rowsPerPage,
        searchQuery,
      });
      if (result?.status) {
        toast.success("Pickup requests fetched successfully!");
        const transformedData = (result.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
        setData(transformedData);
        setTotalPages(result.totalPage || 0);
        setTotalRecord(result.totalResult || 0);
      } else {
        toast.error(result?.message || "Failed to fetch pickup requests.");
      }
    } catch (error) {
      console.error("Error fetching pickup requests:", error);
      toast.error("Error fetching pickup requests.");
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
    });
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleAddClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("createRequestPickup");
      setIsLoading(false);
    }, 300);
  };

  const exportFunc = async (allRequestsData) => {
    if (allRequestsData.length < 1) {
      return toast.error("Pickup requests list is empty!");
    }
    setIsExporting(true);
    const settings = {
      fileName: "WasteCollection_PickupRequests",
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };
    const data = [
      {
        sheet: "Pickup Requests List",
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker />
      </div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search pickup requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            aria-label="Search pickup requests"
          />
          <button
            onClick={() => {
              setSearchQuery(search);
              setPage(1);
            }}
            className="bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white px-5 py-2.5 rounded-lg font-medium"
          >
            Search
          </button>
        </div>
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => exportFunc(data)}
            className="bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-shadow"
            aria-label="Export pickup requests to Excel"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <LoderBtn />
                Exporting...
              </span>
            ) : (
              "Export Excel"
            )}
          </motion.button>
          {/* <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddClick}
            data-aos="fade-left"
            className="bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-shadow"
            aria-label="Add new pickup request"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoderBtn />
                Add Pickup Request
              </span>
            ) : (
              "Add Pickup Request"
            )}
          </motion.button> */}
        </div>
      </div>

      <TableContainer
        component={Paper}
        className="rounded-xl shadow-lg overflow-hidden"
      >
        <Table sx={{ minWidth: 700 }} aria-label="pickup requests table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Pickup Date</StyledTableCell>
              <StyledTableCell>Pickup Time</StyledTableCell>
              {/* <StyledTableCell>Waste Types</StyledTableCell> */}
              <StyledTableCell>Total Amount</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell
                  colSpan={9}
                  align="center"
                  className="py-8 text-gray-500 text-lg"
                >
                  No pickup requests found
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              data.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>
                    {(page - 1) * rowsPerPage + index + 1}
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.user?.name || row.user?.mobile || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.address?.address || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.pickupDate
                      ? new Date(row.pickupDate).toLocaleDateString()
                      : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.pickupTime || "N/A"}
                  </StyledTableCell>
                  {/* <StyledTableCell className="text-gray-600">
                    {row.wasteType
                      ?.map((wt) => `${wt.notes} (Qty: ${wt.quantity})`)
                      .join(", ") || "N/A"}
                  </StyledTableCell> */}
                  <StyledTableCell className="text-gray-600">
                    {row.totalAmount || "0"}
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.requestStatus || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, row.id)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={`Actions for pickup request ${row.id}`}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedRowId === row.id}
                      onClose={handleMenuClose}
                      PaperProps={{
                        className: "shadow-lg rounded-lg",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          navigate(`requestPickupView/${row.id}`);
                          handleMenuClose();
                        }}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                      >
                        <EyeIcon className="h-5 w-5 text-blue-600" />
                        View
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          navigate(`updateRequestPickup/${row.id}`);
                          handleMenuClose();
                        }}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                      >
                        <PencilIcon className="h-5 w-5 text-green-600" />
                        Edit
                      </MenuItem>
                    </Menu>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalRecord > rowsPerPage && (
        <Stack spacing={2} alignItems="center" marginTop={6}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
            className="rounded-lg p-2"
            boundaryCount={1}
            siblingCount={1}
            aria-label="Pagination for pickup requests list"
          />
        </Stack>
      )}
    </div>
  );
}
