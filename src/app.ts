import express from "express";

import defaultRoutes from "./routes/default.router";

const app = express();

app.use(express.json());

// Routes
app.use("/", defaultRoutes);

export default app;
