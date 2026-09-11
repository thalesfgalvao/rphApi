import express from "express";
import routes from "./routes/index.js";

const app = express();
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
