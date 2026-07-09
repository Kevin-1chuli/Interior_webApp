-- Update OWNER role to MANAGER role
-- This migration renames the OWNER enum value to MANAGER

-- First, update all OWNER users to MANAGER
UPDATE users SET role = 'MANAGER' WHERE role = 'OWNER';

-- Drop the old enum type and create new one
ALTER TYPE "UserRole" RENAME TO "UserRole_old";

CREATE TYPE "UserRole" AS ENUM ('MANAGER', 'STAFF');

ALTER TABLE users 
  ALTER COLUMN role TYPE "UserRole" 
  USING (role::text::"UserRole");

DROP TYPE "UserRole_old";
