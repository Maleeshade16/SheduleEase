import prisma from "@/lib/prisma";
import { EventPriority } from "@prisma/client";
import { format, isToday } from "date-fns";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {isToday(date) ? "No events scheduled for today." : "No events scheduled for this date."}
        </p>
      </div>
    );
  }

  return events.map((event) => {
    const priorityColor = {
      HIGH: 'bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-700',
      MEDIUM: 'bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30 dark:border-yellow-700',
      LOW: 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-700',
    }[event.priority || EventPriority.MEDIUM];

    return (
      <div
        className={`p-4 rounded-lg border-l-4 mb-3 ${priorityColor} shadow-sm`}
        key={event.id}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {event.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {event.description}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {format(event.startTime, 'HH:mm')}
              {event.endTime && ` - ${format(event.endTime, 'HH:mm')}`}
            </span>
            {event.classId && (
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                Class: {event.className || 'General'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  });
};

export default EventList;
