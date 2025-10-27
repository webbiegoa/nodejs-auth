import { prisma } from "../config/prisma";
import {
  SignupInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../types/auth.types";
import { hashPassword, verifyPassword } from "../utils/scrypt";
import { ApiError } from "../utils/ApiError";
import { signJwt, signRefreshJwt, verifyRefreshJwt } from "../utils/jwt";
import { generateExpiry, generateToken } from "../utils/generate";
import { sendVerificationEmail } from "../utils/sendVerificationEmail";
import { verifyTurnstile } from "../utils/verifyTurnstile";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { addMinutes } from "date-fns";
import { sendEmail } from "../utils/sendEmail";
import { forgotPasswordEmail } from "../email/templates/forgotPasswordEmail";

/**
 * Registers a new user after validating the Turnstile token and hashing the password.
 * @param data - Signup input data including email, password, name, phone, and Turnstile token.
 * @throws ApiError if validation fails or user already exists.
 * @returns A success message indicating signup completion.
 */
export const signupUser = async (data: SignupInput) => {
  try {
    const { email, password, firstname, lastname, phone, turnstileToken } =
      data;
    if (!turnstileToken)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Turnstile token missing",
        true
      );
    const token = generateToken();
    const expires = generateExpiry();
    // Verify Turnstile Token with Cloudflare
    try {
      await verifyTurnstile(turnstileToken);
    } catch (err) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Turnstile check failed", true);
    }

    // Check if user already exists
    const existing = await prisma.sccUser.findUnique({ where: { email } });
    if (existing)
      throw new ApiError(StatusCodes.NOT_FOUND, "Email already registered");

    // Hash password and salt
    const { hash, salt } = await hashPassword(password);

    // Create new user in database
    const user = await prisma.sccUser.create({
      data: {
        email,
        password: hash,
        salt,
        firstname,
        lastname,
        phone,
        isEmailVerified: false,
        verificationId: token,
        verificationExpires: expires,
      },
    });

    await sendVerificationEmail(email, firstname, token);

    return { message: "Signup successful. Please check your email to verify." };
  } catch (error: any) {
    console.error("❌ Error occurred:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.stack || error.message,
      false
    ); // system error
  }
};

export const forgotPassword = async (data: ForgotPasswordInput) => {
  try {
    const { email } = data;
    const RESET_EXP_MIN = 20;
    // Check if user already exists
    const existing = await prisma.sccUser.findUnique({ where: { email } });
    if (!existing)
      throw new ApiError(StatusCodes.NOT_FOUND, "Email not registered");
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await prisma.passwordReset.create({
      data: {
        userId: existing.id, // Int
        tokenHash,
        expiresAt: addMinutes(new Date(), RESET_EXP_MIN),
      },
    });
    const resetUrl = `${process.env.ORIGIN_URL}/reset-password?token=${rawToken}`;
    await sendEmail({
      to: email,
      subject: "Your Company - Please verify your email",
      html: forgotPasswordEmail(existing.firstname, resetUrl),
    });
    return { message: "If this email exists, a reset link has been sent." };
  } catch (error: any) {
    console.error("❌ Error occurred:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.stack || error.message,
      false
    ); // system error
  }
};

export const resetPassword = async (data: ResetPasswordInput) => {
  try {
    const { token, password } = data;
    const senttokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const reset = await prisma.passwordReset.findFirst({
      where: {
        tokenHash: senttokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
    if (!reset)
      throw new ApiError(StatusCodes.NOT_FOUND, "Invalid or Expired Token");
    const { user } = reset;
    const { hash, salt } = await hashPassword(password);
    await prisma.sccUser.update({
      where: { id: user.id },
      data: {
        password: hash,
        salt,
      },
    });
    // Mark reset token as used
    await prisma.passwordReset.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    });
    return { message: "Password reset successful." };
  } catch (error: any) {
    console.error("❌ Error occurred:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.stack || error.message,
      false
    ); // system error
  }
};

/**
 * Verifies the user's email using the token from the magic link.
 * @param token - The verification token from the email link.
 * @returns The authenticated user and a JWT token.
 */
export const verifyEmail = async (token: string) => {
  const user = await prisma.sccUser.findFirst({
    where: { verificationId: token as string },
  });
  if (!user)
    throw new ApiError(StatusCodes.NOT_FOUND, "Verification token missing");
  if (user.isEmailVerified)
    throw new ApiError(StatusCodes.NOT_FOUND, "Email already verified");
  if (user.verificationExpires! < new Date()) {
    const newToken = generateToken();
    const newExpires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    await prisma.sccUser.update({
      where: { id: user.id },
      data: { verificationId: newToken, verificationExpires: newExpires },
    });
    await sendVerificationEmail(user.email, user.firstname, newToken);
    throw new ApiError(
      StatusCodes.GONE,
      "Link expired. New link sent to your email."
    );
  }
  const regUser = await prisma.sccUser.update({
    where: { email: user.email },
    data: { isEmailVerified: true },
  });

  const jwt = signJwt({ id: regUser.id, email: regUser.email });

  return { message: "Email verified Successfully" };
};

/**
 * Authenticates a user with email and password.
 * @param data - Login input data including email and password.
 * @throws ApiError if authentication fails.
 * @returns The authenticated user and a JWT token.
 */
export const login = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await prisma.sccUser.findUnique({ where: { email } });
  if (!user || !user.password || !user.salt) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const isValid = await verifyPassword(password, user.password, user.salt);
  if (!isValid)
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");

  if (!user.isEmailVerified) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Please verify your email before logging in."
    );
  }

  const token = signJwt({ userId: user.id, email: user.email });
  const refreshToken = signRefreshJwt({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    token,
    refreshToken,
  };
};

/**
 * Handles social login via OAuth providers using Stytch.
 * @param token - OAuth token from the provider.
 * @returns The authenticated user and a JWT token.
 */
export const socialLogin = async (token: string) => {
  const email = "someemail";
  let loggedInUser = await prisma.sccUser.findUnique({ where: { email } });
  const user = {};
  if (!loggedInUser) {
    loggedInUser = await prisma.sccUser.create({
      data: {
        email,
        oauthProvider: "gogole",
        firstname: "OAuth",
        lastname: "User",
        phone: "",
        isEmailVerified: true,
      },
    });
  }

  const jwt = signJwt({ userId: loggedInUser.id, email: loggedInUser.email });
  return { user, token: jwt };
};

/**
 * Retrieves the profile of a user by their ID.
 * @param userId - The ID of the user.
 * @throws ApiError if user is not found.
 * @returns The user profile data.
 */
export const getProfile = async (userId: number) => {
  const user = await prisma.sccUser.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  return user;
};

/**
 * Refreshes the JWT token using a refresh token.
 * @param refreshToken - The refresh token.
 * @throws ApiError if refresh token is invalid.
 * @returns The new JWT token.
 */
export const refreshToken = async (refreshToken: string) => {
  const decoded = verifyRefreshJwt(refreshToken) as any;
  const accessToken = signJwt({ userId: decoded.userId, email: decoded.email });
  const newRefreshToken = signRefreshJwt({
    userId: decoded.userId,
    email: decoded.email,
  });
  return { accessToken, refreshToken: newRefreshToken };
};
