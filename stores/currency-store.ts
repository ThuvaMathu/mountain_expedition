import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = "USD" | "INR";

interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;

  // Symbols
  symbols: Record<Currency, string>;
  getSymbol: () => string;

  // Currency values
  values: Partial<Record<Currency, number>>;
  loadCurrency: (values: Partial<Record<Currency, number>>) => void;
  getCurrencyValue: () => number | undefined;

  // Format with symbol and commas
  formatedValue: () => string | undefined;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "USD",

      symbols: {
        USD: "$",
        INR: "₹",
      },

      values: {},

      setCurrency: (currency: Currency) => set({ currency }),

      getSymbol: () => {
        const { currency, symbols } = get();
        return symbols[currency];
      },

      loadCurrency: (values) => set({ values }),

      getCurrencyValue: () => {
        const { currency, values } = get();
        return values[currency];
      },

      formatedValue: () => {
        const { currency, values, symbols } = get();
        const value = values[currency];
        if (value === undefined) return undefined;

        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 0, // no decimals if you want clean whole numbers
        })
          .format(value)
          .replace(/^\D+/, symbols[currency] + " ");
      },
    }),
    {
      name: "currency-storage",
      partialize: (state) => ({
        currency: state.currency,
        values: state.values,
      }),
    }
  )
);
