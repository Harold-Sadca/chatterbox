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

export async function getUsers() {
  const usersRef = collection(db, 'users');

  const q = query(usersRef);

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

export const fetchUserMessages = async (userId: string) => {
  const userDocRef = doc(db, 'users', userId);
  const messagesCollectionRef = collection(userDocRef, 'messages');

  try {
    const querySnapshot = await getDocs(messagesCollectionRef);

    const userMessages: TypeMessage[] = [];

    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      userMessages.push(messageData as TypeMessage);
    });

    return userMessages;
  } catch (error) {
    console.error('Error fetching user messages:', error);
    throw error;
  }
};

export const fetchAllMessages = async (userUid: string) => {
  const messagesCollectionRef = collection(db, 'messages');
  const q = query(
    messagesCollectionRef,
    where('senderUid', '==', userUid), // Fetch sent messages
    orderBy('timestamp', 'desc')
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
      orderBy('timestamp', 'desc')
    );

    const receivedMessagesSnapshot = await getDocs(receivedMessagesQuery);

    receivedMessagesSnapshot.forEach((doc) => {
      const messageData = doc.data();
      allMessages.push(messageData as TypeMessage);
    });

    return allMessages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
