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
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import {
  getAllSubCategory,
  SubCategoryDelete,
} from "../../Services/SubCategoryApi";
import { Modal } from "antd";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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

export default function SubCategoryList() {
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllSubCategory({
        page,
        rowsPerPage,
        searchQuery,
      });
      if (result?.status) {
        toast.success("Subcategories fetched successfully!");
        const transformedData = (result.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
        setData(transformedData);
        setTotalPages(result.totalPage || 0);
        setTotalRecord(result.totalResult || 0);
      } else {
        toast.error(result?.message || "Failed to fetch subcategories.");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Error fetching subcategories.");
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
    setSelectedImage("");
  };

  const deleteHandler = (id) => {
    Modal.confirm({
      title: "Delete Subcategory",
      content:
        "Are you sure you want to delete this subcategory? This action cannot be undone.",
      okText: loading ? "Deleting..." : "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: { disabled: loading },
      onOk: async () => {
        try {
          setLoading(true);
          const result = await SubCategoryDelete(id);
          if (result?.status) {
            toast.success("Subcategory deleted successfully!");
            fetchData();
          } else {
            toast.error(result?.message || "Failed to delete subcategory.");
          }
        } catch (error) {
          console.error("Error deleting subcategory:", error);
          toast.error("Error deleting subcategory.");
        } finally {
          setLoading(false);
        }
      },
    });
    handleMenuClose();
  };

  const handleAddClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("createsubcategory");
      setIsLoading(false);
    }, 300);
  };

  const exportFunc = async (allLeadsData) => {
    if (allLeadsData.length < 1) {
      return toast.error("Subcategory list is empty!");
    }
    setIsExporting(true);
    const settings = {
      fileName: "WasteCollection_Subcategories",
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };
    const data = [
      {
        sheet: "Subcategory List",
        columns: [
          { label: "ID", value: (row) => row?._id || "" },
          { label: "Name", value: (row) => row?.name || "" },
          { label: "Image Path", value: (row) => row?.image || "" },
          { label: "Category Name", value: (row) => row?.category?.name || "" },
          { label: "Priority", value: (row) => row?.priority ?? "" },
          {
            label: "Status",
            value: (row) => (row?.status ? "Active" : "Inactive"),
          },
          { label: "Measure By", value: (row) => row?.measureBy || "" },
          { label: "Price", value: (row) => row?.price ?? "" },
          {
            label: "Created Date",
            value: (row) =>
              row?.createdAt ? new Date(row.createdAt).toLocaleString() : "",
          },
        ],
        content: allLeadsData,
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
            placeholder="Search subcategories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            aria-label="Search subcategories"
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
            aria-label="Export subcategories to Excel"
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
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddClick}
            data-aos="fade-left"
            className="bg-gradient-to-t from-[#45d85e] to-[#1F4926] text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-shadow"
            aria-label="Add new subcategory"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoderBtn />
                Add Subcategory
              </span>
            ) : (
              "Add Subcategory"
            )}
          </motion.button>
        </div>
      </div>

      <TableContainer
        component={Paper}
        className="rounded-xl shadow-lg overflow-hidden"
      >
        <Table sx={{ minWidth: 700 }} aria-label="subcategory table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Priority</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Measure By</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Created Date</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell
                  colSpan={10}
                  align="center"
                  className="py-8 text-gray-500 text-lg"
                >
                  No subcategories found
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              data.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>
                    {(page - 1) * rowsPerPage + index + 1}
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.name || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.image ? (
                      <img
                        className="h-12 w-16 rounded-md object-cover border-2 border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                        src={`${BASE_URL}/${row.image}`}
                        alt={`Subcategory ${row.name || row.id}`}
                        onClick={() =>
                          handleImageClick(`${BASE_URL}/${row.image}`)
                        }
                        // onError={(e) => (e.target.src = '/assets/placeholder.png')}
                      />
                    ) : (
                      <div className="h-12 w-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                        N/A
                      </div>
                    )}
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.category?.name || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.priority || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        row.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {row.status ? "Active" : "Inactive"}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.measureBy || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.price != null ? row.price : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell className="text-gray-600">
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString()
                      : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, row.id)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={`Actions for subcategory ${
                        row.name || row.id
                      }`}
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
                          navigate(`subcategoryView/${row.id}`);
                          handleMenuClose();
                        }}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                      >
                        <EyeIcon className="h-5 w-5 text-blue-600" />
                        View
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          navigate(`updateSubcategory/${row.id}`);
                          handleMenuClose();
                        }}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                      >
                        <PencilIcon className="h-5 w-5 text-green-600" />
                        Edit
                      </MenuItem>
                      {/* <MenuItem
                        onClick={() => deleteHandler(row.id)}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                      >
                        <TrashIcon className="h-5 w-5 text-red-600" />
                        Delete
                      </MenuItem> */}
                    </Menu>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        title="Subcategory Image"
        open={isImageModalOpen}
        onCancel={handleImageModalClose}
        footer={null}
        centered
        width={800}
        className="p-4"
      >
        <div className="flex justify-center items-center">
          <img
            src={selectedImage}
            alt="Large subcategory"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </Modal>

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
            aria-label="Pagination for subcategory list"
          />
        </Stack>
      )}
    </div>
  );
}
