import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
// Helper to compare objects deeply
export const isEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};
export const refreshJwtExpiration = () => {
  const jwtDataStr = localStorage.getItem("jwt");
  if (!jwtDataStr) return; // No JWT found, so nothing to update

  const jwtData = JSON.parse(jwtDataStr);
  // Add 30 minutes (30 * 60 * 1000 milliseconds) to the current time
  jwtData.exp = Date.now() + 30 * 60 * 1000;

  localStorage.setItem("jwt", JSON.stringify(jwtData));
};
