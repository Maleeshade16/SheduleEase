import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "Home",
        label: "Dashboard",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Users",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "Users",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "BookOpen",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "School",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "Calendar",
        label: "Schedule",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "ClipboardList",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "FileText",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "ClipboardCheck",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Calendar",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "MessageSquare",
        label: "Chatbot",
        href: "/chat",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Megaphone",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Activity",
        label: "Wellness Tracker",
        href: "/wellness",
        visible: ["admin", "student"],
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        icon: "User",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Settings",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "LogOut",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  return (
    <div className="mt-6 space-y-8">
      {menuItems.map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="px-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => {
              if (item.visible.includes(role)) {
                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <Icon name={item.icon} className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
