import { IOfficer } from "../../interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: IOfficer;
    }
  }
}
