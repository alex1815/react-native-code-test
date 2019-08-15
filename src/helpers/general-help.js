// @flow

export function getNameAsString(name: string): string {
  const temp: { [string]: null } = { [name]: null };
  return Object.keys(temp)[0];
}
