import { Account } from "../hooks/useStore/asyncMethods/monoClientInfo";
import { currencyNumberToCode } from "./currencyNumberToCode";

export function accountToStrLabel(account: Account) {
  const type = account.type
    .split("")
    .map((char, i) => (i === 0 ? char.toUpperCase() : char.toLowerCase()))
    .join("");

  const pan = account.maskedPan.map((pan) => pan.slice(-5)).join(", ");

  return [type, currencyNumberToCode(account.currencyCode), pan].join(" ");
}
