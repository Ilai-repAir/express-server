import * as fs from "fs";
import { Request, Response, response } from "express";
import { getFieldsFromAllTabs } from "../tools/helpers";
import { createPool } from "../tools/DBInstance";
import { OkPacket } from "mysql";
import { ResultSetHeader, RowDataPacket, FieldPacket } from "mysql2";

const pool = createPool(
  process.env.DB_USERNAME || "",
  process.env.DB_PASSWORD || "",
  "trials"
);

let configs: PlotTabConfig[] = [];

export const fetchTabsConfig = async (): Promise<{
  configs: PlotTabConfig[] | null;
  errorMessage: string;
}> => {
  // pool.getConnection((err,con)=>{
  //   console.log(err);
    
  // })
  const poolPromise = pool.promise();
  //@ts-ignore
  let promisesArr = [];

  //If config were already fetched
  if (configs.length > 0) return { configs: configs, errorMessage: "" };

  
  //Push all Promises to array
  try {
  
    await poolPromise.query("SELECT * FROM trials.plots_tab").then(
      (configsFetchResult) => {

        promisesArr = (configsFetchResult[0] as PlotTabConfig[]).map(
          async (plotTabConfig, i) => {
            configs.push(plotTabConfig);

            await fetchFieldsByTab(plotTabConfig.tabId).then(
              (res) => (configs[i].plotAxis = res)
            );
          }
        );
      },
      (err) => {
        // res.status(400).send({ message: "config error fetch", err: err });
        return { configs: null, errorMessage: err };
      }
    );

    //After adding all Promises to the array fetch them all and wait for them to finish
    //@ts-ignore
    await Promise.all(promisesArr)
      .then(() => {
        //poolPromise.end();

        return { configs: configs, errorMessage: "" };
      })
      .catch((err) => {
        return err;
      });
  } catch (error) {
    console.log("catch",error);
    
    return { configs: null, errorMessage: error as string };
  }
  return { configs: configs, errorMessage: "" };
};
export const postTabConfig = async (req: Request, res: Response) => {
  interface PlotData {
    y: string;
    y2?: string;
    x: string;
  }

  //get these from req.params
  const json_data: PlotData[] = [
    { y: "Volt_mv", y2: "Current_ma", x: "Time_series_Hour" },
    { y: "Co2_enriched_ppm", y2: "CO2_depleted", x: "Time_series_Hour" },
    {
      y: "CO2_removed_ppm",
      y2: "Capture_rate_Kg_m2_Year",
      x: "Time_series_Hour",
    },
    { y: "CO2_removal_percent", x: "Time_series_Hour" },
    { y: "Energy_consumption_MWh_t", x: "Time_series_Hour" },
    { y: "e_CO2_ratio", x: "Time_series_Hour" },
    { y: "Power_W", x: "Time_series_Hour" },
  ];

  const tabId: string = "timeframe_data"; // Replace with your actual timeframe data
  const plot_id: string = "your_plot_id"; // Replace with your actual plot ID

  const sql_statements: string[] = [];
  const poolPromise = pool.promise();

  for (const data of json_data) {
    const { y, y2, x } = data;

    const sql_statement = `INSERT INTO \`plots_tab\`.\`plots_in_tab\` (\`tab_id\`, \`y\`, \`y2\`, \`x\`, \`plot_id\`) VALUES ('${tabId}', '${y}', '${
      y2 || ""
    }', '${x}', '${y + y2 + x}');`;

    await poolPromise
      .query(sql_statement)
      .then((queryResult) => {})
      .catch((err) => {
        res.status(400).send(err);
      });

    sql_statements.push(sql_statement);
  }

  // Print or execute the SQL statements
  for (const statement of sql_statements) {
    console.log(statement);
  }
};
export const updateAxisInTab = async (
  axisId: string | number | undefined,
  field2Update: string,
  value2Update: string | number,
  x: string | undefined,
  y: string | undefined
) => {
  const poolPromise = pool.promise();
  let res: any = {};

  try {
    if (axisId) {
      res = await poolPromise.query(
        `UPDATE axis_in_tab SET ${field2Update} = "${value2Update}"
          WHERE axis_in_tab.axisId = "${axisId}"`
      );
    } else if (x && y) {
      res = await poolPromise.query(
        `UPDATE axis_in_tab SET ${field2Update} = "${value2Update}"
          WHERE axis_in_tab.x = "${x}" AND axis_in_tab.y = "${y}"`
      );
    } else return null;
  } catch (error) {
    return error;
  }

  return res[0];
};

