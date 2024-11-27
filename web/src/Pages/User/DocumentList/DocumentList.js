import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Box, Typography, List, ListItem, ListItemText, IconButton, Dialog, DialogActions, DialogTitle } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";

const DocumentList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [documents, setDocuments] = React.useState(location.state?.documents || []);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = React.useState(null);

  const handleDeleteDialog = (index) => {
    setDeleteIndex(index);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDocuments((prevDocs) => prevDocs.filter((_, i) => i !== deleteIndex));
    setIsDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleAddDocument = () => {
    navigate("/document-uploader");
  };
  const handleOrder = () => {
    navigate("/order");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "20px",
        backgroundColor: "#f1f1f1",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Document List
      </Typography>
      <List sx={{ width: "50%", backgroundColor: "#fff", borderRadius: "6px", padding: "10px" }}>
        {documents.map((doc, index) => (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "10px 15px",
              marginBottom: "10px",
            }}
          >
            <ListItemText primary={doc.name} />
            <Box>
              <IconButton color="primary">
                <SettingsIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteDialog(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px", width: "50%" }}>
        <Button variant="contained" color="secondary" onClick={handleAddDocument}>
         Upload More
        </Button>

        <Button variant="contained" color="primary" onClick={handleOrder}>
          Confirm
        </Button>
      </Box>

      {/* Dialog for delete confirmation */}
      <Dialog open={isDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Are you sure you want to delete this document?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentList;
