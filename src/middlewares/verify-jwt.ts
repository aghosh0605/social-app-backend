import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { verify } from "jsonwebtoken";

const JwtRequestSchema = yup.object({
  authorization: yup
    .string()
    .trim()
    .min(1, "JWT cannot be null")
    .matches(/^Bearer .+$/, "JWT should be Bearer Token")
    .required(),
});

type JwtRequest = yup.InferType<typeof JwtRequestSchema>;

export const validateJWT = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      try {
        await JwtRequestSchema.validate(req.headers, { abortEarly: false });
      } catch (err: Error | any) {
        let message: string = "";
        err.errors.forEach((error: string) => {
          message += `${error}.\n `;
        });
        throw {
          errorCode: 400,
          status: "JWT Validation Error",
        };
      }
      const { authorization } = req.headers as JwtRequest;
      if (!authorization) {
        return next("JWT error");
      }
      const authToken = authorization.split(" ")[1];
      verify(authToken, process.env.SECRET_KEY!);
      next();
    } catch (err: Error | any) {
      next({
        errorCode: 403,
        status: `JWT Validation Error ;${err.name}: ${err.message}`,
      });
    }
  };
};
