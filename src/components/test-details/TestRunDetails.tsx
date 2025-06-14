import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Play,
  FileText,
  Image,
  Video,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  Download,
  ExternalLink,
} from "lucide-react";

interface TestStep {
  id: string;
  name: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
  screenshot?: string;
  log: string;
}

interface TestCase {
  id: string;
  name: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
  steps: TestStep[];
  errorMessage?: string;
  tags: string[];
}

interface TestRunDetailsProps {
  testRunId?: string;
  testSuite?: string;
  environment?: string;
  browser?: string;
  startTime?: string;
  duration?: number;
  status?: "passed" | "failed" | "partial";
  passRate?: number;
  testCases?: TestCase[];
  videoUrl?: string;
}

const TestRunDetails: React.FC<TestRunDetailsProps> = ({
  testRunId = "TR-12345",
  testSuite = "Login Flow Tests",
  environment = "Production",
  browser = "Chrome",
  startTime = "2023-06-15T14:30:00Z",
  duration = 245,
  status = "partial",
  passRate = 85,
  videoUrl = "https://example.com/test-recording.mp4",
  testCases = [
    {
      id: "TC-001",
      name: "User can log in with valid credentials",
      status: "passed",
      duration: 12.5,
      tags: ["smoke", "critical-path"],
      steps: [
        {
          id: "S-001",
          name: "Navigate to login page",
          status: "passed",
          duration: 1.2,
          log: "Successfully navigated to https://example.com/login",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-002",
          name: "Enter username",
          status: "passed",
          duration: 0.8,
          log: 'Entered username "testuser" in field #username',
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-003",
          name: "Enter password",
          status: "passed",
          duration: 0.7,
          log: "Entered password in field #password",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-004",
          name: "Click login button",
          status: "passed",
          duration: 1.5,
          log: "Clicked on button #login-btn",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-005",
          name: "Verify dashboard is displayed",
          status: "passed",
          duration: 2.1,
          log: "Dashboard element #user-dashboard is visible",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
      ],
    },
    {
      id: "TC-002",
      name: "User cannot log in with invalid password",
      status: "passed",
      duration: 10.2,
      tags: ["smoke", "security"],
      steps: [
        {
          id: "S-001",
          name: "Navigate to login page",
          status: "passed",
          duration: 1.1,
          log: "Successfully navigated to https://example.com/login",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-002",
          name: "Enter username",
          status: "passed",
          duration: 0.7,
          log: 'Entered username "testuser" in field #username',
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-003",
          name: "Enter invalid password",
          status: "passed",
          duration: 0.6,
          log: "Entered invalid password in field #password",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-004",
          name: "Click login button",
          status: "passed",
          duration: 1.4,
          log: "Clicked on button #login-btn",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-005",
          name: "Verify error message is displayed",
          status: "passed",
          duration: 1.8,
          log: 'Error message "Invalid credentials" is displayed',
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
      ],
    },
    {
      id: "TC-003",
      name: "User can reset password",
      status: "failed",
      duration: 15.8,
      tags: ["regression"],
      errorMessage: "Timeout waiting for password reset email (waited 10s)",
      steps: [
        {
          id: "S-001",
          name: "Navigate to login page",
          status: "passed",
          duration: 1.2,
          log: "Successfully navigated to https://example.com/login",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-002",
          name: "Click forgot password link",
          status: "passed",
          duration: 0.9,
          log: "Clicked on link #forgot-password",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-003",
          name: "Enter email address",
          status: "passed",
          duration: 1.1,
          log: 'Entered email "test@example.com" in field #email',
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-004",
          name: "Submit reset request",
          status: "passed",
          duration: 1.3,
          log: "Clicked on button #reset-btn",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-005",
          name: "Check for confirmation message",
          status: "passed",
          duration: 0.8,
          log: "Confirmation message is displayed",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
        {
          id: "S-006",
          name: "Wait for reset email",
          status: "failed",
          duration: 10.0,
          log: "ERROR: Timeout waiting for password reset email (waited 10s)",
          screenshot:
            "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
        },
      ],
    },
    {
      id: "TC-004",
      name: "Session expires after inactivity",
      status: "skipped",
      duration: 0,
      tags: ["security"],
      steps: [],
    },
  ],
}) => {
  const [selectedTestCase, setSelectedTestCase] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(
    {},
  );

  const formattedDate = new Date(startTime).toLocaleString();
  const formattedDuration = `${Math.floor(duration / 60)}m ${duration % 60}s`;

  const passedTests = testCases.filter((tc) => tc.status === "passed").length;
  const failedTests = testCases.filter((tc) => tc.status === "failed").length;
  const skippedTests = testCases.filter((tc) => tc.status === "skipped").length;

  const handleTestCaseClick = (testCaseId: string) => {
    setSelectedTestCase(selectedTestCase === testCaseId ? null : testCaseId);
  };

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const getStatusIcon = (
    status: "passed" | "failed" | "skipped" | "partial",
  ) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "skipped":
        return <Clock className="h-5 w-5 text-gray-400" />;
      case "partial":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getStatusColor = (
    status: "passed" | "failed" | "skipped" | "partial",
  ) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800 border-green-300";
      case "failed":
        return "bg-red-100 text-red-800 border-red-300";
      case "skipped":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "partial":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      {/* Test Run Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{testSuite}</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="text-gray-700">
              {testRunId}
            </Badge>
            <Badge className={getStatusColor(status)}>
              {status === "partial"
                ? "Partially Passed"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Artifacts
          </Button>
        </div>
      </div>

      {/* Test Run Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Environment</p>
                <p className="text-lg font-semibold">{environment}</p>
              </div>
              <Avatar className="h-8 w-8 bg-blue-100">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  ENV
                </AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Browser</p>
                <p className="text-lg font-semibold">{browser}</p>
              </div>
              <Avatar className="h-8 w-8 bg-purple-100">
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  BR
                </AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-lg font-semibold">{formattedDuration}</p>
              </div>
              <Avatar className="h-8 w-8 bg-amber-100">
                <AvatarFallback className="bg-amber-100 text-amber-600">
                  DUR
                </AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                <p className="text-lg font-semibold">{passRate}%</p>
              </div>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                {passRate}%
              </div>
            </div>
            <Progress value={passRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="test-cases" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="video">Video Recording</TabsTrigger>
          <TabsTrigger value="dom-diff">DOM Diff</TabsTrigger>
        </TabsList>

        {/* Test Cases Tab */}
        <TabsContent value="test-cases" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">{passedTests} Passed</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">{failedTests} Failed</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-gray-300 mr-2"></div>
                <span className="text-sm">{skippedTests} Skipped</span>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] rounded-md">
                <div className="p-4">
                  {testCases.map((testCase) => (
                    <div key={testCase.id} className="mb-4">
                      <div
                        className={`p-4 rounded-md cursor-pointer border ${selectedTestCase === testCase.id ? "border-primary" : "border-gray-200"}`}
                        onClick={() => handleTestCaseClick(testCase.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(testCase.status)}
                            <div>
                              <h3 className="font-medium">{testCase.name}</h3>
                              <div className="flex gap-2 mt-1">
                                {testCase.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {testCase.duration.toFixed(1)}s
                          </div>
                        </div>

                        {testCase.errorMessage && (
                          <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                            {testCase.errorMessage}
                          </div>
                        )}

                        {selectedTestCase === testCase.id &&
                          testCase.steps.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                              <h4 className="text-sm font-medium mb-2">
                                Test Steps
                              </h4>
                              <Accordion type="multiple" className="w-full">
                                {testCase.steps.map((step) => (
                                  <AccordionItem key={step.id} value={step.id}>
                                    <AccordionTrigger className="py-2">
                                      <div className="flex items-center gap-3">
                                        {getStatusIcon(step.status)}
                                        <span>{step.name}</span>
                                        <span className="text-xs text-gray-500 ml-2">
                                          {step.duration.toFixed(1)}s
                                        </span>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-4 p-2">
                                        <div className="bg-gray-50 p-3 rounded-md">
                                          <h5 className="text-xs font-medium mb-1">
                                            Log
                                          </h5>
                                          <pre className="text-xs whitespace-pre-wrap">
                                            {step.log}
                                          </pre>
                                        </div>

                                        {step.screenshot && (
                                          <div>
                                            <h5 className="text-xs font-medium mb-1">
                                              Screenshot
                                            </h5>
                                            <div className="relative border rounded-md overflow-hidden">
                                              <img
                                                src={step.screenshot}
                                                alt={`Screenshot for ${step.name}`}
                                                className="w-full h-auto"
                                              />
                                              <Button
                                                variant="secondary"
                                                size="sm"
                                                className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                                              >
                                                <ExternalLink className="h-4 w-4 mr-1" />{" "}
                                                View Full Size
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Test Run Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {`[2023-06-15 14:30:00] INFO: Starting test run ${testRunId} for suite "${testSuite}"
[2023-06-15 14:30:01] INFO: Environment: ${environment}, Browser: ${browser}
[2023-06-15 14:30:02] INFO: Starting test case TC-001: User can log in with valid credentials
[2023-06-15 14:30:03] INFO: Navigating to https://example.com/login
[2023-06-15 14:30:04] INFO: Entering username "testuser"
[2023-06-15 14:30:05] INFO: Entering password
[2023-06-15 14:30:06] INFO: Clicking login button
[2023-06-15 14:30:08] INFO: Verifying dashboard is displayed
[2023-06-15 14:30:10] INFO: Test case TC-001 PASSED in 12.5s
[2023-06-15 14:30:10] INFO: Starting test case TC-002: User cannot log in with invalid password
[2023-06-15 14:30:11] INFO: Navigating to https://example.com/login
[2023-06-15 14:30:12] INFO: Entering username "testuser"
[2023-06-15 14:30:13] INFO: Entering invalid password
[2023-06-15 14:30:14] INFO: Clicking login button
[2023-06-15 14:30:16] INFO: Verifying error message is displayed
[2023-06-15 14:30:18] INFO: Test case TC-002 PASSED in 10.2s
[2023-06-15 14:30:18] INFO: Starting test case TC-003: User can reset password
[2023-06-15 14:30:19] INFO: Navigating to https://example.com/login
[2023-06-15 14:30:20] INFO: Clicking forgot password link
[2023-06-15 14:30:21] INFO: Entering email "test@example.com"
[2023-06-15 14:30:22] INFO: Submitting reset request
[2023-06-15 14:30:24] INFO: Checking for confirmation message
[2023-06-15 14:30:25] INFO: Waiting for reset email
[2023-06-15 14:30:35] ERROR: Timeout waiting for password reset email (waited 10s)
[2023-06-15 14:30:35] INFO: Test case TC-003 FAILED in 15.8s
[2023-06-15 14:30:35] INFO: Skipping test case TC-004: Session expires after inactivity
[2023-06-15 14:30:35] INFO: Test run completed. Results: 2 passed, 1 failed, 1 skipped
[2023-06-15 14:30:35] INFO: Total duration: ${formattedDuration}`}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Recording Tab */}
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Test Run Recording</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-md overflow-hidden relative">
                {videoUrl ? (
                  <video
                    controls
                    className="w-full h-full"
                    poster="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1200&q=80"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-center">
                      <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No video recording available for this test run</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Video Markers</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Login form submission</span>
                    </div>
                    <span className="text-sm text-gray-500">00:25</span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Password reset request</span>
                    </div>
                    <span className="text-sm text-gray-500">01:45</span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      <span>Error occurred</span>
                    </div>
                    <span className="text-sm text-gray-500">03:12</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DOM Diff Tab */}
        <TabsContent value="dom-diff">
          <Card>
            <CardHeader>
              <CardTitle>DOM Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Before</h3>
                  <div className="border rounded-md p-4 bg-gray-50 h-[400px] overflow-auto">
                    <pre className="text-xs font-mono">
                      {`<div class="login-container">
  <form id="login-form">
    <h2>Login</h2>
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" />
    </div>
    <button type="submit" id="login-btn">Log In</button>
    <a href="#" id="forgot-password">Forgot Password?</a>
  </form>
</div>`}
                    </pre>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">After</h3>
                  <div className="border rounded-md p-4 bg-gray-50 h-[400px] overflow-auto">
                    <pre className="text-xs font-mono">
                      {`<div class="login-container">
  <form id="login-form">
    <h2>Login</h2>
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" />
    </div>
    <button type="submit" id="login-btn" disabled>Logging in...</button>
    <a href="#" id="forgot-password">Forgot Password?</a>
    <div class="error-message" style="color: red;">Invalid credentials</div>
  </form>
</div>`}
                    </pre>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Changes Detected</h3>
                <div className="space-y-2">
                  <div className="p-2 border-l-4 border-red-500 bg-red-50">
                    <p className="text-sm">
                      Added:{" "}
                      <code className="text-xs bg-white px-1 py-0.5 rounded">
                        &lt;div class="error-message" style="color:
                        red;"&gt;Invalid credentials&lt;/div&gt;
                      </code>
                    </p>
                  </div>
                  <div className="p-2 border-l-4 border-amber-500 bg-amber-50">
                    <p className="text-sm">
                      Modified:{" "}
                      <code className="text-xs bg-white px-1 py-0.5 rounded">
                        &lt;button type="submit" id="login-btn"&gt;
                      </code>{" "}
                      →{" "}
                      <code className="text-xs bg-white px-1 py-0.5 rounded">
                        &lt;button type="submit" id="login-btn"
                        disabled&gt;Logging in...&lt;/button&gt;
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestRunDetails;
