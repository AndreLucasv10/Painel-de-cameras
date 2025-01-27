import { Box, Text, Stack, VStack, useBreakpointValue } from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import CameraItem from './CameraItem';

function MenuLateral({ cameras }) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      bg="gray.800"
      p={4}
      borderRight="1px solid"
      borderColor="gray.700"
      top="0"
      left="0"
      boxShadow="lg"
      height={'100vh'}
      width={'300px'}
      transition="all 0.3s ease-in-out"
    >
      <Text
        fontSize={isMobile ? "xl" : "2xl"}
        fontWeight="bold"
        color="white"
        mb={6}
        textAlign={isMobile ? "center" : "left"}
        letterSpacing="wider"
        overflowY="auto"
      >
        Lista de Câmeras
      </Text>

      <VStack align="stretch">
        {cameras.map((camera) => (
          <Stack
            key={camera.name}
            align="center"
            justify="space-between"
            borderRadius="md"
            _hover={{
              bg: 'gray.600',
              boxShadow: 'lg',
              transform: 'scale(1.02)',
            }}
            transition="all 0.2s"
          >
            <CameraItem camera={camera} onClick={() => aoClicarCamera(camera)} />
          </Stack>
        ))}
      </VStack>

      <Text fontSize="xl" color="gray.300" mt={4}>
        Total de câmeras: {cameras.length}
      </Text>
    </Box>
  );
}

export default MenuLateral;
