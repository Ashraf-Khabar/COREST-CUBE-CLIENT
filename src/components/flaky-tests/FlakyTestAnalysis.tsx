import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

interface FlakyTest {
  id: string;
  testName: string;
  instabilityScore: number;
  failureRate: number;
  totalRuns: number;
  lastFailure: string;
  suggestedFixes: string[];
  category: "high" | "medium" | "low";
  environment: string;
}

interface FlakyTestAnalysisProps {
  flakyTests?: FlakyTest[];
}

const FlakyTestAnalysis: React.FC<FlakyTestAnalysisProps> = ({
  flakyTests = [
    {
      id: "1",
      testName: "User Registration Flow - Email Verification",
      instabilityScore: 85,
      failureRate: 23,
      totalRuns: 150,
      lastFailure: "2023-06-15 14:32:45",
      category: "high",
      environment: "Chrome / Windows",
      suggestedFixes: [
        "Add explicit wait for email verification element",
        "Implement retry mechanism for network requests",
        "Use more stable selectors (data-testid instead of CSS classes)",
      ],
    },
    {
      id: "2",
      testName: "Product Search - Filter Results",
      instabilityScore: 72,
      failureRate: 18,
      totalRuns: 200,
      lastFailure: "2023-06-15 13:45:22",
      category: "high",
      environment: "Firefox / MacOS",
      suggestedFixes: [
        "Increase timeout for search results loading",
        "Add wait condition for filter animation completion",
        "Handle race conditions in filter application",
      ],
    },
    {
      id: "3",
      testName: "Shopping Cart - Add Multiple Items",
      instabilityScore: 58,
      failureRate: 12,
      totalRuns: 180,
      lastFailure: "2023-06-15 12:18:03",
      category: "medium",
      environment: "Safari / iOS",
      suggestedFixes: [
        "Add delay between item additions",
        "Verify cart update completion before next action",
        "Handle mobile-specific timing issues",
      ],
    },
    {
      id: "4",
      testName: "User Profile - Avatar Upload",
      instabilityScore: 45,
      failureRate: 8,
      totalRuns: 120,
      lastFailure: "2023-06-15 11:05:17",
      category: "medium",
      environment: "Edge / Windows",
      suggestedFixes: [
        "Implement file upload progress monitoring",
        "Add validation for supported file formats",
        "Handle upload timeout scenarios",
      ],
    },
    {
      id: "5",
      testName: "Dashboard - Data Refresh",
      instabilityScore: 32,
      failureRate: 5,
      totalRuns: 160,
      lastFailure: "2023-06-15 10:22:51",
      category: "low",
      environment: "Chrome / Android",
      suggestedFixes: [
        "Add loading state verification",
        "Implement data freshness checks",
        "Handle network connectivity issues",
      ],
    },
  ],
}) => {
  const [sortBy, setSortBy] = useState("instabilityScore");
  const [filterCategory, setFilterCategory] = useState("all");

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getInstabilityColor = (score: number) => {
    if (score >= 70) return "text-red-600";
    if (score >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  const filteredTests = flakyTests.filter((test) => {
    return filterCategory === "all" || test.category === filterCategory;
  });

  const sortedTests = [...filteredTests].sort((a, b) => {
    switch (sortBy) {
      case "instabilityScore":
        return b.instabilityScore - a.instabilityScore;
      case "failureRate":
        return b.failureRate - a.failureRate;
      case "totalRuns":
        return b.totalRuns - a.totalRuns;
      default:
        return 0;
    }
  });

  const highRiskTests = flakyTests.filter((t) => t.category === "high").length;
  const mediumRiskTests = flakyTests.filter(
    (t) => t.category === "medium",
  ).length;
  const lowRiskTests = flakyTests.filter((t) => t.category === "low").length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Flaky Test Analysis</h1>
          <p className="text-gray-600">
            Identify and resolve unstable tests with AI-powered insights
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">High Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {highRiskTests}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Medium Risk</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mediumRiskTests}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Low Risk</p>
                <p className="text-2xl font-bold text-green-600">
                  {lowRiskTests}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tests</p>
                <p className="text-2xl font-bold">{flakyTests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instabilityScore">Instability Score</SelectItem>
            <SelectItem value="failureRate">Failure Rate</SelectItem>
            <SelectItem value="totalRuns">Total Runs</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risks</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Flaky Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Flaky Tests ({sortedTests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Instability Score</TableHead>
                  <TableHead>Failure Rate</TableHead>
                  <TableHead>Total Runs</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Last Failure</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={test.testName}>
                        {test.testName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(test.category)}>
                        {test.category.charAt(0).toUpperCase() +
                          test.category.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${getInstabilityColor(test.instabilityScore)}`}
                        >
                          {test.instabilityScore}
                        </span>
                        <Progress
                          value={test.instabilityScore}
                          className="w-16 h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{test.failureRate}%</span>
                    </TableCell>
                    <TableCell>{test.totalRuns}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{test.environment}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {test.lastFailure}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        View Fixes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Fixes Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI-Powered Fix Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedTests.slice(0, 3).map((test) => (
              <div key={test.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium truncate" title={test.testName}>
                    {test.testName}
                  </h3>
                  <Badge className={getCategoryColor(test.category)}>
                    {test.category} risk
                  </Badge>
                </div>
                <div className="space-y-2">
                  {test.suggestedFixes.map((fix, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{fix}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlakyTestAnalysis;
