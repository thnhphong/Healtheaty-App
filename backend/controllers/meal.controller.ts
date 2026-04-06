import { Request, Response } from 'express';
import { MealService } from '../services/meal.service';

export class MealController {
  private mealService = new MealService();

  getHistory = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const history = await this.mealService.getHistory(userId as string);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getDailyLog = async (req: Request, res: Response) => {
    try {
      const { userId, date } = req.params;
      const log = await this.mealService.getDailyLog(userId as string, date as string);
      res.json(log);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteMeal = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.mealService.deleteMeal(id as string);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
