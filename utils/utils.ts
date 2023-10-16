import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  orderBy,
} from 'firebase/firestore';
import { TypeLoggedInUser, TypeMessage } from './types';

export async function getUsers(userUid: string) {
  const usersRef = collection(db, 'users');

  const q = query(usersRef, where('uid', '!=', userUid));

  try {
    const querySnapshot = await getDocs(q);
    const users: TypeLoggedInUser[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push(data as TypeLoggedInUser);
    });

    return users;
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return [];
  }
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
// export const fetchAllMessages = async (
//   userUid: string,
//   updateMessages: (messages: TypeMessage[]) => void
// ) => {
//   const messagesCollectionRef = collection(db, 'messages');
//   const receivedQuery = query(
//     messagesCollectionRef,
//     where('recipientUid', '==', userUid), // Fetch received messages
//     orderBy('date', 'desc')
//   );

//   const sentQuery = query(
//     messagesCollectionRef,
//     where('senderUid', '==', userUid), // Fetch sent messages
//     orderBy('date', 'desc')
//   );

//   const allMessages: TypeMessage[] = [];

//   try {
//     const querySnapshot = await getDocs(sentQuery);

//     querySnapshot.forEach((doc) => {
//       const messageData = doc.data();
//       allMessages.push(messageData as TypeMessage);
//     });

//     // Subscribe to changes in the received messages query
//     const unsubscribe = onSnapshot(receivedQuery, (querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         allMessages.push(doc.data() as TypeMessage);
//       });
//       allMessages.sort((a, b) => a.date.toMillis() - b.date.toMillis());
//       updateMessages([...allMessages]);
//     });

//     // Return the unsubscribe function so you can stop listening when needed
//     return unsubscribe;
//   } catch (error) {
//     console.log(error);
//   }
// };
