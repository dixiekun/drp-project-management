# Project Guidelines for Claude

## Debugging Protocol

When encountering runtime errors:

1. **READ THE ERROR MESSAGE FIRST** - The error message tells you exactly what's wrong and where
2. **Trace back to the source** - If error says "Cannot read properties of undefined (reading 'name')", check:
   - What object is undefined?
   - Where is that data supposed to come from?
   - Is the data being loaded correctly?
3. **Check the actual data flow** - Verify queries include necessary relations (e.g., `with` clauses in Drizzle)
4. **DO NOT blame infrastructure first** - Don't assume it's the database, network, or server unless you have evidence
5. **DO NOT make random changes** - Don't add/remove React refs, kill servers, or switch databases without understanding the root cause

### Bad Debugging Approach (DO NOT DO THIS):
- Seeing slow loading → assume it's Turso
- Seeing undefined → assume it's React Strict Mode
- Seeing errors → kill all servers and restart
- Making 10+ changes without understanding the issue

### Good Debugging Approach:
- Read error → Check code at error line → Trace data source → Fix the actual issue
- One systematic change at a time
- Verify assumptions with logs/data inspection

## Database

- Currently using local SQLite (local.db) for development
- This is a single-file database suitable for development and small deployments
- **For production with multiple concurrent users, you MUST switch back to Turso** (or another proper database server)
- Local SQLite will NOT work for multi-user web apps due to:
  - File locking issues with concurrent writes
  - No network access (can't deploy to Vercel/production)
  - Single connection limitations

## Stack

- Next.js 14 (App Router)
- Drizzle ORM with LibSQL
- Clerk Authentication
- TailwindCSS + shadcn/ui
- Turso (for production)
