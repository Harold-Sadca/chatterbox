import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
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
