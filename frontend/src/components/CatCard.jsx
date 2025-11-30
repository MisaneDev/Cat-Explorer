// frontend/src/components/CatCard.jsx (VERSÃO FINAL SEM DELEÇÃO)

import React from 'react'; // Não precisa mais do useContext
import { 
    Card, CardMedia, CardContent, Typography, 
    Box, Chip
    // Não precisa de IconButton ou Box para a lixeira
} from '@mui/material';
// Não precisa mais do DeleteIcon nem do CatContext

export default function CatCard({ breed: cat }) { 
    // Desestrutura o objeto do gato (owner_id não é mais necessário)
    const { id, name, breed, image_url } = cat; 
    
    // A lógica de remoção (handleRemove) FOI REMOVIDA

    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: '0.3s', 
                '&:hover': { boxShadow: 6 },
                position: 'relative', 
                overflow: 'visible' 
            }}
        >
            
            <CardMedia 
                component="img" 
                height="200" 
                sx={{ objectFit: 'cover' }} 
                image={image_url || 'https://via.placeholder.com/200/cccccc/000000?text=Sem+Imagem+DB'} 
                alt={name}
            />

            {/* O bloco de BOTÃO DE LIXEIRA FOI REMOVIDO */}
            
            <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" component="div">{name}</Typography>
                    
                    <Chip 
                        label={breed || 'Desconhecida'} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                    /> 
                </Box>
                
                <Typography variant="caption" display="block" color="text.secondary">
                    ID: {id}
                </Typography>
                
                {cat.description && (
                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {cat.description.substring(0, 100)}...
                    </Typography>
                )}
            </CardContent>
            
        </Card>
    );
}