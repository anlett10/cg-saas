import { cn as cnfast, type ClassValue as CnfastClassValue } from "cnfast";

type ClassValue =
    | CnfastClassValue
    | ((state: any) => string | undefined);

function resolve(value: ClassValue): CnfastClassValue {
    if (typeof value === "function") {
        return value(undefined) ?? "";
    }
    return value;
}

export function cn(...inputs: ClassValue[]): string {
    return cnfast(...inputs.map(resolve));
}
