const currencyMap: Record<string, string> = {
  USD: "$",
  INR: "₹",
  Yen: "¥",
  CAD: "C$",
  SGD: "S$",
  EUR: "€",
  GBP: "£",
  PHP: "₱",
  AUD: "A$",
};
export const useCurrencySymbol = () => {
  const getSymbol = (code: string): string => {
    return currencyMap[code === "Yen" ? code : code.toUpperCase()] || code;
  };

  return { getSymbol };
};
