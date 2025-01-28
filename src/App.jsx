import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  SimpleGrid,
  Spinner,
  Stack,
  Input,
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react';
import { DndContext, closestCenter, closestCorners } from '@dnd-kit/core';
import CameraGrid from './componentes/CameraGrid';
import MenuLateral from './componentes/MenuLateral';
import { system } from '@chakra-ui/react/preset';

function App() {
  const [camerasOrigem, setCamerasOrigem] = useState([]);
  const [camerasDestino, setCamerasDestino] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [gridSize, setGridSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const camerasOrigemSalvas = JSON.parse(localStorage.getItem('camerasOrigem'));
    const camerasDestinoSalvas = JSON.parse(localStorage.getItem('camerasDestino'));

    if (camerasOrigemSalvas && camerasDestinoSalvas) {
      setCamerasOrigem(camerasOrigemSalvas);
      setCamerasDestino(camerasDestinoSalvas);
      setCarregando(false);
    } else {
      fetch('./src/dados/data.json')
        .then((response) => response.json())
        .then((data) => {
          setCamerasOrigem(data.cameras);
          setCamerasDestino(new Array(gridSize).fill(null));
          setCarregando(false);
        })
        .catch(() => setCarregando(false));
    }
  }, []);

  const filteredCameras = camerasOrigem.filter((camera) => {
    const name = camera.name ? camera.name.toLowerCase() : '';
    const tags = camera.tags ? camera.tags.map(tag => tag.toLowerCase()) : []; // Transformar tags em lowercase
  
    const matchesName = name.includes(searchTerm.toLowerCase());
    const matchesTag = tags.some(tag => tag.includes(searchTerm.toLowerCase())); // Verificar se alguma tag corresponde
  
    return matchesName || matchesTag;
  });

  const handleGridSizeChange = (value) => {
    const numericValue = parseInt(value, 10);
    setGridSize(numericValue);
  
    const novoDestino = new Array(numericValue).fill(null);
  
    camerasDestino.forEach((camera, index) => {
      if (camera !== null && index < numericValue) {
        novoDestino[index] = camera;
      }
    });
  
    const camerasRestantes = camerasDestino.filter(
      (camera) => camera !== null && !novoDestino.includes(camera)
    );
  
    // Evitar duplicação ao adicionar câmeras removidas de volta
    setCamerasDestino(novoDestino);
    setCamerasOrigem((prev) => {
      // Filtrando as câmeras removidas para garantir que não sejam duplicadas
      const novoOrigem = [...prev, ...camerasRestantes.filter(camera => !prev.some(c => c.name === camera.name))];
      localStorage.setItem('camerasOrigem', JSON.stringify(novoOrigem));
      return novoOrigem;
    });
  
    localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
  };
  const aoFinalizarArraste = ({ active, over }) => {
    if (!over) return;
    let origemId;
    if(active.id.includes("grid_")){
      origemId = active.id.split("_")[1]
    }else{
      origemId = active.id
    }
    // const origemId = active.id; // ID da câmera arrastada
    console.log(origemId)
    const destinoIndex = parseInt(over.id, 10); // Index do destino no grid
  
    // Verificar se a câmera está na lista de origem
    const cameraSelecionada = camerasOrigem.find((camera) => camera.name === origemId);
  
    // Verificar se o destino já tem uma câmera
    const cameraNoDestino = camerasDestino[destinoIndex];
  
    // Se o destino já tiver uma câmera e a câmera que está sendo movida não for a mesma, permitir troca
    if (cameraNoDestino && cameraNoDestino.name !== origemId) {
      setCamerasDestino((prev) => {
        const novoDestino = [...prev];
        const origemIndex = prev.findIndex((camera) => camera?.name === origemId);
        [novoDestino[origemIndex], novoDestino[destinoIndex]] = [
          novoDestino[destinoIndex],
          novoDestino[origemIndex],
        ];
        localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
        return novoDestino;
      });
      return;
    }
  
    // Caso a câmera esteja no grid, permitir que ela seja movida para posições vazias
    const cameraNoGrid = camerasDestino.find((camera) => camera?.name === origemId);
  
    if (cameraNoGrid) {
      // Se a posição de destino está vazia, mover a câmera para lá
      if (!cameraNoDestino) {
        setCamerasDestino((prev) => {
          const novoDestino = [...prev];
          const origemIndex = prev.findIndex((camera) => camera?.name === origemId);
          novoDestino[origemIndex] = undefined;  // Remover a câmera da posição anterior
          novoDestino[destinoIndex] = cameraNoGrid; // Mover a câmera para a posição vazia
          localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
          return novoDestino;
        });
        return;
      }
    }
  
    // Verificar se a câmera está na lista de origem e se não está desabilitada
    if (cameraSelecionada && !cameraNoGrid && !cameraSelecionada.disabled) { // Certifique-se que a câmera não está desabilitada
      // Adicionar ao grid apenas se não estiver e não estiver desabilitada
      setCamerasDestino((prev) => {
        const novoDestino = [...prev];
        novoDestino[destinoIndex] = cameraSelecionada; // Adicionar ao índice
        localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
        return novoDestino;
      });
  
      // Atualizar lista de origem para desabilitar a câmera
      setCamerasOrigem((prev) =>
        prev.map((camera) =>
          camera.name === cameraSelecionada.name
            ? { ...camera, disabled: true }
            : camera
        )
      );
      localStorage.setItem(
        'camerasOrigem',
        JSON.stringify(
          camerasOrigem.map((camera) =>
            camera.name === cameraSelecionada.name
              ? { ...camera, disabled: true }
              : camera
          )
        )
      );
    }
  };
  
  

  const adicionarCameraAoGrid = (camera) => {
    const proximoEspacoVazio = camerasDestino.findIndex((item) => item === null);
  
    if (proximoEspacoVazio !== -1) {
      setCamerasDestino((prev) => {
        const novoDestino = [...prev];
        novoDestino[proximoEspacoVazio] = camera;
        console.log('Câmera adicionada ao grid:', novoDestino);
        localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
        return novoDestino;
      });
  
      setCamerasOrigem((prev) =>
        prev.map((item) =>
          item.name === camera.name ? { ...item, disabled: true } : item
        )
      );
    } else {
      console.warn('Grid cheio! Não é possível adicionar mais câmeras.');
    }
  };
  const removerCameraDoGrid = (indice) => {
    setCamerasDestino((prev) => {
      const novoDestino = [...prev];
      const cameraRemovida = novoDestino[indice];
  
      if (cameraRemovida) {
        // Reativar câmera na lista
        setCamerasOrigem((prevOrigem) =>
          prevOrigem.map((camera) =>
            camera.name === cameraRemovida.name
              ? { ...camera, disabled: false }
              : camera
          )
        );
  
        localStorage.setItem(
          'camerasOrigem',
          JSON.stringify(
            camerasOrigem.map((camera) =>
              camera.name === cameraRemovida.name
                ? { ...camera, disabled: false }
                : camera
            )
          )
        );
      }
  
      novoDestino[indice] = null;
      localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
      return novoDestino;
    });
  };

  return (
    <ChakraProvider value={system}>
<Box>
  <Stack spacing={6}>
    {carregando ? (
      <Spinner size="xl" color="teal.500" />
    ) : (
      <DndContext onDragEnd={aoFinalizarArraste}>
        <Box display={'flex'} onDoubleClick={aoFinalizarArraste}>
          <Box
            flex="1"
            // overflowY="auto"  // Adicionado overflow para permitir rolagem no menu lateral
            // maxHeight="calc(100vh - 40px)" // Define a altura máxima do menu lateral
          >
            <MenuLateral
              cameras={filteredCameras}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              aoClicarCamera={adicionarCameraAoGrid}
              camerasDestino={camerasDestino}
            />
          </Box> 
          <Box mr={10} mb={2} width={'100%'} mt={8}>
            <Box display="flex" flexDirection="row" alignItems="center" mb={4} gap={2} ml={10}>
              <NativeSelectRoot >
                <NativeSelectField
                  placeholder="Selecione o tamanho do grid"
                  value={gridSize}
                  onChange={(e) => handleGridSizeChange(e.currentTarget.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="12">12</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </Box>
            <CameraGrid cameras={camerasDestino} onRemove={removerCameraDoGrid} gridSize={gridSize} />
          </Box>
        </Box>
      </DndContext>
    )}
  </Stack>
</Box>
    </ChakraProvider>
  );
}

export default App;
