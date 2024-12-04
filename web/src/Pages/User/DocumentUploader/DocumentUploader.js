import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

const DocumentUploader = () => {
  const [documents, setDocuments] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null); // Quản lý chỉ số tài liệu muốn xóa
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Quản lý trạng thái pop-up
  const navigate = useNavigate();

  // Xử lý khi chọn file
  const handleFileChange = (event) => {
    const files = event.target.files;
    const newDocs = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
    }));
    setDocuments((prevDocs) => [...prevDocs, ...newDocs]);
  };

  // Mở pop-up xóa
  const openDeleteDialog = (index) => {
    setDeleteIndex(index);
    setIsDialogOpen(true);
  };

  // Xử lý xóa tài liệu sau khi xác nhận
  const handleConfirmDelete = () => {
    const updatedDocuments = documents.filter((_, i) => i !== deleteIndex);
    setDocuments(updatedDocuments);
    setIsDialogOpen(false);
  };

  // Hủy bỏ xóa
  const handleCancelDelete = () => {
    setDeleteIndex(null);
    setIsDialogOpen(false);
  };

  // Chuyển sang DocumentList
  const handleNext = () => {
    navigate("/document-list", { state: { documents } });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          width: "600px",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Upload Your Document
        </Typography>

        {/* Phần tải file */}
        <Box>
          <TextField
            type="file"
            inputProps={{ multiple: true }}
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-input"
          />
          <label htmlFor="upload-input">
            <Button
              variant="contained"
              component="span"
              color="primary"
              startIcon={<UploadFileIcon />}
            >
              Upload
            </Button>
          </label>
        </Box>

        {/* Danh sách tài liệu */}
        <List sx={{ marginTop: "20px", textAlign: "left" }}>
          {documents.map((doc, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "4px",
                marginBottom: "10px",
                padding: "8px 16px",
              }}
            >
              <ListItemText primary={doc.name} />
              <IconButton
                color="error"
                size="small"
                onClick={() => openDeleteDialog(index)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        {/* Nút Next */}
        <Button
          variant="contained"
          color="primary"
          disabled={documents.length === 0}
          onClick={handleNext}
          sx={{ marginTop: "20px" }}
        >
          Confirm
        </Button>
      </Box>

      {/* Pop-up Xác Nhận Xóa */}
      <Dialog open={isDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Are you sure you want to delete this document?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">
            Cancle
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentUploader;