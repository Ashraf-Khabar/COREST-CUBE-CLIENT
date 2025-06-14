import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GitCompare,
  Image,
  ZoomIn,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Maximize2,
} from "lucide-react";

interface TestRun {
  id: string;
  name: string;
  timestamp: string;
  status: "passed" | "failed" | "partial";
  environment: string;
}

interface ScreenshotComparison {
  id: string;
  testCase: string;
  baselineImage: string;
  currentImage: string;
  diffImage: string;
  similarity: number;
  status: "match" | "mismatch" | "new";
  threshold: number;
}

interface VisualComparisonProps {
  testRuns?: TestRun[];
  comparisons?: ScreenshotComparison[];
}

const VisualComparison: React.FC<VisualComparisonProps> = ({
  testRuns = [
    {
      id: "TR-12345",
      name: "Login Flow Tests - June 15",
      timestamp: "2023-06-15 14:30:00",
      status: "partial",
      environment: "Chrome / Windows",
    },
    {
      id: "TR-12344",
      name: "Login Flow Tests - June 14",
      timestamp: "2023-06-14 16:45:00",
      status: "passed",
      environment: "Chrome / Windows",
    },
    {
      id: "TR-12343",
      name: "Login Flow Tests - June 13",
      timestamp: "2023-06-13 15:20:00",
      status: "failed",
      environment: "Chrome / Windows",
    },
  ],
  comparisons = [
    {
      id: "1",
      testCase: "Login Page - Initial Load",
      baselineImage:
        "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
      currentImage:
        "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
      diffImage:
        "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
      similarity: 98.5,
      status: "match",
      threshold: 95,
    },
    {
      id: "2",
      testCase: "Login Form - Error State",
      baselineImage:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
      currentImage:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
      diffImage:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
      similarity: 87.2,
      status: "mismatch",
      threshold: 95,
    },
    {
      id: "3",
      testCase: "Dashboard - After Login",
      baselineImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
      currentImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
      diffImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
      similarity: 92.8,
      status: "mismatch",
      threshold: 95,
    },
    {
      id: "4",
      testCase: "User Profile - Settings Page",
      baselineImage:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
      currentImage:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
      diffImage:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
      similarity: 99.1,
      status: "match",
      threshold: 95,
    },
  ],
}) => {
  const [selectedBaselineRun, setSelectedBaselineRun] = useState("TR-12344");
  const [selectedCurrentRun, setSelectedCurrentRun] = useState("TR-12345");
  const [selectedComparison, setSelectedComparison] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"side-by-side" | "overlay" | "diff">(
    "side-by-side",
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "match":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "mismatch":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "new":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "match":
        return "bg-green-100 text-green-800";
      case "mismatch":
        return "bg-red-100 text-red-800";
      case "new":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSimilarityColor = (similarity: number, threshold: number) => {
    if (similarity >= threshold) return "text-green-600";
    if (similarity >= threshold - 10) return "text-yellow-600";
    return "text-red-600";
  };

  const matchCount = comparisons.filter((c) => c.status === "match").length;
  const mismatchCount = comparisons.filter(
    (c) => c.status === "mismatch",
  ).length;
  const newCount = comparisons.filter((c) => c.status === "new").length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Visual Comparison Tools</h1>
          <p className="text-gray-600">
            Compare test runs and analyze visual differences with AI-powered
            insights
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Test Run Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Compare Test Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Baseline Run
              </label>
              <Select
                value={selectedBaselineRun}
                onValueChange={setSelectedBaselineRun}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select baseline run" />
                </SelectTrigger>
                <SelectContent>
                  {testRuns.map((run) => (
                    <SelectItem key={run.id} value={run.id}>
                      {run.name} - {run.timestamp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Current Run
              </label>
              <Select
                value={selectedCurrentRun}
                onValueChange={setSelectedCurrentRun}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select current run" />
                </SelectTrigger>
                <SelectContent>
                  {testRuns.map((run) => (
                    <SelectItem key={run.id} value={run.id}>
                      {run.name} - {run.timestamp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Matches</p>
                <p className="text-2xl font-bold text-green-600">
                  {matchCount}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Mismatches</p>
                <p className="text-2xl font-bold text-red-600">
                  {mismatchCount}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  New Screenshots
                </p>
                <p className="text-2xl font-bold text-blue-600">{newCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold">{comparisons.length}</p>
              </div>
              <Image className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison-list" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="comparison-list">Comparison List</TabsTrigger>
          <TabsTrigger value="detailed-view">Detailed View</TabsTrigger>
        </TabsList>

        {/* Comparison List Tab */}
        <TabsContent value="comparison-list">
          <Card>
            <CardHeader>
              <CardTitle>Screenshot Comparisons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Case</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Similarity</TableHead>
                      <TableHead>Threshold</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisons.map((comparison) => (
                      <TableRow key={comparison.id}>
                        <TableCell className="font-medium">
                          {comparison.testCase}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(comparison.status)}
                            <Badge
                              className={getStatusColor(comparison.status)}
                            >
                              {comparison.status.charAt(0).toUpperCase() +
                                comparison.status.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${getSimilarityColor(comparison.similarity, comparison.threshold)}`}
                            >
                              {comparison.similarity.toFixed(1)}%
                            </span>
                            <Progress
                              value={comparison.similarity}
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{comparison.threshold}%</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSelectedComparison(comparison.id)
                              }
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed View Tab */}
        <TabsContent value="detailed-view">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Detailed Comparison View</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={viewMode}
                    onValueChange={(value: any) => setViewMode(value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="side-by-side">Side by Side</SelectItem>
                      <SelectItem value="overlay">Overlay</SelectItem>
                      <SelectItem value="diff">Diff Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedComparison ? (
                <div className="space-y-6">
                  {(() => {
                    const comparison = comparisons.find(
                      (c) => c.id === selectedComparison,
                    );
                    if (!comparison) return null;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              {comparison.testCase}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(comparison.status)}
                                <Badge
                                  className={getStatusColor(comparison.status)}
                                >
                                  {comparison.status.charAt(0).toUpperCase() +
                                    comparison.status.slice(1)}
                                </Badge>
                              </div>
                              <span
                                className={`font-semibold ${getSimilarityColor(comparison.similarity, comparison.threshold)}`}
                              >
                                {comparison.similarity.toFixed(1)}% similarity
                              </span>
                            </div>
                          </div>
                        </div>

                        {viewMode === "side-by-side" && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Baseline
                              </h4>
                              <div className="border rounded-lg overflow-hidden">
                                <img
                                  src={comparison.baselineImage}
                                  alt="Baseline"
                                  className="w-full h-auto"
                                />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Current
                              </h4>
                              <div className="border rounded-lg overflow-hidden">
                                <img
                                  src={comparison.currentImage}
                                  alt="Current"
                                  className="w-full h-auto"
                                />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Difference
                              </h4>
                              <div className="border rounded-lg overflow-hidden">
                                <img
                                  src={comparison.diffImage}
                                  alt="Difference"
                                  className="w-full h-auto"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {viewMode === "diff" && (
                          <div className="max-w-2xl mx-auto">
                            <h4 className="text-sm font-medium mb-2">
                              Visual Differences
                            </h4>
                            <div className="border rounded-lg overflow-hidden">
                              <img
                                src={comparison.diffImage}
                                alt="Difference"
                                className="w-full h-auto"
                              />
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Image className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">
                    Select a comparison from the list to view details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualComparison;
