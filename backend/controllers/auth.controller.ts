import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/errorHandler';

export class AuthController {
  private userService = new UserService();

  /**
   * Sync user on first login or signup
   * Typically called by FE after Firebase Auth success
   */
  onboarding = async (req: Request, res: Response) => {
    const { userId, email, fullName } = req.body;
    
    if (!userId || !email) {
      throw new AppError('userId and email are required', 400);
    }

    try {
      await this.userService.createUserProfile(userId, email, fullName || 'User');
      res.status(201).json({ success: true, message: 'User synced successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
