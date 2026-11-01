/**
 * content/roles.ts
 *
 * Applicant role list — the single shared constant used by:
 * 1. The ApplicantForm <select> element
 * 2. The Zod enum in lib/validators.ts
 * 3. The email subject label in lib/mail.ts
 *
 * Keep in sync in exactly ONE place so they never drift apart. (api.md §1.2)
 * OWNER-CONFIRM: confirm this list with the owner before launch.
 */

export const ROLES = [
  { value: "nurse", label: "Nurse" },
  { value: "bedside-attendant", label: "Bedside attendant" },
  { value: "elderly-caretaker", label: "Elderly caretaker" },
  { value: "dementia-caretaker", label: "Dementia / Alzheimer's caretaker" },
  { value: "mother-baby-caretaker", label: "Mother and baby caretaker" },
  { value: "live-in-caretaker", label: "Live-in caretaker" },
  { value: "patient-transport-driver", label: "Patient transport driver" },
  { value: "other", label: "Other" },
] as const;

export type RoleValue = (typeof ROLES)[number]["value"];

/** Quick lookup: value → label (used in email subjects) */
export const ROLE_LABEL: Record<RoleValue, string> = Object.fromEntries(
  ROLES.map((r) => [r.value, r.label])
) as Record<RoleValue, string>;
