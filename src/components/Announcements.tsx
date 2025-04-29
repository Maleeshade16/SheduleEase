import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";

const Announcements = async () => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  const announcements = await prisma.announcement.findMany({
    take: 5,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
    include: {
      class: {
        select: {
          name: true,
        },
      },
    },
  });

  const getBadgeColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
        <a
          href="/list/announcements"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </a>
      </div>
      
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <div
            key={announcement.id}
            className={`p-4 rounded-lg border-l-4 ${
              index % 2 === 0 ? "border-blue-500" : "border-green-500"
            } bg-gray-50 hover:bg-gray-100 transition-colors`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-gray-800">{announcement.title}</h2>
                {announcement.class && (
                  <Badge className={`mt-1 ${getBadgeColor(index)}`}>
                    Class: {announcement.class.name}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(announcement.date)}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{announcement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;