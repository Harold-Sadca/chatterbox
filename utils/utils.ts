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

export const fetchAllMessages = async (userUid: string) => {
  const messagesCollectionRef = collection(db, 'messages');
  const q = query(
    messagesCollectionRef,
    where('senderUid', '==', userUid), // Fetch sent messages
    orderBy('date', 'desc')
  );

  try {
    const querySnapshot = await getDocs(q);

    const allMessages: TypeMessage[] = [];

    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      allMessages.push(messageData as TypeMessage);
    });

    const receivedMessagesQuery = query(
      messagesCollectionRef,
      where('recipientUid', '==', userUid), // Fetch received messages
      orderBy('date', 'desc')
    );

    const receivedMessagesSnapshot = await getDocs(receivedMessagesQuery);

    receivedMessagesSnapshot.forEach((doc) => {
      const messageData = doc.data();
      allMessages.push(messageData as TypeMessage);
    });

    allMessages.sort((a, b) => b.date.toMillis() - a.date.toMillis());

    return allMessages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
