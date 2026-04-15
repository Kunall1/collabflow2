"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageLoader } from "@/components/ui/ProgressBar";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  // JS: 0=Sun. We want Mon=0
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;
  return { daysInMonth, startOffset };
}

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3); // April = 3

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => setEvents(data.calendarEvents || []))
      .finally(() => setLoading(false));
  }, []);

  const { daysInMonth, startOffset } = getMonthData(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  }

  function getEventsForDay(day: number) {
    return events.filter((e) => {
      const d = new Date(e.eventDate);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  if (loading) return <PageLoader />;

  return (
    <div className="animate-slide-up">
      <div className="bg-card border border-border rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-surface-hover text-txt-muted hover:text-txt transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-lg font-bold text-txt min-w-[160px] text-center">
              {MONTH_NAMES[month]} {year}
            </h3>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-surface-hover text-txt-muted hover:text-txt transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex gap-3">
            {[
              { color: "#D4A843", label: "Deliverable" },
              { color: "#60A5FA", label: "Meeting" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-1.5 text-[11px] text-txt-muted">
                <span className="w-2 h-2 rounded-sm" style={{ background: t.color }} />
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2 text-center text-[11px] font-semibold text-txt-muted uppercase">{d}</div>
          ))}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[90px]" />
          ))}
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isCurrentMonth && today.getDate() === day;
            return (
              <div
                key={day}
                className={`min-h-[90px] p-2 border border-border rounded-lg transition-colors ${
                  dayEvents.length > 0 ? "bg-surface-hover" : ""
                } ${isToday ? "ring-1 ring-gold/40" : ""}`}
              >
                <div className={`text-xs mb-1 ${isToday ? "font-bold text-gold" : "font-medium text-txt-muted"}`}>
                  {day}
                </div>
                {dayEvents.map((e: any, i: number) => (
                  <div
                    key={i}
                    className="text-[9px] leading-tight px-1 py-0.5 rounded font-semibold mb-0.5 truncate"
                    style={{
                      background: `${e.color}20`,
                      color: e.color,
                    }}
                    title={e.title}
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
