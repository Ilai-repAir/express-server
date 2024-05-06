import express from "express";

import {
  fetchTabsConfig,
  postTabConfig,
  updateAxisInTab,
} from "../controllers/plots_controller";

const plotsRouter = express.Router();

plotsRouter.use((req, res, next) => {
  console.log(
    `IP - ${req.ip} METHOD - ${req.method} REQUEST PATH - ${req.path}`
  );
  next();
});

plotsRouter.get("/", (req, res) => {
  const trial = req.query;
  res.status(200).send(trial);
});

// plotsRouter.get("/tabs", fetchTabsWithData);\\\\
//plotsRouter.get("/tabs-configs", fetchTabsConfig);

//Get all tab configs
plotsRouter.get("/tabs-configs", (req, res) => {
  const data = fetchTabsConfig();
  data.then((result) => {
    result.configs
      ? res.status(200).send(result.configs)
      : res.status(400).send(result.errorMessage);
  });
});

//WIP - API routes for updating configs and disable tabs.

//Update some value in the config
// plotsRouter.put("/tabs-config:tab_id", (req, res) => {
//   const data = fetchTabsConfig();
//   data.then((result) => {
//     result.configs
//       ? res.status(200).send(result.configs)
//       : res.status(400).send(result.errorMessage);
//   });
// });

// plotsRouter.put("/disable_tab:tab_id", (req, res) => {
//   const data = fetchTabsConfig();
//   data.then((result) => {
//     result.configs
//       ? res.status(200).send(result.configs)
//       : res.status(400).send(result.errorMessage);
//   });
// });

// plotsRouter.post("/tabs-config:tab_id", (req, res) => {
//   const data = fetchTabsConfig();
//   data.then((result) => {
//     result.configs
//       ? res.status(200).send(result.configs)
//       : res.status(400).send(result.errorMessage);
//   });
// });

plotsRouter.put("/axis-in-tab", (req, res) => {
  const axisId = req.query["axisId"] as string | undefined;
  const field2Update = req.query["field2Update"] as string;
  const value2Update = req.query["value2Update"] as string;
  const x = req.query["x"] as string | undefined;
  const y = req.query["y"] as string | undefined;

  console.log(req.query);

  const updateResult = updateAxisInTab(
    axisId,
    field2Update,
    value2Update,
    x,
    y
  ).then((promiseRes) => {
    console.log("RES", promiseRes);

    res.status(promiseRes ? 200 : 400).send(updateResult);
  });
});

///WIP
plotsRouter.put("/axis-in-tab-in-bulk", (req, res) => {
  const axis = [];
  const configs = fetchTabsConfig();
  configs.then((result) => {
    if (result.configs) {
      for (let index = 0; index < result.configs.length; index++) {
        const element = result.configs[index];
        console.log("tab id", element.tabId);

        if (element.tabId == "cycle_average_data") {
          element.plotAxis.forEach((plotAxis) => {
            let indexOfMean = plotAxis.y.indexOf("mean");
            let value2Update =
              plotAxis.y[indexOfMean - 2] == "1"
                ? plotAxis.y.replace("1_mean", "2_std")
                : plotAxis.y.replace("mean", "std");
            const query = {
              field2Update: "y_std",
              value2Update: value2Update,
              x: plotAxis.x,
              y: plotAxis.y,
            };
            axis.push(
              updateAxisInTab(
                plotAxis.axisId,
                "y_std",
                value2Update,
                plotAxis.x,
                plotAxis.y
              ).then((promiseRes) => {
                console.log(promiseRes);
              })
            );
          });
        }
      }
    }
  });
});

plotsRouter.post("/tabs-configs", postTabConfig); //This should be written same as 'GET' above
export default plotsRouter;
