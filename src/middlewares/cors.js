import cors from "cors";

const ACEPPTED_ORIGINS = ["http://localhost:3000", "https://my-app.com"];

const corsMiddleware = () => cors({
  origin: (origin, callback) => {

    if (ACEPPTED_ORIGINS.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});

export default corsMiddleware;