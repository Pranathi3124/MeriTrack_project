
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download, Eye, Clock } from "lucide-react";
import { Timestamp } from "firebase/firestore";

interface AchievementCardProps {
  achievement: {
    id: string;
    title: string;
    category: string;
    description: string;
    date: Timestamp | Date;
    documentURL?: string;
    documentName?: string;
    status: "pending" | "approved" | "rejected";
    createdAt: Timestamp;
  };
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "academic":
      return "bg-red-100 text-red-800";
    case "sports":
      return "bg-blue-100 text-blue-800";
    case "internships":
      return "bg-green-100 text-green-800";
    case "hackathon":
      return "bg-purple-100 text-purple-800";
    case "workshops":
      return "bg-yellow-100 text-yellow-800";
    case "co-curricular":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const formatCategory = (category: string) => {
  // Convert category to title case and replace dashes with spaces
  const formatted = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  return formatted;
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const categoryClass = getCategoryColor(achievement.category);
  const statusClass = getStatusColor(achievement.status);
  
  const formattedDate = achievement.date instanceof Date
    ? format(achievement.date, "PPP")
    : format(achievement.date.toDate(), "PPP");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{achievement.title}</CardTitle>
          <Badge className={categoryClass}>
            {formatCategory(achievement.category)}
          </Badge>
        </div>
        <CardDescription className="flex items-center mt-1">
          <Clock className="h-3 w-3 mr-1" />
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-gray-600 text-sm">
          {achievement.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <Badge className={statusClass}>
            {achievement.status.charAt(0).toUpperCase() + achievement.status.slice(1)}
          </Badge>
          <div className="flex space-x-2">
            {achievement.documentURL && (
              <>
                <Button variant="outline" size="sm" className="h-8" asChild>
                  <a href={achievement.documentURL} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="h-8" asChild>
                  <a href={achievement.documentURL} download={achievement.documentName || "document"}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AchievementCard;
