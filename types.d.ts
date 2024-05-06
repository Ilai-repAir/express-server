export {};

declare global {
  type PartialTestData = Partial<keyof TrialDataPacket>;

  type PlotTabConfigDataPacket = {
    fields: Partial<keyof TrialDataPacket>[];
    configs: PlotTabConfig[];
  };

  type PlotAxis = {
    y: keyof TrialDataPacket;
    y2?: keyof TrialDataPacket;
    x: "Time_series_Hour" | "Cycle" | "Accumulative_captured_CO2_Kg_m2";
    axisId: number;
    xDisplayName: string;
    yDisplayName: string;
    y2DisplayName: string;
    y_std?: keyof TrialDataPacket;
  };

  type PlotTabConfig = {
    tabId: string;
    tabTitle: string;
    toolTipTitle: string;
    plotAxis: PlotAxis[];
    isDisabled: boolean;
    tabType?: "table" | "plot";
    isOverlay: boolean;
    dbName: string;
    tableName: string;
    plotMode?: string;
    plotType?: string;
  };

  interface PlotTabConfigWithData extends RowDataPacket {
    tabId: number;
    tabTitle: string;
    plotAxis: {
      y: Axis;
      y2?: Axis;
      x: Axis;
    }[];
    isDisabled: boolean;
  }

  interface TrialDataPacket
    extends RowDataPacket,
      OkPacket,
      ResultSetHeader,
      RowDataPacket,
      RowDataPacket,
      OkPacket {
    //Previously TestData
    Co2_enriched_ppm: number;
    CO2_depleted: number;
    FL_CA_L_min: number;
    FL_An_L_min: number;
    Volt_mv: number;
    Current_ma: number;
    T_DEW_An_C: number;
    T_line_An_C: number;
    T_DEW_Ca_C: number;
    T_line_Ca_C: number;
    RH_An_percent: number;
    RH_Ca_percent: number;
    Dp_An_mbar: number;
    Dp_Ca_mbar: number;
    T_Cell_C: number;
    initial_CO2_ppm: number;
    Power_W: number;
    CO2_removed_ppm: number;
    CO2_removal_percent: number;
    Capture_rate_Kg_m2_Year: number;
    Energy_consumption_MWh_t: number;
    e_CO2_ratio: number;
    Time_series: number;
    Time_series_Hour: number;
    Cycle: string;
    new_Captured_CO2_mol: number;
    Accumulative_new_Captured_CO2_mol: number;
    new_Captured_CO2_gr: number;
    new_Captured_CO2_Kg_m2: number;
    normalized_Captured_CO2_Kg_m2: number;
    Accumulative_captured_CO2_gr: number;
    Accumulative_captured_CO2_Kg_m2: number;
    new_Energy_consumption_Wh: number;
    Accumultive_Energy_consumption_Wh: number;
    New_e_mol_s: number;
    New_e_mol: number;
    Accumultive_electrone_mol: number;
    new_e_CO2: number;
    accumlated_new_Captured_CO2_mol: number;
    accumlated_e_CO2: number;
    IVI_Time: number;
    IVI_Current_A: number;
    IVI_Volt_V: number;
    trial_number: number;
    trial_run: number;
    trial_string_comment: string;
    trial: string;
    trial_run_2: number;
    trial_run_3: number;
    trial_run_4: number;
    mean_CO2_removed_ppm: number;
    // cycle: string | number;
    Cycle: number | string;
    CO2_removal_percent_1_mean: number;
    CO2_removal_percent_2_std: number;
    Capture_rate_Kg_m2_Year_1_mean: number;
    Capture_rate_Kg_m2_Year_2_std: number;
    CO2_removed_ppm_1_mean: number;
    CO2_removed_ppm_2_std: number;
    Energy_consumption_MWh_t_1_mean: number;
    Energy_consumption_MWh_t_2_std: number;
    ASR_ohm_cm_2_mean: number;
    ASR_ohm_cm_2_std: number;
    IVI_Energy_consumption_MWh_t_mean: number;
    IVI_Energy_consumption_MWh_t_std: number;
    IVI_e_CO2_ratio_mean: number;
    IVI_e_CO2_ratio_std: number;
    IVI_Resistance_ohm_mean: number;
    IVI_Resistance_ohm_std: number;
    Co2_enriched_ppm: number;
  }

  interface TrialDataCyclePacket
    extends RowDataPacket,
      OkPacket,
      ResultSetHeader,
      RowDataPacket,
      RowDataPacket,
      OkPacket {
    //Previously TestData
    mean_CO2_removed_ppm: number;
    cycle: string | number;
    trial: string;
  }

  type TrialSpecs = {
    trial: string;
    trial_number: number;
    trial_run: number;
    trial_string_comment: string;
  };

  type TrialData = {
    Cycle: string[] | number[];
    CO2_removal_percent_1_mean: number[];
    CO2_removal_percent_2_std: number[];
    Capture_rate_Kg_m2_Year_1_mean: number[];
    Capture_rate_Kg_m2_Year_2_std: number[];
    CO2_removed_ppm_1_mean: number[];
    CO2_removed_ppm_2_std: number[];
    Energy_consumption_MWh_t_1_mean: number[];
    Energy_consumption_MWh_t_2_std: number[];
    ASR_ohm_cm_2_mean: number[];
    ASR_ohm_cm_2_std: number[];
    IVI_Energy_consumption_MWh_t_mean: number[];
    IVI_Energy_consumption_MWh_t_std: number[];
    IVI_e_CO2_ratio_mean: number[];
    IVI_e_CO2_ratio_std: number[];
    IVI_Resistance_ohm_mean: number[];
    IVI_Resistance_ohm_std: number[];
    Co2_enriched_ppm: number[];
    CO2_depleted: number[];
    FL_CA_L_min: number[];
    FL_An_L_min: number[];
    Volt_mv: number[];
    Current_ma: number[];
    T_DEW_An_C: number[];
    T_line_An_C: number[];
    T_DEW_Ca_C: number[];
    T_line_Ca_C: number[];
    RH_An_percent: number[];
    RH_Ca_percent: number[];
    Dp_An_mbar: number[];
    Dp_Ca_mbar: number[];
    T_Cell_C: number[];
    initial_CO2_ppm: number[];
    Power_W: number[];
    CO2_removed_ppm: number[];
    CO2_removal_percent: number[];
    Capture_rate_Kg_m2_Year: number[];
    Energy_consumption_MWh_t: number[];
    e_CO2_ratio: number[];
    Time_series: number[];
    Time_series_Hour: number[];
    new_Captured_CO2_mol: number[];
    Accumulative_new_Captured_CO2_mol: number[];
    new_Captured_CO2_gr: number[];
    new_Captured_CO2_Kg_m2: number[];
    Accumulative_captured_CO2_gr: number[];
    Accumulative_captured_CO2_Kg_m2: number[];
    new_Energy_consumption_Wh: number[];
    Accumultive_Energy_consumption_Wh: number[];
    New_e_mol_s: number[];
    New_e_mol: number[];
    Accumultive_electrone_mol: number[];
    new_e_CO2: number[];
    accumlated_new_Captured_CO2_mol: number[];
    IVI_Time: number[];
    IVI_Current_A: number[];
    IVI_Volt_V: number[];
    normalized_Captured_CO2_Kg_m2: number[];
    accumlated_e_CO2: number[];
    mean_CO2_removed_ppm: number[];

    // cycle: string[] | number[];
  };

  type PartialTrialData = Partial<TrialData>;
  type Trial = {
    trial: string;
    trial_number?: number;
    trial_run?: number;
    trial_string_comment?: string;
    data: PartialTrialData;
  };

  type TestDataArr = Partial<Record<keyof TestData, number[]>>;
}

