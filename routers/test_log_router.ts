import express from "express";
import * as helpers from "../tools/helpers";
import * as fs from "fs";
type TestLogSectionsLargeSystems = {
  cellSpecs: {
    test: string;
    subTest: number;
    Assemblydate: Date;
    RunDate: Date;
    Testsystem: number;
    Cell: 1;
    FFnumberAnode: number;
    FFnumberCathode: number;
    FFTypeAnode: string;
    FFTypeCathode: string;
    Testgoal: string;
  };
};

const testLogSectionsLargeSystems = {
  //DRAW THIS FROM DB AND MAKE IT TYPED
  cellSpecs: [
    "test",
    "Sub test",
    "Assembly date",
    "Run Date",
    "Test",
    "Test system",
    "Cell",
    "FF number Anode",
    "FF number Cathode",
    "FF Type Anode",
    "FF Type Cathode",
    "Test goal",
  ],
  MEA: [
    "Anode number",
    "Cathode number",
    "assembly type",
    "Electrode substrate",
    "anode thickness [um]",
    "cathode thickness [um]",
    "gasket type",
    "GDL substrate",
    "GDL thickness  [um]",
    "GDL Quantity per side",
    "Membrane type",
    "Membrane thickness [um]",
  ],
  assembley: [
    "Closure piston force [ton]",
    "Closure bellivelle hight [mm]",
    "Continuity check [Ohm]",
    "Start pressure leak test [bar] ",
    "Pressure leak test after 5 minutes [bar]",
    "Leak rate [ml/min]",
  ],
  runSpecsHMI: [
    "Flow rate Anode [L/min]     ",
    "Flow rate Cathode [L/min]",
    "Gas source 1",
    "Gas source 2",
    "SV. Temp Anode humidity outlet [C]",
    "SV. Temp Cathode humidity outlet [C]",
    "SV. Temp Anode sleeve [C]	",
    "SV. Temp Cathode sleeve [C]	",
    "SV. Temp stack inlet Anode [C]",
    "SV. Temp stack inlet Cathode [C]",
    "PV. Temp Stack outlet Anode [C]",
    "PV. Temp Stack outlet Cathode [C]",
    "Tdew anode humidifier [C]",
    "Tdew Cathode Humidifier [C]	",
    "SV. RH% Anode",
    "SV. RH% Cathode",
    "Humidification duration [h]",
    "Current density [mA/cm2]",
    "EDCS",
    "humidification procedure",
    "F (hz)",
    "HFR [mOhm]",
    "F(hz) Finish runing",
    "HFR [mOhm] Finish runing",
  ],
  endOfTrial: ["Comments", "the success of the experiment", "failure reason"],
};

const testLogRouter = express.Router();

testLogRouter.post("/upload-test", (req, res) => {});

export default testLogRouter;
