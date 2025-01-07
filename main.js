const fs = require("fs");

function readJSONFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}

/**
 * Function that returns the percentage efficiency value of a substat as a
 * helper for `doEfficiencyCalculation`, so that the code is more readable
 * @param {number} min minimum value of the substat
 * @param {number} max maximum value of the substat
 * @param {number} value the obtained value
 * @param {string} substatName the substat that is being calculated
 */
function getEfficiencyValue(min, max, value, substatName) {
  let percentageEfficiencyValue, substatWeight;

  // Since flat stats have no decimal values, but the other stats do
  // we need different cases for both
  if (["atk", "hp", "def"].includes(substatName)) {
    // The +1 is to account for the minimum value of the substat as a
    // separate data point, so that there is never a 0% efficiency
    substatWeight = 100 / (max - min + 1);
    percentageEfficiencyValue = (value - min + 1) * substatWeight;
  } else {
    // Multiply by 10 to get rid of the decimal
    substatWeight = 100 / ((max - min) * 10 + 1);
    percentageEfficiencyValue = ((value - min) * 10 + 1) * substatWeight;
  }

  return percentageEfficiencyValue;
}

/**
 * Function to calculate the efficiency of an echo based on the substat data
 * @param {Object} echoSubstatData Min and max rolls of each substat
 * @param {Array} equippedEchoData The data of the currently equipped echo
 */
function doEfficiencyCalculation(echoSubstatData, equippedEchoData) {
  const numSubstats = equippedEchoData.length;
  let aggregatedEfficiency = 0;
  for (let equippedEchoStat of equippedEchoData) {
    let equippedStatName = equippedEchoStat.name,
      equippedStatValue = equippedEchoStat.value;

    let efficiencyValue = getEfficiencyValue(
      echoSubstatData[equippedStatName].min,
      echoSubstatData[equippedStatName].max,
      equippedStatValue,
      equippedStatName
    );

    aggregatedEfficiency += efficiencyValue;
  }

  const efficiency = aggregatedEfficiency / numSubstats;
  return efficiency;
}

async function main() {
  const echoSubstatData = {
    atk: {
      min: 30,
      max: 70,
    },
    hp: {
      min: 320,
      max: 580,
    },
    def: {
      min: 30,
      max: 70,
    },
    "atk%": {
      min: 6.4,
      max: 11.6,
    },
    "hp%": {
      min: 6.4,
      max: 11.6,
    },
    "def%": {
      min: 8.1,
      max: 14.7,
    },
    energy_regen: {
      min: 5.6,
      max: 14.9,
    },
    crit_rate: {
      min: 6.3,
      max: 10.5,
    },
    crit_dmg: {
      min: 12.6,
      max: 21.0,
    },
    basic_atk_dmg_bonus: {
      min: 6.4,
      max: 11.6,
    },
    heavy_atk_dmg_bonus: {
      min: 6.4,
      max: 11.6,
    },
    resonance_skill_dmg_bonus: {
      min: 6.4,
      max: 11.6,
    },
    resonance_liberation_dmg_bonus: {
      min: 6.4,
      max: 11.6,
    },
  };

  let equippedEchoData = await readJSONFile("equippedEchoData.json");

  const echoEfficiency = doEfficiencyCalculation(
    echoSubstatData,
    equippedEchoData
  );

  console.log(`Efficiency: ${echoEfficiency.toFixed(2)}`);
}

main();
