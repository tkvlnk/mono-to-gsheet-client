import { create } from "zustand";
import {
  StateWithAsyncSlices,
  AsyncSliceCtx,
  asyncSlices,
} from "zustand-async-slices";
import {
  monoStatements,
} from "./asyncMethods/monoStatements";
import { Account, monoClientInfo } from "./asyncMethods/monoClientInfo";
import { googleTokenClient } from "./asyncMethods/googleTokenClient";
import { googleSignIn } from "./asyncMethods/googleSignIn";
import { writeMonoStatementsToGoogleSheet } from "./asyncMethods/writeMonoStatementsToGoogleSheet";
import { googleProfile } from "./asyncMethods/googleProfile";
import { devtools } from "zustand/middleware";
import { googleSignOut } from "./asyncMethods/googleSignOut";

const asyncMethods = {
  monoStatements,
  monoClientInfo,
  googleTokenClient,
  googleSignIn,
  googleSignOut,
  googleProfile,
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
    setMonoAuthToken(monoAuthToken: string): void;
  },
  typeof asyncMethods
>;

export type StoreCtx = AsyncSliceCtx<Store>;

export const useStore = create<Store>()(
  devtools(
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
  )
);
