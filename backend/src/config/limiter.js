import rateLimit from 'express-rate-limit';
import { getMessage } from "../common/messages.js";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15minutes
    max: 90, //Limit each IP to 100 requests
    message: getMessage("limiter.requests")
  })
export default limiter;