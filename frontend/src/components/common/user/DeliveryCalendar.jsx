import React, { useMemo, useState } from "react";

const normalizeDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value?.$date || value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const DeliveryCalendar = ({ deliveryDates = [] }) => {
  const today = new Date();
  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = current.getFullYear();
  const month = current.getMonth();
  const monthName = current.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const deliveryDaySet = useMemo(() => {
    const validDates = deliveryDates
      .map((value) => normalizeDate(value))
      .filter(
        (date) =>
          date && date.getFullYear() === year && date.getMonth() === month,
      );

    return new Set(validDates.map((date) => date.getDate()));
  }, [deliveryDates, year, month]);

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  return (
    <div className="rounded-2xl border border-[#EADFD7] bg-white shadow-sm p-6 h-full flex flex-col max-h-[600px] text-[#3B170D]">
      <h2 className="flex justify-center items-center text-xl font-instrument-serif mb-4">
        Deliveries
      </h2>

      <div className="rounded-xl border border-[#EADFD7] bg-[#FDF9F5] p-4 flex-1 max-h-[500px]">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prev}
            className="p-1 hover:bg-[#3B170D]/10 rounded-full transition-colors font-semibold"
          >
            {"<"}
          </button>
          <span className="font-serif text-sm tracking-widest">
            {monthName}
          </span>
          <button
            onClick={next}
            className="p-1 hover:bg-[#3B170D]/10 rounded-full transition-colors font-semibold"
          >
            {">"}
          </button>
        </div>

        <div className="grid grid-cols-7 text-center mb-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="text-xs font-semibold py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1 text-center">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isDelivery = deliveryDaySet.has(day);
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            return (
              <div
                key={day}
                className={`
                  aspect-square flex items-center justify-center rounded-full text-xs cursor-pointer transition-colors
                  ${isDelivery ? "bg-[#3B170D] text-[#FFF3EB] font-bold" : ""}
                  ${isToday && !isDelivery ? "ring-2 ring-[#3B170D]" : ""}
                  ${!isDelivery ? "hover:bg-[#3B170D]/10 text-[#3B170D]" : "hover:bg-[#5A2A1A]"}
                `}
                title={isDelivery ? "Delivery scheduled" : ""}
              >
                {day}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs mt-3 font-serif">{year}</p>
      </div>

      <div className="flex items-center gap-2 mt-3 text-xs">
        <div className="w-3 h-3 rounded-full bg-[#3B170D]" />
        <span>Scheduled delivery</span>
      </div>
    </div>
  );
};

export default DeliveryCalendar;
