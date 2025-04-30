"use client";

import { useState } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
} from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-overrides.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const InteractiveCalendar = ({
  events,
  defaultView = "week",
  onEventClick,
}: {
  events: any[];
  defaultView?: "day" | "week" | "month";
  onEventClick?: (event: any) => void;
}) => {
  const [view, setView] = useState<"day" | "week" | "month" | "agenda">(
    Views.WEEK
  );

  return (
    <div className="h-[600px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        view={view}
        onView={setView}
        onSelectEvent={onEventClick}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderColor: event.color,
            opacity: 0.8,
          },
        })}
        components={{
          event: CustomEvent,
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
};

const CustomEvent = ({ event }: { event: any }) => {
  return (
    <div className="p-1">
      <strong>{event.title}</strong>
      {event.description && (
        <p className="text-xs truncate">{event.description}</p>
      )}
    </div>
  );
};

const CustomToolbar = ({ label, onView, view }: any) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        {label}
      </h2>
      <div className="flex space-x-2">
        <button
          onClick={() => onView(Views.DAY)}
          className={`px-3 py-1 rounded ${
            view === Views.DAY
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => onView(Views.WEEK)}
          className={`px-3 py-1 rounded ${
            view === Views.WEEK
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => onView(Views.MONTH)}
          className={`px-3 py-1 rounded ${
            view === Views.MONTH
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Month
        </button>
      </div>
    </div>
  );
};

export default InteractiveCalendar;
