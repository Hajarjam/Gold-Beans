import React, { useState } from 'react';

// Fake upcoming delivery dates
const deliveryDays = [28];

const DeliveryCalendar = () => {
  const [current, setCurrent] = useState(new Date(2026, 1, 1)); // Feb 2026

  const year  = current.getFullYear();
  const month = current.getMonth();
  const monthName  = current.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay(); // 0=Sun
  const offset      = firstDay === 0 ? 6 : firstDay - 1; // Mon-based

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  return (
    <div className="bg-transparent border-2 border-brown rounded-xl p-6 h-full flex flex-col">
      <h2 className="flex justify-center items-center text-xl font-instrument-serif text-brown mb-4">Deliveries</h2>

      <div className="bg-[#77523C]/45 rounded-xl p-4 flex-1">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={prev} className="p-1 hover:bg-[#d4a574]/40 rounded-full transition-colors text-[#1a0f0a] font-semibold">
            ←
          </button>
          <span className="font-serif text-[#1a0f0a] text-sm tracking-widest">· {monthName} ·</span>
          <button onClick={next} className="p-1 hover:bg-[#d4a574]/40 rounded-full transition-colors text-[#1a0f0a] font-semibold">
            →
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 text-center mb-1">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} className="text-xs font-semibold text-[#4a2f1f] py-1">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isDelivery = deliveryDays.includes(day);
            const isToday = day === 10 && month === 1 && year === 2026;
            return (
              <div
                key={day}
                className={`
                  aspect-square flex items-center justify-center rounded-full text-xs cursor-pointer transition-colors
                  ${isDelivery ? 'bg-[#1a0f0a] text-[#f5f0e8] font-bold' : ''}
                  ${isToday && !isDelivery ? 'ring-2 ring-charcoal' : ''}
                  ${!isDelivery ? 'hover:bg-brown hover:text-peach text-charcoal' : 'hover:bg-charcoal'}
                `}
                title={isDelivery ? '📦 Delivery scheduled' : ''}
              >
                {day}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-[#4a2f1f] mt-3 font-serif">· {year} ·</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-[#4a2f1f]">
        <div className="w-3 h-3 rounded-full bg-[#1a0f0a]" />
        <span>Scheduled delivery</span>
      </div>

      <button className="mt-3 w-full py-2 border-2 border-[#1a0f0a] text-[#1a0f0a] rounded-lg hover:bg-[#d4a574]/30 transition-colors text-sm font-serif">
        View more
      </button>
    </div>
  );
};

export default DeliveryCalendar;
