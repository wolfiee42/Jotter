import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

export type ExpireTime =
  | `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`
  | number;

/***
 * the expiresIn property in the SignOptions type expects a specific format for the expiration time. The expiresIn can be either:
 *
 * - A number representing seconds (e.g., 60 for 60 seconds)
 * - A string with a time unit (e.g., "2 days", "10h", "7d")
 * - Or undefined
 */

export const createToken = (
  payload: Record<string, unknown>,
  secret: Secret | string,
  expireTime: ExpireTime, // Only accept valid formats like "1h", "2d", 3600, etc.
): string => {
  const options: SignOptions = {
    expiresIn: expireTime,
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const decodedJWTToken = (
  token: string,
  secret: Secret,
): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    console.error(error);
    return null;
  }
};
