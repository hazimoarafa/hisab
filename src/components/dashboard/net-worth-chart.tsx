"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts"

const data = [
  { month: "Jan", netWorth: 150000, assets: 200000, liabilities: 50000 },
  { month: "Feb", netWorth: 155000, assets: 205000, liabilities: 50000 },
  { month: "Mar", netWorth: 158000, assets: 210000, liabilities: 52000 },
  { month: "Apr", netWorth: 162000, assets: 215000, liabilities: 53000 },
  { month: "May", netWorth: 168000, assets: 223000, liabilities: 55000 },
  { month: "Jun", netWorth: 175000, assets: 230000, liabilities: 55000 },
]

interface NetWorthChartProps {
  data?: typeof data
}

export default function NetWorthChart({ data: chartData = data }: NetWorthChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Net Worth Trend</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {label}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            Net Worth
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Value
                          </span>
                          <span className="font-bold">
                            {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 