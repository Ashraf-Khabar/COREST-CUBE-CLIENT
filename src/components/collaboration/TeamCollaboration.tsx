import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Users,
  Bell,
  Share2,
  FileText,
  Calendar,
  AtSign,
  Send,
  Pin,
  MoreHorizontal,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastActive: string;
}

interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  timestamp: string;
  mentions: string[];
  testRunId?: string;
  isPinned: boolean;
}

interface SharedReport {
  id: string;
  title: string;
  author: TeamMember;
  sharedWith: TeamMember[];
  createdAt: string;
  type: "summary" | "detailed" | "trend";
}

interface TeamCollaborationProps {
  teamMembers?: TeamMember[];
  comments?: Comment[];
  sharedReports?: SharedReport[];
}

const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  teamMembers = [
    {
      id: "1",
      name: "Alice Johnson",
      role: "QA Lead",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      status: "online",
      lastActive: "now",
    },
    {
      id: "2",
      name: "Bob Smith",
      role: "Test Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      status: "away",
      lastActive: "5 minutes ago",
    },
    {
      id: "3",
      name: "Carol Davis",
      role: "Automation Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
      status: "online",
      lastActive: "now",
    },
    {
      id: "4",
      name: "David Wilson",
      role: "DevOps Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      status: "offline",
      lastActive: "2 hours ago",
    },
  ],
  comments = [
    {
      id: "1",
      author: {
        id: "1",
        name: "Alice Johnson",
        role: "QA Lead",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        status: "online",
        lastActive: "now",
      },
      content:
        "The login test failure seems to be related to the new authentication changes. @bob can you take a look at the timeout settings?",
      timestamp: "2023-06-15 14:32:45",
      mentions: ["bob"],
      testRunId: "TR-12345",
      isPinned: true,
    },
    {
      id: "2",
      author: {
        id: "2",
        name: "Bob Smith",
        role: "Test Engineer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        status: "away",
        lastActive: "5 minutes ago",
      },
      content:
        "I've increased the timeout to 30 seconds and added retry logic. The test should be more stable now.",
      timestamp: "2023-06-15 14:45:22",
      mentions: [],
      testRunId: "TR-12345",
      isPinned: false,
    },
    {
      id: "3",
      author: {
        id: "3",
        name: "Carol Davis",
        role: "Automation Engineer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
        status: "online",
        lastActive: "now",
      },
      content:
        "Great work on the flaky test fixes! The pass rate has improved significantly. @alice should we schedule a review meeting?",
      timestamp: "2023-06-15 15:12:03",
      mentions: ["alice"],
      isPinned: false,
    },
  ],
  sharedReports = [
    {
      id: "1",
      title: "Weekly Test Summary - June 15, 2023",
      author: {
        id: "1",
        name: "Alice Johnson",
        role: "QA Lead",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        status: "online",
        lastActive: "now",
      },
      sharedWith: [
        {
          id: "2",
          name: "Bob Smith",
          role: "Test Engineer",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
          status: "away",
          lastActive: "5 minutes ago",
        },
        {
          id: "4",
          name: "David Wilson",
          role: "DevOps Engineer",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
          status: "offline",
          lastActive: "2 hours ago",
        },
      ],
      createdAt: "2023-06-15 16:00:00",
      type: "summary",
    },
    {
      id: "2",
      title: "Flaky Test Analysis Report",
      author: {
        id: "3",
        name: "Carol Davis",
        role: "Automation Engineer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
        status: "online",
        lastActive: "now",
      },
      sharedWith: [
        {
          id: "1",
          name: "Alice Johnson",
          role: "QA Lead",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
          status: "online",
          lastActive: "now",
        },
      ],
      createdAt: "2023-06-15 14:30:00",
      type: "detailed",
    },
  ],
}) => {
  const [newComment, setNewComment] = useState("");
  const [selectedTestRun, setSelectedTestRun] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "summary":
        return "bg-blue-100 text-blue-800";
      case "detailed":
        return "bg-purple-100 text-purple-800";
      case "trend":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      // Handle sending comment
      setNewComment("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Team Collaboration</h1>
          <p className="text-gray-600">
            Share insights, discuss test results, and collaborate with your team
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="discussions" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="reports">Shared Reports</TabsTrigger>
        </TabsList>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-6">
          {/* Comment Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Add Comment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={selectedTestRun}
                  onValueChange={setSelectedTestRun}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select test run" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">General Discussion</SelectItem>
                    <SelectItem value="TR-12345">TR-12345</SelectItem>
                    <SelectItem value="TR-12344">TR-12344</SelectItem>
                    <SelectItem value="TR-12343">TR-12343</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Share your thoughts, mention team members with @username..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <AtSign className="h-4 w-4" />
                    <span>Use @username to mention team members</span>
                  </div>
                  <Button onClick={handleSendComment}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>
                            {comment.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {comment.author.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {comment.author.role}
                            </Badge>
                            {comment.testRunId && (
                              <Badge variant="secondary" className="text-xs">
                                {comment.testRunId}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {comment.timestamp}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {comment.isPinned && (
                          <Pin className="h-4 w-4 text-blue-500" />
                        )}
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-700 ml-11">{comment.content}</p>
                    {comment.mentions.length > 0 && (
                      <div className="ml-11 mt-2">
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <AtSign className="h-3 w-3" />
                          <span>Mentioned: {comment.mentions.join(", ")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members ({teamMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                        ></div>
                      </div>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}
                        ></div>
                        <span className="text-sm capitalize">
                          {member.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {member.lastActive}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shared Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Shared Reports ({sharedReports.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sharedReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium mb-1">{report.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>by {report.author.name}</span>
                          <span>•</span>
                          <span>{report.createdAt}</span>
                        </div>
                      </div>
                      <Badge className={getReportTypeColor(report.type)}>
                        {report.type.charAt(0).toUpperCase() +
                          report.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          Shared with:
                        </span>
                        <div className="flex -space-x-2">
                          {report.sharedWith.slice(0, 3).map((member) => (
                            <Avatar
                              key={member.id}
                              className="h-6 w-6 border-2 border-white"
                            >
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {report.sharedWith.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">
                                +{report.sharedWith.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamCollaboration;
