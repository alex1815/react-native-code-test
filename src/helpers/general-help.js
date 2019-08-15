// @flow

export function getNameAsString(name: string) {
  const temp = { [name]: null };
  return Object.keys(temp)[0];
}
