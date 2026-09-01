export type UnitCategory = 
  | 'length' 
  | 'weight' 
  | 'temperature' 
  | 'area' 
  | 'volume' 
  | 'speed' 
  | 'data' 
  | 'time'
  | 'energy'
  | 'power';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  toBase: (val: number) => number; // convert to base unit
  fromBase: (baseVal: number) => number; // convert from base unit
}

export const UNIT_CATEGORIES: Record<UnitCategory, { name: string; baseUnit: string; units: UnitDefinition[] }> = {
  length: {
    name: 'Length & Distance',
    baseUnit: 'meter',
    units: [
      { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: v => v / 1000, fromBase: b => b * 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: v => v / 100, fromBase: b => b * 100 },
      { id: 'm', name: 'Meter', symbol: 'm', toBase: v => v, fromBase: b => b },
      { id: 'km', name: 'Kilometer', symbol: 'km', toBase: v => v * 1000, fromBase: b => b / 1000 },
      { id: 'in', name: 'Inch', symbol: 'in', toBase: v => v * 0.0254, fromBase: b => b / 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', toBase: v => v * 0.3048, fromBase: b => b / 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', toBase: v => v * 0.9144, fromBase: b => b / 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', toBase: v => v * 1609.344, fromBase: b => b / 1609.344 },
    ],
  },
  weight: {
    name: 'Weight & Mass',
    baseUnit: 'kilogram',
    units: [
      { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: v => v / 1e6, fromBase: b => b * 1e6 },
      { id: 'g', name: 'Gram', symbol: 'g', toBase: v => v / 1000, fromBase: b => b * 1000 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: v => v, fromBase: b => b },
      { id: 'ton', name: 'Metric Ton', symbol: 't', toBase: v => v * 1000, fromBase: b => b / 1000 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', toBase: v => v * 0.0283495, fromBase: b => b / 0.0283495 },
      { id: 'lb', name: 'Pound', symbol: 'lb', toBase: v => v * 0.453592, fromBase: b => b / 0.453592 },
    ],
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'celsius',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: v => v, fromBase: b => b },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: v => (v - 32) * (5 / 9), fromBase: b => b * (9 / 5) + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: v => v - 273.15, fromBase: b => b + 273.15 },
    ],
  },
  area: {
    name: 'Area',
    baseUnit: 'squareMeter',
    units: [
      { id: 'sqm', name: 'Square Meter', symbol: 'm²', toBase: v => v, fromBase: b => b },
      { id: 'sqft', name: 'Square Foot', symbol: 'ft²', toBase: v => v * 0.092903, fromBase: b => b / 0.092903 },
      { id: 'sqyd', name: 'Square Yard', symbol: 'yd²', toBase: v => v * 0.836127, fromBase: b => b / 0.836127 },
      { id: 'acre', name: 'Acre', symbol: 'ac', toBase: v => v * 4046.86, fromBase: b => b / 4046.86 },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', toBase: v => v * 10000, fromBase: b => b / 10000 },
      { id: 'sqkm', name: 'Square Kilometer', symbol: 'km²', toBase: v => v * 1e6, fromBase: b => b / 1e6 },
    ],
  },
  volume: {
    name: 'Volume & Capacity',
    baseUnit: 'liter',
    units: [
      { id: 'ml', name: 'Milliliter', symbol: 'mL', toBase: v => v / 1000, fromBase: b => b * 1000 },
      { id: 'l', name: 'Liter', symbol: 'L', toBase: v => v, fromBase: b => b },
      { id: 'cum', name: 'Cubic Meter', symbol: 'm³', toBase: v => v * 1000, fromBase: b => b / 1000 },
      { id: 'gal_us', name: 'US Gallon', symbol: 'gal', toBase: v => v * 3.78541, fromBase: b => b / 3.78541 },
      { id: 'fl_oz', name: 'Fluid Ounce (US)', symbol: 'fl oz', toBase: v => v * 0.0295735, fromBase: b => b / 0.0295735 },
    ],
  },
  speed: {
    name: 'Speed & Velocity',
    baseUnit: 'mps',
    units: [
      { id: 'mps', name: 'Meters per second', symbol: 'm/s', toBase: v => v, fromBase: b => b },
      { id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', toBase: v => v / 3.6, fromBase: b => b * 3.6 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', toBase: v => v * 0.44704, fromBase: b => b / 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', toBase: v => v * 0.514444, fromBase: b => b / 0.514444 },
    ],
  },
  data: {
    name: 'Digital Data Storage',
    baseUnit: 'byte',
    units: [
      { id: 'b', name: 'Bit', symbol: 'b', toBase: v => v / 8, fromBase: b => b * 8 },
      { id: 'B', name: 'Byte', symbol: 'B', toBase: v => v, fromBase: b => b },
      { id: 'KB', name: 'Kilobyte', symbol: 'KB', toBase: v => v * 1024, fromBase: b => b / 1024 },
      { id: 'MB', name: 'Megabyte', symbol: 'MB', toBase: v => v * Math.pow(1024, 2), fromBase: b => b / Math.pow(1024, 2) },
      { id: 'GB', name: 'Gigabyte', symbol: 'GB', toBase: v => v * Math.pow(1024, 3), fromBase: b => b / Math.pow(1024, 3) },
      { id: 'TB', name: 'Terabyte', symbol: 'TB', toBase: v => v * Math.pow(1024, 4), fromBase: b => b / Math.pow(1024, 4) },
      { id: 'PB', name: 'Petabyte', symbol: 'PB', toBase: v => v * Math.pow(1024, 5), fromBase: b => b / Math.pow(1024, 5) },
    ],
  },
  time: {
    name: 'Time',
    baseUnit: 'second',
    units: [
      { id: 'ms', name: 'Millisecond', symbol: 'ms', toBase: v => v / 1000, fromBase: b => b * 1000 },
      { id: 's', name: 'Second', symbol: 's', toBase: v => v, fromBase: b => b },
      { id: 'min', name: 'Minute', symbol: 'min', toBase: v => v * 60, fromBase: b => b / 60 },
      { id: 'hr', name: 'Hour', symbol: 'hr', toBase: v => v * 3600, fromBase: b => b / 3600 },
      { id: 'day', name: 'Day', symbol: 'd', toBase: v => v * 86400, fromBase: b => b / 86400 },
      { id: 'week', name: 'Week', symbol: 'wk', toBase: v => v * 604800, fromBase: b => b / 604800 },
      { id: 'yr', name: 'Year (365d)', symbol: 'yr', toBase: v => v * 31536000, fromBase: b => b / 31536000 },
    ],
  },
  energy: {
    name: 'Energy',
    baseUnit: 'joule',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', toBase: v => v, fromBase: b => b },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', toBase: v => v * 1000, fromBase: b => b / 1000 },
      { id: 'cal', name: 'Gram Calorie', symbol: 'cal', toBase: v => v * 4.184, fromBase: b => b / 4.184 },
      { id: 'kcal', name: 'Kilocalorie (Food)', symbol: 'kcal', toBase: v => v * 4184, fromBase: b => b / 4184 },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', toBase: v => v * 3600, fromBase: b => b / 3600 },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', toBase: v => v * 3.6e6, fromBase: b => b / 3.6e6 },
    ],
  },
  power: {
    name: 'Power',
    baseUnit: 'watt',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', toBase: v => v, fromBase: b => b },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', toBase: v => v * 1000, fromBase: b => b / 1000 },
      { id: 'hp', name: 'Horsepower (metric)', symbol: 'hp', toBase: v => v * 735.49875, fromBase: b => b / 735.49875 },
    ],
  },
};

export function convertUnit(
  category: UnitCategory,
  fromUnitId: string,
  toUnitId: string,
  value: number
): { result: number; formula: string } {
  const cat = UNIT_CATEGORIES[category];
  if (!cat) return { result: 0, formula: '' };

  const fromUnit = cat.units.find(u => u.id === fromUnitId) || cat.units[0];
  const toUnit = cat.units.find(u => u.id === toUnitId) || cat.units[1];

  const baseVal = fromUnit.toBase(value);
  const converted = toUnit.fromBase(baseVal);

  const formula = `1 ${fromUnit.symbol} = ${(toUnit.fromBase(fromUnit.toBase(1))).toPrecision(6)} ${toUnit.symbol}`;

  return {
    result: Number(converted.toFixed(6)),
    formula,
  };
}
