import { Request, Response, response } from "express";
import { createPool } from "../tools/DBInstance";
import { OkPacket, ResultSetHeader } from "mysql2";

const pool = createPool(
  process.env.DB_USERNAME || "",
  process.env.DB_PASSWORD || "",
  "trials"
);
const table2fetchFrom = "total_mean"; // Later change this total_mean
export const fetchTestsTableColumns = async () => {
  const poolPromise = pool.promise();
  const query = `SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = 'trials'
                AND TABLE_NAME = '${table2fetchFrom}';`;
  let fields: { COLUMN_NAME: string }[] = [];

  try {
    await poolPromise.query(query).then(
      (res) => {
        fields = res[0] as { COLUMN_NAME: string }[];
      },
      (rej) => {
        console.log("error");
        throw new Error(rej);
      }
    );
  } catch (error) {
    console.log("error");
    return null;
  }

  return fields;
};

export const fetchTestsTableData = async (
  trialsIDs: string,
  columns: string
) => {
  const poolPromise = pool.promise();

  let trials2fetchSplit = trialsIDs.split(",");
  let trials2fetch = trials2fetchSplit.map((trial, i) => {
    return `trial = "${trial}" ${
      i < trials2fetchSplit.length - 1 ? "OR " : ""
    }`;
  });

  const query = `SELECT trial,${columns}
                  FROM ${table2fetchFrom}
                  WHERE ${trials2fetch.join("")} limit ${trialsIDs.length}`;
  let metadataData: {}[] = [];

  try {
    await poolPromise.query(query).then(
      (res) => {
        metadataData = res[0] as {}[];
      },
      (rej) => {
        console.log("rej", rej);
        throw new Error(rej);
      }
    );
  } catch (error) {
    return null;
  }

  return metadataData;
};

export const updateTestsTableView = async (
  viewID: number,
  columns2Add: string
) => {
  const poolPromise = pool.promise();
  let columns2AddArr = columns2Add.split(",");
  let columns2AddString = columns2AddArr
    .map((col) => `(${viewID},"${col}","")`)
    .join(",");
  // columns2AddString = columns2AddString.slice(0,columns2AddString.length-1)
  const query = `INSERT INTO trials.columns_in_view
  VALUES
  ${columns2AddString};`;

  let isQuerySuccessful = false;
  let queryError = "";
  console.log("post view query - ", query);

  try {
    await poolPromise.query(query).then(
      (res) => {
        isQuerySuccessful = true;
      },
      (rej) => {
        console.log("rej", rej);
        queryError = rej.sqlMessage;
        throw new Error(rej);
      }
    );
  } catch (error) {
    console.log("error");
    isQuerySuccessful = false;
  }

  return {
    isQuerySuccessful: isQuerySuccessful,
    error: queryError,
  };
};

type TableView = {
  viewId: number;
  viewDisplayName: string;
  isDefaultView: boolean;
};
export const fetchTestsTableDataViews = async () => {
  const poolPromise = pool.promise();
  const query = `SELECT * FROM trials.tests_views`;

  const queryResult: { data: TableView[]; queryError: string } = {
    data: [],
    queryError: "",
  };
  try {
    await poolPromise.query(query).then(
      (res) => {
        queryResult.data = res[0] as TableView[];
      },
      (rej) => {
        queryResult.queryError = rej.sqlMessage;
        queryResult.data = [];
        throw new Error(rej.sqlMessage);
      }
    );
  } catch (error) {
    return queryResult;
  }

  return queryResult;
};

type TableData = {
  viewDisplayName: string;
  isDefaultView: boolean;
};
// export const fetchTestsTableDataViewByID = async (viewID: number,fields:string[]) => {
//   const poolPromise = pool.promise();
//   const query = `SELECT * FROM trials.columns_in_view WHERE view_id = ${viewID}`;

//   const queryResult: { data: TableView | null; queryError: string } = {
//     data: null,
//     queryError: "",
//   };
//   try {
//     await poolPromise.query(query).then(
//       (res) => {
//         if ((res[0] as OkPacket[]).length == 0) {
//           throw new Error("View ID not found.");
//         }
//         //@ts-ignore
//         queryResult.data = res[0][0] as TableView;
//       },
//       (rej) => {
//         console.log("Rej", rej);

//         queryResult.queryError = rej.sqlMessage;
//         throw new Error(rej.sqlMessage);
//       }
//     );
//   } catch (error) {
//     return queryResult;
//   }

//   return queryResult;
// };
//fetchTestsTableDataViewByID(0);
