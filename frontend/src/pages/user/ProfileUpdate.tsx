import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import api from "../../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

/* ------------------ OPTIONS ------------------ */
const subjectOptions = [
  { value: "Math", label: "Math" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "English", label: "English" },
];

const classOptions = [
  { value: "Class 6", label: "Class 6" },
  { value: "Class 7", label: "Class 7" },
  { value: "Class 8", label: "Class 8" },
  { value: "SSC", label: "SSC" },
  { value: "HSC", label: "HSC" },
];

const tuitionTypeOptions = [
  { value: "Home", label: "Home" },
  { value: "Online", label: "Online" },
  { value: "Both", label: "Both" },
];

const mediumOptions = [
  { value: "Bangla", label: "Bangla" },
  { value: "English", label: "English" },
  { value: "English Version", label: "English Version" },
];

const curriculumOptions = [
  { value: "NCTB", label: "NCTB" },
  { value: "Cambridge", label: "Cambridge" },
  { value: "Edexcel", label: "Edexcel" },
];

const genderOptions = [
  { value: 1, label: "Male" },
  { value: 2, label: "Female" },
  { value: 3, label: "Other" },
];

const daysOptions = [
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
];

interface SelectOption {
  value: string | number;
  label: string;
}

interface TutorProfileResponse {
  username: string;
  headline: string | null;
  bio: string | null;
  profilePhoto: string | null;
  coverPhoto: string | null;
  gender: number | null;
  dateOfBirth: string | null;
  highestEducation: string | null;
  institution: string | null;
  department: string | null;
  currentStatus: string | null;
  experienceYears: number;
  tuitionType: string;
  preferredGender: number | null;
  expectedSalary: number | null;
  availableDays: string | null;
  availableTime: string | null;
  city: string;
  area: string | null;
  medium: string | null;
  curriculum: string | null;
  isAvailable: boolean;
  willingToTravel: boolean;
  subjects: string;
  classes: string;
}

interface FormState {
  username: string;
  headline: string;
  bio: string;
  profilePhoto: string;
  coverPhoto: string;
  gender: number | null;
  dateOfBirth: string;
  highestEducation: string;
  institution: string;
  department: string;
  currentStatus: string;
  experienceYears: number | string;
  tuitionType: string;
  preferredGender: number | null;
  expectedSalary: number | string;
  availableDays: SelectOption[];
  availableTime: string;
  city: string;
  area: string;
  medium: string;
  curriculum: string;
  isAvailable: boolean;
  willingToTravel: boolean;
  subjects: SelectOption[];
  classes: SelectOption[];
}

/* ------------------ HELPER: SAFE JSON PARSE ------------------ */
const safeJsonParse = (jsonString: string | null | undefined): string[] => {
  if (
    !jsonString ||
    typeof jsonString !== "string" ||
    jsonString.trim() === ""
  ) {
    return [];
  }
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse JSON string:", jsonString, error);
    return [];
  }
};

