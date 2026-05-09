# Security Specification - EVn Chat

## Data Invariants
1. A user can only create their own profile (`/users/{uid}`).
2. Profile updates are action-based: Owner can update `displayName`, `lastActive`, `settings`, and `contacts`.
3. `displayName` is limited to 60 chars. `uniqueCode` is limited to 15 chars.
4. Chat access is strictly restricted to the two participants identified in the `chatId` (`{uid1}_{uid2}`).
5. Group messages can only be read/created by group members.
6. Group admins have full control over group metadata and can delete any message.
7. Members can only delete their own messages.
8. Requests can only be updated (status changes) by the recipient or the sender.
9. Device authentication (`deviceAuth`) is strictly per-owner.
10. Message history (`history`) is immutable (create-only for users) and read-accessible to any authenticated user.
11. Backups (`userBackups`, `privateKeyBackups`) are write-only for users, providing a secure one-way sync to the server.

## The "Dirty Dozen" (Attack Payloads)
1. **Identity Spoofing**: Attempt to create a user profile with a different UID.
2. **Settings Hijack**: Attempt to read/write another user's settings.
3. **Chat Snooping**: User A attempts to read messages in a chat between User B and User C.
4. **Message Impersonation**: Attempt to send a message as another user (senderId spoofing).
5. **Unauthorized Message Deletion**: Attempt to delete another user's message in a P2P chat.
6. **Group Message Leak**: Non-member attempts to read group messages via `get()`.
7. **Malicious Group Meta Update**: Member attempts to change group `name` or `adminUid`.
8. **Nickname Poisoning**: Attempt to set an excessively large object in `settings.customNames`.
9. **Fake ID Injection**: Attempt to use invalid characters in a message ID.
10. **Admin Escalation**: Attempt to bypass `isAdmin()` without being the specific whitelisted email.
11. **Contact Manipulation**: Attempt to add/remove contacts for another user without being in their list.
12. **Request Hijacking**: Third party attempts to accept a friend request intended for someone else.

## Conflict Report
| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
| :--- | :--- | :--- | :--- |
| users | BLOCKED | BLOCKED | BLOCKED |
| chats | BLOCKED | N/A | BLOCKED |
| groups | BLOCKED | BLOCKED | BLOCKED |
| requests | BLOCKED | BLOCKED | BLOCKED |
| deviceAuth | BLOCKED | N/A | BLOCKED |
| history | BLOCKED (Delete) | N/A | BLOCKED |
| userBackups | N/A (Read Blocked)| N/A | BLOCKED |
