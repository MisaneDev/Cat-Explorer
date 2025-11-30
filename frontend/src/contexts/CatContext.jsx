// frontend/src/contexts/CatContext.jsx (VERSÃO FINAL E CORRIGIDA)

import React, { createContext, useState, useReducer, useEffect } from 'react';
import api from '../services/api';
import externalApi from '../services/externalApi';

export const CatContext = createContext();

/* ============================================================
   ESTADO E REDUCER
============================================================ */
const initialState = {
  breeds: [],
  loading: false,
  error: null,
  lastQuery: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'SEARCH_START':
      return { ...state, loading: true, error: null };
      
    case 'SEARCH_SUCCESS':
      return {
        ...state,
        loading: false,
        breeds: action.payload,
        lastQuery: action.query || '' 
      };
      
    case 'SEARCH_FAIL':
      // Mantém a lista vazia em caso de falha de busca
      return { ...state, loading: false, error: action.error, breeds: [] }; 
      
    case 'LOGOUT_SUCCESS': 
        return initialState;
        
    default:
      return state;
  }
}

/* ============================================================
   PROVIDER
============================================================ */
export function CatProvider({ children }) {
  
  const initialDataSource = localStorage.getItem('token') ? 'db' : 'external';
  const [dataSource, setDataSource] = useState(initialDataSource); 
  const [user, setUser] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);


  /* ============================================================
     AUTENTICAÇÃO
  ============================================================ */
  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_email', userData.email);
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      setUser(userData); 
      setDataSource('db'); 
      
      return true;
    } catch (error) {
      console.error("Erro no login:", error.response?.data?.error || error.message);
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id'); 
    localStorage.removeItem('user_email');
    delete api.defaults.headers.Authorization;
    setUser(null);
    dispatch({ type: 'LOGOUT_SUCCESS' });
    setDataSource('external');
  };


  /* ============================================================
     BUSCA DA API EXTERNA
  ============================================================ */
  const fetchExternalCats = async (query = '') => { 
      dispatch({ type: 'SEARCH_START' });
      try {
          const endpoint = query ? '/breeds/search' : '/breeds';
          const params = query ? { q: query } : { limit: 12 };
          
          const response = await externalApi.get(endpoint, { params }); 
          let filteredBreeds = response.data;

          const catsWithImages = await Promise.all(
            filteredBreeds.slice(0, 12).map(async (breed) => {
              try {
                const r = await externalApi.get(
                  `https://api.thecatapi.com/v1/images/search?breed_id=${breed.id}&limit=1`
                );
                
                const imgs = await r.data;
                const imageUrl = imgs[0]?.url || null;

                return { 
                    id: breed.id || breed.name, 
                    name: breed.name, 
                    breed: breed.origin || breed.temperament, 
                    // 💡 URL COMPLETA
                    image_url: imageUrl || 'https://via.placeholder.com/200/cccccc/000000?text=Sem+Imagem+API',
                    description: breed.description 
                };
              } catch (e) {
                return { 
                    id: breed.id || breed.name, 
                    name: breed.name, 
                    breed: breed.origin || breed.temperament, 
                    // 💡 URL COMPLETA
                    image_url: 'https://via.placeholder.com/200/cccccc/000000?text=Erro+Imagem+API',
                    description: breed.description 
                };
              }
            })
          );


          if (!catsWithImages || catsWithImages.length === 0) {
            dispatch({
              type: 'SEARCH_FAIL',
              error: 'Nenhuma raça encontrada.'
            });
          } else {
            dispatch({
                type: 'SEARCH_SUCCESS',
                payload: catsWithImages,
                query: query
            });
          }
          
      } catch (error) {
          console.error("Erro no fetch externo:", error);
          const errorMessage = 'Erro ao buscar API externa. Verifique a URL e sua chave API, se necessário.';
          dispatch({ type: 'SEARCH_FAIL', error: errorMessage });
      }
  };

/* ============================================================
   BUSCA GERAL (DB OU EXTERNA) - MODO DB CORRIGIDO
============================================================ */
const fetchCats = async (query = '') => { 
    if (dataSource === 'external') {
        return fetchExternalCats(query); 
    }
        
    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
        return; 
    }
        
    dispatch({ type: 'SEARCH_START' });

    try {
        api.defaults.headers.Authorization = `Bearer ${savedToken}`;
        
        // ENVIA A QUERY PARA O BACK-END: ?q=query
        const endpoint = query ? `/cats?q=${encodeURIComponent(query)}` : '/cats'; 
        
        const response = await api.get(endpoint); 

        if (!response.data || response.data.length === 0) {
            dispatch({ type: 'SEARCH_FAIL', error: 'Nenhum resultado encontrado no DB.' });
        } else {
            
            const mappedCats = response.data.map(cat => ({
                id: cat.id,
                name: String(cat.name || 'Nome Desconhecido'), 
                breed: String(cat.breed || 'Raça Indefinida'),
                // 💡 URL COMPLETA
                image_url: String(cat.image_url || 'https://via.placeholder.com/200/cccccc/000000?text=Sem+Imagem+DB'), 
                owner_id: cat.owner_id 
            }));
            
            dispatch({
                type: 'SEARCH_SUCCESS',
                payload: mappedCats, 
                query
            });
        }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.error("Token expirado ou inválido. Forçando logout.");
          logout(); 
          return dispatch({ type: 'SEARCH_FAIL', error: 'Sessão expirada. Faça login novamente.' });
      }
        
      const errorMessage = error.response?.data?.error || 'Erro de conexão no DB. Tente novamente.';
      dispatch({ type: 'SEARCH_FAIL', error: errorMessage });
    }
};


  /* ============================================================
     CRUD (DB)
  ============================================================ */
  const addCat = async (catData) => { 
    if (!user) return { success: false, error: 'Faça login para inserir.' };
      
    try {
      await api.post('/cats', catData); 
      // Não chamamos fetchCats aqui, o App.jsx precisa decidir se deve atualizar
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro de validação no servidor.';
      return { success: false, error: errorMessage };
    }
  };


  /* ============================================================
     EFEITOS DE CONTROLE
  ============================================================ */
  useEffect(() => {
    // EFEITO 1: Inicialização (Configura token e user)
    const savedToken = localStorage.getItem('token');
    const savedUserId = localStorage.getItem('user_id'); 
    const savedUserEmail = localStorage.getItem('user_email');
    if (savedToken && savedUserId) {
      api.defaults.headers.Authorization = `Bearer ${savedToken}`;
      setUser({ 
          id: parseInt(savedUserId), 
          email: savedUserEmail || 'Sessão Ativa' 
      });
    } else {
      setUser(null);
    }
  }, []); 


  useEffect(() => {
    // EFEITO 2: Dispara Busca (Controla carregamento automático)
    if (dataSource === 'db') {
        // Limpa a lista de cards no modo DB para forçar o clique do usuário
        dispatch({ type: 'SEARCH_SUCCESS', payload: [], query: '' });
        
    } else if (dataSource === 'external') {
        // Busca automaticamente se trocar para externa
        fetchCats(''); 
    }

  }, [user, dataSource]);


  return (
    <CatContext.Provider
      value={{
        user, login, logout, 
        fetchCats, addCat, 
        state, 
        dataSource, setDataSource, fetchExternalCats
      }}
    >
      {children}
    </CatContext.Provider>
  );
}