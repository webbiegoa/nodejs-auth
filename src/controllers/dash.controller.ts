// controllers/dash.controller.ts
import { Request, Response, NextFunction } from 'express';
import { BaseController } from "./BaseController";
import { JwtUser } from '../types/express';         

class DashController extends BaseController {
  // Using arrow function to preserve `this` context
  getDash = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as JwtUser;

      if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const result = {
        id: user.userId,
        email: user.email,
      };

      return this.ok(res, result, 'Dashboard fetched');
    } catch (error) {
      next(error);
    }
  };
}

export default new DashController();
