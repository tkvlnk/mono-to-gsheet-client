import { useStore } from "../hooks/useStore";
import { monthNames } from "../utils/monthNames";

export function ProcessingBar() {
  const monthIndex = useStore(s => s.monthIndex);
  const year = useStore(s => s.year);
  const accountType = useStore(s => s.account?.type);
  const sheetName = useStore(s => s.sheet?.name);
  const sheetId = useStore(s => s.sheet?.id);
  
console.table({monthIndex, year, accountType, sheetName, sheetId})

  if (typeof monthIndex === 'undefined' || !year || !accountType || !sheetName || !sheetId) {
    return;
  }

  return (
    <div>
      <div className="block">Імпортувати дані по рахунку {accountType} за {monthNames[monthIndex].ua} {year} в таблицю {sheetName} (id: {sheetId})</div>
      <button className='block button is-primary'>Підтвердити</button>
    </div>
  );
}