// type NormalizedTestDataTimeSeries = {
//   trial: string;
//   trial_number: number;
//   trial_run: number;
//   trial_run_2: number;
//   trial_run_3: number;
//   trial_run_4: number;
//   trial_string_comment: string;
//   data: {
//     Co2_enriched_ppm: number[];
//     CO2_depleted: number[];
//     FL_CA_L_min: number[];
//     FL_An_L_min: number[];
//     Volt_mv: number[];
//     Current_ma: number[];
//     T_DEW_An_C: number[];
//     T_line_An_C: number[];
//     T_DEW_Ca_C: number[];
//     T_line_Ca_C: number[];
//     RH_An_percent: number[];
//     RH_Ca_percent: number[];
//     Dp_An_mbar: number[];
//     Dp_Ca_mbar: number[];
//     T_Cell_C: number[];
//     initial_CO2_ppm: number[];
//     Power_W: number[];
//     CO2_removed_ppm: number[];
//     CO2_removal_percent: number[];
//     Capture_rate_Kg_m2_Year: number[];
//     Energy_consumption_MWh_t: number[];
//     e_CO2_ratio: number[];
//     Time_series: number[];
//     Time_series_Hour: number[];
//     new_Captured_CO2_mol: number[];
//     Accumulative_new_Captured_CO2_mol: number[];
//     new_Captured_CO2_gr: number[];
//     new_Captured_CO2_Kg_m2: number[];
//     Accumulative_captured_CO2_gr: number[];
//     Accumulative_captured_CO2_Kg_m2: number[];
//     new_Energy_consumption_Wh: number[];
//     Accumultive_Energy_consumption_Wh: number[];
//     New_e_mol_s: number[];
//     New_e_mol: number[];
//     Accumultive_electrone_mol: number[];
//     new_e_CO2: number[];
//     accumlated_new_Captured_CO2_mol: number[];
//     IVI_Time: number[];
//     IVI_Current_A: number[];
//     IVI_Volt_V: number[];
//     normalized_Captured_CO2_Kg_m2: number[];
//     accumlated_e_CO2: number[];
//   };
// };

