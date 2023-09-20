export interface TypeLoggedInUser {
  email: string;
  accessToken?: string;
  uid: string;
}

export interface TypeMessage {
  id: string;
  text: string;
  sender: TypeLoggedInUser;
}
