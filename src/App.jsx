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
    const tag = camera.tag ? camera.tag.toLowerCase() : '';

    const matchesName = name.includes(searchTerm.toLowerCase());
    const matchesTag = tag.includes(searchTerm.toLowerCase());

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

    setCamerasDestino(novoDestino);
    setCamerasOrigem((prev) => {
      const novoOrigem = [...prev, ...camerasRestantes];
      localStorage.setItem('camerasOrigem', JSON.stringify(novoOrigem));
      return novoOrigem;
    });

    localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
  };
  // Função para lidar com o arraste de câmeras
const aoFinalizarArraste = ({ active, over }) => {
  
  if (!over) return;

  const camerasCombinadas = camerasOrigem.concat(camerasDestino);
  const cameraSelecionada = camerasCombinadas.find(
    (camera) => camera && camera.name === active.id
  );

  const destinoIndex = parseInt(over.id, 10);

  if (cameraSelecionada) {
    const cameraDestino = camerasDestino[destinoIndex];
    if (cameraDestino !== null) {
      const cameraOriginalIndex = camerasDestino.findIndex(
        (camera) => camera && camera.name === cameraSelecionada.name
      );

      if (cameraOriginalIndex !== -1) {
        setCamerasDestino((prev) => {
          const novoDestino = [...prev];
          novoDestino[cameraOriginalIndex] = cameraDestino;
          novoDestino[destinoIndex] = cameraSelecionada;
          localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
          return novoDestino;
        });
      }
      return;
    }

    if (camerasDestino.some((camera) => camera && camera.name === cameraSelecionada.name)) {
      const cameraOriginalIndex = camerasDestino.findIndex(
        (camera) => camera && camera.name === cameraSelecionada.name
      );
      setCamerasDestino((prev) => {
        const novoDestino = [...prev];
        novoDestino[cameraOriginalIndex] = null;
        return novoDestino;
      });
    }

    setCamerasDestino((prev) => {
      const novoDestino = [...prev];
      novoDestino[destinoIndex] = cameraSelecionada;
      localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
      return novoDestino;
    });

    if (!camerasDestino.some((camera) => camera && camera.name === cameraSelecionada.name)) {
      setCamerasOrigem((prev) => {
        const novoOrigem = prev.filter(
          (camera) => camera && camera.name !== cameraSelecionada.name
        );
        localStorage.setItem('camerasOrigem', JSON.stringify(novoOrigem));
        return novoOrigem;
      });
    }
  }
};

  const removerCameraDoGrid = (indice) => {    
    setCamerasDestino((prev) => {
      const novoDestino = [...prev];
      const cameraRemovida = novoDestino[indice];

      novoDestino[indice] = null;

      if (cameraRemovida) {
        setCamerasOrigem((prevOrigem) => {
          const novaOrigem = [...prevOrigem, cameraRemovida];
          localStorage.setItem('camerasOrigem', JSON.stringify(novaOrigem));
          return novaOrigem;
        });
      }

      localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
      return novoDestino;
    });
  };
  const aoClicarCamera = (cameraSelecionada) => {
    console.log()
    setClickCount((prevCount) => {
      const novoCount = prevCount + 1;
      
      if (novoCount === 2) {
        // Adicionar a câmera ao grid
        setCamerasDestino((prev) => {
          const novoDestino = [...prev];
          
          // Encontrar o próximo espaço vazio no grid
          const indiceVazio = novoDestino.findIndex((camera) => camera === null);
          
          if (indiceVazio !== -1) {
            // Colocar a câmera no próximo espaço vazio
            novoDestino[indiceVazio] = cameraSelecionada;
            localStorage.setItem('camerasDestino', JSON.stringify(novoDestino));
          }
          
          // Ordenar o grid após adicionar a câmera
          const camerasOrdenadas = novoDestino.filter((camera) => camera !== null);
          camerasOrdenadas.sort((a, b) => a.name.localeCompare(b.name));  // Ordenação de exemplo
          
          // Preencher posições restantes com null
          const camerasComGrid = [...camerasOrdenadas, ...new Array(gridSize - camerasOrdenadas.length).fill(null)];
          
          // Atualizar o estado e salvar no localStorage
          localStorage.setItem('camerasDestino', JSON.stringify(camerasComGrid));
          return camerasComGrid;
        });
        
        // Resetar contador de cliques
        setClickCount(0);
      }
      
      return novoCount;
    });
  };

  return (
    <ChakraProvider value={system}>
      <Box overflowY={'auto'}>
      <Stack spacing={6}>
        {carregando ? (
          <Spinner size="xl" color="teal.500" />
        ) : (
          <DndContext onDragEnd={aoFinalizarArraste}  >
            <Box display={'flex'} onDoubleClick={aoFinalizarArraste} >
            <MenuLateral cameras={filteredCameras} aoClicarCamera={aoClicarCamera}  />
             <Box  mr={10}  mb={2} width={'100%'} mt={8}>
              <Text fontSize="xl" mb={4} fontWeight="semibold">
                Grid de Câmeras
              </Text>
              <Box display="flex" flexDirection="row" alignItems="center" mb={4}>
                <Input
                  placeholder="Digite aqui a Tag ou Nome da Camera"
                  value={searchTerm}
                  maxW="70%"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  />
                <NativeSelectRoot maxW="30%">
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
