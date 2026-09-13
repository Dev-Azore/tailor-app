# Admin Provisioning Runbook

Admins cannot self-register on the Tailor Measurement Management System. To provision a new admin account, follow these steps:

1. **Create the user**
   Navigate to the Supabase Dashboard → Authentication → Users → Add user.
   Create the user with an email and password, or invite them via email.

2. **Confirm the profile row exists**
   When the user signs up (or is created), a trigger automatically creates a row in the `public.users` table with the default role `'tailor'`.
   Confirm this via the Supabase SQL Editor:
   ```sql
   select id, name, role from public.users where id = '<user-uuid>';
   ```

3. **Promote to admin**
   You must use the `service_role` key to bypass RLS, because the RLS policy for updating accounts only permits admins to update the `status` column, not the `role` column.
   Run the following in the Supabase SQL Editor (which uses `service_role` privileges by default), or via a secure backend script:
   ```sql
   update public.users set role = 'admin' where id = '<user-uuid>';
   ```

4. **Verify the promotion**
   Check that the role was updated successfully:
   ```sql
   select id, name, role from public.users where id = '<user-uuid>';
   -- Expect: role = 'admin'
   ```

The user can now log in and access the `/admin` routes.
