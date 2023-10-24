# CrossPay

CrossPay is a payment application that is designed to consolidate bank account, credit card, and payment information all in one app. Through React Native, both iOS and Android devices are supported, and utilizing the Plaid API allows for transactions to occur. CrossPay simplifies payments into one, easy to access app.

# Mobile development environment

You'll need to set up a mobile development environment to run the app on iOS or Android. The steps and features depend on if you have a MacOS or Windows.
A MacOS is ideal for development since it allows for both iOS and Android testing, however Windows is ideal for Android development.

Follow the environment setup instructions found in the official React Native docs: https://reactnative.dev/docs/environment-setup. This would including installing XCode (for iOS only), Ruby (for iOS only), Android Studio...etc.
You'll specifically need to follow the instructions under "React Native CLI Quickstart". Select your "Development OS" and follow the installation instructions for both iOS and Android (under "Target OS").

For Android ensure enviroment variables and Android SDK is setup properly.

## Setup

Install dependencies:  
Ensure your Node version is 16.20.1. Next, run `npm install` in the client folder.

Now, navigate to the server directory and run `npm install` and `npm install -g nodemon`.
Add `.env` file to the `server` directory. You will need a username and password that has access to the database cluster:

```
DATABASE=mongodb+srv://<user>:<password>@crosspaycluster.c9tl0ik.mongodb.net/CrossPay?retryWrites=true&w=majority
JWT_SECRET=<secret>
PLAID_CLIENT_ID=<client-id>
PLAID_SECRET=<sandbox-secret>
PLAID_ENV=sandbox
PLAID_SANDBOX_REDIRECT_URI=https://cdn-testing.plaid.com/link/v2/stable/sandbox-oauth-a2a-react-native-redirect.html
PLAID_ANDROID_PACKAGE_NAME=com.crosspay
```

### iOS Setup

First, change the `react-native-plaid-link-sdk` version to `"^8.0.0"`. Navigate to the `client/ios/` folder and run `pod install` to install all necessary iOS dependencies or `bundle install` in `client/` and then `pod install` in `client/ios` if necessary gem dependencies don't exist. Update the pods repo or the Plaid package if necessary. Make sure you develop on the `users/<user>` directory on Mac if watchman does not work.

Start the backend server, run the following commands:

```
cd server
npm start
```

This will run a local server on port 8000, connecting to MongoDB via Node/Express.

## Running the app

Open a new terminal window and run one of the following commands in the CrossPay/client folder:

To run on iOS, run this command:

```
npx react-native run-ios
```

To run on Android, run this command:

```
npx react-native run-android
```

#

Both commands start Metro, build the app, open a simulator/emulator, and launch the app in the simulator/emulator. For iOS, if you encounter an error related to a simulator not being found, you can specify a simulator like so:
`npx react-native run-ios --simulator="iPhone 14"`

# Release Notes

## Version 0.3.0

### Features

- Created Account screen and first iteration of footer
- Integrated [Plaid Link](https://plaid.com/docs/link/) to securely add the following accounts:  
  - Checking
  - Savings
  - Credit Card
- Connected Plaid accounts added to MongoDB, allowing users to save their account details to their user profile

### Bug Fixes

- Fixed the axios discrepancies with iOS and Android
- Fixed MongoDB accessibility issues in the backend
- Allowed a way to return home from the forgot password page

### Known Issues

- Icons for the footer don't currently show up on iOS
- Log out functionality is yet to be implemented
- Plaid SDK Plugin requires different versions for iOS and Android. Requires package changing until a solution is found.

## Version 0.2.0

### Features

- Created Account screen and first iteration of footer
- Integrated [Plaid Link](https://plaid.com/docs/link/) to securely add the following accounts:  
  - Checking
  - Savings
  - Credit Card
- Connected Plaid accounts added to MongoDB, allowing users to save their account details to their user profile

### Bug Fixes

- Fixed the axios discrepancies with iOS and Android
- Fixed MongoDB accessibility issues in the backend
- Allowed a way to return home from the forgot password page

### Known Issues

- Icons for the footer don't currently show up on iOS
- Log out functionality is yet to be implemented
- Plaid SDK Plugin requires different versions for iOS and Android. Requires package changing until a solution is found.

## Version 0.1.0

### Features

- Created and connected MongoDB for login information.
- Login Screen is implemented. Users are capable of:
  - Creating a new account
  - Logging in with preexisting accounts
  - Resetting passwords of accounts

### Bug Fixes

- As this is the first version, no bugs were fixed.

### Known Issues

- MongoDB currently has some issues with accessibility on the backend. This will be looked at in the future.
- Using axios differs depending on os and is not accounted for. A permanent solution is being looked into.
