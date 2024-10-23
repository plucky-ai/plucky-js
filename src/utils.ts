export function getEnv(key: string) {
  return process.env[key];
}

export function average(...values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function sum(...values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0);
}
