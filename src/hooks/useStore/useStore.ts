import { create } from "zustand";
import {
  StateWithAsyncSlices,
  AsyncSliceCtx,
  asyncSlices,
} from "zustand-async-slices";
import {
  Statement,
  monoStatements,
} from "./asyncMethods/monoStatements";
import { writeStatementsToSheet } from "../useGoogleApiFacade/writeStatementsToSheet";
import { statementsToColumns } from "../../utils/statementsToColumns";
import { monthNames } from "../../utils/monthNames";
import { Account, monoClientInfo } from "./asyncMethods/monoClientInfo";
import { googleTokenClient } from "./asyncMethods/googleTokenClient";
import { googleAuthTokens } from "./asyncMethods/googleAuthTokens";
import { writeMonoStatementsToGoogleSheet } from "./asyncMethods/writeMonoStatementsToGoogleSheet";

const asyncMethods = {
  monoStatements,
  monoClientInfo,
  googleTokenClient,
  googleAuthTokens,
  writeMonoStatementsToGoogleSheet,
};

export type Store = StateWithAsyncSlices<
  {
    monthIndex?: number;
    setMonthIndex(monthIndex: number): void;
    year?: number;
    setYear(year: number): void;
    sheet?: {
      id: string;
      name: string;
    };
    setSheet(sheet: Store["sheet"]): void;
    account?: Account;
    setAccount(account: Account): void;
    monoAuthToken?: string;
    getMonoAuthToken(): string;
    setMonoAuthToken: (monoAuthToken: string) => void;
  },
  typeof asyncMethods
>;

export type StoreCtx = AsyncSliceCtx<Store>;

export const useStore = create<Store>(
  asyncSlices(
    (set, get) => ({
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
      setMonoAuthToken: (monoAuthToken) => set({ monoAuthToken }),
      getMonoAuthToken: () => {
        const { monoAuthToken } = get();

        if (!monoAuthToken) {
          throw new Error("monoAuthToken is not defined");
        }

        return monoAuthToken;
      },
    }),
    asyncMethods
  )
);
