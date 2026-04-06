import { Request, Response } from 'express';
import { ScanService } from '../services/scan.service';

export class ScanController {
  private scanService = new ScanService();

  predict = async (req: Request, res: Response) => {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    try {
      const result = await this.scanService.analyzeFoodImage(image);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  health = (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'Healtheaty Backend Node.js',
      timestamp: new Date().toISOString()
    });
  };
}
