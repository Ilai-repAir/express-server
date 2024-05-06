import express from "express";
import dotenv from "dotenv";
import {
  fetchTrialList,
  fetchDataByTab,
  fetchAllTrialData,
} from "../controllers/trials_controller";

const smallSystemsTrialsRouter = express.Router();

dotenv.config();

smallSystemsTrialsRouter.use((req, res, next) => {
  console.log(
    `IP - ${req.ip} METHOD - ${req.method} REQUEST PATH - ${req.path}`
  );
  next();
});

smallSystemsTrialsRouter.get("/trial/:trial_number", (req, res) => {
  const trialNumber = req.params["trial_number"];
  let data = fetchAllTrialData(trialNumber);
  data.then((val) => {
    res.send(val);
  });
});

//ex. query = http://localhost:3010/trials/trial-data-by-tab?trial_id=RA-744-2&fields=T_Cell_C,Time_series&table=time_series

smallSystemsTrialsRouter.get("/trial_data_by_tab", (req, res) => {
  let tabId = req.query["tabId"];
  let trialId = req.query["trialId"];

  if (!tabId || !trialId) {
    res.status(400).send("missing query params");
    return;
  }

  let data = fetchDataByTab(tabId as string, trialId as string);
  data.then((val) => {
    res.send(val);
  });
});

/////get trail list/////
smallSystemsTrialsRouter.get("/trials_list", fetchTrialList);

export default smallSystemsTrialsRouter;