// id: number;
// Co2_enriched_ppm: number;
// CO2_depleted: number;
// FL_CA_L_min: number;
// FL_An_L_min: number;
// Volt_mv: number;
// Current_ma: number;
// T_DEW_An_C: number;
// T_line_An_C: number;
// T_DEW_Ca_C: number;
// T_line_Ca_C: number;
// RH_An_percent: number;
// RH_Ca_percent: number;
// Dp_An_mbar: number;
// Dp_Ca_mbar: number;
// T_Cell_C: number;
// initial_CO2_ppm: number;
// Power_W: number;
// CO2_removed_ppm: number;
// CO2_removal_percent: number;
// Capture_rate_Kg_m2_Year: number;
// Energy_consumption_MWh_t: number;
// e_CO2_ratio: number;
// Time_series: number;
// Time_series_Hour: number;
// Cycle: string;
// new_Captured_CO2_mol: number;
// Accumulative_new_Captured_CO2_mol: number;
// new_Captured_CO2_gr: number;
// new_Captured_CO2_Kg_m2: number;
// normalized_Captured_CO2_Kg_m2: number;
// Accumulative_captured_CO2_gr: number;
// Accumulative_captured_CO2_Kg_m2: number;
// new_Energy_consumption_Wh: number;
// Accumultive_Energy_consumption_Wh: number;
// New_e_mol_s: number;
// New_e_mol: number;
// Accumultive_electrone_mol: number;
// new_e_CO2: number;
// accumlated_new_Captured_CO2_mol: number;
// accumlated_e_CO2: number;
// IVI_Time: number;
// IVI_Current_A: number;
// IVI_Volt_V: number;
// trial_number: number;
// trial_run: number;
// trial_string_comment: string;
// trial: string;