/* ------------------ COMPONENT ------------------ */
export default function ProfileUpdate() {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery<{
    message: string;
    tutor: TutorProfileResponse;
  }>({
    queryKey: ["tutor-profile"],
    queryFn: () => api.get("/main/tutor/profile").then((res) => res.data),
  });

  const profile = response?.tutor;

  const [form, setForm] = useState<FormState>({
    username: "",
    headline: "",
    bio: "",
    profilePhoto: "",
    coverPhoto: "",
    gender: null,
    dateOfBirth: "",
    highestEducation: "",
    institution: "",
    department: "",
    currentStatus: "",
    experienceYears: 0,
    tuitionType: "",
    preferredGender: null,
    expectedSalary: "",
    availableDays: [],
    availableTime: "",
    city: "",
    area: "",
    medium: "",
    curriculum: "",
    isAvailable: true,
    willingToTravel: true,
    subjects: [],
    classes: [],
  });

  /* ------------------ POPULATE FORM SAFELY ------------------ */
  useEffect(() => {
    if (profile) {
      const parsedSubjects = safeJsonParse(profile.subjects);
      const parsedClasses = safeJsonParse(profile.classes);
      const parsedDays = safeJsonParse(profile.availableDays);

      setForm({
        username: profile.username || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        profilePhoto: profile.profilePhoto || "",
        coverPhoto: profile.coverPhoto || "",
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth || "",
        highestEducation: profile.highestEducation || "",
        institution: profile.institution || "",
        department: profile.department || "",
        currentStatus: profile.currentStatus || "",
        experienceYears: profile.experienceYears ?? 0,
        tuitionType: profile.tuitionType || "",
        preferredGender: profile.preferredGender,
        expectedSalary: profile.expectedSalary ?? "",
        availableTime: profile.availableTime || "",
        city: profile.city || "",
        area: profile.area || "",
        medium: profile.medium || "",
        curriculum: profile.curriculum || "",
        isAvailable: profile.isAvailable ?? true,
        willingToTravel: profile.willingToTravel ?? true,

        subjects: parsedSubjects.map((val: string) => ({
          value: val,
          label: val,
        })),
        classes: parsedClasses.map((val: string) => ({
          value: val,
          label: val,
        })),
        availableDays: parsedDays.map((val: string) => ({
          value: val,
          label: val,
        })),
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (payload: any) => api.put("/main/tutor/profile", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-profile"] });
      alert("Profile updated successfully!");
    },
    onError: (error: any) => {
      console.error("Update failed:", error);
      alert("Failed to update profile. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (!form.username.trim()) {
      alert("Username is required");
      return;
    }
    if (!form.city.trim()) {
      alert("City is required");
      return;
    }
    if (!form.tuitionType) {
      alert("Tuition type is required");
      return;
    }
    if (form.subjects.length === 0) {
      alert("At least one subject is required");
      return;
    }
    if (form.classes.length === 0) {
      alert("At least one class is required");
      return;
    }

    mutation.mutate({
      username: form.username,
      headline: form.headline || null,
      bio: form.bio || null,
      profilePhoto: form.profilePhoto || null,
      coverPhoto: form.coverPhoto || null,
      gender: form.gender || null,
      dateOfBirth: form.dateOfBirth || null,
      highestEducation: form.highestEducation || null,
      institution: form.institution || null,
      department: form.department || null,
      currentStatus: form.currentStatus || null,
      experienceYears: Number(form.experienceYears) || 0,
      tuitionType: form.tuitionType,
      preferredGender: form.preferredGender || null,
      expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : null,
      availableDays:
        form.availableDays.length > 0
          ? JSON.stringify(form.availableDays.map((d) => d.value))
          : null,
      availableTime: form.availableTime || null,
      city: form.city,
      area: form.area || null,
      medium: form.medium || null,
      curriculum: form.curriculum || null,
      isAvailable: form.isAvailable,
      willingToTravel: form.willingToTravel,
      subjects: JSON.stringify(form.subjects.map((s) => s.value)),
      classes: JSON.stringify(form.classes.map((c) => c.value)),
    });
  };

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-lg">Loading your profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Update Tutor Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* PUBLIC PROFILE */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Public Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Username *</Label>
                <Input
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Headline</Label>
                <Input
                  placeholder="e.g., Experienced Math Tutor for SSC & HSC"
                  value={form.headline}
                  onChange={(e) =>
                    setForm({ ...form, headline: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                placeholder="Tell students about yourself..."
                value={form.bio}
                rows={5}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Profile Photo URL</Label>
                <Input
                  placeholder="https://example.com/photo.jpg"
                  value={form.profilePhoto}
                  onChange={(e) =>
                    setForm({ ...form, profilePhoto: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Cover Photo URL</Label>
                <Input
                  placeholder="https://example.com/cover.jpg"
                  value={form.coverPhoto}
                  onChange={(e) =>
                    setForm({ ...form, coverPhoto: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Gender</Label>
                <Select
                  options={genderOptions}
                  value={
                    genderOptions.find((o) => o.value === form.gender) || null
                  }
                  onChange={(v) =>
                    setForm({ ...form, gender: (v?.value as number) || null })
                  }
                  isClearable
                  placeholder="Select gender"
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    setForm({ ...form, dateOfBirth: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          {/* ACADEMIC INFORMATION */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Highest Education</Label>
                <Input
                  placeholder="e.g., BSc in Physics"
                  value={form.highestEducation}
                  onChange={(e) =>
                    setForm({ ...form, highestEducation: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Institution</Label>
                <Input
                  placeholder="e.g., Dhaka University"
                  value={form.institution}
                  onChange={(e) =>
                    setForm({ ...form, institution: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Department</Label>
                <Input
                  placeholder="e.g., Physics"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Current Status</Label>
                <Input
                  placeholder="e.g., 4th Year Student"
                  value={form.currentStatus}
                  onChange={(e) =>
                    setForm({ ...form, currentStatus: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          {/* TEACHING DETAILS */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Teaching Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Subjects *</Label>
                <Select
                  isMulti
                  options={subjectOptions}
                  value={form.subjects}
                  onChange={(v) =>
                    setForm({ ...form, subjects: v as SelectOption[] })
                  }
                  placeholder="Select subjects you can teach"
                />
              </div>
              <div>
                <Label>Classes *</Label>
                <Select
                  isMulti
                  options={classOptions}
                  value={form.classes}
                  onChange={(v) =>
                    setForm({ ...form, classes: v as SelectOption[] })
                  }
                  placeholder="Select classes you can teach"
                />
              </div>
              <div>
                <Label>Medium</Label>
                <Select
                  options={mediumOptions}
                  value={
                    mediumOptions.find((o) => o.value === form.medium) || null
                  }
                  onChange={(v) =>
                    setForm({ ...form, medium: (v?.value as string) || "" })
                  }
                  isClearable
                  placeholder="Select medium"
                />
              </div>
              <div>
                <Label>Curriculum</Label>
                <Select
                  options={curriculumOptions}
                  value={
                    curriculumOptions.find(
                      (o) => o.value === form.curriculum
                    ) || null
                  }
                  onChange={(v) =>
                    setForm({ ...form, curriculum: (v?.value as string) || "" })
                  }
                  isClearable
                  placeholder="Select curriculum"
                />
              </div>
              <div>
                <Label>Experience Years</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.experienceYears}
                  onChange={(e) =>
                    setForm({ ...form, experienceYears: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          {/* TUITION PREFERENCES */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Tuition Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tuition Type *</Label>
                <Select
                  options={tuitionTypeOptions}
                  value={
                    tuitionTypeOptions.find(
                      (o) => o.value === form.tuitionType
                    ) || null
                  }
                  onChange={(v) =>
                    setForm({
                      ...form,
                      tuitionType: (v?.value as string) || "",
                    })
                  }
                  placeholder="Select tuition type"
                />
              </div>
              <div>
                <Label>Preferred Student Gender</Label>
                <Select
                  options={genderOptions}
                  value={
                    genderOptions.find(
                      (o) => o.value === form.preferredGender
                    ) || null
                  }
                  onChange={(v) =>
                    setForm({
                      ...form,
                      preferredGender: (v?.value as number) || null,
                    })
                  }
                  isClearable
                  placeholder="Any"
                />
              </div>
              <div>
                <Label>Expected Salary (BDT per month)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 5000"
                  value={form.expectedSalary}
                  onChange={(e) =>
                    setForm({ ...form, expectedSalary: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Available Days</Label>
                <Select
                  isMulti
                  options={daysOptions}
                  value={form.availableDays}
                  onChange={(v) =>
                    setForm({ ...form, availableDays: v as SelectOption[] })
                  }
                  placeholder="Select available days"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Available Time</Label>
                <Input
                  placeholder="e.g., 4 PM - 8 PM"
                  value={form.availableTime}
                  onChange={(e) =>
                    setForm({ ...form, availableTime: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          {/* LOCATION */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>City *</Label>
                <Input
                  placeholder="e.g., Dhaka"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <Label>Area</Label>
                <Input
                  placeholder="e.g., Dhanmondi, Mirpur"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* AVAILABILITY */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold">Availability</h3>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <Label>Available for Tuition</Label>
                <Switch
                  checked={form.isAvailable}
                  onCheckedChange={(v) => setForm({ ...form, isAvailable: v })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Label>Willing to Travel</Label>
                <Switch
                  checked={form.willingToTravel}
                  onCheckedChange={(v) =>
                    setForm({ ...form, willingToTravel: v })
                  }
                />
              </div>
            </div>
          </section>

          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full mt-8"
            size="lg"
          >
            {mutation.isPending ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
