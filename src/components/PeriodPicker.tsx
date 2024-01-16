import { useMemo, useState } from "react";
import {  } from "date-fns";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

export function PeriodPicker() {
  const [monthIndex, setMonthIndex] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const years = useMemo(() => [...Array(5)].reverse(), [])

  const filteredMonthNames = useMemo(() => monthNames.filter((_, monthIndex) => {
    if (year === currentYear) {
      return monthIndex <= currentMonth;
    }

    return true;
  }), [year]);

  return (
    <div className="level is-mobile">
      <div className="level-left">
        <div className="level-item">
          <div className="field">
            <label className="label">
              <span>Рік</span>
            </label>
            <div className="control">
              <div className="select">
                <select
                  value={year}
                  onChange={({ target: { value } }) => setYear(Number(value))}
                >
                  {years.map((_, index) => (
                    <option key={index} value={currentYear - index}>{currentYear - index}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="level-item">
          <div className="field">
            <label className="label">
              <span>Місяць</span>
            </label>
            <div className="control">
              <div className="select">
                <select
                  value={monthIndex}
                  onChange={({ target: { value } }) => setMonthIndex(Number(value))}
                >
                  {filteredMonthNames.map(({ ua }, index) => (
                    <option key={ua} value={index}>{ua}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const monthNames = [
  {
    ua: 'Січень',
    en: 'January'
  },
  {
    ua: 'Лютий',
    en: 'February'
  },
  {
    ua: 'Березень',
    en: 'March'
  },
  {
    ua: 'Квітень',
    en: 'April'
  },
  {
    ua: 'Травень',
    en: 'May'
  },
  {
    ua: 'Червень',
    en: 'June'
  },
  {
    ua: 'Липень',
    en: 'July'
  },
  {
    ua: 'Серпень',
    en: 'August'
  },
  {
    ua: 'Вересень',
    en: 'September'
  },
  {
    ua: 'Жовтень',
    en: 'October'
  },
  {
    ua: 'Листопад',
    en: 'November'
  },
  {
    ua: 'Грудень',
    en: 'December'
  },
];
