# Chatterbox

Chatterbox is a real-time chat application built using Next.js, Redux, CSS, Material UI, and Firebase.

## Getting Started

To run this project locally, follow these steps:

1. Clone this repository to your local machine:

```bash
git clone https://github.com/Harold-Sadca/chatterbox
```

2. Navigate to the project directory:

```bash
cd chatterbox
```

3. Install the project dependencies:

```bash
npm install
```

4. Create a `.env` file in the project root and add your Firebase configuration:

```env
FIREBASE_API_KEY= ''
FIREBASE_AUTH_DOMAIN= ''
FIREBASE_PROJECT_ID= ''
FIREBASE_STORAGE_BUCKET= ''
FIREBASE_MESSAGING_SENDER_ID= ''
FIREBASE_APP_ID= ''
FIREBASE_MEASUREMENT_ID= ''
```

Make sure to replace the empty values with your actual Firebase configuration.

5. Start the development server:

```bash
npm run dev
```

Your Chatterbox app should now be running locally. Open your browser and visit [http://localhost:3000](http://localhost:3000) to access the application.

## Features

- Real-time chat with Firebase Firestore and Firebase Authentication.
- Secure user authentication and authorization.
- Send and receive messages in real-time.
- Material UI for a responsive and user-friendly design.

## About

Chatterbox is a real-time chat application created for educational purposes. It demonstrates how to build a chat application using modern web technologies and Firebase.

## Contributing

If you would like to contribute to this project, feel free to open issues or create pull requests. We welcome contributions from the community.
