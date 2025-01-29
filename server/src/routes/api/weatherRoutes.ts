import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const city = req.body.cityName;

    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        // Get weather data from city name
        const weatherData = await WeatherService.getWeatherForCity(city);

        if (!weatherData) {
            return res.status(404).json({ error: 'Weather data not found' });
        }

        // Save city to search history
        await HistoryService.addCity(city);

        return res.status(200).json(weatherData);
    } catch (error) {
        console.error('Error retrieving weather data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
} catch (error) {
    console.error('Error retrieving search history:', error);
    return res.status(500).json({ error: 'Internal server error' });
}
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            res.status(400).json({ error: 'City ID is required' });
            return;
          }
    
        await HistoryService.removeCity(req.params.id);
        res.json( { success: 'city removed from search history' })
    } catch (error) {
        res.status(500).json(error);
    }
});


export default router;
