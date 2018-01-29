export function isNothing(value: any): boolean {
  return value === undefined || value === null || value !== value;
}
