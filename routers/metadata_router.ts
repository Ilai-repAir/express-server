import express, { query } from "express";
import {
  fetchTestsTableColumns,
  fetchTestsTableData,
  fetchTestsTableDataViews,
  updateTestsTableView,
} from "../controllers/metadata_controller";

const metadataRouter = express.Router();

metadataRouter.use((req, res, next) => {
  console.log(
    `IP - ${req.ip} TIME - ${new Date().toUTCString()} METHOD - ${
      req.method
    } REQUEST PATH - ${req.path} `
  );
  next();
});
metadataRouter.get("/table_columns", (req, res) => {
  fetchTestsTableColumns().then((data) => {
    console.log(data);

    res.status(data ? 200 : 400).send(data);
  });
});

metadataRouter.get("/table_data", (req, res) => {
  let fields2fetch = req.query["fields"] as string;
  let trials2fetch = req.query["trials2fetch"] as string;

  fetchTestsTableData(trials2fetch, fields2fetch).then((data) => {
    console.log(data);

    res.status(data ? 200 : 400).send(data);
  });
});

metadataRouter.get("/table_views", (req, res) => {
  fetchTestsTableDataViews().then((queryResult) => {
    console.log("queryResult", queryResult);

    res.status(queryResult.data.length > 0 ? 200 : 400).send(queryResult);
  });
});

// metadataRouter.get("/table_view/:view_id", (req, res) => {
//   let viewID = req.params["view_id"] as string;

//   fetchTestsTableDataViewByID(Number(viewID)).then((queryResult) => {
//     res.status(queryResult.data ? 200 : 400).send(queryResult);
//   });
// });

metadataRouter.post("/columns2view", (req, res) => {
  let columns2Add = req.query["columns"] as string;
  let viewID = req.query["view_id"] as string;

  updateTestsTableView(Number(viewID), columns2Add).then((data) => {
    console.log(data);

    res.status(data ? 200 : 400).send(data);
  });
});

// metadataRouter.post("/add_view", (req, res) => {
//   let fields2fetch = req.query["fields"] as string;
//   let trials2fetch = req.query["trials2fetch"] as string;

//   fe(trials2fetch, fields2fetch).then((data) => {
//     console.log(data);

//     res.status(data ? 200 : 400).send(data);
//   });
// });

export default metadataRouter;
