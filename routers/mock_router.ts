import express from "express";
import * as helpers from "../tools/helpers";
import * as fs from "fs";

const mockRouter = express.Router();

mockRouter.get("/", (req, res) => {
  res.send("mock");
});

// mockRouter.get("/trial/:trial_number", (req, res) => {
//   // let trial_number: string = req.params["trail_number"].replace(/\D/g, "");
//   const path = `./mock/${req.params["trial_number"]}.json`;
//   if (!fs.existsSync(path)) {
//     res.status(404).send("invalid path");
//     return;
//   }

//   const data = JSON.parse(fs.readFileSync(path, "utf8")) as TrialData[];
//   // let newData = helpers.normalizeData(
//   //   data.filter((td) => td.trial.replace(/\D/g, "") == trial_number)
//   // );

//   let newData = helpers.object2Arr(data);

//   res.status(data.length > 0 ? 200 : 400).send(newData);
// });

//get trail list MOCK

mockRouter.get("/trials_list", (req, res) => {
  const path = "./mock";
  var files = fs.readdirSync(path);

  res
    .status(files.length > 0 ? 200 : 400)
    .send(files.map((f, i) => f.replace(".json", "")));
});

export default mockRouter;
