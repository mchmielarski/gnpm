export function or(v1: any, v2: any): boolean;
export function or(v1: any): (v2: any) => boolean;
export function or(v1: any, v2?: any): boolean | ((v2: any) => boolean) {
  if (arguments.length === 1) {
    return (v2_2: any) => or(v1, v2_2);
  }
  return !!v1 || !!v2;
}
