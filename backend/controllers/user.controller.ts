import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private userService = new UserService();

  getProfile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const profile = await this.userService.getUserProfile(id as string);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await this.userService.updateProfile(id as string, data);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
