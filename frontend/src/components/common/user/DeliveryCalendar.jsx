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
    <div className="bg-transparent border-2 border-brown rounded-xl p-6 h-full flex flex-col max-h-[600px]">
      <h2 className="flex justify-center items-center text-xl font-instrument-serif text-brown mb-4">
        Deliveries
      </h2>

      <div className="bg-peach/50 rounded-xl p-4 flex-1 max-h-[500px]">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prev}
            className="p-1 hover:bg-charcoal/40 rounded-full transition-colors text-brown font-semibold"
          >
            {"<"}
          </button>
          <span className="font-serif text-brown text-sm tracking-widest">
            {monthName}
          </span>
          <button
            onClick={next}
            className="p-1 hover:bg-charcoal/40 rounded-full transition-colors text-brown font-semibold"
          >
            {">"}
          </button>
        </div>

        <div className="grid grid-cols-7 text-center mb-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="text-xs font-semibold text-brown py-1">
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
                  ${isDelivery ? "bg-charcoal text-peach font-bold" : ""}
                  ${isToday && !isDelivery ? "ring-2 ring-charcoal" : ""}
                  ${!isDelivery ? "hover:bg-brown hover:text-peach text-charcoal" : "hover:bg-charcoal"}
                `}
                title={isDelivery ? "Delivery scheduled" : ""}
              >
                {day}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-brown mt-3 font-serif">{year}</p>
      </div>

      <div className="flex items-center gap-2 mt-3 text-xs text-[#4a2f1f]">
        <div className="w-3 h-3 rounded-full bg-charcoal" />
        <span>Scheduled delivery</span>
      </div>
    </div>
  );
};

export default DeliveryCalendar;
