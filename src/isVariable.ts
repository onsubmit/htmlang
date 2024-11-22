export function getVariableName(string: string): string | undefined {
  const match = string.match(/^{(?<VAR_NAME>\S+)}$/);
  const varName = match?.groups?.['VAR_NAME'];
  return varName;
}
