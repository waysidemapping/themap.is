export function generateStyle(baseStyleJsonString) {

  // parse anew every time to avoid object references
  const style = JSON.parse(baseStyleJsonString);

  return style;
}