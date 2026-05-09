import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

let testEnv: RulesTestEnvironment;

describe('Firestore Security Rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'evn-chat-test',
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it('allows user to create their own profile', async () => {
    const aliceContext = testEnv.authenticatedContext('alice', { email: 'alice@example.com' });
    const aliceDb = aliceContext.firestore();
    await assertSucceeds(setDoc(doc(aliceDb, 'users', 'alice'), {
      uid: 'alice',
      displayName: 'Alice',
      email: 'alice@example.com'
    }));
  });

  it('blocks user from creating profile with different UID', async () => {
    const aliceContext = testEnv.authenticatedContext('alice');
    const aliceDb = aliceContext.firestore();
    await assertFails(setDoc(doc(aliceDb, 'users', 'bob'), {
      uid: 'bob',
      displayName: 'Bob'
    }));
  });

  it('allows chat participants to read messages', async () => {
    const chatId = 'alice_bob';
    // Pre-seed chat document
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'chats', chatId), { members: ['alice', 'bob'] });
    });

    const aliceContext = testEnv.authenticatedContext('alice');
    const aliceDb = aliceContext.firestore();
    await assertSucceeds(getDoc(doc(aliceDb, `chats/${chatId}/messages/msg1`)));
  });

  it('blocks non-participants from reading chat messages', async () => {
    const chatId = 'alice_bob';
    const charlieContext = testEnv.authenticatedContext('charlie');
    const charlieDb = charlieContext.firestore();
    await assertFails(getDoc(doc(charlieDb, `chats/${chatId}/messages/msg1`)));
  });

  it('blocks users from joining groups without admin authorization', async () => {
    const groupId = 'group123';
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'groups', groupId), {
        adminUid: 'admin_user',
        members: ['admin_user'],
        name: 'Secret Group'
      });
    });

    const aliceContext = testEnv.authenticatedContext('alice');
    const aliceDb = aliceContext.firestore();
    await assertFails(updateDoc(doc(aliceDb, 'groups', groupId), {
      members: ['admin_user', 'alice']
    }));
  });

  it('blocks setting excessively long nicknames', async () => {
    const aliceContext = testEnv.authenticatedContext('alice');
    const aliceDb = aliceContext.firestore();
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users', 'alice'), { uid: 'alice', settings: {} });
    });

    const longNickname = 'a'.repeat(200); // Exceeding reasonable size if enforced
    await assertFails(updateDoc(doc(aliceDb, 'users', 'alice'), {
      'settings.customNames.bob': longNickname
    }));
  });
});
