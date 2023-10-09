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
}
