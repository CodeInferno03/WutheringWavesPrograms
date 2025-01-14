const doEchoEfficiencyCalculation = require("./individualEchoEfficiencyCalculator");
const echoPrettyPrint = require('./prettyPrinter');
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
  let individualEchoData = equippedEchoData.echo_data[0].substats;

  const echoEfficiency = doEchoEfficiencyCalculation(
    echoSubstatData,
    individualEchoData,
    1
  );

  echoPrettyPrint(
    echoEfficiency,
    echoSubstatData,
    individualEchoData
  )
}

main();