import { IOfficer } from "../../src/interfaces";
declare global {
  namespace Express {
    interface Request {
      user?: IOfficer;
    }
  }
}
