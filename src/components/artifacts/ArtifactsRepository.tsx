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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Image,
  Video,
  Download,
  Search,
  Filter,
  Calendar,
  Eye,
} from "lucide-react";

interface Artifact {
  id: string;
  name: string;
  type: "log" | "screenshot" | "video" | "report";
  testRun: string;
  testCase: string;
  size: string;
  timestamp: string;
  url: string;
}

interface ArtifactsRepositoryProps {
  artifacts?: Artifact[];
}

const ArtifactsRepository: React.FC<ArtifactsRepositoryProps> = ({
  artifacts = [
    {
      id: "1",
      name: "login_test_screenshot_001.png",
      type: "screenshot",
      testRun: "TR-12345",
      testCase: "Login Authentication Test",
      size: "2.3 MB",
      timestamp: "2023-06-15 14:32:45",
      url: "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=600&q=80",
    },
    {
      id: "2",
      name: "test_execution_log.txt",
      type: "log",
      testRun: "TR-12345",
      testCase: "Login Authentication Test",
      size: "45 KB",
      timestamp: "2023-06-15 14:32:45",
      url: "#",
    },
    {
      id: "3",
      name: "full_test_recording.mp4",
      type: "video",
      testRun: "TR-12345",
      testCase: "Complete Test Suite",
      size: "125 MB",
      timestamp: "2023-06-15 14:30:00",
      url: "#",
    },
    {
      id: "4",
      name: "test_report_summary.pdf",
      type: "report",
      testRun: "TR-12344",
      testCase: "Regression Test Suite",
      size: "1.8 MB",
      timestamp: "2023-06-15 13:45:22",
      url: "#",
    },
    {
      id: "5",
      name: "checkout_flow_screenshot.png",
      type: "screenshot",
      testRun: "TR-12343",
      testCase: "Checkout Process Validation",
      size: "3.1 MB",
      timestamp: "2023-06-15 12:18:03",
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    },
  ],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterTestRun, setFilterTestRun] = useState("all");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "log":
        return <FileText className="h-4 w-4" />;
      case "screenshot":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "report":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      log: "bg-blue-100 text-blue-800",
      screenshot: "bg-green-100 text-green-800",
      video: "bg-purple-100 text-purple-800",
      report: "bg-orange-100 text-orange-800",
    };
    return (
      <Badge
        className={
          colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const filteredArtifacts = artifacts.filter((artifact) => {
    const matchesSearch =
      artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.testCase.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || artifact.type === filterType;
    const matchesTestRun =
      filterTestRun === "all" || artifact.testRun === filterTestRun;
    return matchesSearch && matchesType && matchesTestRun;
  });

  const uniqueTestRuns = [...new Set(artifacts.map((a) => a.testRun))];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Test Artifacts Repository</h1>
          <p className="text-gray-600">
            Centralized storage for test logs, screenshots, videos, and reports
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Bulk Download
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search artifacts by name or test case..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="log">Logs</SelectItem>
                <SelectItem value="screenshot">Screenshots</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="report">Reports</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTestRun} onValueChange={setFilterTestRun}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by test run" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Test Runs</SelectItem>
                {uniqueTestRuns.map((testRun) => (
                  <SelectItem key={testRun} value={testRun}>
                    {testRun}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Artifacts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Artifacts ({filteredArtifacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Test Run</TableHead>
                  <TableHead>Test Case</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtifacts.map((artifact) => (
                  <TableRow key={artifact.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(artifact.type)}
                        {artifact.name}
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(artifact.type)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{artifact.testRun}</Badge>
                    </TableCell>
                    <TableCell
                      className="max-w-xs truncate"
                      title={artifact.testCase}
                    >
                      {artifact.testCase}
                    </TableCell>
                    <TableCell>{artifact.size}</TableCell>
                    <TableCell>{artifact.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
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
    </div>
  );
};

export default ArtifactsRepository;
