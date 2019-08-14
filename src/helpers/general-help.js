// @flow

export function getNameAsString(growValueCircle: string) {
  const temp = { [growValueCircle]: null };
  return Object.keys(temp)[0];
}
