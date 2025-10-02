import express, { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";

config({ path: path.resolve(__dirname, "../.env") });
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT) || 100,
});
const app = express();
app.use("/api/", apiLimiter);
app.use(morgan("dev"));
app.use(helmet());
const url = process.env.URL;
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", url ?? ""],
      imgSrc: ["'self'", "data:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
    },
  })
);

app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/check", (req: Request, res: Response) => {
  res.send("Server is running");
});

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "frontEnd", "dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(_dirname, "frontEnd", "dist", "index.html"));
});

// Catch-all route for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, (err?: Error) => {
  if (err) {
    console.error("Failed to start server:", err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
