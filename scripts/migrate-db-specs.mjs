import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ELECTRIC_BOOMLIFT_MODELS = {
  "LTQE1214": [
    { "label": "---DIMENSIONS---", "value": "" },
    { "label": "Max. Working Height (m)", "value": "14" },
    { "label": "Max. Platform Height (m)", "value": "12" },
    { "label": "Max. Horizontal Reach (m)", "value": "8" },
    { "label": "Max. Up & Over Clearance (m)", "value": "5" },
    { "label": "Platform Dimensions — L×W (m)", "value": "1.1 × 0.65" },
    { "label": "Length — Stowed (m)", "value": "5.3" },
    { "label": "Width — Stowed (m)", "value": "2" },
    { "label": "Height — Stowed (m)", "value": "2.05" },
    { "label": "Wheelbase (m)", "value": "2" },
    { "label": "Ground Clearance — Center (m)", "value": "0.2" },
    { "label": "---PRODUCTIVITY---", "value": "" },
    { "label": "Max. Load Capacity (kg)", "value": "230" },
    { "label": "Max. Platform Occupancy", "value": "2" },
    { "label": "Platform Rotation", "value": "±80°" },
    { "label": "Vertical Jib Rotation", "value": "140°" },
    { "label": "Turntable Rotation", "value": "355°" },
    { "label": "Drive Speed — Stowed (km/h)", "value": "3" },
    { "label": "Drive Speed — Raised/Extended (km/h)", "value": "—" },
    { "label": "Gradeability", "value": "0.25" },
    { "label": "Max. Allowable Slope", "value": "3° / 3°" },
    { "label": "Turning Radius — Inside (m)", "value": "2.2" },
    { "label": "Turning Radius — Outside (m)", "value": "—" },
    { "label": "Drive & Steer Mode", "value": "4×2×2" },
    { "label": "Tire Type", "value": "0.59 × 0.19" },
    { "label": "---POWER---", "value": "" },
    { "label": "Power Source", "value": "Lithium Battery" },
    { "label": "Battery", "value": "48V / 320Ah" },
    { "label": "Drive and Steering", "value": "2WD × 2WS" },
    { "label": "Drive Electric Motor Power (kW)", "value": "—" },
    { "label": "Control Voltage", "value": "24V DC" },
    { "label": "Charger", "value": "48V / 50A" },
    { "label": "Weight (kg)", "value": "5500" }
  ],
  "LTQE1416": [
    { "label": "---DIMENSIONS---", "value": "" },
    { "label": "Max. Working Height (m)", "value": "16" },
    { "label": "Max. Platform Height (m)", "value": "14" },
    { "label": "Max. Horizontal Reach (m)", "value": "7.6" },
    { "label": "Max. Up & Over Clearance (m)", "value": "—" },
    { "label": "Platform Dimensions — L×W (m)", "value": "1.53 × 0.76" },
    { "label": "Length — Stowed (m)", "value": "6.58" },
    { "label": "Width — Stowed (m)", "value": "1.76" },
    { "label": "Height — Stowed (m)", "value": "1.98" },
    { "label": "Wheelbase (m)", "value": "2" },
    { "label": "Ground Clearance — Center (m)", "value": "0.2" },
    { "label": "---PRODUCTIVITY---", "value": "" },
    { "label": "Max. Load Capacity (kg)", "value": "230" },
    { "label": "Max. Platform Occupancy", "value": "2" },
    { "label": "Platform Rotation", "value": "±80°" },
    { "label": "Vertical Jib Rotation", "value": "140°" },
    { "label": "Turntable Rotation", "value": "355°" },
    { "label": "Drive Speed — Stowed (km/h)", "value": "5" },
    { "label": "Drive Speed — Raised/Extended (km/h)", "value": "—" },
    { "label": "Gradeability", "value": "0.25" },
    { "label": "Max. Allowable Slope", "value": "3° / 3°" },
    { "label": "Turning Radius — Inside (m)", "value": "2.2" },
    { "label": "Turning Radius — Outside (m)", "value": "—" },
    { "label": "Drive & Steer Mode", "value": "4×2×2" },
    { "label": "Tire Type", "value": "26 × 12-16" },
    { "label": "---POWER---", "value": "" },
    { "label": "Power Source", "value": "Lithium Battery" },
    { "label": "Battery", "value": "48V / 320Ah" },
    { "label": "Drive and Steering", "value": "2WD × 2WS" },
    { "label": "Drive Electric Motor Power (kW)", "value": "—" },
    { "label": "Control Voltage", "value": "24V DC" },
    { "label": "Charger", "value": "48V / 50A" },
    { "label": "Weight (kg)", "value": "6800" }
  ],
  "LTQE1618": [
    { "label": "---DIMENSIONS---", "value": "" },
    { "label": "Max. Working Height (m)", "value": "18" },
    { "label": "Max. Platform Height (m)", "value": "16" },
    { "label": "Max. Horizontal Reach (m)", "value": "9.6" },
    { "label": "Max. Up & Over Clearance (m)", "value": "—" },
    { "label": "Platform Dimensions — L×W (m)", "value": "1.53 × 0.76" },
    { "label": "Length — Stowed (m)", "value": "7.7" },
    { "label": "Width — Stowed (m)", "value": "2.32" },
    { "label": "Height — Stowed (m)", "value": "2.35" },
    { "label": "Wheelbase (m)", "value": "2.28" },
    { "label": "Ground Clearance — Center (m)", "value": "0.28" },
    { "label": "---PRODUCTIVITY---", "value": "" },
    { "label": "Max. Load Capacity (kg)", "value": "230" },
    { "label": "Max. Platform Occupancy", "value": "2" },
    { "label": "Platform Rotation", "value": "±80°" },
    { "label": "Vertical Jib Rotation", "value": "140°" },
    { "label": "Turntable Rotation", "value": "355°" },
    { "label": "Drive Speed — Stowed (km/h)", "value": "5" },
    { "label": "Drive Speed — Raised/Extended (km/h)", "value": "0.8" },
    { "label": "Gradeability", "value": "0.25" },
    { "label": "Max. Allowable Slope", "value": "3° / 3°" },
    { "label": "Turning Radius — Inside (m)", "value": "2.66" },
    { "label": "Turning Radius — Outside (m)", "value": "5.66" },
    { "label": "Drive & Steer Mode", "value": "4×2×2" },
    { "label": "Tire Type", "value": "26 × 12-16" },
    { "label": "---POWER---", "value": "" },
    { "label": "Power Source", "value": "Lithium Battery" },
    { "label": "Battery", "value": "48V / 390Ah" },
    { "label": "Drive and Steering", "value": "2WD × 2WS" },
    { "label": "Drive Electric Motor Power (kW)", "value": "6.5 × 2" },
    { "label": "Control Voltage", "value": "24V DC" },
    { "label": "Charger", "value": "48V / 62A" },
    { "label": "Weight (kg)", "value": "7080" }
  ],
  "LTQE1820": [
    { "label": "---DIMENSIONS---", "value": "" },
    { "label": "Max. Working Height (m)", "value": "20" },
    { "label": "Max. Platform Height (m)", "value": "18" },
    { "label": "Max. Horizontal Reach (m)", "value": "10.8" },
    { "label": "Max. Up & Over Clearance (m)", "value": "9.2" },
    { "label": "Platform Dimensions — L×W (m)", "value": "1.53 × 0.76" },
    { "label": "Length — Stowed (m)", "value": "8.1" },
    { "label": "Width — Stowed (m)", "value": "2.38" },
    { "label": "Height — Stowed (m)", "value": "2.38" },
    { "label": "Wheelbase (m)", "value": "2.6" },
    { "label": "Ground Clearance — Center (m)", "value": "0.3" },
    { "label": "---PRODUCTIVITY---", "value": "" },
    { "label": "Max. Load Capacity (kg)", "value": "230" },
    { "label": "Max. Platform Occupancy", "value": "2" },
    { "label": "Platform Rotation", "value": "±80°" },
    { "label": "Vertical Jib Rotation", "value": "140°" },
    { "label": "Turntable Rotation", "value": "355°" },
    { "label": "Drive Speed — Stowed (km/h)", "value": "5" },
    { "label": "Drive Speed — Raised/Extended (km/h)", "value": "0.8" },
    { "label": "Gradeability", "value": "0.25" },
    { "label": "Max. Allowable Slope", "value": "3° / 3°" },
    { "label": "Turning Radius — Inside (m)", "value": "2.66" },
    { "label": "Turning Radius — Outside (m)", "value": "5.66" },
    { "label": "Drive & Steer Mode", "value": "4×2×2" },
    { "label": "Tire Type", "value": "33 × 12-20" },
    { "label": "---POWER---", "value": "" },
    { "label": "Power Source", "value": "Lithium Battery" },
    { "label": "Battery", "value": "48V / 390Ah" },
    { "label": "Drive and Steering", "value": "2WD × 2WS" },
    { "label": "Drive Electric Motor Power (kW)", "value": "6.5 × 2" },
    { "label": "Control Voltage", "value": "24V DC" },
    { "label": "Charger", "value": "48V / 62A" },
    { "label": "Weight (kg)", "value": "8080" }
  ],
  "LTQE2022": [
    { "label": "---DIMENSIONS---", "value": "" },
    { "label": "Max. Working Height (m)", "value": "22" },
    { "label": "Max. Platform Height (m)", "value": "20" },
    { "label": "Max. Horizontal Reach (m)", "value": "12.3" },
    { "label": "Max. Up & Over Clearance (m)", "value": "9.2" },
    { "label": "Platform Dimensions — L×W (m)", "value": "1.53 × 0.76" },
    { "label": "Length — Stowed (m)", "value": "9.2" },
    { "label": "Width — Stowed (m)", "value": "2.38" },
    { "label": "Height — Stowed (m)", "value": "2.34" },
    { "label": "Wheelbase (m)", "value": "2.6" },
    { "label": "Ground Clearance — Center (m)", "value": "0.3" },
    { "label": "---PRODUCTIVITY---", "value": "" },
    { "label": "Max. Load Capacity (kg)", "value": "230" },
    { "label": "Max. Platform Occupancy", "value": "2" },
    { "label": "Platform Rotation", "value": "±80°" },
    { "label": "Vertical Jib Rotation", "value": "140°" },
    { "label": "Turntable Rotation", "value": "355°" },
    { "label": "Drive Speed — Stowed (km/h)", "value": "5" },
    { "label": "Drive Speed — Raised/Extended (km/h)", "value": "—" },
    { "label": "Gradeability", "value": "0.25" },
    { "label": "Max. Allowable Slope", "value": "3° / 3°" },
    { "label": "Turning Radius — Inside (m)", "value": "2.66" },
    { "label": "Turning Radius — Outside (m)", "value": "—" },
    { "label": "Drive & Steer Mode", "value": "4×2×2" },
    { "label": "Tire Type", "value": "33 × 12-20" },
    { "label": "---POWER---", "value": "" },
    { "label": "Power Source", "value": "Lithium Battery" },
    { "label": "Battery", "value": "48V / 390Ah" },
    { "label": "Drive and Steering", "value": "2WD × 2WS" },
    { "label": "Drive Electric Motor Power (kW)", "value": "6.5 × 2" },
    { "label": "Control Voltage", "value": "24V DC" },
    { "label": "Charger", "value": "48V / 62A" },
    { "label": "Weight (kg)", "value": "8200" }
  ]
};

