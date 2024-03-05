import { create } from "zustand";
import { Account, ClientInfo, getClientInfo } from "../useMonobandApiFacade/getClientInfo";
import {
  Statement,
  getStatements,
} from "../useMonobandApiFacade/getStatements";
import { writeStatementsToSheet } from "../useGoogleApiFacade/writeStatementsToSheet";
import { statementsToColumns } from "../../utils/statementsToColumns";
import { monthNames } from "../../utils/monthNames";

export type Store = {
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
  setMonoAuthToken: (monoAuthToken: string) => void;
  getClientInfo(): Promise<ClientInfo>;
  getStatements(): Promise<Statement[]>;
  writeStatementsToSheet(params: {
    statements: Statement[];
  }): Promise<void>;
};

export const useStore = create<Store>((set, get) => ({
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
  getClientInfo: () => {
    const { monoAuthToken } = get();

    if (!monoAuthToken) {
      throw new Error("monoAuthToken is not defined");
    }

    return getClientInfo.call({
      apiKey: monoAuthToken,
    });
  },
  getStatements: () => {
    const { monoAuthToken, monthIndex, year, account } = get();

    if (!monoAuthToken) {
      throw new Error("monoAuthToken is not defined");
    }

    if (typeof monthIndex === "undefined") {
      throw new Error("monthIndex is not defined");
    }

    if (!year) {
      throw new Error("year is not defined");
    }

    if (!account) {
      throw new Error("account is not defined");
    }

    return getStatements.call(
      {
        apiKey: monoAuthToken,
      },
      {
        account: account.id,
        from: toSeconds(new Date(year, monthIndex, 1)),
        to: toSeconds(new Date(year, monthIndex + 1, 0, 23, 59, -1)),
      }
    );

    function toSeconds(date: Date) {
      return Math.round(date.getTime() / 1000);
    }
  },
  writeStatementsToSheet: ({ statements }) => {
    const { sheet, monthIndex } = get();

    if (!sheet?.id) {
      throw new Error("sheet.id is not defined");
    }

    if (typeof monthIndex === "undefined") {
      throw new Error("monthIndex is not defined");
    }

    return writeStatementsToSheet({
      values: statementsToColumns(statements),
      spreadsheetId: sheet.id,
      tabName: monthNames[monthIndex].code,
    });
  },
}));


