"use client";

import {
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  Label,
  ResponsiveContainer,
} from "recharts";

const chartData = [{ name: "result", response: 25, nonresponse: 10 }];
//ini nanti ambil data dari hook api

export function ChartResponse() {
  const totalResponse = chartData[0].response;
  const totalNonResponse = chartData[0].nonresponse;
  const totalParticipant = totalResponse + totalNonResponse;

  return (
    <div className="">
      {/* Chart */}
      {/* <ResponsiveContainer width={200} height={150}>
        <RadialBarChart
          data={chartData}
          innerRadius={40}
          outerRadius={80}
          endAngle={180}
        >
          <PolarRadiusAxis tick={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 10}
                        className="fill-foreground text-lg font-bold"
                      >
                        {totalParticipant}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 12}
                        className="fill-muted-foreground text-xs"
                      >
                        Total
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>

          <RadialBar
            dataKey="response"
            fill="#10B981"
            stackId="a"
            cornerRadius={5}
          />
          <RadialBar
            dataKey="nonresponse"
            fill="#EF4444"
            stackId="a"
            cornerRadius={5}
          />
        </RadialBarChart>
      </ResponsiveContainer> */}

      {/* Keterangan rapet */}
      {/* <div className=" flex flex-col gap-1 text-xs mt-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>Response: {totalResponse}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>NonResponse: {totalNonResponse}</span>
        </div>
      </div> */}
      <span className="text-green-600">• Response: {totalResponse}  </span>
      <span className="text-red-600">• NonResponse: {totalNonResponse}</span>
    </div>
  );
}
