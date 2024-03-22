import { create } from "zustand";
import { AsyncSliceCtx, asyncSlices } from "zustand-async-slices";
import { devtools } from "zustand/middleware";
import { Store, asyncMethods } from "./types";

export type { Store };

export type StoreCtx = AsyncSliceCtx<Store>;

const MONO_API_KEY = "mono-api-key";
const GOOGLE_TOKENS = "google-tokens";

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
        monoAuthToken: localStorage.getItem(MONO_API_KEY) ?? undefined,
        setMonoAuthToken: (monoAuthToken) => {
          set({ monoAuthToken });
          if (monoAuthToken) {
            try {
              localStorage.setItem(MONO_API_KEY, monoAuthToken);
              get().monoClientInfo.execute();
            } catch {
              /* empty */
            }
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
