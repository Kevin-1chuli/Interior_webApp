-- AlterEnum: Rename OWNER to MANAGER in UserRole enum
BEGIN;

-- Update all existing OWNER records to MANAGER
UPDATE users SET role = 'MANAGER' WHERE role = 'OWNER';

-- Rename the enum type
ALTER TYPE "UserRole" RENAME TO "UserRole_old";

-- Create new enum type with MANAGER instead of OWNER
CREATE TYPE "UserRole" AS ENUM ('MANAGER', 'STAFF');

-- Update the column to use the new enum
ALTER TABLE users 
  ALTER COLUMN role TYPE "UserRole" 
  USING (role::text::"UserRole");

-- Drop the old enum type
DROP TYPE "UserRole_old";

COMMIT;
