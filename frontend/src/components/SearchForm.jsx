// frontend/src/components/SearchForm.jsx (VERSÃO FINAL E RESPONSIVA)

import React, { useState, useContext } from 'react';
import { 
    Box, Button, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CatContext } from '../contexts/CatContext';

// -------------------------------------------------------------------
// COMPONENTE PRINCIPAL: SearchForm
// -------------------------------------------------------------------
export default function SearchForm() {
    const { fetchCats, state, dataSource, user } = useContext(CatContext); 
    const { loading } = state;
    const [q, setQ] = useState(''); 
    
    function handleSearch(e) {
        e.preventDefault();
        
        if (dataSource === 'db') {
            if (!user) {
                alert('Faça login para buscar dados do seu Banco de Dados!');
                return;
            }
            fetchCats(q); 
        } else {
            fetchCats(q);
        }
    }

    return (
        <Box sx={{ mb: 3, width: { xs: '100%', sm: 'auto' } }}>
            
            <Box 
                component="form" 
                onSubmit={handleSearch} 
                // 💡 AJUSTE DE RESPONSIVIDADE: Muda a direção para coluna em mobile (xs)
                sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' } // Empilha no mobile
                }}
            >
                <TextField
                    label={dataSource === 'db' ? 'Buscar Gato por Nome/Raça no DB' : 'Buscar Raça na API Externa'}
                    variant="outlined"
                    size="small" 
                    // 💡 AJUSTE DE RESPONSIVIDADE: Ocupa 100% da largura do contêiner pai no mobile
                    sx={{ width: { xs: '100%', sm: 350 } }} 
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    disabled={loading} 
                    
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    disabled={loading}
                    // 💡 AJUSTE DE RESPONSIVIDADE: Ocupa 100% da largura no mobile
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    {loading ? 'Buscando...' : 'Buscar Dados'}
                </Button>
                
            </Box>

        </Box>
    );
}