/**
 * Returns a random 8-bit value (0 to 255)
 * @param  {number} from - value floor
 * @param  {number} to   - value ceiling
 * @return {number}      - random value between "from" and "to"
 */
function rand8BitValue(from = 0x00, to = 0xFF) {
  // TODO: I suspect the 'to' value isn't being returned due to rounding
  return Math.floor(from + Math.random() * (to - from));
}

/**
 * Formats red, green, and blue values into a RGB Hex String
 * @param  {number} red   - color value int between 0 and 255
 * @param  {number} green - color value int between 0 and 255
 * @param  {number} blue  - color value int between 0 and 255
 * @return {string}       - #RRGGBB formatted web-color
 */
function colorValsToHexString(red, green, blue) {
  // shift red value left by four digits in hexadecimal
  const shiftedRed = red * 0x10000;
  // shift green value left by two digits in hexadecimal
  const shiftedGreen = green * 0x100;
  // sum colors to form a 6-digit RRGGBB hex value
  const rgb = shiftedRed + shiftedGreen + blue;
  // return as 7-character #RRGGBB formatted string
  return `#${rgb.toString(16).padStart(6, '0')}`;
}

/**
 * Generate a randomized grass-green color
 * @return {string} - #RRGGBB hex color code
 */
export function randGrassColor() {
  const red = rand8BitValue(0x00, 0x40);
  const green = rand8BitValue(0x40, 0xC0);
  const blue = rand8BitValue(0x00, 0x40);
  return colorValsToHexString(red, green, blue);
}

/**
 * Generate a randomized cloud-blue color
 * @return {string} - #RRGGBB hex color code
 */
export function randCloudColor() {
  const red = rand8BitValue(0xA0, 0xE0);
  const green = red;
  const blue = rand8BitValue(0xE0, 0xFF);
  return colorValsToHexString(red, green, blue);
}
