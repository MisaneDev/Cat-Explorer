// frontend/src/App.jsx (VERSÃO FINAL E AJUSTADA)

import React, { useContext } from 'react';
import { 
    Container, Typography, Box, Grid, Alert,
    Button, Stack, Chip, CircularProgress 
} from '@mui/material'; 
import SearchForm from './components/SearchForm'; 
import CatCard from './components/CatCard';
import { CatContext } from './contexts/CatContext';
import Login from './components/Login';
import AddCatButton from './components/AddCatButton'; // O componente de botão/modal


export default function App() {
  const { 
    user, logout, state, 
    dataSource, setDataSource 
  } = useContext(CatContext); 
  
  const { breeds, loading, error, lastQuery } = state; 
  
  // Lógica de toggle da fonte de dados
  const handleDataSourceToggle = (source) => {
    setDataSource(source);
    // Nota: O SearchForm deve ter sua própria lógica para disparar a busca (fetchCats)
  };

  // GATE DE LOGIN:
  if (!user) {
    return <Login />; 
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh', bgcolor: '#ffffff' }}>

      <Box 
        textAlign="center" 
        mb={2} 
        pt={2}
        sx={{ borderBottom: '2px solid #f0f0f0' }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#3f51b5' }}>
          🐱 Cat Explorer 2.0
        </Typography>
       <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          Bem Vindo: **{user.email}**
       </Typography> 
      </Box>

      {/* ======================================================= */}
      {/* BARRA DE CONTROLE PRINCIPAL (Busca vs. Ações) */}
      {/* ======================================================= */}
      <Box 
        display="flex" 
        // 💡 AJUSTE 1: Empilha em coluna (column) no celular (xs)
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }} 
        // 💡 AJUSTE 2: Centraliza itens e adiciona espaçamento extra em mobile
        alignItems={{ xs: 'center', sm: 'flex-start' }} 
        justifyContent="space-between" 
        mb={5}
        mt={4}
        gap={3} // Adiciona um gap entre o SearchForm e o Stack de botões
      >
        {/* GRUPO ESQUERDO: FORMULÁRIO DE BUSCA */}
        {/* Este componente será corrigido no próximo passo */}
        <SearchForm /> 

        {/* GRUPO DIREITO: BOTÕES DE AÇÃO E LOGOUT */}
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center"
          // 💡 AJUSTE 3: Garante que os botões não quebrem a linha no mobile
          sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }} 
        >
          {/* 1. BOTÕES DE FONTE DE DADOS (API Toggle) */}
          <Chip 
            label="API Externa" 
            onClick={() => handleDataSourceToggle('external')}
            color={dataSource === 'external' ? 'secondary' : 'default'}
            variant={dataSource === 'external' ? 'filled' : 'outlined'}
            disabled={loading}
          />
          <Chip 
            label="API Própria" 
            onClick={() => handleDataSourceToggle('db')}
            color={dataSource === 'db' ? 'secondary' : 'default'}
            variant={dataSource === 'db' ? 'filled' : 'outlined'}
            disabled={loading}
          />

          {/* 2. BOTÃO INSERIR DADOS (Componente AddCatButton) */}
          {dataSource === 'db' && (
              <AddCatButton />
          )}
          
          {/* 3. BOTÃO LOGOUT */}
          <Button 
            variant="outlined" 
            color="error" 
            onClick={logout} 
            // Removido ml:2 para o alinhamento ficar mais natural
            disabled={loading}
            sx={{ ml: { sm: 2 } }} // Adiciona margem apenas no desktop/tablet
          >
            Sair
          </Button>
        </Stack>
      </Box>
      
      {/* ======================================================= */}
      {/* CONTEÚDO PRINCIPAL (TÍTULO E CARDS) */}
      {/* ======================================================= */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
        {dataSource === 'db' ? 'Gatos Salvos (API Própria)' : 'Gatos da API Externa'}
        {lastQuery && `: "${lastQuery}"`}
      </Typography>

      <Box mt={4} mb={5}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box align="center" sx={{ mt: 5 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>Carregando...</Typography>
          </Box>
        ) : breeds.length === 0 && !error ? (
          <Typography align="center" color="text.secondary" variant="h6" sx={{ mt: 5 }}>
            Nenhum resultado para exibir. Tente buscar na API ou inserir um gato.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {breeds.map((b) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={b.id || b.name}>
                <CatCard breed={b} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      {/* FOOTER */}
      <Box sx={{ py: 2, borderTop: '1px solid #eee', textAlign: 'center', mt: 10 }}>
          <Typography variant="caption" color="text.disabled">
              Projeto Web Fullstack - UTFPR
          </Typography>
      </Box>
    </Container>
  );
}