const REACH_TRUCK_MODELS = {
  "FRB12": [
    { "label": "---GENERAL---", "value": "" },
    { "label": "Power Type", "value": "Full-Electric" },
    { "label": "Capacity (kg)", "value": "1200" },
    { "label": "Max. Lifting Height (H2) (mm)", "value": "3000" },
    { "label": "Load Center (C) (mm)", "value": "500" },
    { "label": "---DIMENSIONS---", "value": "" },
    { "label": "Fork Dimensions (mm)", "value": "1070 × 100 × 35" },
    { "label": "Fork Spread (mm)", "value": "210 – 705" },
    { "label": "Reach Distance (mm)", "value": "555" },
    { "label": "Overall Length Including Fork (L) (mm)", "value": "2245" },
    { "label": "Overall Width (S) (mm)", "value": "1090" },
    { "label": "Height — Mast Lowered (H1) (mm)", "value": "2100" },
    { "label": "Max. Height When Fork is Lifting (H) (mm)", "value": "3965" },
    { "label": "Turning Radius (Wa) (mm)", "value": "1670" },
    { "label": "Height of Overhead Guards (mm)", "value": "2280" },
    { "label": "Min. Stacking Aisle (mm)", "value": "2700" },
    { "label": "Min. Ground Clearance (mm)", "value": "70" },
    { "label": "Total Weight (kg)", "value": "2000" },
    { "label": "---WHEELS & CHASSIS---", "value": "" },
    { "label": "Wheel Type", "value": "PU Solid Tire" },
    { "label": "Front Wheel (mm)", "value": "Ø210 × 85" },
    { "label": "Balance Wheel (mm)", "value": "Ø150 × 50" },
    { "label": "---POWER & CONTROL---", "value": "" },
    { "label": "Battery", "value": "Lithium" },
    { "label": "Battery Capacity (V/Ah)", "value": "24 / 280" },
    { "label": "Charger — Intelligent (V/A)", "value": "24 / 40" },
    { "label": "Driving Motor (kW)", "value": "2.5" },
    { "label": "Lifting Motor (kW)", "value": "3" },
    { "label": "Drive Controlling Type", "value": "2.5 (AC)" },
    { "label": "Walking Adjustable Type", "value": "Holzer type accelerator" },
    { "label": "Walkie Brake", "value": "Electromagnetic" }
  ],
  "FRB15": [
    { "label": "---GENERAL---", "value": "" },
    { "label": "Power Type", "value": "Full-Electric" },
    { "label": "Capacity (kg)", "value": "1500" },
    { "label": "Max. Lifting Height (H2) (mm)", "value": "3000" },
    { "label": "Load Center (C) (mm)", "value": "500" },
    { "label": "---DIMENSIONS---", "value": "" },
    { "label": "Fork Dimensions (mm)", "value": "1070 × 100 × 35" },
    { "label": "Fork Spread (mm)", "value": "210 – 705" },
    { "label": "Reach Distance (mm)", "value": "555" },
    { "label": "Overall Length Including Fork (L) (mm)", "value": "2245" },
    { "label": "Overall Width (S) (mm)", "value": "1090" },
    { "label": "Height — Mast Lowered (H1) (mm)", "value": "2100" },
    { "label": "Max. Height When Fork is Lifting (H) (mm)", "value": "3965" },
    { "label": "Turning Radius (Wa) (mm)", "value": "1670" },
    { "label": "Height of Overhead Guards (mm)", "value": "2280" },
    { "label": "Min. Stacking Aisle (mm)", "value": "2700" },
    { "label": "Min. Ground Clearance (mm)", "value": "70" },
    { "label": "Total Weight (kg)", "value": "2200" },
    { "label": "---WHEELS & CHASSIS---", "value": "" },
    { "label": "Wheel Type", "value": "PU Solid Tire" },
    { "label": "Front Wheel (mm)", "value": "Ø210 × 85" },
    { "label": "Balance Wheel (mm)", "value": "Ø150 × 50" },
    { "label": "---POWER & CONTROL---", "value": "" },
    { "label": "Battery", "value": "Lithium" },
    { "label": "Battery Capacity (V/Ah)", "value": "24 / 280" },
    { "label": "Charger — Intelligent (V/A)", "value": "24 / 40" },
    { "label": "Driving Motor (kW)", "value": "2.5" },
    { "label": "Lifting Motor (kW)", "value": "3" },
    { "label": "Drive Controlling Type", "value": "2.5 (AC)" },
    { "label": "Walking Adjustable Type", "value": "—" },
    { "label": "Walkie Brake", "value": "—" }
  ],
  "FRB20": [
    { "label": "---GENERAL---", "value": "" },
    { "label": "Power Type", "value": "Full-Electric" },
    { "label": "Capacity (kg)", "value": "2000" },
    { "label": "Max. Lifting Height (H2) (mm)", "value": "3000" },
    { "label": "Load Center (C) (mm)", "value": "500" },
    { "label": "---DIMENSIONS---", "value": "" },
    { "label": "Fork Dimensions (mm)", "value": "1070 × 122 × 40" },
    { "label": "Fork Spread (mm)", "value": "270 – 705" },
    { "label": "Reach Distance (mm)", "value": "640" },
    { "label": "Overall Length Including Fork (L) (mm)", "value": "2315" },
    { "label": "Overall Width (S) (mm)", "value": "1090" },
    { "label": "Height — Mast Lowered (H1) (mm)", "value": "2100" },
    { "label": "Max. Height When Fork is Lifting (H) (mm)", "value": "3965" },
    { "label": "Turning Radius (Wa) (mm)", "value": "1820" },
    { "label": "Height of Overhead Guards (mm)", "value": "2280" },
    { "label": "Min. Stacking Aisle (mm)", "value": "2800" },
    { "label": "Min. Ground Clearance (mm)", "value": "70" },
    { "label": "Total Weight (kg)", "value": "2250" },
    { "label": "---WHEELS & CHASSIS---", "value": "" },
    { "label": "Wheel Type", "value": "PU Solid Tire" },
    { "label": "Front Wheel (mm)", "value": "Ø210 × 85" },
    { "label": "Balance Wheel (mm)", "value": "Ø150 × 50" },
    { "label": "---POWER & CONTROL---", "value": "" },
    { "label": "Battery", "value": "Lithium" },
    { "label": "Battery Capacity (V/Ah)", "value": "24 / 280" },
    { "label": "Charger — Intelligent (V/A)", "value": "24 / 40" },
    { "label": "Driving Motor (kW)", "value": "2.5" },
    { "label": "Lifting Motor (kW)", "value": "3" },
    { "label": "Drive Controlling Type", "value": "2.5 (AC)" },
    { "label": "Walking Adjustable Type", "value": "—" },
    { "label": "Walkie Brake", "value": "—" }
  ]
};

