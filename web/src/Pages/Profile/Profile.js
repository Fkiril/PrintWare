import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Avatar, Grid, Paper } from '@mui/material';
import PasswordDialog from './ChangePass';
import { InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LoadingSpinner from '../../components/ui/Loading/LoadingSpinner';

import axios from 'axios';
import { CustomerModelKeys } from '../../models/User';

const token = localStorage.getItem('accessToken');

const showAlert = (message, type) => {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Oops...' : 'Success',
    text: message,
    confirmButtonText: 'OK',
  });
};

const Profile = () => {
  const [ userName, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ phoneNum, setPhone ] = useState('');
  const [ classId, setClass ] = useState('');
  const [ hcmutId, setHcmutId ] = useState('');
  const [ faculty, setFaculty ] = useState('');
  const [ major, setMajor ] = useState('')
  const [ academicYear, setAcademicYear ] = useState('')
  const [ avatar, setAvatar ] = useState('');
  const [ originalAvatar, setOriginalAvatar ] = useState('');
  const [ coverPhoto, setCoverPhoto ] = useState('');
  const [ originalCoverPhoto, setOriginalCoverPhoto ] = useState('');

  const [ isEditable, setIsEditable ] = useState(false);
  const [ isPasswordDialogOpen, setIsPasswordDialogOpen ] = useState(false);
  const [ isPasswordConfirmed, setIsPasswordConfirmed ] = useState(false);
  const [ loading, setLoading ] = useState(false); 

  const loadData = () => {
    setUsername(localStorage.getItem(CustomerModelKeys.userName));
    setEmail(localStorage.getItem(CustomerModelKeys.email));
    setPhone(localStorage.getItem(CustomerModelKeys.phoneNum));
    setClass(localStorage.getItem(CustomerModelKeys.classId));
    setHcmutId(localStorage.getItem(CustomerModelKeys.hcmutId));
    setFaculty(localStorage.getItem(CustomerModelKeys.faculty));
    setMajor(localStorage.getItem(CustomerModelKeys.major));
    setAcademicYear(localStorage.getItem(CustomerModelKeys.academicYear));

    if (localStorage.getItem(CustomerModelKeys.avatar)) {
      setAvatar(localStorage.getItem(CustomerModelKeys.avatar));
      setOriginalAvatar(localStorage.getItem(CustomerModelKeys.avatar));
    } else {
      setAvatar('');
      setOriginalAvatar('');
    }
    if (localStorage.getItem(CustomerModelKeys.coverPhoto)) {
      setCoverPhoto(localStorage.getItem(CustomerModelKeys.coverPhoto));
      setOriginalCoverPhoto(localStorage.getItem(CustomerModelKeys.coverPhoto));
    }
    else {
      setCoverPhoto('');
      setOriginalCoverPhoto('');
    }
  };

  const fetchProfileEdit = async () => {
    if (!localStorage.getItem(CustomerModelKeys.userId)) {
      showAlert('User not found', 'error');
      return;
    }
    if (!userName) {
      showAlert('userName is required', 'error');
      return;
    }
    if (!hcmutId || !faculty) {
      showAlert('HcmutId and faculty are required', 'error');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append(CustomerModelKeys.userName, userName);
    formData.append(CustomerModelKeys.email, email);
    formData.append(CustomerModelKeys.phoneNum, phoneNum);
    formData.append(CustomerModelKeys.hcmutId, hcmutId);
    formData.append(CustomerModelKeys.classId, classId);
    formData.append(CustomerModelKeys.faculty, faculty);
    formData.append(CustomerModelKeys.major, major);
    formData.append(CustomerModelKeys.academicYear, academicYear);

    const fileInputAvatar = document.querySelector('input[name="avatar"]');
    const fileInputCover = document.querySelector('input[name="coverPhoto"]');
    if (fileInputAvatar && fileInputAvatar.files[0]) {
      formData.append('avatar', fileInputAvatar.files[0]);
    }
    if (fileInputCover && fileInputCover.files[0]) {
      formData.append('coverPhoto', fileInputCover.files[0]);
    }

    const responses = await Promise.allSettled([
      axios.patch(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/update-profile`, formData, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          userId: localStorage.getItem(CustomerModelKeys.userId)
        }
      }),
      formData.has('avatar') && axios.post(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/upload-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          userId: localStorage.getItem(CustomerModelKeys.userId),
          type: 'avatar'
        }
      }),
      formData.has('coverPhoto') && axios.post(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/upload-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          userId: localStorage.getItem(CustomerModelKeys.userId),
          type: 'coverPhoto'
        }
      })
    ]);

    responses.forEach((response, index) => {
      if (response !== undefined) {
        if (response.status === 'fulfilled') {
          if (index === 0) {
            const result = response.value.data;
            setIsEditable(false);
            localStorage.setItem(CustomerModelKeys.userName, result.data.userName || '');
            localStorage.setItem(CustomerModelKeys.email, result.data.email || '');
            localStorage.setItem(CustomerModelKeys.phoneNum, result.data.phoneNum || '');
            localStorage.setItem(CustomerModelKeys.hcmutId, result.data.hcmutId || '');
            localStorage.setItem(CustomerModelKeys.faculty, result.data.faculty || '');
            localStorage.setItem(CustomerModelKeys.major, result.data.major || '');
            localStorage.setItem(CustomerModelKeys.classId, result.data.classId || '');
            localStorage.setItem(CustomerModelKeys.academicYear, result.data.academicYear || '');
          }
          else {
            const imageResponse = response.value.data;
            setImageInLocalStorage(index === 1 ? 'avatar' : 'coverPhoto', { contentType: imageResponse.headers['Content-Type'], data: imageResponse.data });
          }
        }
        else if (response.status === 'rejected') {
          if (index === 0) {
            console.error("Error update profile data: ", response.reason, response.value.data)
          }
          else if (index === 1) {
            console.error("Error update avatar data: ", response.reason, response.value.data)
          }
          else {
            console.error("Error update cover photo data: ", response.reason, response.value.data)
          }
        }
      }
    });

    loadData();

    setLoading(false);
  };

  const setImageInLocalStorage = (key, data) => {
    if (data) {
      const src = `data:${data.contentType};base64,${data.data}`;
      localStorage.setItem(key, src);
    } else {
      localStorage.setItem(key, '');
    }
  };

  const handleSave = () => {
    fetchProfileEdit();
  };

  const handleCancel = () => {
    loadData();
    setIsEditable(false);
    setAvatar(originalAvatar);
    setCoverPhoto(originalCoverPhoto);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChangeClick = () => {
    if (isEditable) {
      setIsPasswordDialogOpen(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const obfuscatePhone = (phoneNum) => {
    if (!phoneNum) return '';
    const digits = phoneNum.replace(/\D/g, '');
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  };

  const obfuscateEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    return `${user.slice(0, 2)}${'*'.repeat(user.length - 2)}@${domain}`;
  };
  return (
    <Box sx={{ p: 3, maxWidth: '600px', margin: 'auto',height:'100vh',marginTop: '50px',}}>
      <Paper sx={{ p: 2, borderRadius: '17px' ,background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.6) 5%, 
                    rgba(255, 255, 255, 1) 100%)`,}}>
        {/* Cover Photo Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 200, // Adjust height as needed
            backgroundImage: `url(${coverPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '17px',
            border: '1px solid #ddd', // Border around the cover photo
            mb: 2,
          }}
        >
          {isEditable && (
            <Button
              variant="contained"
              component="label"
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                bgcolor: '#ffffff',
                color: '#000',
                fontSize: '0.75rem', // Kích thước chữ nhỏ hơn
                padding: '4px 8px', // Kích thước nút nhỏ hơn
                '&:hover': {
                  bgcolor: '#e0e0e0',
                },
              }}
            >
              Upload Cover Photo
              <input
                type="file"
                name="coverPhoto"
                hidden
                onChange={handleCoverPhotoChange}
              />
            </Button>
          )}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              mb: 2,
            }}
          >
            <img 
              id='test-img'/>

            <Avatar src={avatar} sx={{ width: 100, height: 100,top:15, }} />
            {isEditable && (
              <Button
                variant="contained"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: '#ffffff',
                  color: '#000',
                  padding: '1px 1px', // Kích thước nút nhỏ hơn
                  borderRadius: '20px',
                  '&:hover': {
                    bgcolor: '#e0e0e0',
                  },
                }}
              >
                <CameraAltIcon />
                <input
                  type="file"
                  name="avatar"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Button>
            )}
          </Box>
        </Box>

        {/* Profile Form */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="userName"
              value={userName || ''}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={isEditable ? email : obfuscateEmail(email)}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              value={isEditable ? phoneNum : obfuscatePhone(phoneNum)}
              fullWidth
              InputProps={{
                readOnly: true, // Phone number is always read-only
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              value="**** ****"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: isEditable && (
                  <InputAdornment position="end">
                    <Button
                      variant="text"
                      sx={{ textTransform: 'none' }}
                      onClick={handlePasswordChangeClick}
                    >
                      Click here to change password
                    </Button>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="ID Student"
              value={hcmutId || ''}
              onChange={(e) => setHcmutId(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="classId" 
              value={classId || ''}
              onChange={(e) => setClass(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="faculty"
              value={faculty || ''}
              onChange={(e) => setFaculty(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            {!isEditable ? (
              <Button variant="contained" onClick={() => setIsEditable(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  sx={{
                    bgcolor: '#ff0505',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: '#b50000', // Dark red on hover
                    },
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>

                {/* Container for LoadingSpinner to not affect layout */}
                <Box sx={{ position: 'relative', width: '50px', height: '50px', alignItems: 'center' }}>
                  {loading && (
                    <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
                      <LoadingSpinner />
                    </Box>
                  )}
                </Box>

                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save
                </Button>
              </>
            )}
          </Grid>

        </Grid>
      </Paper>

      {/* Password Dialog */}
      <PasswordDialog
        open={isPasswordDialogOpen}
        onClose={() => {
          setIsPasswordDialogOpen(false);
          if (isPasswordConfirmed) {
            // Refresh profile data if the password was confirmed
            loadData();
          }
        }}
        onConfirm={(confirmed) => {
          setIsPasswordConfirmed(confirmed); // Đảm bảo setIsPasswordConfirmed được gọi đúng cách
          if (confirmed) {
            setIsPasswordDialogOpen(false); // Close the dialog if password is confirmed
          }
        }}
      />
    </Box>
  );
};

export default Profile;
