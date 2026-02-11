# Guest User Implementation

This implementation adds a "Continue as Guest" option that allows users to create and edit resumes without authentication.

## What Was Changed

### 1. **Guest User Helper** (`src/integrations/orpc/helpers/guest-user.ts`)
- Created a helper function `ensureGuestUserExists()` that creates a guest user with UUID `00000000-0000-0000-0000-000000000000`
- Handles race conditions with proper error handling
- Guest user is automatically created when needed

### 2. **Login Page** (`src/routes/auth/-components/social-auth.tsx`)
- Added a prominent "Continue as Guest" button at the top of social auth options
- Sets `guestMode=true` in localStorage when clicked
- Redirects to `/dashboard/resumes` without authentication

### 3. **Route Guards**
- **Dashboard Route** (`src/routes/dashboard/route.tsx`): Allows access if `guestMode=true` in localStorage
- **Builder Route** (`src/routes/builder/$resumeId/route.tsx`): Allows access if `guestMode=true` in localStorage

### 4. **API Endpoints** (`src/integrations/orpc/router/resume.ts`)
Converted the following endpoints from `protectedProcedure` to `publicProcedure`:
- `resume.list` - List all resumes
- `resume.getById` - Get a specific resume
- `resume.create` - Create a new resume (calls `ensureGuestUserExists()`)
- `resume.import` - Import a resume (calls `ensureGuestUserExists()`)
- `resume.update` - Update a resume
- `resume.delete` - Delete a resume
- `resume.duplicate` - Duplicate a resume
- `resume.setLocked` - Lock/unlock a resume
- `resume.setPassword` - Set password on a resume
- `resume.removePassword` - Remove password from a resume
- `resume.tags.list` - List resume tags
- `resume.statistics.getById` - Get resume statistics

All endpoints now use: `const userId = context.user?.id ?? GUEST_USER_ID;`

### 5. **Guest User Setup Script** (`scripts/database/create-guest-user.ts`)
- Script to manually create the guest user in the database
- Can be run before starting the app to pre-populate the database

## How It Works

1. **User clicks "Continue as Guest"**
   - Sets `localStorage.setItem("guestMode", "true")`
   - Redirects to dashboard

2. **Route guards check for guest mode**
   - Routes allow access if either `session` exists OR `guestMode=true`

3. **API calls use guest user ID**
   - When no authenticated user, APIs fall back to `GUEST_USER_ID`
   - First API call that creates data automatically creates the guest user

4. **Guest user persists in database**
   - All guest resumes are associated with `00000000-0000-0000-0000-000000000000`
   - Guest data persists across sessions

## Setup Instructions

### Option 1: Automatic (Recommended)
Just start using the app! The guest user will be created automatically when you:
1. Click "Continue as Guest" on the login page
2. Create your first resume

### Option 2: Manual Setup
If you want to pre-create the guest user:

```bash
# Make sure your PostgreSQL database is running
# Then run:
source .env
export $(grep -v '^#' .env | xargs)
npx tsx scripts/database/create-guest-user.ts
```

## Testing

1. Start your development server: `pnpm dev`
2. Navigate to the login page
3. Click "Continue as Guest"
4. You should be redirected to `/dashboard/resumes`
5. Create a new resume - it should work without any authentication!

## Technical Notes

- **Guest User ID**: Uses the nil UUID (`00000000-0000-0000-0000-000000000000`) which is a standard convention
- **Data Isolation**: All guest users share the same data (all resumes created by any guest user)
- **Security**: Guest mode is indicated by localStorage flag, actual user ID is managed server-side
- **Backward Compatibility**: Authenticated users continue to work normally with their own data

## Future Improvements (Optional)

- Add a banner in guest mode indicating limited features
- Add option to "upgrade" guest account by creating an account
- Implement guest data migration when signing up
- Add session-based guest IDs for better data isolation
