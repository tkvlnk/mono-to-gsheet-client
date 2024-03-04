import { create } from "zustand";
import { Account } from "../useMonobandApiFacade/getClientInfo";

export type Store = {
  monthIndex?: number;
  setMonthIndex: (monthIndex: number) => void;
  year?: number;
  setYear: (year: number) => void;
  sheet?: {
    id: string;
    name: string;
  };
  setSheet: (sheet: Store["sheet"]) => void;
  account?: Account;
  setAccount: (account: Account) => void;
};

export const useStore = create<Store>((set) => ({
  setMonthIndex: (monthIndex) =>
    set({
      monthIndex,
    }),
  setYear: (year) =>
    set({
      year,
    }),
  setSheet: (sheet) =>
    set({
      sheet,
    }),
  setAccount: (account) => set({ account }),
}));
