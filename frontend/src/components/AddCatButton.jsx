import React, { useState, useContext } from 'react';
import { 
    Button, Modal, Box, Typography, 
    TextField, Stack, Alert 
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CatContext } from '../contexts/CatContext'; // Importar contexto para addCat

// Estilo básico para o Modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function AddCatButton() {
  const { addCat } = useContext(CatContext);
    
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleOpen = () => {
      setError(null);
      setSuccess(false);
      setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name || !breed) {
        return setError('Nome e Raça são obrigatórios!');
    }

    const catData = {
        name,
        breed,
        image_url: imageUrl || 'https://via.placeholder.com/200/cccccc/000000?text=Sem+Imagem',
    };

    const result = await addCat(catData);
    
    if (result.success) {
        setSuccess(true);
        // Limpa os campos após o sucesso
        setName('');
        setBreed('');
        setImageUrl('');
        // Fecha o modal após um pequeno delay
        setTimeout(() => handleClose(), 1500); 
    } else {
        setError(result.error || 'Falha ao adicionar gato.');
    }
  };

  return (
    <>
      <Button 
        variant="contained" 
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleOpen}
        color="primary"
      >
        Inserir Dados
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" component="h2" mb={3}>
            Adicionar Novo Gato
          </Typography>
          
          <Stack spacing={2}>
              <TextField 
                label="Nome do Gato" 
                variant="outlined" 
                fullWidth 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField 
                label="Raça" 
                variant="outlined" 
                fullWidth 
                required
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
              />
              <TextField 
                label="URL da Imagem (Opcional)" 
                variant="outlined" 
                fullWidth 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
          </Stack>
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>Gato adicionado com sucesso!</Alert>}

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button onClick={handleClose} variant="outlined">Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">Adicionar</Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}