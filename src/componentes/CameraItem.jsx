import React from 'react';
import { AspectRatio, Box, Text } from '@chakra-ui/react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function CameraItem({ camera, index }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: camera.name,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    border: '1px solid #ddd',
    padding: '6px',
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
 
  };

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <Text fontWeight="bold">{camera.name}</Text>
      <Text fontSize="sm" color={camera.online ? 'green.500' : 'red.500'}>
        {camera.online ? 'Online' : 'Offline'}
      </Text>
    </Box>
  );
}

export default CameraItem;
