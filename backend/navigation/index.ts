import { Router } from 'express';
import { ScanController } from '../controllers/scan.controller';
import { UserController } from '../controllers/user.controller';
import { MealController } from '../controllers/meal.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const scanController = new ScanController();
const userController = new UserController();
const mealController = new MealController();
const authController = new AuthController();

// Authentication / Sync
router.post('/auth/sync', authController.onboarding);

// Health
router.get('/health', scanController.health);

// User Profile & Info
router.get('/users/:id', userController.getProfile);
router.put('/users/:id', userController.updateProfile);

// Scan functionality
router.post('/scan/predict', scanController.predict);

// Meal & History Management
router.get('/meals/history/:userId', mealController.getHistory);
router.get('/meals/log/:userId/:date', mealController.getDailyLog);
router.delete('/meals/:id', mealController.deleteMeal);

export default router;
