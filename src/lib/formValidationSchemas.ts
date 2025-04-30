import { z } from "zod";

// Academic Subject Validation
export const courseValidation = z.object({
  identifier: z.number().optional(),
  title: z.string().min(1, "Course title cannot be empty"),
  instructors: z.array(z.string()).nonempty("At least one instructor required"),
});

export type CourseData = z.infer<typeof courseValidation>;

// Classroom Group Validation
export const groupValidation = z.object({
  identifier: z.number().optional(),
  groupName: z.string().min(1, "Group designation required"),
  maxStudents: z.number().min(1, "Minimum capacity is 1"),
  levelId: z.number().min(1, "Academic level required"),
  leadInstructorId: z.string().optional(),
});

export type GroupData = z.infer<typeof groupValidation>;

// Educator Validation
export const educatorValidation = z.object({
  identifier: z.string().optional(),
  userHandle: z.string()
    .min(3, "Minimum 3 characters for user handle")
    .max(20, "Maximum 20 characters for user handle"),
  secretCode: z.string()
    .min(8, "Security code requires 8+ characters")
    .optional()
    .or(z.literal("")),
  firstName: z.string().min(1, "Given name required"),
  lastName: z.string().min(1, "Family name required"),
  contactEmail: z.string()
    .email("Valid email format required")
    .optional()
    .or(z.literal("")),
  contactNumber: z.string().optional(),
  residence: z.string().min(1, "Location information required"),
  profileImage: z.string().optional(),
  hematology: z.string().min(1, "Blood classification required"),
  birthDate: z.date("Valid date of birth required"),
  gender: z.enum(["MALE", "FEMALE"], "Gender specification required"),
  specialties: z.array(z.string()).optional(),
});

export type EducatorData = z.infer<typeof educatorValidation>;

// Learner Validation
export const learnerValidation = z.object({
  identifier: z.string().optional(),
  userHandle: z.string()
    .min(3, "Minimum 3 characters for user handle")
    .max(20, "Maximum 20 characters for user handle"),
  secretCode: z.string()
    .min(8, "Security code requires 8+ characters")
    .optional()
    .or(z.literal("")),
  firstName: z.string().min(1, "Given name required"),
  lastName: z.string().min(1, "Family name required"),
  contactEmail: z.string()
    .email("Valid email format required")
    .optional()
    .or(z.literal("")),
  contactNumber: z.string().optional(),
  residence: z.string().min(1, "Location information required"),
  profileImage: z.string().optional(),
  hematology: z.string().min(1, "Blood classification required"),
  birthDate: z.date("Valid date of birth required"),
  gender: z.enum(["MALE", "FEMALE"], "Gender specification required"),
  academicLevel: z.number().min(1, "Academic level required"),
  groupId: z.number().min(1, "Learning group required"),
  guardianId: z.string().min(1, "Guardian reference required"),
});

export type LearnerData = z.infer<typeof learnerValidation>;

// Assessment Validation
export const assessmentValidation = z.object({
  identifier: z.number().optional(),
  evaluationTitle: z.string().min(1, "Assessment title required"),
  commencement: z.date("Start time required"),
  conclusion: z.date("End time required"),
  moduleId: z.number("Academic module reference required"),
});

export type AssessmentData = z.infer<typeof assessmentValidation>;

// Institutional Notice Validation
export const noticeValidation = z.object({
  identifier: z.number().optional(),
  heading: z.string()
    .min(1, "Notice heading required")
    .refine(text => text.trim().split(/\s+/).length >= 3, {
      message: "Heading must contain minimum 3 terms"
    }),
  content: z.string()
    .min(12, "Detailed content required (12+ characters)"),
  publicationDate: z.string()
    .min(1, "Publication date required")
    .transform(text => new Date(text)),
  groupReference: z.string()
    .optional()
    .transform(text => text ? parseInt(text) : null),
});

export type NoticeData = z.infer<typeof noticeValidation>;

// Academic Calendar Event Validation
export const calendarEventValidation = z.object({
  identifier: z.number().optional(),
  eventTitle: z.string()
    .min(1, "Event designation required")
    .refine(text => text.trim().split(/\s+/).length >= 3, {
      message: "Title must contain minimum 3 terms"
    }),
  eventDetails: z.string()
    .min(12, "Event description required (12+ characters)"),
  startDateTime: z.string().min(1, "Commencement time required"),
  endDateTime: z.string().min(1, "Conclusion time required"),
  groupReference: z.string().optional(),
});

export type CalendarEventData = z.infer<typeof calendarEventValidation>;

// Wellbeing Assessment Validation
export const wellbeingValidation = z.object({
  identifier: z.number().optional(),
  userReference: z.string(),
  evaluationStress: z.number().min(0).max(4),
  taskStress: z.number().min(0).max(3),
  complexity: z.number().min(1).max(5),
  overload: z.number().min(1).max(5),
  respitePattern: z.enum(["Never", "Infrequent", "Occasional", "Regular"]),
  restPattern: z.enum(["<4", "4-6", "6-8", "8+"]),
  movement: z.enum(["Sedentary", "Light", "Moderate", "Vigorous"]),
  stressSource: z.string().optional(),
  relaxation: z.boolean(),
});

export type WellbeingData = z.infer<typeof wellbeingValidation>;
