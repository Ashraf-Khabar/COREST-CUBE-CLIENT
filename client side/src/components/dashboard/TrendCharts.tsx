import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface TrendChartsProps {
  data?: {
    passRateData: Array<{
      date: string;
      passRate: number;
      totalTests: number;
    }>;
    durationData: Array<{
      date: string;
      duration: number;
      testCount: number;
    }>;
  };
}

const defaultPassRateData = [
  { date: "May 1", passRate: 92, totalTests: 120 },
  { date: "May 2", passRate: 88, totalTests: 115 },
  { date: "May 3", passRate: 94, totalTests: 130 },
  { date: "May 4", passRate: 91, totalTests: 125 },
  { date: "May 5", passRate: 86, totalTests: 118 },
  { date: "May 6", passRate: 89, totalTests: 122 },
  { date: "May 7", passRate: 95, totalTests: 128 },
  { date: "May 8", passRate: 93, totalTests: 132 },
  { date: "May 9", passRate: 90, totalTests: 124 },
  { date: "May 10", passRate: 96, totalTests: 135 },
];

const defaultDurationData = [
  { date: "May 1", duration: 45, testCount: 120 },
  { date: "May 2", duration: 48, testCount: 115 },
  { date: "May 3", duration: 42, testCount: 130 },
  { date: "May 4", duration: 46, testCount: 125 },
  { date: "May 5", duration: 50, testCount: 118 },
  { date: "May 6", duration: 47, testCount: 122 },
  { date: "May 7", duration: 43, testCount: 128 },
  { date: "May 8", duration: 44, testCount: 132 },
  { date: "May 9", duration: 49, testCount: 124 },
  { date: "May 10", duration: 41, testCount: 135 },
];

const TrendCharts: React.FC<TrendChartsProps> = ({
  data = {
    passRateData: defaultPassRateData,
    durationData: defaultDurationData,
  },
}) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [chartType, setChartType] = useState("line");

  // Filter data based on selected time range
  const getFilteredData = (dataArray: any[], range: string) => {
    switch (range) {
      case "24h":
        return dataArray.slice(-1);
      case "7d":
        return dataArray.slice(-7);
      case "30d":
        return dataArray;
      default:
        return dataArray;
    }
  };

  const filteredPassRateData = getFilteredData(data.passRateData, timeRange);
  const filteredDurationData = getFilteredData(data.durationData, timeRange);

  return (
    <div className="w-full bg-background">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">
            Test Execution Trends
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pass-rate" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="pass-rate">Pass Rate Trend</TabsTrigger>
              <TabsTrigger value="duration">Execution Duration</TabsTrigger>
            </TabsList>
            <TabsContent value="pass-rate" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart
                    data={filteredPassRateData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Pass Rate"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="passRate"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Pass Rate (%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="totalTests"
                      stroke="#6366f1"
                      strokeWidth={2}
                      name="Total Tests"
                    />
                  </LineChart>
                ) : (
                  <BarChart
                    data={filteredPassRateData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "passRate" ? `${value}%` : value,
                        name === "passRate" ? "Pass Rate" : "Total Tests",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="passRate"
                      fill="#10b981"
                      name="Pass Rate (%)"
                    />
                    <Bar
                      dataKey="totalTests"
                      fill="#6366f1"
                      name="Total Tests"
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="duration" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart
                    data={filteredDurationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "duration" ? `${value} min` : value,
                        name === "duration" ? "Avg. Duration" : "Test Count",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="duration"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Avg. Duration (min)"
                    />
                    <Line
                      type="monotone"
                      dataKey="testCount"
                      stroke="#6366f1"
                      strokeWidth={2}
                      name="Test Count"
                    />
                  </LineChart>
                ) : (
                  <BarChart
                    data={filteredDurationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "duration" ? `${value} min` : value,
                        name === "duration" ? "Avg. Duration" : "Test Count",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="duration"
                      fill="#f59e0b"
                      name="Avg. Duration (min)"
                    />
                    <Bar dataKey="testCount" fill="#6366f1" name="Test Count" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendCharts;
