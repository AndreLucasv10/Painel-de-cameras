import React, { useEffect, useRef } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import Hls from 'hls.js';

function CameraGridItem({ camera, index, onRemove }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (camera?.stream_url?.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(camera.stream_url);
        hls.attachMedia(videoRef.current);
        return () => hls.destroy();
      } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = camera.stream_url;
      }
    }
  }, [camera]);

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: index });
  const { attributes, listeners, setNodeRef: setDraggableRef, transform } = useDraggable({
    id: camera ? camera.name : index,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
    position: 'relative',
    width: '100%',
    cursor: 'grab',
  };

  const isDragging = !!transform;

  return (
      <Box
        ref={setDroppableRef}
        border="2px dashed"
        borderColor={isOver ? 'teal.500' : 'gray.300'}
        bg={isDragging ? 'teal.200' : isOver ? 'teal.100' : 'white'}
        borderRadius="md"
        textAlign="center"
        display="flex"
        // height="100"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        position="relative"
        maxW={'calc(100% - 8px)'}
        style={{ aspectRatio: '16 / 9' }}
      >
      {camera ? (
        <>
          <Box
            ref={setDraggableRef}
            {...listeners}
            {...attributes}
            style={style}
          >
            <video ref={videoRef} height={'100%'} width={'100%'}  controls>
              Seu navegador não suporta vídeos.
            </video>
            <Text fontSize="sm" color={camera.online ? 'green.500' : 'red.500'} mb={2}>
            </Text>
          </Box>
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => onRemove(index)}
            position="absolute"
            top="10px"
            right="10px"

          >
            X
          </Button>
        </>
      ) : (
        <Text color="gray.600">Arraste uma Câmera aqui</Text>
      )}
    </Box>
  );
}
export default CameraGridItem;