import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToSentenceCase(input: string): string {
  return input
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

export const calculateBudgetRange = (min: string, max: string) => {
  const minNum = Number.parseFloat(min);
  const maxNum = Number.parseFloat(max);
  const avg = (minNum + maxNum) / 2;

  if (avg < 25000) return "under-25k";
  if (avg < 50000) return "25k-50k";
  if (avg < 100000) return "50k-100k";
  return "over-100k";
};

export const daysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const today = new Date();
  const diff = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, diff);
};

export function decodeId(encodedId: string) {
  const base64String = encodedId.replace(/^.*:/, "");

  try {
    const decoded = atob(base64String);
    return decoded;
  } catch (error) {
    console.error("Error decoding ID:", error);
    return null;
  }
}
