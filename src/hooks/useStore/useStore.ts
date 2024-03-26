import { create } from "zustand";
import { AsyncSliceCtx, asyncSlices } from "zustand-async-slices";
import { devtools } from "zustand/middleware";
import { Store, asyncMethods } from "./types";

export type { Store };

export type StoreCtx = AsyncSliceCtx<Store>;

const MONO_API_KEY = "mono-api-key";
const GOOGLE_TOKENS = "google-tokens";
const SELECTED_MONO_ACCOUNT = "selected-mono-account";

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
        monoAccountId: localStorage.getItem(SELECTED_MONO_ACCOUNT) ?? undefined,
        setAccountMonoAccountId: (monoAccountId) => {
          set({ monoAccountId });
          localStorage.setItem(SELECTED_MONO_ACCOUNT, monoAccountId);
        },
        getMonoAccount: () => {
          const { monoClientInfo, monoAccountId } = get();

          if (!monoAccountId) {
            throw new Error("monoAccountId is not defined");
          }

          if (!monoClientInfo.data) {
            throw new Error("monoClientInfo.data is not defined");
          }

          const account = monoClientInfo.data.accounts.find(
            (acc) => acc.id === monoAccountId
          );

          if (!account) {
            throw new Error("monoAccount is not defined");
          }

          return account;
        },
        monoAuthToken: localStorage.getItem(MONO_API_KEY) ?? undefined,
        setMonoAuthToken: (monoAuthToken) => {
          set({
            monoAccountId: undefined,
            monoAuthToken,
          });
          localStorage.removeItem(SELECTED_MONO_ACCOUNT);

          if (monoAuthToken) {
            localStorage.setItem(MONO_API_KEY, monoAuthToken);
            get().monoClientInfo.execute();
          } else {
            localStorage.removeItem(MONO_API_KEY);
          }
        },
        getMonoAuthToken: () => {
          const { monoAuthToken } = get();

          if (!monoAuthToken) {
            throw new Error("monoAuthToken is not defined");
          }

          return monoAuthToken;
        },
        googleTokens: JSON.parse(localStorage.getItem(GOOGLE_TOKENS) ?? "null"),
        setGoogleTokens: (googleTokens) => {
          set({
            googleTokens,
          });

          localStorage.setItem(GOOGLE_TOKENS, JSON.stringify(googleTokens));
          get().googleProfile.execute();
        },
      }),
      asyncMethods
    )
  )
);
