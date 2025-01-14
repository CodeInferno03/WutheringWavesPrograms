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
 * @param {number} maxEfficiency The maximum achievable efficiency of an echo, a number between 0 and 1
 */
function doEfficiencyCalculation(
  echoSubstatData,
  equippedEchoData,
  maxEfficiency
) {
  const numSubstats = equippedEchoData.length;
  const substatEfficiencyValues = {};
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

    substatEfficiencyValues[equippedStatName] = efficiencyValue;

    aggregatedEfficiency += efficiencyValue;
  }

  const theoreticalEfficiency = aggregatedEfficiency / numSubstats;
  const efficiency = theoreticalEfficiency * maxEfficiency;
  substatEfficiencyValues.total_echo_efficiency = efficiency;
  return substatEfficiencyValues;
};

module.exports = doEfficiencyCalculation;

// main();
