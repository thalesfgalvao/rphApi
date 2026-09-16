import express from "express";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
