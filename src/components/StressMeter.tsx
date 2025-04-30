"use client";

const StressMeter = ({ percentage }: { percentage: number }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>0%</span>
        <span>Stress Level: {percentage}%</span>
        <span>100%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`h-4 rounded-full ${
            percentage < 30 ? "bg-green-500" :
            percentage < 70 ? "bg-yellow-500" :
            "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default StressMeter;
