-- 1. Create a customer company
insert into companies (name, status)
values ('Acme Client', 'active')
returning id;

-- 2. Connect the company to the Dooray project used by that customer
-- Replace <company-id> and <dooray-project-id> with real values.
insert into company_dooray_projects (
  company_id,
  dooray_project_id,
  dooray_project_name,
  active
)
values (
  '<company-id>',
  '<dooray-project-id>',
  'Acme Client Dooray Project',
  true
);

-- 3. After the customer signs in once with Supabase magic link,
-- find the user ID in Auth > Users and connect that user to the company.
insert into company_members (
  company_id,
  user_id,
  role
)
values (
  '<company-id>',
  '<supabase-auth-user-id>',
  'member'
);

-- 4. Useful verification query
select
  c.name as company_name,
  cm.user_id,
  cm.role,
  cdp.dooray_project_id,
  cdp.dooray_project_name,
  cdp.active
from companies c
join company_members cm on cm.company_id = c.id
join company_dooray_projects cdp on cdp.company_id = c.id
where c.id = '<company-id>';
