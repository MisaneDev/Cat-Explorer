// frontend/src/components/Login.jsx (VERSÃO FINAL SEM COMPONENTE HIDDEN)

import React, { useState, useContext } from 'react';
import { 
    Button, TextField, Box, Typography, 
    CardMedia, Alert
} from '@mui/material';
import { CatContext } from '../contexts/CatContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const { login } = useContext(CatContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const success = await login(email, password); 
    if (!success) {
      setErrorMsg('Credenciais inválidas. Verifique e-mail/senha.');
    }
  };

  return (
    // 1. CONTÊINER PRINCIPAL
    <Box 
        sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            bgcolor: '#f4f6f8',
            p: 2 
        }}
    >
        {/* 2. CAIXA PRINCIPAL DO LOGIN (Imagem + Formulário) */}
        <Box 
            sx={{ 
                display: 'flex', 
                maxWidth: 750, 
                width: '100%', 
                boxShadow: 8, 
                borderRadius: '12px',
                overflow: 'hidden',
                bgcolor: 'white'
            }}
        >
            {/* 3. IMAGEM (Responsividade nativa do MUI: Oculta no XS, visível a partir do SM) */}
            <Box 
                sx={{ 
                    // 💡 Oculta no mobile (xs), aparece no desktop (sm+)
                    display: { xs: 'none', sm: 'block' },
                    width: '50%', 
                    position: 'relative' 
                }}
            >
                <CardMedia
                    component="img"
                    image="https://drbigodes.pt/wp-content/uploads/Raca-de-Gato-Bengal.jpg"
                    alt="Imagem de Gato para Login"
                    sx={{ 
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                />
            </Box>

            {/* 4. FORMULÁRIO DE LOGIN */}
            <Box 
                sx={{ 
                    // Ocupa 100% no mobile, 50% no desktop
                    width: { xs: '100%', sm: '50%' }, 
                    p: { xs: 3, sm: 5 }, 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#3f51b5' }}>
                    Cat Explorer
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    Acesso para Gerenciamento
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        type="email"
                        label="E-mail"
                        placeholder="professor@utfpr.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    
                    <TextField
                        type="password"
                        label="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        sx={{ mb: 3 }}
                    />
                    
                    <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                        Entrar
                    </Button>
                </Box>
                
                {errorMsg && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {errorMsg}
                    </Alert>
                )}
            </Box>
        </Box>
    </Box>
  );
}

export default Login;