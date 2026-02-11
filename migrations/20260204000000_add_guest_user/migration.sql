-- Insert guest user if it doesn't already exist
INSERT INTO "user" (
  "id",
  "name",
  "email",
  "email_verified",
  "username",
  "display_username",
  "two_factor_enabled",
  "created_at",
  "updated_at"
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Guest User',
  'guest@reactive-resume.com',
  true,
  'guest',
  'guest',
  false,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;