import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { style } from 'framer-motion/client';

function CameraItem({ camera }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: camera.name,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    width: '100%',
    background: '#ffffff', // Fundo branco para um visual limpo
    borderRadius: '12px',
    border: '1px solid #e5e5e5', // Borda leve e discreta
    boxShadow: isDragging
      ? '0 8px 16px rgba(0, 0, 0, 0.1)' // Sombra mais forte durante o arrasto
      : '0 4px 8px rgba(0, 0, 0, 0.05)', // Sombra leve para um visual moderno
    padding: '16px',
    transition: 'box-shadow 0.1s, transform 0.1s', // Animação suave
  };

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      _hover={{
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', // Sombra mais forte no hover
        transform: 'scale(1.02)', // Leve aumento no hover
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Nome da câmera à esquerda */}
        <Text fontSize="lg" fontWeight="medium" color="gray.800">
          {camera.name}
        </Text>

        {/* Indicador de status (bola) à direita */}
        <Box
          borderRadius="50%"
          width="14px"
          height="14px"
          bg={camera.online ? 'green.400' : 'red.400'}
          boxShadow={camera.online ? '0 0 8px rgba(72, 187, 120, 0.6)' : '0 0 8px rgba(245, 101, 101, 0.6)'}
        />
      </Box>
    </Box>
  );
}

export default CameraItem;
