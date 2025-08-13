import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign, AlertTriangle, Clock } from "lucide-react";

export default function FeeOverview() {
  const data = [
    { name: "Paid", value: 75, color: "#10b981", amount: 375000 },
    { name: "Pending", value: 20, color: "#f59e0b", amount: 100000 },
    { name: "Overdue", value: 5, color: "#ef4444", amount: 25000 },
  ];

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">Fee Collection Overview</h3>
        <div className="text-sm text-neutral-500">
          This month
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Percentage']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          {data.map((item) => {
            const getIcon = (name: string) => {
              switch (name) {
                case "Paid": return <DollarSign className="w-4 h-4 text-green-600" />;
                case "Pending": return <Clock className="w-4 h-4 text-yellow-600" />;
                case "Overdue": return <AlertTriangle className="w-4 h-4 text-red-600" />;
                default: return null;
              }
            };

            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getIcon(item.name)}
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{item.name}</p>
                    <p className="text-xs text-neutral-600">{item.value}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-800">
                    ₹{(item.amount / 1000).toFixed(0)}k
                  </p>
                  <div 
                    className="w-2 h-2 rounded-full ml-auto mt-1"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-800">Total</span>
              <span className="text-sm font-bold text-neutral-800">
                ₹{(totalAmount / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-800">
            5 students have overdue fees. Send reminders?
          </span>
        </div>
      </div>
    </div>
  );
}