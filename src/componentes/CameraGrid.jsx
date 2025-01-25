import React from 'react';
import CameraGridItem from './CameraGridItem';
import { Box } from '@chakra-ui/react';

function CameraGrid({ cameras, onRemove, isMobile, gridSize }) {
  const getGridColumns = (size) => {
    if (size === 1) return '1fr';
    if (size === 2) return 'repeat(2, 1fr)';
    if (size === 4) return 'repeat(2, 1fr)';
    if (size === 6) return 'repeat(3, 1fr)';
    if (size === 12) return 'repeat(4, 1fr)';
    return '1fr';
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={getGridColumns(gridSize)}
      gap={4}
    >
      {cameras.slice(0, gridSize).map((camera, index) => (
        <CameraGridItem
          key={index}
          index={index}
          camera={camera}
          onRemove={onRemove}
        />
      ))}
    </Box>
  );
}

export default CameraGrid;