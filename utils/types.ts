import { Timestamp } from 'firebase/firestore';

export interface TypeLoggedInUser {
  email: string;
  accessToken?: string;
  uid: string;
}

export interface TypeMessage {
  id: string;
  recipientUid: string;
  text: string;
  senderUid: string;
  date: Timestamp;
}
