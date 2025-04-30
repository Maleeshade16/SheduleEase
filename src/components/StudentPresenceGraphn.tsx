import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StudentRecord {
  month: string;
  attended: number;
  missed: number;
  delayed?: number;
}

const StudentPresenceGraph = ({ records }: { records: StudentRecord[] }) => {
  // Custom tick style
  const axisStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "0.85rem",
    color: "#5a677d",
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          <ul className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <li key={`item-${index}`} className="flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="text-gray-700">
                  {entry.name === "attended"
                    ? "Present"
                    : entry.name === "missed"
                    ? "Absent"
                    : "Late"}
                  : {entry.value} students
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full p-1">
      <ResponsiveContainer width="99%" height="95%">
        <BarChart
          data={records}
          layout="vertical"
          margin={{ top: 15, right: 25, left: 15, bottom: 10 }}
          barCategoryGap={12}
        >
          <CartesianGrid 
            horizontal={true} 
            vertical={false} 
            stroke="#e8edf3" 
            strokeDasharray="2 4" 
          />
          <XAxis 
            type="number" 
            axisLine={false}
            tick={axisStyle}
            tickLine={false}
          />
          <YAxis 
            dataKey="month" 
            type="category" 
            axisLine={false}
            tick={{ ...axisStyle, fontWeight: 500 }}
            tickLine={false}
            width={80}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(210, 220, 235, 0.3)' }}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: "15px" }}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-sm font-medium text-gray-600 px-1">
                {value === "attended"
                  ? "Present"
                  : value === "missed"
                  ? "Absent"
                  : "Delayed"}
              </span>
            )}
          />
          <Bar
            dataKey="attended"
            name="Present"
            fill="#5aa3fc"
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
          />
          <Bar
            dataKey="missed"
            name="Absent"
            fill="#ff6b7f"
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
          />
          <Bar
            dataKey="delayed"
            name="Late"
            fill="#ffc445"
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentPresenceGraph;
