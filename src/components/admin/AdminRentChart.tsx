
import {
  ChartContainer,
} from "@/components/ui/chart";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", rent: 13000 },
  { month: "Feb", rent: 12500 },
  { month: "Mar", rent: 14000 },
  { month: "Apr", rent: 13500 },
  { month: "May", rent: 14200 },
  { month: "Jun", rent: 13800 },
  { month: "Jul", rent: 14500 },
  { month: "Aug", rent: 14300 },
  { month: "Sep", rent: 13900 },
  { month: "Oct", rent: 14800 },
  { month: "Nov", rent: 14600 },
  { month: "Dec", rent: 15000 },
];

export function AdminRentChart() {
  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <div className="mb-4 font-bold text-lg">
        Monthly Rent Collection Overview
      </div>
      <ChartContainer config={{}}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-[#f3f3f3]" />
            <XAxis dataKey="month" className="text-xs text-gray-500" />
            <YAxis className="text-xs text-gray-500" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="rent"
              stroke="#9b87f5"
              fill="#e5deff"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
