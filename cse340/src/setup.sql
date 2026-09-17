DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_name VARCHAR(100) NOT NULL UNIQUE,
  organization_description TEXT NOT NULL,
  image_file VARCHAR(100) NOT NULL
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  project_name VARCHAR(100) NOT NULL,
  project_description TEXT NOT NULL,
  project_location VARCHAR(150) NOT NULL,
  project_date DATE NOT NULL,
  project_time TIME NOT NULL,
  organization_id INTEGER NOT NULL REFERENCES organizations(organization_id)
    ON DELETE CASCADE
);

CREATE TABLE project_categories (
  project_id INTEGER NOT NULL REFERENCES projects(project_id)
    ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(category_id)
    ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

INSERT INTO organizations
  (organization_name, organization_description, image_file)
VALUES
  ('Community Support Organization',
   'Supports local communities through volunteer activities and service projects.',
   'organization1.svg'),
  ('Education for Everyone',
   'Provides educational support and learning opportunities for community members.',
   'organization2.svg'),
  ('Healthy Communities',
   'Helps communities improve health and wellness through service and outreach programs.',
   'organization3.svg');

INSERT INTO categories (category_name)
VALUES
  ('Environmental'),
  ('Educational'),
  ('Community Service'),
  ('Health and Wellness');

INSERT INTO projects
  (project_name, project_description, project_location, project_date, project_time, organization_id)
VALUES
  ('Community Cleanup',
   'Help clean and improve public spaces in the community.',
   'Riverside Park', '2026-10-03', '09:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Community Support Organization')),
  ('Food Pantry Drive',
   'Collect and organize food donations for local families.',
   'Community Food Pantry', '2026-10-10', '10:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Community Support Organization')),
  ('Neighborhood Garden',
   'Plant and maintain a shared garden for neighborhood residents.',
   'Maple Street Garden', '2026-10-17', '08:30',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Community Support Organization')),
  ('Winter Clothing Collection',
   'Sort and distribute warm clothing to neighbors in need.',
   'Community Center', '2026-10-24', '11:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Community Support Organization')),
  ('Senior Technology Workshop',
   'Help older adults learn to use phones, tablets, and online services.',
   'Westside Library', '2026-10-31', '13:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Community Support Organization')),
  ('Educational Support',
   'Support students through tutoring and educational activities.',
   'Eastside Learning Center', '2026-11-07', '15:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Education for Everyone')),
  ('Reading Partners',
   'Read with elementary students and encourage lifelong learning.',
   'Lincoln Elementary School', '2026-11-14', '09:30',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Education for Everyone')),
  ('STEM Mentoring Day',
   'Lead hands-on science and technology activities for young learners.',
   'Innovation Hall', '2026-11-21', '10:30',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Education for Everyone')),
  ('Adult Literacy Class',
   'Practice reading and writing skills with adult learners.',
   'Central Library', '2026-11-28', '18:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Education for Everyone')),
  ('School Supply Workshop',
   'Prepare learning kits for students before the new school term.',
   'Education for Everyone Office', '2026-12-05', '14:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Education for Everyone')),
  ('Community Outreach',
   'Participate in activities that support individuals and families.',
   'Healthy Communities Clinic', '2026-12-12', '09:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Healthy Communities')),
  ('Health Screening Fair',
   'Support free health screenings and wellness information for residents.',
   'Civic Plaza', '2026-12-19', '10:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Healthy Communities')),
  ('Community Fitness Walk',
   'Encourage healthy activity through an accessible community walk.',
   'Lakeside Trailhead', '2027-01-09', '08:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Healthy Communities')),
  ('Mental Wellness Workshop',
   'Share practical resources that support mental and emotional wellness.',
   'Wellness Resource Center', '2027-01-16', '16:00',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Healthy Communities')),
  ('Healthy Meals Demonstration',
   'Teach families how to prepare affordable, nutritious meals.',
   'Northside Community Kitchen', '2027-01-23', '11:30',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Healthy Communities'));

INSERT INTO project_categories (project_id, category_id)
SELECT p.project_id, c.category_id
FROM projects p
JOIN organizations o ON o.organization_id = p.organization_id
JOIN categories c ON c.category_name = CASE
  WHEN o.organization_name = 'Education for Everyone' THEN 'Educational'
  WHEN o.organization_name = 'Healthy Communities' THEN 'Health and Wellness'
  ELSE 'Community Service'
END;