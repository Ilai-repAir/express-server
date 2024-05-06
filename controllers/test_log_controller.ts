import * as fs from "fs";
import { Request, Response } from "express";
import { createPool } from "../tools/DBInstance";
import * as mysql from "mysql2/promise";
import * as util from "util";
import * as excel from "exceljs";

// MySQL Connection Configuration
// const pool = createPool(
//   process.env.DB_USERNAME || "",
//   process.env.DB_PASSWORD || "",
//   "trials"
// );
// interface TableData {
//     "Event ID": string
//     Date: string
//     Location: string
//     Capacity: string
//     Speakers: string
//   }

// function main(workbook: ExcelScript.Workbook): TableData[] {
//     // Get the first table in the "PlainTable" worksheet.
//     // If you know the table name, use `workbook.getTable('TableName')` instead.
//     const table = workbook.getWorksheet('PlainTable').getTables()[0];

//     // Get all the values from the table as text.
//     const texts = table.getRange().getTexts();

//     // Create an array of JSON objects that match the row structure.
//     let returnObjects: TableData[] = [];
//     if (table.getRowCount() > 0) {
//       returnObjects = returnObjectFromValues(texts);
//     }

//     // Log the information and return it for a Power Automate flow.
//     console.log(JSON.stringify(returnObjects));
//     return returnObjects
//   }

//   // This function converts a 2D array of values into a generic JSON object.
//   // In this case, we have defined the TableData object, but any similar interface would work.
//   function returnObjectFromValues(values: string[][]): TableData[] {
//     let objectArray: TableData[] = [];
//     let objectKeys: string[] = [];
//     for (let i = 0; i < values.length; i++) {
//       if (i === 0) {
//         objectKeys = values[i]
//         continue;
//       }

//       let object: {[key: string]: string} = {}
//       for (let j = 0; j < values[i].length; j++) {
//         object[objectKeys[j]] = values[i][j]
//       }

//       objectArray.push(object as unknown as TableData);
//     }

//     return objectArray;
//   }

// const readFileAsync = util.promisify(fs.readFile);

// interface ExcelRow {
//   [key: string]: string | number | boolean | Date | undefined;
// }

// async function readExcel(filePath: string): Promise<ExcelRow[]> {
//   const fileContent = await readFileAsync(filePath);
//   const workbook = new excel.Workbook();
//   await workbook.xlsx.load(fileContent);

//   const worksheet = workbook.getWorksheet(1);
//   if (!worksheet) return [];
//   const headers = worksheet.getRow(1).values as string[];

//   const rows: ExcelRow[] = [];

//   worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
//     if (rowNumber > 1) {
//       const rowData: ExcelRow = {};
//       row.eachCell((cell, colNumber) => {
//         //@ts-ignore
//         rowData[headers[colNumber - 1]] = cell.value;
//       });
//       rows.push(rowData);
//     }
//   });

//   return rows;
// }

// async function createTableIfNotExists(
//   connection: mysql.Connection,
//   tableName: string,
//   sampleData: ExcelRow[]
// ): Promise<void> {
//   const query = `
//       CREATE TABLE IF NOT EXISTS ${tableName} (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         ${Object.keys(sampleData[0])
//           .map((column) => `${column} VARCHAR(255)`)
//           .join(",")}
//       );
//     `;

//   await connection.query(query);
// }

// async function uploadToMySQL(
//   data: ExcelRow[],
//   tableName: string,
//   connection: mysql.Connection
// ): Promise<void> {
//   await createTableIfNotExists(connection, tableName, data);

//   const columns = Object.keys(data[0]).join(",");
//   //const placeholders = Array(data[0]).fill("?").join(",");

//   const insertQuery = `
//     INSERT INTO ${tableName} (${columns}) VALUES ?;
//   `;

//   const values = data.map((row) => Object.values(row));

//   await pool.query(insertQuery, [values]);
// }

// // Replace these values with your own database credentials
// const tableName = "test_log";
// const excelFilePath = "path/to/your/excel/file.xlsx";

// (async () => {

//   try {
//     const data = await readExcel(excelFilePath);
//     await uploadToMySQL(data, tableName, pool);
//     console.log("Data uploaded to MySQL successfully!");
//   } catch (error) {
//     console.error("Error uploading data to MySQL:", error);
//   } finally {
//     await connection.end();
//   }
// })();

// // Excel File Path
// const excelFilePath = "C:\Users\ilai\Desktop\apps\express-server\Test log 2023-11.xlsx";

// // Table Name in MySQL
// const tableName = "your_table_name";

// // Read Excel File
// const workbook = xlsx.readFile(excelFilePath);
// const sheetName = workbook.SheetNames[0];
// const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// async function uploadDataToMySQL() {
//   try {
//     const connection = await pool.getConnection((err) => {
//       throw new Error(err?.message);
//     });
//     await pool.query(`CREATE TABLE IF NOT EXISTS ${tableName} (
//       // Define your table columns here based on the specified structure
//     )`);

//     for (const row of excelData) {
//       // Adjust the column names and values based on your Excel sheet structure
//       //@ts-ignore
//       const columns = Object.keys(row).join(",");
//       //@ts-ignore
//       const values = Object.values(row)
//       //@ts-ignore
//         .map((value) => connection.escape(value))
//         .join(",");

//       await pool.query(
//         `INSERT INTO ${tableName} (${columns}) VALUES (${values})`
//       );
//     }

//     console.log("Data uploaded successfully");
//   } catch (error) {
//     console.error("Error uploading data to MySQL:", error);
//   } finally {
//     pool.end(); // Close the connection pool
//   }
// }

// uploadDataToMySQL();
