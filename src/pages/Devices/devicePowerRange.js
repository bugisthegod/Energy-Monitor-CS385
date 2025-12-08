
export const DEVICE_POWER_RANGES = {
air_conditioner: { min: 1000, max: 3000 },
refrigerator: { min: 100, max: 400 },
washing_machine: { min: 500, max: 2000 },
tv: { min: 50, max: 300 },
lighting: { min: 10, max: 100 },
heater: { min: 1500, max: 2500 },  microwave: { min: 800, max: 1500 },
computer: { min: 200, max: 500 },
 dishwasher: { min: 1200, max: 2400 }
};

// generate random power
export function generateRandomPower(deviceType) {
const range = DEVICE_POWER_RANGES[deviceType];
 if (!range) return 0;
 return Math.floor(Math.random() * (range.max - range.min + 1) + range.min);
}