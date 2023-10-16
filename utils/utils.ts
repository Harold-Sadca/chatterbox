import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { TypeLoggedInUser, TypeMessage } from './types';

export async function getUsers(
  userUid: string,
  setUsersState: (users: TypeLoggedInUser[]) => void
) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('uid', '!=', userUid));

  const users: TypeLoggedInUser[] = [];

  // Subscribe to real-time updates
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const newUsers = snapshot
      .docChanges()
      .map((change) => change.doc.data()) as TypeLoggedInUser[];
    users.push(...newUsers);
    setUsersState([...users]);
  });
  return () => {
    // Unsubscribe from the real-time listener when needed
    unsubscribe();
  };
}

export const fetchAllMessages = async (
  userUid: string,
  updateMessages: (messages: TypeMessage[]) => void
) => {
  const messagesCollectionRef = collection(db, 'messages');
  const receivedQuery = query(
    messagesCollectionRef,
    where('recipientUid', '==', userUid), // Fetch received messages
    orderBy('date', 'desc')
  );

  const sentQuery = query(
    messagesCollectionRef,
    where('senderUid', '==', userUid), // Fetch sent messages
    orderBy('date', 'desc')
  );

  const allMessages: TypeMessage[] = [];

  const sentUnsubscribe = onSnapshot(sentQuery, (sentSnapshot) => {
    const newSentMessages = sentSnapshot
      .docChanges()
      .map((change) => change.doc.data()) as TypeMessage[];

    allMessages.push(...newSentMessages);
    allMessages.sort((a, b) => a.date.toMillis() - b.date.toMillis());
    updateMessages([...allMessages]);
  });

  const receivedUnsubscribe = onSnapshot(receivedQuery, (receivedSnapshot) => {
    const newReceivedMessages = receivedSnapshot
      .docChanges()
      .map((change) => change.doc.data()) as TypeMessage[];

    allMessages.push(...newReceivedMessages);
    allMessages.sort((a, b) => a.date.toMillis() - b.date.toMillis());
    updateMessages([...allMessages]);
  });

  return () => {
    // Unsubscribe from the real-time listeners when needed
    sentUnsubscribe();
    receivedUnsubscribe();
  };
};
