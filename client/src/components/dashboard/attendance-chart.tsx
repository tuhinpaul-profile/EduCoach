import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AttendanceChart() {
  const data = [
    { day: "Mon", attendance: 85, total: 100 },
    { day: "Tue", attendance: 92, total: 100 },
    { day: "Wed", attendance: 78, total: 100 },
    { day: "Thu", attendance: 88, total: 100 },
    { day: "Fri", attendance: 94, total: 100 },
    { day: "Sat", attendance: 76, total: 100 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">Weekly Attendance</h3>
        <div className="text-sm text-neutral-500">
          Last 7 days
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#white',
                border: '1px solid #e5e5e5',
                borderRadius: '8px'
              }}
              formatter={(value, name) => [
                name === 'attendance' ? `${value}%` : value,
                name === 'attendance' ? 'Attendance' : 'Total Students'
              ]}
            />
            <Bar 
              dataKey="attendance" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              name="attendance"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Average Attendance</span>
          <span className="font-medium text-neutral-800">
            85.5% <span className="text-green-600">↗ 2.3%</span>
          </span>
        </div>
      </div>
    </div>
  );
}