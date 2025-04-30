"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Calendar as OriginalCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-styles.css";

const CustomCalendar = ({ initialDate }: { initialDate?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<Date>(initialDate ? new Date(initialDate) : new Date());

  useEffect(() => {
    if (searchParams.get('date') !== value.toISOString().split('T')[0]) {
      router.push(`?date=${value.toISOString().split('T')[0]}`);
    }
  }, [value, router, searchParams]);

  return (
    <div className="custom-calendar">
      <OriginalCalendar
        onChange={setValue}
        value={value}
        locale="en-US"
        minDetail="month"
        next2Label={null}
        prev2Label={null}
        tileClassName={({ date, view }) => {
          return view === 'month' && date.getDay() === 0 ? 'sunday' : null;
        }}
      />
    </div>
  );
};

export default CustomCalendar;
