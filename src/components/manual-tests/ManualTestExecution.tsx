import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Upload,
  FolderOpen,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Terminal,
  Pause,
  Square,
} from "lucide-react";

interface TestFile {
  id: string;
  name: string;
  path: string;
  framework: string;
  selected: boolean;
}

interface TestExecution {
  id: string;
  name: string;
  status: "running" | "completed" | "failed";
  startTime: string;
  duration?: string;
  results?: {
    passed: number;
    failed: number;
    total: number;
  };
}

export default function ManualTestExecution() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("");
  const [testDirectory, setTestDirectory] = useState("");
  const [outputDirectory, setOutputDirectory] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentExecution, setCurrentExecution] =
    useState<TestExecution | null>(null);
  const [testFiles, setTestFiles] = useState<TestFile[]>([
    {
      id: "1",
      name: "login.spec.js",
      path: "/tests/e2e/login.spec.js",
      framework: "cypress",
      selected: false,
    },
    {
      id: "2",
      name: "dashboard.spec.js",
      path: "/tests/e2e/dashboard.spec.js",
      framework: "cypress",
      selected: false,
    },
    {
      id: "3",
      name: "test_user_management.py",
      path: "/tests/selenium/test_user_management.py",
      framework: "selenium",
      selected: false,
    },
    {
      id: "4",
      name: "api_tests.robot",
      path: "/tests/robot/api_tests.robot",
      framework: "robot",
      selected: false,
    },
    {
      id: "5",
      name: "integration.spec.js",
      path: "/tests/e2e/integration.spec.js",
      framework: "cypress",
      selected: false,
    },
  ]);
  const [outputPath, setOutputPath] = useState("/test-results");
  const [customCommand, setCustomCommand] = useState("");
  const [executions, setExecutions] = useState<TestExecution[]>([
    {
      id: "1",
      name: "Cypress E2E Tests",
      status: "completed",
      startTime: "2024-01-15 14:30:00",
      duration: "2m 45s",
      results: { passed: 8, failed: 1, total: 9 },
    },
    {
      id: "2",
      name: "Selenium User Tests",
      status: "running",
      startTime: "2024-01-15 14:35:00",
    },
  ]);

  const testLanguages = [
    {
      value: "javascript",
      label: "JavaScript (Jest/Cypress/Playwright)",
      extensions: [".js", ".ts", ".spec.js", ".test.js"],
    },
    {
      value: "python",
      label: "Python (Pytest/Selenium)",
      extensions: [".py", "test_*.py", "*_test.py"],
    },
    {
      value: "java",
      label: "Java (JUnit/TestNG)",
      extensions: [".java", "Test.java", "Tests.java"],
    },
    {
      value: "csharp",
      label: "C# (NUnit/MSTest)",
      extensions: [".cs", "Test.cs", "Tests.cs"],
    },
    {
      value: "robot",
      label: "Robot Framework",
      extensions: [".robot", ".txt"],
    },
  ];

  const frameworks = [
    { value: "cypress", label: "Cypress" },
    { value: "selenium", label: "Selenium" },
    { value: "robot", label: "Robot Framework" },
    { value: "playwright", label: "Playwright" },
    { value: "jest", label: "Jest" },
    { value: "pytest", label: "Pytest" },
    { value: "junit", label: "JUnit" },
  ];

  const filteredTestFiles = selectedFramework
    ? testFiles.filter((file) => file.framework === selectedFramework)
    : testFiles;

  const handleFileSelection = (fileId: string, checked: boolean) => {
    setTestFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, selected: checked } : file,
      ),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setTestFiles((prev) =>
      prev.map((file) => ({ ...file, selected: checked })),
    );
  };

  const handleBrowseDirectory = (type: "test" | "output") => {
    // In a real application, this would open a file dialog
    // For demo purposes, we'll simulate directory selection
    const mockPath =
      type === "test"
        ? "/Users/username/my-project/tests"
        : "/Users/username/my-project/test-results";
    if (type === "test") {
      setTestDirectory(mockPath);
    } else {
      setOutputDirectory(mockPath);
    }
  };

  const handleRunTests = () => {
    const selectedFiles = testFiles.filter((file) => file.selected);
    if (selectedFiles.length === 0) {
      alert("Please select at least one test file to run.");
      return;
    }

    if (!testDirectory || !outputDirectory) {
      alert("Please select both test directory and output directory.");
      return;
    }

    setIsRunning(true);
    const newExecution: TestExecution = {
      id: Date.now().toString(),
      name: `${selectedLanguage} Tests - ${selectedFiles.length} files`,
      status: "running",
      startTime: new Date().toLocaleString(),
    };

    setCurrentExecution(newExecution);
    setExecutions((prev) => [newExecution, ...prev]);

    // Simulate test execution with progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Complete the execution
        const completedExecution = {
          ...newExecution,
          status: "completed" as const,
          duration: "2m 15s",
          results: {
            passed: Math.floor(Math.random() * 8) + 2,
            failed: Math.floor(Math.random() * 3),
            total: selectedFiles.length,
          },
        };

        setCurrentExecution(completedExecution);
        setExecutions((prev) =>
          prev.map((exec) =>
            exec.id === newExecution.id ? completedExecution : exec,
          ),
        );
        setIsRunning(false);
      }
    }, 500);
  };

  const handleStopTests = () => {
    setIsRunning(false);
    if (currentExecution) {
      const stoppedExecution = {
        ...currentExecution,
        status: "failed" as const,
        duration: "Stopped",
      };
      setCurrentExecution(stoppedExecution);
      setExecutions((prev) =>
        prev.map((exec) =>
          exec.id === currentExecution.id ? stoppedExecution : exec,
        ),
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manual Test Execution
            </h1>
            <p className="text-gray-600 mt-2">
              Run your local tests manually and manage test execution
            </p>
          </div>
        </div>

        <Tabs defaultValue="configure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configure">Configure Tests</TabsTrigger>
            <TabsTrigger value="execute">Execute Tests</TabsTrigger>
            <TabsTrigger value="history">Execution History</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Test Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure your test language, framework, and directories
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Test Language</Label>
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test language" />
                      </SelectTrigger>
                      <SelectContent>
                        {testLanguages.map((language) => (
                          <SelectItem
                            key={language.value}
                            value={language.value}
                          >
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="framework">Framework (Optional)</Label>
                    <Select
                      value={selectedFramework}
                      onValueChange={setSelectedFramework}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select testing framework" />
                      </SelectTrigger>
                      <SelectContent>
                        {frameworks.map((framework) => (
                          <SelectItem
                            key={framework.value}
                            value={framework.value}
                          >
                            {framework.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testDirectory">Test Directory</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="testDirectory"
                        value={testDirectory}
                        onChange={(e) => setTestDirectory(e.target.value)}
                        placeholder="Select folder containing your tests"
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleBrowseDirectory("test")}
                      >
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outputDirectory">
                      Results Output Directory
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="outputDirectory"
                        value={outputDirectory}
                        onChange={(e) => setOutputDirectory(e.target.value)}
                        placeholder="Select folder to save test results"
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleBrowseDirectory("output")}
                      >
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customCommand">
                      Custom Command (Optional)
                    </Label>
                    <Textarea
                      id="customCommand"
                      value={customCommand}
                      onChange={(e) => setCustomCommand(e.target.value)}
                      placeholder="Custom test execution command..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Test Files</span>
                  </CardTitle>
                  <CardDescription>
                    Select the test files you want to execute
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="selectAll"
                        checked={filteredTestFiles.every(
                          (file) => file.selected,
                        )}
                        onCheckedChange={handleSelectAll}
                      />
                      <Label htmlFor="selectAll" className="font-medium">
                        Select All ({filteredTestFiles.length} files)
                      </Label>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {filteredTestFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center space-x-2 p-2 rounded border"
                        >
                          <Checkbox
                            id={file.id}
                            checked={file.selected}
                            onCheckedChange={(checked) =>
                              handleFileSelection(file.id, checked as boolean)
                            }
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={file.id}
                              className="font-medium cursor-pointer"
                            >
                              {file.name}
                            </Label>
                            <p className="text-xs text-gray-500">{file.path}</p>
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {file.framework}
                          </span>
                        </div>
                      ))}
                    </div>

                    {filteredTestFiles.length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        {selectedFramework
                          ? `No ${selectedFramework} test files found`
                          : "Select a framework to see available test files"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="execute" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Execute Tests</span>
                </CardTitle>
                <CardDescription>
                  Run the selected test files with your configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Execution Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Language:</span>
                      <p className="font-medium">
                        {selectedLanguage || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Selected Files:
                      </span>
                      <p className="font-medium">
                        {testFiles.filter((f) => f.selected).length}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Test Directory:
                      </span>
                      <p className="font-medium truncate" title={testDirectory}>
                        {testDirectory || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p
                        className={`font-medium ${
                          isRunning
                            ? "text-blue-600"
                            : testDirectory &&
                                outputDirectory &&
                                selectedLanguage
                              ? "text-green-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {isRunning
                          ? "Running"
                          : testDirectory && outputDirectory && selectedLanguage
                            ? "Ready"
                            : "Configuration needed"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Execution Status */}
                {isRunning && currentExecution && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Terminal className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Running Tests...</span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          In Progress
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Executing: {currentExecution.name}</span>
                          <span>{currentExecution.startTime}</span>
                        </div>
                        <Progress value={Math.random() * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Test Results */}
                {currentExecution &&
                  currentExecution.status === "completed" &&
                  currentExecution.results && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-medium">Tests Completed</span>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            Finished
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {currentExecution.results.passed}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Passed
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                              {currentExecution.results.failed}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Failed
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold">
                              {currentExecution.results.total}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                <div className="flex space-x-4">
                  {!isRunning ? (
                    <Button
                      onClick={handleRunTests}
                      disabled={
                        !selectedLanguage ||
                        !testDirectory ||
                        !outputDirectory ||
                        testFiles.filter((f) => f.selected).length === 0
                      }
                      className="flex items-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Run Tests</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStopTests}
                      variant="destructive"
                      className="flex items-center space-x-2"
                    >
                      <Square className="h-4 w-4" />
                      <span>Stop Tests</span>
                    </Button>
                  )}
                  <Button variant="outline">Save Configuration</Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Execution History</CardTitle>
                <CardDescription>
                  View your recent test executions and their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executions.map((execution) => (
                    <div key={execution.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(execution.status)}
                          <div>
                            <h3 className="font-medium">{execution.name}</h3>
                            <p className="text-sm text-gray-600">
                              Started: {execution.startTime}
                              {execution.duration &&
                                ` • Duration: ${execution.duration}`}
                            </p>
                          </div>
                        </div>

                        {execution.results && (
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-green-600">
                              ✓ {execution.results.passed} passed
                            </span>
                            <span className="text-red-600">
                              ✗ {execution.results.failed} failed
                            </span>
                            <span className="text-gray-600">
                              Total: {execution.results.total}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {executions.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No test executions yet. Run your first test to see results
                      here.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
