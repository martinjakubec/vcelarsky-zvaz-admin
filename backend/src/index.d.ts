declare namespace Express {
  export interface Locals {
    isUserLoggedIn: boolean;
    username: string;
  }

  export interface Request {
    requestId: string;
  }
}
