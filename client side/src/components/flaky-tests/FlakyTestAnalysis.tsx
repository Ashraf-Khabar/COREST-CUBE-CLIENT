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
  FolderOpen,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  projectId: string;
  projectName: string;
  assignedTo?: string;
  status: "open" | "in-progress" | "resolved" | "ignored";
  priority: "critical" | "high" | "medium" | "low";
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
      projectId: "1",
      projectName: "E-commerce Platform",
      assignedTo: "Alice Johnson",
      status: "in-progress",
      priority: "critical",
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
      projectId: "1",
      projectName: "E-commerce Platform",
      assignedTo: "Bob Smith",
      status: "open",
      priority: "high",
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
      projectId: "2",
      projectName: "Mobile App Backend",
      assignedTo: "Carol Davis",
      status: "resolved",
      priority: "medium",
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
      projectId: "2",
      projectName: "Mobile App Backend",
      status: "open",
      priority: "medium",
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
      projectId: "3",
      projectName: "Analytics Dashboard",
      status: "ignored",
      priority: "low",
      suggestedFixes: [
        "Add loading state verification",
        "Implement data freshness checks",
        "Handle network connectivity issues",
      ],
    },
  ],
}) => {
  const { hasPermission, isAdmin } = useAuth();
  const [sortBy, setSortBy] = useState("instabilityScore");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "ignored":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-3 w-3" />;
      case "in-progress":
        return <Clock className="h-3 w-3" />;
      case "open":
        return <AlertTriangle className="h-3 w-3" />;
      case "ignored":
        return <XCircle className="h-3 w-3" />;
      default:
        return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const filteredTests = flakyTests.filter((test) => {
    const matchesCategory =
      filterCategory === "all" || test.category === filterCategory;
    const matchesProject =
      filterProject === "all" || test.projectId === filterProject;
    const matchesStatus =
      filterStatus === "all" || test.status === filterStatus;
    return matchesCategory && matchesProject && matchesStatus;
  });

  const uniqueProjects = [
    ...new Set(
      flakyTests.map((t) => ({ id: t.projectId, name: t.projectName })),
    ),
  ];

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
    <div className="bg-background p-6 rounded-lg shadow-sm w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-foreground">
            Flaky Test Analysis
          </h1>
          <p className="text-muted-foreground">
            Identify and resolve unstable tests with AI-powered insights
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {isAdmin() && (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Manage Tests
            </Button>
          )}
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
                <p className="text-sm font-medium text-muted-foreground">
                  High Risk
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Medium Risk
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Low Risk
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Total Tests
                </p>
                <p className="text-2xl font-bold">{flakyTests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {uniqueProjects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-3 w-3" />
                  {project.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="ignored">Ignored</SelectItem>
          </SelectContent>
        </Select>
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
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Instability Score</TableHead>
                  <TableHead>Failure Rate</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Environment</TableHead>
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
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{test.projectName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        <Badge className={getStatusColor(test.status)}>
                          {test.status.charAt(0).toUpperCase() +
                            test.status.slice(1).replace("-", " ")}
                        </Badge>
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
                    <TableCell className="text-sm">
                      {test.assignedTo || "Unassigned"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{test.environment}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Lightbulb className="h-4 w-4 mr-1" />
                          Fixes
                        </Button>
                        {hasPermission("canWrite") && (
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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
                      <span className="text-foreground">{fix}</span>
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
