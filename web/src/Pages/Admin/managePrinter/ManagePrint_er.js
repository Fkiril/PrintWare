import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  // const [employees, setEmployees] = useState([
  //   {
  //     id: 1,
  //     employeeId: "EMP001",
  //     name: "John Doe",
  //     email: "john@example.com",
  //     address: "123 Main Street, New York",
  //     lastLogin: "2023-12-01 10:00:00",
  //     loginCount: 12,
  //   },
  //   {
  //     id: 2,
  //     employeeId: "EMP002",
  //     name: "Jane Smith",
  //     email: "jane@example.com",
  //     address: "456 Elm Street, Los Angeles",
  //     lastLogin: "2023-12-03 14:45:00",
  //     loginCount: 8,
  //   },
  //   {
  //     id: 3,
  //     employeeId: "EMP003",
  //     name: "Michael Brown",
  //     email: "michael@example.com",
  //     address: "789 Oak Street, Chicago",
  //     lastLogin: "2023-12-02 09:30:00",
  //     loginCount: 15,
  //   },
  // ]);
  const [employees, setEmployees] = useState([]);

  async function fetchUsersProfile() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found');
      return false;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/get-all-user-profiles`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          userType: 'spso'
        }
      });

      setEmployees(response.data.data);

      return true;
    } catch (error) {
      console.error('Error fetching users:', error);
      return false;
    }
  }

  useEffect(() => {
    fetchUsersProfile();
  }, []);

  const chartRef = useRef(null); // Tham chiếu biểu đồ

  // Dữ liệu cho biểu đồ
  const loginData = {
    labels: employees.map((emp) => emp.name),
    datasets: [
      {
        label: "Login Counts",
        data: employees.map((emp) => emp.loginCount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Employees",
        },
      },
      y: {
        title: {
          display: true,
          text: "Login Count",
        },
        beginAtZero: true,
      },
    },
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleSaveChanges = () => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id ? { ...selectedEmployee } : emp
      )
    );
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Employee Management
      </Typography>

      {/* Bảng nhân viên */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Last Login Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.userId}>
                <TableCell>{emp.userId}</TableCell>
                <TableCell>{emp.employeeId}</TableCell>
                <TableCell>{emp.userName}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.address}</TableCell>
                <TableCell>{emp.lastLogin}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(emp)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(emp.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Biểu đồ thống kê */}
      <Box sx={{ mb: 4, height: "400px", width: "800px", textAlign: 'center', margin: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          Login Statistics
        </Typography>
        <Bar ref={chartRef} data={loginData} options={chartOptions} />
      </Box>

      {/* Dialog chỉnh sửa */}
      {selectedEmployee && (
        <Dialog open={isEditDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogContent>
            <TextField
              label="Employee ID"
              value={selectedEmployee.employeeId}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  employeeId: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Name"
              value={selectedEmployee.name}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  name: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              value={selectedEmployee.email}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  email: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Address"
              value={selectedEmployee.address}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  address: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AdminDashboard;
