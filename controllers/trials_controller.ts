import { RowDataPacket } from "mysql2/promise";
import { createPool } from "../tools/DBInstance";
import {
  getFieldsFromAllTabs,
  getFieldsFromAxis,
  normalizeTrialList,
  object2Arr,
} from "../tools/helpers";
import { Request, Response } from "express";
import { fetchTabsConfig } from "./plots_controller";

enum SQLVerbs {
  TRIAL_SERIES_SMALL = "time_series",
  TRIAL_SERIES_LARGE = "time_series_big_cells`",
  TRIAL = "trial",
}
type TabQueryParams = {
  table: string;
  fields: string;
  trialID: string;
};

//later create this with client's info;
const pool = createPool(
  process.env.DB_USERNAME || "",
  process.env.DB_PASSWORD || "",
  "trials"
);
////Get trial list////
export const fetchTrialList = async (req: Request, res: Response) => {
  const start = performance.now();
  console.log("trials list");

  const query: string = `select distinct trial from time_series`;

  const poolPromise = pool.promise();

  try {
    await poolPromise.query(query).then(
      (list) => {
        console.log(
          `Trial list performance `,
          (performance.now() - start) / 1000
        );

        res
          .status(200)
          .send(normalizeTrialList(list[0] as { trial: string }[]));
      },
      (err) => {
        res.status(400).send({ message: "trial - list error", err: err });
      }
    );
  } catch (error) {
    console.log(error);
    
    res.status(400).send("server error");
  }
};

export const handleTestFetchAsync = async (
  trialNumber: string,
  fields: string,
  
  isSmallCell:boolean|true,
  db?: string
) => {
  const query1 = `SELECT ${fields ? fields : "*"} FROM ${
    isSmallCell?SQLVerbs.TRIAL_SERIES_SMALL:SQLVerbs.TRIAL_SERIES_LARGE
  } WHERE ${SQLVerbs.TRIAL} = "${trialNumber}"`;

  const query2 = `SELECT time_series.cycle, total_mean.mean_CO2_removed_ppm FROM time_series JOIN total_mean ON time_series.trial = total_mean.trial where total_mean.trial = "${trialNumber}"`;

  const start = performance.now();
  const poolPromise = pool.promise();

  console.log("handle test data fetch trial - ", trialNumber);

  const data = await poolPromise.query(query1 + ";" + query2).then(
    (res1) => {
      console.log(
        `Trial - ${trialNumber} performance `,
        (performance.now() - start) / 1000
      );

      // @ts-ignore
      let data2convert = (res1[0][0] as Array<TrialDataPacket>).concat(
        // @ts-ignore
        res1[0][1] as Array<TrialDataPacket>
      );

      return object2Arr(data2convert);
    },
    (err) => {
      console.log("fetch error", err);
      return null;
    }
  );
  return data;
  // try {

  // } catch (error) {
  //   console.log("err", error);

  //   return null;
  // }
  // console.log("before return - ", data);

  // return data;
};

export async function fetchDataByTab(tabId: string, trialId: string) {
  let configs: PlotTabConfig[] | null = [];
  let dbName = "";
  let tableName = "";
  let query = "";
  let queryFields = "";
  const start = performance.now();
  const poolPromise = pool.promise();

  const configsPromise = await fetchTabsConfig();
  // configsPromise.then((res) => {
  //   configs = res.configs || [];
  // });
  configs = configsPromise.configs;

  if (!configs) return null;

  const configToFetchBy = configs.filter((val) => val.tabId === tabId);
  if (!configToFetchBy) return null;

  dbName = configToFetchBy[0].dbName;
  tableName = configToFetchBy[0].tableName;

  queryFields = getFieldsFromAxis(configToFetchBy[0].plotAxis).join(",");
  queryFields = queryFields.slice(0, queryFields.length);

  query = `SELECT ${queryFields} FROM ${dbName}.${tableName} WHERE trial = "${trialId}"`;

  const data = await poolPromise.query(query).then(
    (res1) => {
      console.log(
        `Trial - ${trialId} performance `,
        (performance.now() - start) / 1000
      );

      // @ts-ignore
      let data2convert = res1[0] as Array<TrialDataPacket>;
      let convertedTrial = object2Arr(data2convert);
      convertedTrial.trial = trialId;
      return convertedTrial;
    },
    (err) => {
      console.log("fetch error", err);
      return null;
    }
  );

  return data;
}

export async function fetchAllTrialData(trialId: string,isSmallCell:boolean = true) {
  let configs: PlotTabConfig[] | null = [];

  let trail: Trial = { data: {}, trial: "" };
  const start = performance.now();
  const poolPromise = pool.promise();
  //@ts-ignore
  const queries = [];
  const configsPromise = await fetchTabsConfig();

  configs = configsPromise.configs;

  console.log(configs);
  

  if (!configs) return null;

  configs.forEach((config) => {
    let dbName = "";
    let tableName = "";
    let query = "";
    let queryFields = "";

    dbName = config.dbName;
    tableName = config.tableName;

    queryFields = getFieldsFromAxis(config.plotAxis).join(",");
    queryFields = queryFields.slice(0, queryFields.length);
    query = `SELECT ${queryFields} FROM ${dbName}.${tableName} WHERE trial = "${trialId}"`;

    const fetcher = poolPromise.query(query).then(
      (res1) => {
        console.log(
          `Trial - ${trialId} performance `,
          (performance.now() - start) / 1000
        );

        // @ts-ignore
        let data2convert = res1[0] as Array<TrialDataPacket>;

        let convertedTrial = object2Arr(data2convert);
        convertedTrial.trial = trialId;
        return convertedTrial;
      },
      (err) => {
        console.log("fetch error", err);
        return null;
      }
    );
    queries.push(fetcher);
  });

  //@ts-ignore
  await Promise.all(queries)
    .then((res) => {
      (res as Trial[]).forEach((t) => {
        trail.data = { ...trail.data, ...t.data };
      });

      //Check this condition
      //poolPromise.end();
      return trail;
    })
    .catch((err) => {
      return err;
    });

  return trail;
}

