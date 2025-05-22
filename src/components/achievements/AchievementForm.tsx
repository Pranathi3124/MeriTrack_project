
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { addAchievement, uploadAchievementDocument } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

// Define the schema for form validation
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  level: z.string().min(1, "Please select a level"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date({
    required_error: "Please select a date",
  }),
  document: z.any().optional(),
  semester: z.string().min(1, "Please select a semester"),
  academicYear: z.string().min(1, "Please select an academic year"),
  cgpa: z.string().optional(),
  sgpa: z.string().optional(),
});

type AchievementFormProps = {
  onSuccess: () => void;
};

const AchievementForm: React.FC<AchievementFormProps> = ({ onSuccess }) => {
  const { user, userData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  
  // For conditional fields based on category
  const [selectedCategory, setSelectedCategory] = useState("");

  // Generate academic year options (last 4 years)
  const currentYear = new Date().getFullYear();
  const academicYears = [];
  for (let i = 0; i < 4; i++) {
    const year = currentYear - i;
    academicYears.push(`${year}-${year + 1}`);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      level: "",
      description: "",
      semester: "",
      academicYear: academicYears[0],
    },
  });
  
  const watchCategory = form.watch("category");
  const watchSemester = form.watch("semester");
  
  if (watchCategory !== selectedCategory) {
    setSelectedCategory(watchCategory);
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setDocumentFile(files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !userData) return;

    try {
      setIsSubmitting(true);
      
      // Create achievement data
      const achievementData: {
        title: string;
        category: string;
        level: string;
        description: string;
        date: Date;
        semester: string;
        academicYear: string;
        studentName: string;
        studentEmail: string;
        rollNo: string;
        branch: string;
        year: string;
        status: string;
        cgpa?: string;
        sgpa?: string;
      } = {
        title: values.title,
        category: values.category,
        level: values.level,
        description: values.description,
        date: values.date,
        semester: values.semester,
        academicYear: values.academicYear,
        studentName: userData.name || "",
        studentEmail: userData.email || "",
        rollNo: userData.rollNo || "",
        branch: userData.branch || "",
        year: userData.year || "",
        status: "pending",
      };
      
      // Add academic fields if category is academic
      if (values.category === "academic") {
        achievementData.cgpa = values.cgpa || "";
        achievementData.sgpa = values.sgpa || "";
      }
      
      // Add achievement to database
      const achievementId = await addAchievement(user.uid, achievementData);
      
      // Upload document if provided
      if (documentFile && achievementId) {
        await uploadAchievementDocument(achievementId, documentFile);
      }
      
      toast.success("Achievement submitted successfully!");
      form.reset();
      setDocumentFile(null);
      onSuccess();
      
    } catch (error) {
      console.error("Error submitting achievement:", error);
      toast.error("Failed to submit achievement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achievement Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter achievement title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedCategory(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select achievement category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="academic">Academic Excellence</SelectItem>
                  <SelectItem value="technical">Technical Skills</SelectItem>
                  <SelectItem value="research">Research & Projects</SelectItem>
                  <SelectItem value="competition">Competitions</SelectItem>
                  <SelectItem value="extra-curricular">Extra-Curricular</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="internships">Internships</SelectItem>
                  <SelectItem value="hackathon">Hackathons</SelectItem>
                  <SelectItem value="workshops">Workshops</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Level - conditionally show different options for internships */}
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achievement Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select achievement level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedCategory === "internships" ? (
                    <>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="research">Research Institution</SelectItem>
                      <SelectItem value="international">International Organization</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="college">College Level</SelectItem>
                      <SelectItem value="state">State/Regional Level</SelectItem>
                      <SelectItem value="national">National Level</SelectItem>
                      <SelectItem value="international">International Level</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Achievement</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Semester */}
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1st Semester</SelectItem>
                  <SelectItem value="2">2nd Semester</SelectItem>
                  <SelectItem value="3">3rd Semester</SelectItem>
                  <SelectItem value="4">4th Semester</SelectItem>
                  <SelectItem value="5">5th Semester</SelectItem>
                  <SelectItem value="6">6th Semester</SelectItem>
                  <SelectItem value="7">7th Semester</SelectItem>
                  <SelectItem value="8">8th Semester</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Academic Year */}
        <FormField
          control={form.control}
          name="academicYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Year</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional CGPA/SGPA fields for academic category */}
        {selectedCategory === "academic" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cgpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CGPA</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your CGPA (0-10)" {...field} />
                  </FormControl>
                  <FormDescription>Enter value between 0-10</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sgpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SGPA for Semester {watchSemester}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Enter SGPA for Semester ${watchSemester || '?'} (0-10)`} {...field} />
                  </FormControl>
                  <FormDescription>Enter value between 0-10</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your achievement in detail" 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Supporting Document */}
        <FormField
          control={form.control}
          name="document"
          render={() => (
            <FormItem>
              <FormLabel>Supporting Document (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  onChange={handleDocumentChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </FormControl>
              <FormDescription>
                Upload a certificate, screenshot, or any document to verify your achievement.
                Max size: 5MB. Formats: PDF, DOC, DOCX, JPG, PNG.
              </FormDescription>
              <FormMessage />
              {documentFile && (
                <div className="text-sm text-gray-500">
                  Selected file: {documentFile.name}
                </div>
              )}
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Achievement"}
        </Button>
      </form>
    </Form>
  );
};

export default AchievementForm;
