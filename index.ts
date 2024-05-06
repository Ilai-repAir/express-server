import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mockRouter from "./routers/mock_router";
import smallSystemsTrialsRouter from "./routers/small_systems_trials_router";
import path from "path";
import testLogRouter from "./routers/test_log_router";
import plotsRouter from "./routers/plots_router";
import metadataRouter from "./routers/metadata_router";
enum RoutersPrefix {
  MOCK = "/mock",
  TRIALS_SMALL = "/trials/small",
  TRIALS_LARGE = "/trials/small",
  TESTLOG = "/test_log",
  PLOTS = "/plots",
  METADATA = "/metadata",
}
dotenv.config({ path: path.resolve(__dirname, "../.env") });

////RUN DEV SERVER - npm run dev

////CONFIG
const app: Express = express();
const port = process.env.SERV_PORT;

app.use(cors());

////Routers
app.use(RoutersPrefix.MOCK, mockRouter);
app.use(RoutersPrefix.TRIALS_SMALL, smallSystemsTrialsRouter);
app.use(RoutersPrefix.TESTLOG, testLogRouter);
app.use(RoutersPrefix.PLOTS, plotsRouter);
app.use(RoutersPrefix.METADATA, metadataRouter);

///Static HTML path
const staticWebPath = path.join(__dirname, "..", "website");

app.use(express.static(staticWebPath));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.sendFile(staticWebPath, "index.html");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use(function (req, res, next) {
  res.status(404);
  res.json({ status: 404, title: "Not Found", msg: "Route not found" });
  next();
});
