/**
 * User document structure from Firestore
 */
export type UserDoc = {
  uid: string;
  email: string;
  roles: Record<string, boolean>;
  createdAt: Date;

  // Profile fields
  name?: string;              // User-editable custom name
  phone?: string;             // User-editable phone
  customPhotoURL?: string;    // User-uploaded avatar (stored in Storage)

  // Cached from Firebase Auth (auto-populated, not editable)
  displayName?: string;       // From Google OAuth
  photoURL?: string;          // From Google OAuth

  // Preferences
  preferredLanguage?: string;
  preferredScheduleStyle?: string;
}

/**
 * Bilingual text structure used throughout the app
 */
export type BilingualText = {
  en: string;
  he: string;
};

/**
 * Class levels
 */
export type ClassLevel = 'Kids' | 'Beginner' | 'All Levels' | 'Advanced' | 'Master' | 'Women';

/**
 * Class types
 */
export type ClassType = 'Gi' | 'No-Gi' | 'Open Mat' | 'MMA' | 'Functional';

/**
 * Complete class document structure from Firestore
 */
export type ClassDoc = {
  id: string;
  title: BilingualText;
  coach: BilingualText;
  level: ClassLevel;
  type: ClassType;
  repeated: boolean;
  active?: boolean;
  // Repeated fields
  weekday?: number; // 0-6 (Sun-Sat)
  startDate?: string; // YYYY-MM-DD (first occurrence not earlier than this)
  // Unique fields
  date?: string; // YYYY-MM-DD
  // Common time fields
  startTime: string; // HH:MM (24h)
  endTime: string;   // HH:MM (24h)
  // Audit
  createdBy?: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

/**
 * Snapshot of class details stored with registrations for historical accuracy
 */
export type ClassSnapshot = {
  title: BilingualText;
  coach: BilingualText;
  startTime: string;
  endTime: string;
  level?: string;
  type?: string;
};

/**
 * Class registration document structure
 */
export type RegistrationDoc = {
  classId: string;
  date: string; // YYYY-MM-DD occurrence
  uid: string; // registered user
  email: string; // snapshot of user email at time of action
  name?: string; // snapshot of user name at time of action
  createdAt: Date;
  createdBy: string; // actor who created the registration
  createdByName?: string;
  confirmedAttendance?: boolean;
  classSnapshot?: ClassSnapshot;
};

/**
 * User attendee information
 */
export type AttendeeInfo = {
  uid: string;
  name: string;
  photoURL?: string;
  confirmedAttendance: boolean;
};

/**
 * Class form data (subset of ClassDoc used for create/update)
 */
export type ClassFormData = Omit<
  ClassDoc,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
>;

/**
 * Firestore document data with unknown structure
 */
export type FirestoreDocData = Record<string, unknown>;

/**
 * React child props with flexible typing
 */
export type ReactChildProps = {
  value?: string | number;
  disabled?: boolean;
  children?: React.ReactNode;
  [key: string]: unknown;
};