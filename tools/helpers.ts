import fs from "fs";
import mysql from "mysql";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config();
const con_port = process.env.PORT || "0";

// const normalizeData = (testData: TestData[]): NormalizedTestDataTimeSeries => {
//   const td: NormalizedTestDataTimeSeries = {
//     trial: "",
//     trial_number: 0,
//     trial_run: 0,
//     trial_string_comment: "",
//     trial_run_2: 0,
//     trial_run_3: 0,
//     trial_run_4: 0,
//     data: {
//       Co2_enriched_ppm: [],
//       CO2_depleted: [],
//       FL_CA_L_min: [],
//       FL_An_L_min: [],
//       Volt_mv: [],
//       Current_ma: [],
//       T_DEW_An_C: [],
//       T_line_An_C: [],
//       T_DEW_Ca_C: [],
//       T_line_Ca_C: [],
//       RH_An_percent: [],
//       RH_Ca_percent: [],
//       Dp_An_mbar: [],
//       Dp_Ca_mbar: [],
//       T_Cell_C: [],
//       initial_CO2_ppm: [],
//       Power_W: [],
//       CO2_removed_ppm: [],
//       CO2_removal_percent: [],
//       Capture_rate_Kg_m2_Year: [],
//       Energy_consumption_MWh_t: [],
//       e_CO2_ratio: [],
//       Time_series: [],
//       Time_series_Hour: [],
//       new_Captured_CO2_mol: [],
//       Accumulative_new_Captured_CO2_mol: [],
//       new_Captured_CO2_gr: [],
//       new_Captured_CO2_Kg_m2: [],
//       Accumulative_captured_CO2_gr: [],
//       Accumulative_captured_CO2_Kg_m2: [],
//       new_Energy_consumption_Wh: [],
//       Accumultive_Energy_consumption_Wh: [],
//       New_e_mol_s: [],
//       New_e_mol: [],
//       Accumultive_electrone_mol: [],
//       new_e_CO2: [],
//       accumlated_new_Captured_CO2_mol: [],
//       IVI_Current_A: [],
//       IVI_Time: [],
//       IVI_Volt_V: [],
//       normalized_Captured_CO2_Kg_m2: [],
//       accumlated_e_CO2: [],
//     },
//   };

//   // const packetDataFieldNames = Object.keys(testData);
//   // const testDataFieldNames = Object.keys(TestData);

//   // const isCorrespondingFields =
//   //   packetDataFieldNames.length === testDataFieldNames.length &&
//   //   packetDataFieldNames.every((fieldName) =>
//   //     testDataFieldNames.includes(fieldName)
//   //   );

//   // console.log(isCorrespondingFields); // Output: true

//   //set test info in non repetitive variables
//   td.trial = testData[0].trial;
//   td.trial_number = testData[0].trial_number;
//   td.trial_run = testData[0].trial_run;
//   td.trial_string_comment = testData[0].trial_string_comment;

//   //iterate over query rows
//   for (let index = 0; index < testData.length; index++) {
//     const element = testData[index];

//     //iterate over element's fields
//     Object.keys(element).forEach((e) => {
//       let key = e as keyof TestData;

//       if (
//         !(
//           key === "Cycle" ||
//           key === "trial" ||
//           key === "trial_number" ||
//           key === "trial_run" ||
//           key === "trial_string_comment"
//         )
//       )
//         td.data[key].push(element[key]);
//     });
//   }

//   return td;
// };

const getFieldsFromAllTabs = (
  tabs: PlotTabConfig[]
): Partial<keyof TrialDataPacket>[] => {
  const fields: Partial<keyof TrialDataPacket>[] = [];
  const toolTips: string[][] = [[]];
  tabs.forEach((tab) => {
    tab.plotAxis.forEach((p, i) => {
      !fields.includes(p.x) && fields.push(p.x);
      !fields.includes(p.y) && fields.push(p.y);
      p.y2 && !fields.includes(p.x) && fields.push(p.y2);
    });
  });

  return fields;
};

export const getFieldsFromAxis = (
  plotAxis: PlotAxis[]
): Partial<keyof TrialDataPacket>[] => {
  const fields: Partial<keyof TrialDataPacket>[] = [];
  plotAxis.forEach((axis) => {
    fields.push(axis.x);
    fields.push(axis.y);
    if (axis.y2) fields.push(axis.y2);
    if (axis.y_std) fields.push(axis.y_std);
  });

  return fields;
};

const normalizeTrialList = (trialsList: { trial: string }[]): string[] => {
  const trials = trialsList.map((t) => t.trial).reverse();
  return [...new Set(trials)];
};

const object2Arr = (rawData: TrialDataPacket[]): Trial => {
  //Init trial data obj
  let trialData: PartialTrialData = {};

  //Iterate over raw packet  fields to the TrialData object
  Object.keys(rawData[0]).forEach((e) => {
    let key = e as keyof TrialData;
    trialData[key] = [];
  });

  //Iterate over raw packet and push the value from the object to the correct array
  for (let iData = 0; iData < rawData.length; iData++) {
    //The raw object
    const currentRow = rawData[iData];

    //Iterate over object keys and push the value to the correct array;
    Object.keys(trialData).forEach((e) => {
      const key = e as keyof TrialData;

      //@ts-ignore
      trialData[key]!.push(currentRow[key]);
    });
  }
  //Set trial specs
  let trial: Trial = {
    trial: rawData[0].trial || "",
    trial_number: rawData[0].trial_number || 0,
    trial_run: rawData[0].trial_run || 0,
    trial_string_comment: "",
    data: {},
  };

  trial.data = trialData;
  return trial;
};

const pathChecker = (path: string): string | false => {
  if (!fs.existsSync(path)) {
    return false;
  } else return path;
};

const testConnection = (connection: mysql.Connection) =>
  connection.state === "authenticated";

///git test

export {
  normalizeTrialList,
  object2Arr,
  pathChecker,
  testConnection,
  getFieldsFromAllTabs,
};
