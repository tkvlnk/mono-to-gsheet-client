import { createStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { Account } from "../useMonobandApiFacade/getClientInfo";
import constate from "constate";
import { useTokenClientPromise } from "./useTokenClientPromise";

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

const [StoreContext, useStoreApi] = constate(useStoreInitializer);

export function useStore<R>(
  selector: (s: Store) => R,
  eq: (prev: R, next: R) => boolean
) {
  return useStoreWithEqualityFn(useStoreApi(), selector, eq);
}

export { StoreContext };

function useStoreInitializer() {
  const tokenClientPromise = useTokenClientPromise();

  return createStore<Store>((set) => ({
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
}
