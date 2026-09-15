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
  (project_name, project_description, organization_id)
VALUES
  ('Community Cleanup',
   'Help clean and improve public spaces in the community.',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Community Support Organization')),
  ('Educational Support',
   'Support students through tutoring and educational activities.',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Education for Everyone')),
  ('Community Outreach',
   'Participate in activities that support individuals and families.',
   (SELECT organization_id FROM organizations
    WHERE organization_name = 'Healthy Communities'));

INSERT INTO project_categories (project_id, category_id)
VALUES
  ((SELECT project_id FROM projects WHERE project_name = 'Community Cleanup'),
   (SELECT category_id FROM categories WHERE category_name = 'Environmental')),
  ((SELECT project_id FROM projects WHERE project_name = 'Community Cleanup'),
   (SELECT category_id FROM categories WHERE category_name = 'Community Service')),
  ((SELECT project_id FROM projects WHERE project_name = 'Educational Support'),
   (SELECT category_id FROM categories WHERE category_name = 'Educational')),
  ((SELECT project_id FROM projects WHERE project_name = 'Community Outreach'),
   (SELECT category_id FROM categories WHERE category_name = 'Community Service')),
  ((SELECT project_id FROM projects WHERE project_name = 'Community Outreach'),
   (SELECT category_id FROM categories WHERE category_name = 'Health and Wellness'));