import { calculateRoute, geoCoding } from '../OpenRouteService';
import axios from 'axios';

// Mock de axios
jest.mock('axios');
describe('Pruebas de Aceptación de OpenRouteService', () => {
  it('calcula con éxito una ruta', async () => {
    const datosFalsos = { features: [{ geometry: { coordinates: [[-74.0060, 40.7128], [-118.2437, 34.0522]] }}] };

    // Mock de la respuesta de la API
    axios.get.mockResolvedValue({ data: datosFalsos });

    const resultado = await calculateRoute("coordenadasInicio", "coordenadasFin");
    
    expect(resultado).toEqual(datosFalsos);
  });

  it('realiza con éxito geocodificación', async () => {
    const datosFalsos = { features: [{ geometry: { coordinates: [-74.0060, 40.7128] }}] };

    // Mock de la respuesta de la API
    axios.get.mockResolvedValue({ data: datosFalsos });

    const resultado = await geoCoding("Nueva York");
    
    expect(resultado).toEqual({latitude: 40.7128, longitude: -74.0060});
  });

  it('lanza un error al calcular la ruta', async () => {
    // Mock de la respuesta de error de la API
    axios.get.mockRejectedValue(new Error('Algo salió mal'));

    // Esperamos que calculateRoute lance un error
    await expect(calculateRoute("coordenadasInicio", "coordenadasFin")).rejects.toThrow('Algo salió mal');
  });

  it('lanza un error al realizar la geocodificación', async () => {
    // Mock de la respuesta de error de la API
    axios.get.mockRejectedValue(new Error('Algo salió mal'));

    // Esperamos que geoCoding lance un error
    await expect(geoCoding("Nueva York")).rejects.toThrow('Algo salió mal');
  });
});
