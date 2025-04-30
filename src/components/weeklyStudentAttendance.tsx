import { MoreVertical } from "lucide-react";
import StudentPresenceGraph from "./StudentPresenceGraph";
import prisma from "@/lib/prisma";

const WeeklyStudentAttendance = async () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const daysToLastMonday = currentDay === 0 ? 6 : currentDay - 1;

  const lastMondayDate = new Date(currentDate);
  lastMondayDate.setDate(currentDate.getDate() - daysToLastMonday);

  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMondayDate,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const attendanceSummary: Record<string, { attended: number; missed: number }> = {
    Mon: { attended: 0, missed: 0 },
    Tue: { attended: 0, missed: 0 },
    Wed: { attended: 0, missed: 0 },
    Thu: { attended: 0, missed: 0 },
    Fri: { attended: 0, missed: 0 },
  };

  attendanceRecords.forEach((record) => {
    const recordDate = new Date(record.date);
    const recordDay = recordDate.getDay();
    
    if (recordDay >= 1 && recordDay <= 5) {
      const weekday = weekdays[recordDay - 1];
      record.present 
        ? attendanceSummary[weekday].attended += 1 
        : attendanceSummary[weekday].missed += 1;
    }
  });

  const chartData = weekdays.map((day) => ({
    month: day,
    attended: attendanceSummary[day].attended,
    missed: attendanceSummary[day].missed,
  }));

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-800 rounded-xl p-5 h-full shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Weekly Attendance Overview
        </h2>
        <button className="text-gray-200 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
      <div className="h-[calc(100%-2.5rem)]">
        <StudentPresenceGraph records={chartData} />
      </div>
    </div>
  );
};

export default WeeklyStudentAttendance;
