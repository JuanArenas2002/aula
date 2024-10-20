import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../services/authService';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../context/ThemeContext'; 
import Loader from '../components/Loader'; 

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100%',
  background: theme.palette.mode === 'light' 
    ? `linear-gradient(135deg, #f0f4f8 30%, #e1e9ee 90%)` 
    : `linear-gradient(135deg, #121212 30%, #1e1e1e 90%)`,
  color: theme.palette.text.primary,
  transition: 'background-color 0.3s ease, color 0.3s ease',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'light' ? '#ffffff' : '#242424',
  borderRadius: '20px',
  padding: '40px',
  boxShadow: theme.palette.mode === 'light' ? '0 10px 20px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.5)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  maxWidth: '400px',
  width: '100%',
}));

const IconContainer = styled(Box)(({ theme }) => ({
  fontSize: '4rem',
  marginBottom: '20px',
  color: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: '20px',
  padding: '12px 24px',
  fontSize: '1.1rem',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  
   // Adding a gradient effect for button
   backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  
   '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)',
    boxShadow: theme.palette.mode === 'light' ? 
      '0px 6px 12px rgba(0,0,0,0.2)' : 
      '0px 8px 16px rgba(255,255,255,.2)',
    transition: 'transform .2s ease-in-out',
   },
}));

const ErrorText = styled(Typography)(({ theme }) => ({
    color: theme.palette.error.main,
    marginTop: '10px',
    fontWeight:'bold', // Make error text bold
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        backgroundColor:
            theme.palette.mode === 'light' ? '#f5f5f5' : '#333333',
        borderRadius: '10px',
        transition: '.3s ease-in-out',

        '& input': {
            color: theme.palette.text.primary,
        },
        '& label': {
            color:'#888888', // Light gray label
            transition:'color .3s ease-in-out'
        },
        '& fieldset': {
            borderColor:
                theme.palette.mode === 'light' ? '#bdbdbd' : '#555555',
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const ThemeSwitchContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '20px',
    right: '20px',
}));

const InstitutionLogin = () => {
    const [credentials, setCredentials] = useState({ nit: '', clave: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    
    const { mode, toggleTheme } = useTheme();

    
 const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value,
        }));
};

const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await login('http://localhost:3001/api/institucion/login', credentials); // Usa la URL correcta
            setLoading(false);
            toast.success('Inicio de sesión exitoso.');
            navigate('/dashboard-institucion');
        } catch (error) {
            setLoading(false);
            setError('Error de inicio de sesión. Por favor verifica tus credenciales e intenta nuevamente.');
            toast.error('Error de inicio de sesión. Por favor verifica tus credenciales e intenta nuevamente.');
        }
};

return (
    <PageContainer>
      {loading && <Loader />}
      <ThemeSwitchContainer>
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </ThemeSwitchContainer>
      <FormContainer>
        <IconContainer>
          <BusinessIcon fontSize="inherit" />
        </IconContainer>
        <Typography variant="h4" gutterBottom align="center" color="textPrimary">
          Institution Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            label="NIT"
            name="nit"
            value={credentials.nit}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            InputProps={{
              startAdornment:<BusinessIcon style={{color:'#00bcd4'}} />,
            }}
          />
          <StyledTextField
            label="Clave"
            name="clave"
            type="password"
            value={credentials.clave}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            InputProps={{
              startAdornment:<LockIcon style={{color:'#00bcd4'}} />,
            }}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <StyledButton type="submit" variant="contained" fullWidth>
              Login
          </StyledButton>
        </form>
      </FormContainer>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
      />
    </PageContainer>
);
};

export default InstitutionLogin;