# CrossPay

## Built With

- [![ReactNative][ReactNative]][React-url]
- [![MongoDB][MongoDB]][MongoDB-url]
- [Plaid]

# Install Guide

CrossPay is a payment application that is designed to consolidate bank account, credit card, and payment information all in one app. Through React Native, both iOS and Android devices are supported, and utilizing the Plaid API allows for transactions to occur. CrossPay simplifies payments into one, easy to access app.

## Mobile development environment

You'll need to set up a mobile development environment to run the app on iOS or Android. The steps and features depend on if you have a MacOS or Windows.
A MacOS is ideal for development since it allows for both iOS and Android testing, however Windows is ideal for Android development.

Follow the environment setup instructions found in the official React Native docs: https://reactnative.dev/docs/environment-setup. This would including installing XCode (for iOS only), Ruby (for iOS only), Android Studio...etc.
You'll specifically need to follow the instructions under "React Native CLI Quickstart". Select your "Development OS" and follow the installation instructions for both iOS and Android (under "Target OS").

For Android ensure enviroment variables and Android SDK is setup properly.

## Initial Setup

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

Both commands start Metro, build the app, open a simulator/emulator, and launch the app in the simulator/emulator. For iOS, if you encounter an error related to a simulator not being found, you can specify a simulator like so:
`npx react-native run-ios --simulator="iPhone 14"`

## Troubleshooting

**You are unable to run the Metro application.**

If on iOS, delete the Pods folder and Podfile.lock and rerun `pod install`. If on Android, clean your gradle.

**Your Plaid Link SDK is not compatible with your OS.**

Refer to the [Plaid Link SDK documentation](https://plaid.com/docs/link/react-native/) for the version you would require. Then accordingly modify the `package.json` file.

**The backend does not connect to the database.**

Make sure your `/backend/.env` file is correctly setup with the username and password of the MongoDB database in the `DATABASE=` string.

**The backend does not connect to the Plaid server.**

Make sure your `/backend/.env` file is correctly setup with the client ID and secret of the Plaid account in the `PLAID_CLIENT_ID=<client-id>` and `PLAID_SECRET=<sandbox-secret>=` strings.

# Release Notes

## Version 1.0.0

### Features

- Completed functionality to add, edit, and delete payment profiles
- Enabled paying with and without payment profiles with Plaid ledger enabled
- Included list of payments and transfers in profile page
- Added email notifications for when payments and transfers are successfuly initiated and for when accounts are created

### Bug Fixes

- Fixed payment errors when Plaid ledger is enabled
- Fixed bug where past payments and transfers were not stored in the database appropriately
- Fixed Android Plaid Link issues for Windows machines

### Known Issues

- Async storage is not setup, so user state is not remembered upon closing the app

## Version 0.4.0

### Features

- Completed Payments screens
- Created Transfers screen
- Enabled fully functioning payments from adding Plaid accounts to arbitrary account/routing number via Plaid's Transfer API (within Sandbox environment)
- Enabled fully functioning transfers between adding Plaid accounts via Plaid's Transfer API (within Sandbox environment)

### Bug Fixes

- Prevent adding of duplicate accounts
- Fixed bug where accounts are wiped upon logging in initially
- Fixed Android Plaid Link issues for certain Windows machines

### Known Issues

- Plaid SDK is still not supported on certain Windows/Android setups
- Async storage is not setup, so user state is not remembered upon closing the app

## Version 0.3.0

### Features

- Created Account Information screen
- Routed footer with proper routing with required parameters like user accounts and email
- Created Payment screen with validation check on amount/input
- Implemented log out functionality

### Bug Fixes

- Fixed the icon issues with iOS and Android
- Fixed Android Plaid Link issues for most machines

### Known Issues

- Android only works with `plaid-link-sdk` version of `10.6.4` and iOS only works with `8.0.0`
- Plaid SDK is still not supported on certain Windows/Android setups
- Duplicate accounts can be added
- Accounts wiped upon initial log in sometimes

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

[ReactNative]: https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://reactnative.dev/
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/en-us
[Plaid]: https://plaid.com/
