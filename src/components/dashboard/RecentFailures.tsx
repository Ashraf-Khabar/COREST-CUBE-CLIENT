import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Eye, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FailureRecord {
  id: string;
  testName: string;
  failureReason: string;
  environment: string;
  timestamp: string;
  severity: "critical" | "high" | "medium" | "low";
}

interface RecentFailuresProps {
  failures?: FailureRecord[];
  onViewDetails?: (id: string) => void;
  onViewArtifacts?: (id: string) => void;
  onMarkResolved?: (id: string) => void;
}

const RecentFailures: React.FC<RecentFailuresProps> = ({
  failures = [
    {
      id: "1",
      testName: "Login Authentication Test",
      failureReason: "Element not found: #login-button",
      environment: "Chrome 112 / Windows",
      timestamp: "2023-06-15 14:32:45",
      severity: "high",
    },
    {
      id: "2",
      testName: "Product Search Functionality",
      failureReason: "Timeout waiting for search results",
      environment: "Firefox 98 / MacOS",
      timestamp: "2023-06-15 13:45:22",
      severity: "medium",
    },
    {
      id: "3",
      testName: "Checkout Process Validation",
      failureReason: "AssertionError: Expected total $45.99, got $55.99",
      environment: "Safari 15 / iOS",
      timestamp: "2023-06-15 12:18:03",
      severity: "critical",
    },
    {
      id: "4",
      testName: "User Registration Flow",
      failureReason: "Network error during API call",
      environment: "Edge 101 / Windows",
      timestamp: "2023-06-15 11:05:17",
      severity: "high",
    },
    {
      id: "5",
      testName: "Product Image Gallery",
      failureReason: "Image comparison failed: 78% match (threshold: 95%)",
      environment: "Chrome 112 / Android",
      timestamp: "2023-06-15 10:22:51",
      severity: "low",
    },
  ],
  onViewDetails = () => {},
  onViewArtifacts = () => {},
  onMarkResolved = () => {},
}) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return (
          <Badge variant="destructive" className="bg-orange-500">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Recent Failures
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Failure Reason</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failures.map((failure) => (
                <TableRow key={failure.id}>
                  <TableCell className="font-medium">
                    {failure.testName}
                  </TableCell>
                  <TableCell
                    className="max-w-xs truncate"
                    title={failure.failureReason}
                  >
                    {failure.failureReason}
                  </TableCell>
                  <TableCell>{failure.environment}</TableCell>
                  <TableCell>{failure.timestamp}</TableCell>
                  <TableCell>{getSeverityBadge(failure.severity)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewDetails(failure.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onViewArtifacts(failure.id)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Artifacts</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onMarkResolved(failure.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mark as Resolved</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentFailures;
