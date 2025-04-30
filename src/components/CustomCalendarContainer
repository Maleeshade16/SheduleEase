import CustomCalendar from "./CustomCalendar";
import EventList from "./EventList";
import EventActions from "./EventActions";

const CustomCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  
  return (
    <div className="bg-neutral-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Event Schedule
              </h1>
              <EventActions />
            </div>
            <CustomCalendar initialDate={date} />
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Upcoming Events
            </h2>
            <div className="space-y-4">
              <EventList dateParam={date} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendarContainer;
