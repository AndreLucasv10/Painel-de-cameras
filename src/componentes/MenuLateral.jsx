import { Box, Text, Stack, VStack, Input, useBreakpointValue } from '@chakra-ui/react';
import { TfiAngleDoubleLeft, TfiAngleDoubleRight } from "react-icons/tfi";
import CameraItem from './CameraItem';
import { useState } from 'react';

function MenuLateral({ cameras, searchTerm, setSearchTerm, aoClicarCamera, camerasDestino }) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showCode, setShowCode] = useState(false); // Estado para mostrar ou ocultar o menu

  return (
    <Box
      bg="gray.800"
      p={4}
      borderRight="1px solid"
      borderColor="gray.700"
      top="0"
      left="0"
      boxShadow="lg"
      minH={'100vh'}
      width={showCode ? '300px' : '50px'} // Alteração de largura para retrair o menu
      transition="all 0.3s ease-in-out"
      position="relative"
    >
      <Box
        as="button"
        aria-label="Toggle Menu"
        onClick={() => setShowCode(!showCode)}
        position="absolute"
        top="50%" // Centraliza verticalmente
        right="-20px" // Coloca o ícone na borda direita
        transform="translateY(-50%)" // Ajusta a posição para garantir que fique bem no meio
        width="50px" // Largura do botão
        height="50px" // Altura do botão
        borderRadius="full" // Faz o ícone ficar redondo
        bg="gray.700" // Cor de fundo do ícone
        display="flex" // Usado para centralizar o ícone
        alignItems="center" // Centraliza o ícone verticalmente
        justifyContent="center" // Centraliza o ícone horizontalmente
        _hover={{
          bg: 'teal.600', // Mudar a cor de fundo quando passar o mouse
        }}
        _active={{
          bg: 'teal.700', // Cor de fundo ao clicar
        }}
      >
        {showCode ? (
          <TfiAngleDoubleLeft size="24" color="white" /> // Ícone quando o menu está aberto
        ) : (
          <TfiAngleDoubleRight size="24" color="white" /> // Ícone quando o menu está fechado
        )}
      </Box>

      {showCode && (
        <>
          <Text
            fontSize={isMobile ? 'xl' : '2xl'}
            fontWeight="bold"
            color="white"
            mb={4}
            textAlign={isMobile ? 'center' : 'left'}
            letterSpacing="wider"
          >
            Lista de Câmeras
          </Text>

          <Input
            placeholder="Digite aqui a Tag ou Nome da Câmera"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={6}
            bg="gray.700"
            color="white"
            _placeholder={{ color: 'gray.400' }}
            focusBorderColor="teal.400"
            size="md"
          />
          <VStack align="stretch" paddingBottom="20px" padding={2}>
            {cameras.map((camera) => {
              const cameraNoGrid = camerasDestino.some(
                (item) => item?.name === camera.name
              );

              const isCameraDisabled = !camera.online || cameraNoGrid;

              return (
                <Stack
                  key={camera.name}
                  align="center"
                  justify="space-between"
                  borderRadius="md"
                  opacity={isCameraDisabled ? 0.4 : 1}
                  pointerEvents={isCameraDisabled ? 'none' : 'auto'}
                  draggable={!isCameraDisabled}
                  _hover={{
                    bg: !isCameraDisabled ? 'gray.600' : 'none',
                    boxShadow: !isCameraDisabled ? 'lg' : 'none',
                    transform: !isCameraDisabled ? 'scale(1.02)' : 'none',
                  }}
                  transition="all 0.2s"
                  onDoubleClick={() => !isCameraDisabled && aoClicarCamera(camera)}
                >
                  <CameraItem camera={camera} />
                </Stack>
              );
            })}
          </VStack>
        </>
      )}
    </Box>
  );
}

export default MenuLateral;
