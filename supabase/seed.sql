insert into companies (id, name, status)
values ('11111111-1111-1111-1111-111111111111', 'Sample Client', 'active')
on conflict (id) do nothing;

insert into company_dooray_projects (
  id,
  company_id,
  dooray_project_id,
  dooray_project_name,
  active
)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'sample-dooray-project',
  'Sample Dooray Project',
  true
)
on conflict (id) do nothing;

-- Example:
-- After a real user signs in once, find the user's auth ID in Supabase Auth,
-- then connect that user to a company with a row like:
--
-- insert into company_members (company_id, user_id, role)
-- values (
--   '11111111-1111-1111-1111-111111111111',
--   '<supabase-auth-user-id>',
--   'admin'
-- );
