import { useLayoutEffect, useMemo } from "react";
import {  } from "date-fns";
import { useStore } from "../hooks/useStore";
import { monthNames } from "../utils/monthNames";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

export function PeriodPicker() {
  const monthIndex = useStore((state) => state.monthIndex);
  const setMonthIndex = useStore((state) => state.setMonthIndex);
  const year = useStore((state) => state.year);
  const setYear = useStore((state) => state.setYear);

  const years = useMemo(() => [...Array(5)].reverse(), [])

  useLayoutEffect(() => {
    setMonthIndex(currentMonth);
  }, [setMonthIndex]);

  useLayoutEffect(() => {
    setYear(currentYear);
  }, [setYear]);

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
                  onSelect={(e) => console.log('select', e)}
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