async function migrate() {
  console.log("Starting specifications cleanup migration...");

  // 1. Migrate articulated-boomlift-electric
  console.log("\nProcessing Articulated Boom Lift - Electric...");
  const { data: electricProduct, error: electricError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', 'articulated-boomlift-electric')
    .single();

  if (electricError || !electricProduct) {
    console.error("Error finding product 'articulated-boomlift-electric':", electricError?.message);
  } else {
    for (const [modelName, specs] of Object.entries(ELECTRIC_BOOMLIFT_MODELS)) {
      console.log(`Updating specs for model: ${modelName}`);
      const { error: updateError } = await supabase
        .from('product_models')
        .update({ specs })
        .eq('product_id', electricProduct.id)
        .eq('model_name', modelName);

      if (updateError) {
        console.error(`Failed to update ${modelName}:`, updateError.message);
      } else {
        console.log(`Successfully updated ${modelName}`);
      }
    }
  }

  // 2. Migrate electric-reach-trucks
  console.log("\nProcessing Electric Reach Trucks...");
  const { data: trucksProduct, error: trucksError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', 'electric-reach-trucks')
    .single();

  if (trucksError || !trucksProduct) {
    console.error("Error finding product 'electric-reach-trucks':", trucksError?.message);
  } else {
    for (const [modelName, specs] of Object.entries(REACH_TRUCK_MODELS)) {
      console.log(`Updating specs for model: ${modelName}`);
      const { error: updateError } = await supabase
        .from('product_models')
        .update({ specs })
        .eq('product_id', trucksProduct.id)
        .eq('model_name', modelName);

      if (updateError) {
        console.error(`Failed to update ${modelName}:`, updateError.message);
      } else {
        console.log(`Successfully updated ${modelName}`);
      }
    }
  }

  console.log("\nMigration completed!");
}

migrate();
