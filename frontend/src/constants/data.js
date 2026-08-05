export const JobCategories = [
  "Programming",
  "Data Science",
  "Designing",
  "Networking",
  "Management",
  "Marketing",
  "Cybersecurity",
];

export const JobLocations = [
  "Bangalore",
  "Indore",
  "Hyderabad",
  "Mumbai",
  "Ujjain",
  "Chennai",
  "Delhi",
];

export const JobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

// Deterministic color per company name, used for the initials avatar badge
// so listings look visually distinct without needing uploaded logo images.
const AVATAR_COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#db2777'];

export function companyColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function companyInitials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
