import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

const DashService = {
  getDash: async (userId: string) => {
    try {
         return {
        id: userId
      };
      /*const user = await prisma.sccUser.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      return {
        id: user.id,
        email: user.email,
      }; // return only what's needed*/
    } catch (error: any) {
      console.error("❌ Error occurred:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.stack || error.message,
        false
      );
    }
  },
};

export default DashService;
