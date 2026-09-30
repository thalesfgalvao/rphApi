import express from "express";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.0.104:5173",
      "http://25.31.44.192:5173",
    ],
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
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
