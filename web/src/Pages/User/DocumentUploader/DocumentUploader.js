import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
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
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileType, setFileType] = useState("all"); // State cho loại file
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newDocs = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
    }));
    setDocuments((prevDocs) => [...prevDocs, ...newDocs]);
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) setFileType(newType);
  };

  const filteredDocuments =
    fileType === "all"
      ? documents
      : documents.filter((doc) => doc.name.endsWith(fileType));

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
        {/* Thanh chọn loại tài liệu */}
        <ToggleButtonGroup
          value={fileType}
          exclusive
          onChange={handleTypeChange}
          sx={{ marginBottom: "20px" }}
          fullWidth
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value=".pdf">PDF</ToggleButton>
          <ToggleButton value=".docx">DOCX</ToggleButton>
          <ToggleButton value=".txt">TXT</ToggleButton>
        </ToggleButtonGroup>

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

        <List sx={{ marginTop: "20px", textAlign: "left" }}>
          {filteredDocuments.map((doc, index) => (
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
                onClick={() => setDeleteIndex(index)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          disabled={documents.length === 0}
          onClick={() => navigate("/document-list", { state: { documents } })}
          sx={{ marginTop: "20px" }}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentUploader;
