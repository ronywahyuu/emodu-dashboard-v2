import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatName = (fullName: string) => {
  const parts = fullName.split(' ');
  if (parts.length > 2) {
    return `${parts[0]} ${parts[parts.length - 1]}`;
  }
  return fullName;
};


// text ellipsis 
export const formatTextEllipsis = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}