export const fetchFieldsByTab = async (tabId: string) => {
  const poolPromise = pool.promise();

  const res = await poolPromise.query(
    `SELECT * FROM axis_in_tab WHERE axis_in_tab.tabId = "${tabId}"`
  );

  return res[0] as PlotAxis[];
};

// export const fetchTabsConfig = async (req: Request, res: Response) => {
//   const poolPromise = pool.promise();
//   const path = "./mock/plotsInTab.json";
//   if (!fs.existsSync(path)) {
//     return { data: null, err: "file not exists in fs" };
//   }

//   await poolPromise.query("SELECT * FROM plots_tab.plots_tab", (result) => {
//     console.log("SELECT * FROM plots_tab ", result);
//   });
//   let configs: PlotTabConfig[] = [];
//   try {
//     await poolPromise
//       .query("SELECT * FROM plots_tab.plots_tab")
//       .then(
//         (configsFetchResult) => {
//           return configsFetchResult[0] as PlotTabConfig[];
//         },
//         (err) => {
//           res.status(400).send({ message: "config error fetch", err: err });
//         }
//       )
//       .then((data) => {
//         if (data)
//           data.forEach((plotConfig, plotConfigIndex) => {
//             const tabId = plotConfig.tabId;
//             configs.push(plotConfig);
//             let func = async () => {
//               await poolPromise
//                 .query(
//                   `SELECT * FROM axis_in_tab WHERE axis_in_tab.tabId = "${tabId}"`
//                 )
//                 .then((res) => {
//                   console.log(tabId);

//                   configs[plotConfigIndex].plotAxis = res[0] as PlotAxis[];
//                 });
//             };
//             func();
//           });
//       })
//       .finally(() => {
//         console.log("Configs ", configs);
//         res.status(200).send({
//           configs: configs,
//           fields: [],
//         });
//       });
//   } catch (error) {
//     res.status(400).send(error);
//   }

//   pool.query("SELECT * FROM plots_tab.plots_tab", res, (err, values) => {
//     (values as PlotTabConfig[]).forEach((plotTabConfig, i) => {
//       console.log("config", plotTabConfig);

//       configs.push(plotTabConfig);
//       const tabId = plotTabConfig.tabId;

//       pool.query(
//         `SELECT * FROM axis_in_tab WHERE axis_in_tab.tabId = "${tabId}"`,
//         response,
//         (err, data) => {
//           if (err) res.status(400).send(err);
//           console.log(data);

//           configs[i].plotAxis = data as PlotAxis[];
//         }
//       );
//     });
//   });
//   if (tabConfigsPacket) {
//     console.log("tab config packet is not null");
//     res.send(tabConfigsPacket);
//     return;
//   }
//   console.log("configs outside fetch", configs);

//   const tabConfigs: PlotTabConfig[] = JSON.parse(fs.readFileSync(path, "utf8"));
//   tabConfigsPacket = {
//     configs: configs,
//     fields: [],
//   };

//   res.send(tabConfigsPacket);
// };

// export const fetchTabsWithData = async (req: Request, res: Response) => {
//   const path = "./mock/plotsInTab.json";
//   if (!fs.existsSync(path)) {
//     return { data: null, err: "file not exists in fs" };
//   }

//   let tabsWdata: PlotTabConfigWithData[] = [];

//   const tabs: PlotTabConfig[] = JSON.parse(fs.readFileSync(path, "utf8"));

//   const fields: string[] = getFieldsFromAllTabs(tabs);

//   const testData = await handleTestFetchAsync(
//     req.query["trial"] as string,
//     fields.join(",")
//   );
//   console.log("tabs controller test data - ", testData);

//   if (testData)
//     tabs.forEach((t, i) => {
//       const tabWdata: PlotTabConfigWithData = {
//         isDisabled: t.isDisabled,
//         tabId: t.tabId,
//         tabTitle: t.tabTitle,
//         plotAxis: t.plotAxis.map((pa) => {
//           const y2 = pa.y2
//             ? {
//                 axisId: pa.y2,
//                 data: testData[pa.y2] || [],
//                 axisName: pa.y2,
//                 axisTitle: pa.y2,
//               }
//             : {};
//           return {
//             x: {
//               axisId: pa.x,
//               data: testData[pa.x] || [],
//               axisName: pa.x,
//               axisTitle: pa.x,
//             },
//             y: {
//               axisId: pa.y,
//               data: testData[pa.y] || [],
//               axisName: pa.y,
//               axisTitle: pa.y,
//             },
//             ...y2,
//           };
//         }),
//       };

//       tabsWdata.push(tabWdata);
//     });

//   res.send(tabsWdata);
// };
