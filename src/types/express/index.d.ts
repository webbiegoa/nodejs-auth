// types/express/index.d.ts or types/global.d.ts
import { JwtPayload } from 'jsonwebtoken';

export interface JwtUser extends JwtPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}
