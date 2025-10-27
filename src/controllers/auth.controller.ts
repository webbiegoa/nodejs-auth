import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/auth.service";
import { BaseController } from "./BaseController";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError";
import { verifyJwt } from '../utils/jwt';

class AuthController extends BaseController {
  public signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await AuthService.signupUser(req.body);
      this.message(res, result.message, 201);
    } catch (err) {
      next(err);
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await AuthService.forgotPassword(req.body);
      this.message(res, result.message, 201);
    } catch (err) {
      next(err);
    }
  };

  public resetPassword = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await AuthService.resetPassword(req.body);
      this.message(res, result.message, 201);
    } catch (err) {
      next(err);
    }
  };


  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await AuthService.login(req.body);
      // Set access token in HTTP-only cookie
      res.cookie("accessToken", result.token, {
        httpOnly: true,
        secure: true, // true in production (HTTPS), false in dev (if needed)
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      this.ok(
        res,
        {
          user: result.user,
          refreshToken: result.refreshToken,
        },
        "LOGIN successful",
        200
      );
    } catch (err) {
      next(err);
    }
  };

  public verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token } = req.query;
      const result = await AuthService.verifyEmail(token as string);
      this.ok(res, result, "EMAIL verified successfully", 200);
    } catch (err) {
      next(err);
    }
  };

  public socialLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token } = req.body;
      const result = await AuthService.socialLogin(token);
      this.ok(res, result, "LOGIN successful", 200);
    } catch (err) {
      next(err);
    }
  };

  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      this.ok(
        res,
        {
          refreshToken: result.refreshToken,
        },
        "REFRESH_TOKEN successful",
        200
      );
    } catch (err) {
      next(err);
    }
  };

  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Refresh token required");
      }
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      this.ok(res, {}, "LOGOUT successful", 200);
    } catch (err) {
      next(err);
    }
  };

  public me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.ok(res, {}, "ME successful", 200);
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
