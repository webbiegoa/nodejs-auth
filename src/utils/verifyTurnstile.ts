import axios from "axios";
import { ApiError } from "./ApiError";
import { CLOUDFLARE_TURNSTILE_VERIFY_URL } from "../constants";
import { StatusCodes } from 'http-status-codes';

export const verifyTurnstile = async (token: string) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Turnstile secret missing");

  const res = await axios.post(
    CLOUDFLARE_TURNSTILE_VERIFY_URL,
    new URLSearchParams({ secret, response: token }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  if (!res.data.success) throw new ApiError(StatusCodes.NOT_FOUND, "Turnstile verification failed");
};
