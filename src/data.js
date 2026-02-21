// Column definitions - 20 columns
export const COLUMN_KEYS = [
  'id', 'firstName', 'lastName', 'email', 'phone',
  'department', 'role', 'location', 'country', 'status',
  'salary', 'startDate', 'endDate', 'project', 'manager',
  'team', 'score', 'level', 'region', 'notes',
];

const FIRST_NAMES = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Hank', 'Iris', 'Jack',
  'Karen', 'Leo', 'Mia', 'Nate', 'Olivia', 'Pete', 'Quinn', 'Rachel', 'Sam', 'Tara'];
const LAST_NAMES = ['Smith', 'Jones', 'Brown', 'Taylor', 'Wilson', 'Davis', 'Miller', 'Moore', 'Anderson', 'Thomas',
  'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Lewis'];
const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations', 'Legal', 'Product', 'Design', 'Support'];
const ROLES = ['Engineer', 'Manager', 'Director', 'Analyst', 'Coordinator', 'Specialist', 'Lead', 'Associate', 'Senior', 'Junior'];
const LOCATIONS = ['New York', 'San Francisco', 'Austin', 'Seattle', 'Boston', 'Chicago', 'Denver', 'Atlanta', 'Miami', 'Portland'];
const COUNTRIES = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Australia', 'Japan', 'India', 'Brazil', 'Singapore'];
const STATUSES = ['Active', 'Inactive', 'On Leave', 'Contractor', 'Pending'];
const PROJECTS = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
const TEAMS = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F', 'Team G', 'Team H'];
const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Pacific', 'Atlantic', 'Midwest'];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
}

export function generateData(rowCount = 3000) {
  return Array.from({ length: rowCount }, (_, i) => {
    const firstName = rand(FIRST_NAMES);
    const lastName = rand(LAST_NAMES);
    return {
      id: String(i + 1).padStart(4, '0'),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
      phone: `+1-${String(Math.floor(200 + Math.random() * 800))}-${String(Math.floor(100 + Math.random() * 900))}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      department: rand(DEPARTMENTS),
      role: rand(ROLES),
      location: rand(LOCATIONS),
      country: rand(COUNTRIES),
      status: rand(STATUSES),
      salary: `$${(40000 + Math.floor(Math.random() * 160000)).toLocaleString()}`,
      startDate: randDate(2010, 2023),
      endDate: Math.random() > 0.7 ? randDate(2023, 2025) : 'Present',
      project: rand(PROJECTS),
      manager: `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`,
      team: rand(TEAMS),
      score: String((Math.random() * 100).toFixed(1)),
      level: String(Math.floor(1 + Math.random() * 10)),
      region: rand(REGIONS),
      notes: `Note-${i + 1}-${rand(['alpha', 'beta', 'gamma', 'delta', 'epsilon'])}`,
    };
  });
}
