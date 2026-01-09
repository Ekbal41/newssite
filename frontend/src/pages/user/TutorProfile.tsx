import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layouts/RootNavbar";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  GraduationCap,
  Star,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Calendar,
  DollarSign,
  CheckCircle2,
  Users,
  Eye,
  Award,
  Briefcase,
  MessageCircle,
  ArrowLeft,
  Shield,
  BadgeCheck,
} from "lucide-react";

interface Tutor {
  id: string;
  username: string;
  headline: string | null;
  bio: string | null;
  profilePhoto: string | null;
  coverPhoto: string | null;
  gender: number;
  highestEducation: string | null;
  institution: string | null;
  department: string | null;
  currentStatus: string | null;
  subjects: string;
  classes: string;
  medium: string | null;
  curriculum: string | null;
  experienceYears: number;
  tuitionType: string;
  expectedSalary: number | null;
  availableTime: string | null;
  willingToTravel: boolean;
  city: string;
  area: string | null;
  isAvailable: boolean;
  isVerified: boolean;
  identityVerified: boolean;
  educationVerified: boolean;
  rating: number;
  totalReviews: number;
  totalStudents: number;
  createdAt: string;
}

interface ApiResponse {
  message: string;
  tutor: Tutor;
}

export default function TutorProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error, isError } = useQuery<ApiResponse>({
    queryKey: ["tutor-profile", username],
    queryFn: async () => {
      const response = await api.get(`/main/tutor/profile/${username}`);
      return response.data;
    },
    enabled: !!username,
    retry: 1,
  });

  const tutor = data?.tutor;

  const parseArray = (jsonString: string | null): string[] => {
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getGenderLabel = (gender: number) => {
    switch (gender) {
      case 0:
        return "Male";
      case 1:
        return "Female";
      case 2:
        return "Other";
      default:
        return "Not specified";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background -mt-4">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !tutor) {
    return (
      <div className="min-h-screen bg-background -mt-4">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="text-destructive text-xl font-semibold">
                {isError ? "Failed to load tutor profile" : "Tutor not found"}
              </div>
              <p className="text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "The tutor profile you're looking for doesn't exist."}
              </p>
              <Button onClick={() => navigate("/")}>Back to Home</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const parsedSubjects = parseArray(tutor.subjects);
  const parsedClasses = parseArray(tutor.classes);
  const parsedAvailableTime = parseArray(tutor.availableTime);

  return (
    <div className="min-h-screen bg-background -mt-4">
      {/* Cover Photo & Profile Header */}
      <div className="relative">
        <div
          className="h-64 md:h-80 bg-gradient-to-br from-primary/20 via-primary/10 to-background"
          style={
            tutor.coverPhoto
              ? {
                  backgroundImage: `url(${tutor.coverPhoto})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />

        <div className="max-w-7xl mx-auto px-4">
          <div className="relative -mt-20 md:-mt-24">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
                <AvatarImage src={tutor.profilePhoto || undefined} />
                <AvatarFallback className="text-4xl font-bold">
                  {tutor.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 bg-card p-6 rounded-xl shadow-lg border">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-3xl md:text-4xl font-bold">
                        {tutor.username}
                      </h1>
                      {tutor.isVerified && (
                        <Badge variant="default" className="gap-1">
                          <BadgeCheck className="h-4 w-4" />
                          Verified
                        </Badge>
                      )}
                      {tutor.isAvailable ? (
                        <Badge variant="default" className="bg-green-600">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Available</Badge>
                      )}
                    </div>
                    {tutor.headline && (
                      <p className="text-lg text-muted-foreground">
                        {tutor.headline}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {tutor.city}
                          {tutor.area && `, ${tutor.area}`}
                        </span>
                      </div>
                      {tutor.institution && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>{tutor.institution}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="lg" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Contact Tutor
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                    <div className="text-2xl font-bold">
                      {tutor.rating.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold">
                      {tutor.totalStudents}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Students
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <MessageCircle className="h-8 w-8 text-blue-500" />
                    <div className="text-2xl font-bold">
                      {tutor.totalReviews}
                    </div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-8 w-8 text-green-500" />
                    <div className="text-2xl font-bold">
                      {tutor.experienceYears}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Years Exp
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tutor.bio ? (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {tutor.bio}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No bio provided yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Education & Expertise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Education */}
                {(tutor.highestEducation || tutor.institution) && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                      Education
                    </h4>
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        {tutor.highestEducation && (
                          <div className="font-semibold">
                            {tutor.highestEducation}
                          </div>
                        )}
                        {tutor.institution && (
                          <div className="text-muted-foreground">
                            {tutor.institution}
                            {tutor.department && ` • ${tutor.department}`}
                          </div>
                        )}
                        {tutor.currentStatus && (
                          <Badge variant="secondary" className="mt-2">
                            {tutor.currentStatus}
                          </Badge>
                        )}
                      </div>
                      {tutor.educationVerified && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                )}

                {/* Subjects */}
                {parsedSubjects.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                      Subjects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedSubjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant="secondary"
                          className="text-sm py-1"
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Classes */}
                {parsedClasses.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                      Classes/Levels
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedClasses.map((cls) => (
                        <Badge
                          key={cls}
                          variant="outline"
                          className="text-sm py-1"
                        >
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medium & Curriculum */}
                <div className="grid grid-cols-2 gap-4">
                  {tutor.medium && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Medium
                      </div>
                      <Badge variant="secondary">{tutor.medium}</Badge>
                    </div>
                  )}
                  {tutor.curriculum && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Curriculum
                      </div>
                      <Badge variant="secondary">{tutor.curriculum}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    {tutor.isVerified ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-muted" />
                    )}
                    <div className="text-sm">
                      <div className="font-semibold">Profile Verified</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    {tutor.identityVerified ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-muted" />
                    )}
                    <div className="text-sm">
                      <div className="font-semibold">Identity Verified</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    {tutor.educationVerified ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-muted" />
                    )}
                    <div className="text-sm">
                      <div className="font-semibold">Education Verified</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Pricing & Availability */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing & Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tutor.expectedSalary && (
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">
                      Expected Monthly Fee
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      ৳{tutor.expectedSalary.toLocaleString()}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tuition Type
                    </span>
                    <Badge>{tutor.tuitionType}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Experience
                    </span>
                    <span className="font-semibold">
                      {tutor.experienceYears} years
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Gender
                    </span>
                    <span className="font-semibold">
                      {getGenderLabel(tutor.gender)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Willing to Travel
                    </span>
                    {tutor.willingToTravel ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Time */}
            {parsedAvailableTime.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Available Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {parsedAvailableTime.map((time, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Additional Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>Member since {formatDate(tutor.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">
                  Ready to start learning?
                </CardTitle>
                <CardDescription>
                  Contact {tutor.username} to discuss your requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
