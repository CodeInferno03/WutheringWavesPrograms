/**
 * Function that converts an Array of Objects containing substat roll data
 * into an Object containing substat roll data in the form of
 * `{ substat: roll value }`
 * @param {Array} rolledEchoData
 * @returns Object
 */
function constructEchoRollsObject(rolledEchoData) {
  const echoRollsObject = {};
  for (let substatData of rolledEchoData) {
    echoRollsObject[substatData.name] = substatData.value;
  }
  return echoRollsObject;
}

/**
 * Converts certain terms into uppercase and removes `_` in favor of spaces
 * @param {string} statName the name of the stat
 * @returns string
 */
function formatStatName(statName) {
  const uppercaseTerms = new Set([
    "dmg",
    "hp",
    "hp%",
    "atk",
    "atk%",
    "def",
    "def%",
  ]);

  return statName
    .split("_") // Split the string by '_'
    .map(
      (word) =>
        uppercaseTerms.has(word.toLowerCase())
          ? word.toUpperCase() // Convert specific terms to uppercase
          : word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter
    )
    .join(" "); // Join the words with spaces
}

/**
 * Function to pretty print an Echo's data
 * @param {Object} echoSubstatData The efficiency data of all the substats of an Echo
 * @param {Object} echoData The actual max and min data of all echo substats
 * @param {Array} echoRollData An array containing objects with the rolled values of each substat
 */
function prettyPrintEchoData(echoSubstatData, echoData, echoRollData) {
  console.log(" ".repeat(39) + "ECHO EFFICIENCY" + " ".repeat(39));
  console.log("-".repeat(93));
  console.log(
    `Substat Name${" ".repeat(21)}|Rolled Value${" ".repeat(
      8
    )}|Max Value${" ".repeat(11)}|Efficiency${" ".repeat(15)}`
  );
  console.log("-".repeat(93));

  // constructs an object with the roll data instead of a list for easier parsing
  const echoRollsObject = constructEchoRollsObject(echoRollData);

  for (let echoSubstat in echoSubstatData) {
    if (echoSubstat === "total_echo_efficiency") break;

    let substatLength = echoSubstat.length;

    let substatNameColumn = `${formatStatName(echoSubstat)}${" ".repeat(
      33 - substatLength
    )}`;
    let substatRolledValueColumn = `${echoRollsObject[echoSubstat]}${" ".repeat(
      20 - echoRollsObject[echoSubstat].toString().length
    )}`;
    let substatMaxValueColumn = `${echoData[echoSubstat].max}${" ".repeat(
      20 - echoData[echoSubstat].max.toString().length
    )}`;
    let substatPercentageColumn = `${echoSubstatData[echoSubstat].toFixed(2)}%`;

    let echoTableRow = `${substatNameColumn}|${substatRolledValueColumn}|${substatMaxValueColumn}|${substatPercentageColumn}`;
    console.log(echoTableRow);
  }

  console.log("-".repeat(93));
  // Since echo efficiency doesn't have a rolled or max value, we make a separate case for it
  console.log(
    `Total Echo Efficiency ${" ".repeat(
      95 - 41
    )}${echoSubstatData.total_echo_efficiency.toFixed(2)}%`
  );
  console.log("-".repeat(93));
}

module.exports = prettyPrintEchoData;
