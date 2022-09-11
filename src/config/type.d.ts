declare namespace jsonwebtoken {
  interface JwtPayload {
    uid?: string;
    isAdmin?: boolean;
  }
}

declare namespace Express {
  interface Request {
    user?: string;
  }
}
