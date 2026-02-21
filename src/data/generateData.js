export const COLUMN_SCHEMA = [
  { key: "id", label: "ID", width: 80 },
  { key: "firstName", label: "First Name", width: 120 },
  { key: "lastName", label: "Last Name", width: 120 },
  { key: "email", label: "Email", width: 220 },
  { key: "phone", label: "Phone", width: 160 },
  { key: "department", label: "Department", width: 130 },
  { key: "role", label: "Role", width: 120 },
  { key: "location", label: "Location", width: 130 },
  { key: "country", label: "Country", width: 110 },
  { key: "status", label: "Status", width: 110 },
  { key: "salary", label: "Salary", width: 110 },
  { key: "startDate", label: "Start Date", width: 110 },
  { key: "endDate", label: "End Date", width: 110 },
  { key: "project", label: "Project", width: 110 },
  { key: "manager", label: "Manager", width: 160 },
  { key: "team", label: "Team", width: 100 },
  { key: "score", label: "Score", width: 90 },
  { key: "level", label: "Level", width: 80 },
  { key: "region", label: "Region", width: 100 },
  { key: "notes", label: "Notes", width: 160 },
];

const FIRST_NAMES = [
  "Alice",
  "Bob",
  "Carol",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Hank",
  "Iris",
  "Jack",
  "Karen",
  "Leo",
  "Mia",
  "Nate",
  "Olivia",
  "Pete",
  "Quinn",
  "Rachel",
  "Sam",
  "Tara",
];
const LAST_NAMES = [
  "Smith",
  "Jones",
  "Brown",
  "Taylor",
  "Wilson",
  "Davis",
  "Miller",
  "Moore",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Garcia",
  "Martinez",
  "Robinson",
  "Clark",
  "Lewis",
];
const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "Finance",
  "HR",
  "Operations",
  "Legal",
  "Product",
  "Design",
  "Support",
];
const ROLES = [
  "Engineer",
  "Manager",
  "Director",
  "Analyst",
  "Coordinator",
  "Specialist",
  "Lead",
  "Associate",
  "Senior",
  "Junior",
];
const LOCATIONS = [
  "New York",
  "San Francisco",
  "Austin",
  "Seattle",
  "Boston",
  "Chicago",
  "Denver",
  "Atlanta",
  "Miami",
  "Portland",
];
const COUNTRIES = [
  "USA",
  "UK",
  "Canada",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "India",
  "Brazil",
  "Singapore",
];
const STATUSES = ["Active", "Inactive", "On Leave", "Contractor", "Pending"];
const PROJECTS = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Eta",
  "Theta",
  "Iota",
  "Kappa",
];
const TEAMS = [
  "Team A",
  "Team B",
  "Team C",
  "Team D",
  "Team E",
  "Team F",
  "Team G",
  "Team H",
];
const REGIONS = [
  "North",
  "South",
  "East",
  "West",
  "Central",
  "Pacific",
  "Atlantic",
  "Midwest",
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randDate = (startYear, endYear) => {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start))
    .toISOString()
    .split("T")[0];
};

export function generateData(rowCount = 3000) {
  return Array.from({ length: rowCount }, (_, i) => {
    const firstName = rand(FIRST_NAMES);
    const lastName = rand(LAST_NAMES);
    return {
      id: String(i + 1).padStart(4, "0"),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
      phone: `+1-${Math.floor(200 + Math.random() * 800)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      department: rand(DEPARTMENTS),
      role: rand(ROLES),
      location: rand(LOCATIONS),
      country: rand(COUNTRIES),
      status: rand(STATUSES),
      salary: `$${(40000 + Math.floor(Math.random() * 160000)).toLocaleString()}`,
      startDate: randDate(2010, 2023),
      endDate: Math.random() > 0.7 ? randDate(2023, 2025) : "Present",
      project: rand(PROJECTS),
      manager: `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`,
      team: rand(TEAMS),
      score: String((Math.random() * 100).toFixed(1)),
      level: String(Math.floor(1 + Math.random() * 10)),
      region: rand(REGIONS),
      notes: `Note-${i + 1}-${rand(["alpha", "beta", "gamma", "delta", "epsilon"])}`,
    };
  });
}
