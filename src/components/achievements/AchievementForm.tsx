
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  AchievementCategory, 
  AchievementLevel,
  addAchievement, 
  addAuditLog, 
  uploadAchievementDocument 
} from "@/lib/firebase";
import { Calendar as CalendarIcon, Upload, FileX } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AchievementFormProps {
  onSuccess?: () => void;
}

const AchievementForm: React.FC<AchievementFormProps> = ({ onSuccess }) => {
  const { user, userData } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AchievementCategory | "">("");
  const [level, setLevel] = useState<AchievementLevel | "">("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFile = e.target.files[0];
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      e.target.value = "";
      return;
    }
    
    setFile(selectedFile);
  };
  
  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData) {
      setError("You must be logged in to submit an achievement");
      toast.error("Authentication error");
      return;
    }
    
    setError(null);
    
    if (!title.trim()) {
      setError("Please enter a title");
      toast.error("Please enter a title");
      return;
    }
    
    if (!category) {
      setError("Please select a category");
      toast.error("Please select a category");
      return;
    }
    
    if (!level) {
      setError("Please select achievement level");
      toast.error("Please select achievement level");
      return;
    }
    
    if (!date) {
      setError("Please select a date");
      toast.error("Please select a date");
      return;
    }
    
    if (!file) {
      setError("Please upload a document");
      toast.error("Please upload a document");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Adding achievement to database...");
      // Add achievement to database
      const achievementId = await addAchievement(user.uid, {
        title,
        category,
        level,
        description,
        date,
        rollNo: userData.rollNo,
        branch: userData.branch,
        year: userData.year,
        studentName: userData.name,
        studentEmail: userData.email
      });
      
      console.log("Achievement added with ID:", achievementId);
      console.log("Uploading document...");
      
      // Upload achievement document
      await uploadAchievementDocument(achievementId, file);
      
      console.log("Document uploaded successfully");
      
      // Add audit log
      await addAuditLog("achievement_created", user.uid, { 
        achievementId, 
        title, 
        category 
      });
      
      toast.success("Achievement submitted successfully!");
      
      // Reset form
      setTitle("");
      setCategory("");
      setLevel("");
      setDescription("");
      setDate(undefined);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting achievement:", error);
      
      let errorMessage = "Failed to submit achievement. Please try again later.";
      
      if (error.code === 'permission-denied') {
        errorMessage = "You don't have permission to submit achievements. Please contact an administrator.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      toast.error("Failed to submit achievement");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Achievement</CardTitle>
        <CardDescription>Submit your achievements for faculty recognition</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter achievement title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as AchievementCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="competition">Competitions</SelectItem>
                <SelectItem value="extra-curricular">Extra-Curricular</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="internships">Internships</SelectItem>
                <SelectItem value="hackathon">Hackathon</SelectItem>
                <SelectItem value="workshops">Workshops</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="level">Achievement Level</Label>
            <Select
              value={level}
              onValueChange={(value) => setLevel(value as AchievementLevel)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="college">College/University</SelectItem>
                <SelectItem value="state">State/Regional</SelectItem>
                <SelectItem value="national">National</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date of Achievement</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your achievement"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document">Upload Document</Label>
            <div className="mt-1">
              {!file && (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, Images, or Documents (max 10MB)
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="absolute h-full w-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}
              
              {file && (
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <FileX className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-college-maroon hover:bg-college-darkmaroon"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Achievement"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Your achievement will be reviewed by faculty.
      </CardFooter>
    </Card>
  );
};

export default AchievementForm;
