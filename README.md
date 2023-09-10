# CrossPay


# Mobile development environment

You'll need to set up a mobile development environment to run the app on iOS or Android. The steps and features depend on if you have a MacOS or Windows. 
A MacOS is ideal for development since it allows for both iOS and Android testing.

Follow the environment setup instructions found in the official React Native docs: https://reactnative.dev/docs/environment-setup. This would including installing XCode (for iOS only), Android Studio, Ruby (for iOS only)...etc.
You'll specifically need to follow the instructions under "React Native CLI Quickstart". Select your "Development OS" and follow the installation instructions for both iOS and Android (under "Target OS").

## Setup

Install dependencies:  
Ensure your Node version is 16.14.0. Next, run `npm install` in the client folder.
Navigate to the `client/ios/` folder and run `pod install` to install all necessary iOS dependencies or `bundle install` in `client/` and then `pod install` in `client/ios` if necessary gem dependencies don't exist. Make sure you develop on the `users/<user>` directory on Mac if watchman does not work.

Now, navigate to the server directory and run `npm install` and `npm install -g nodemon`.
Add `.env` file to the `server` directory. You will need a username and password that has access to the database cluster:
```
DATABASE=mongodb+srv://<user>:<password>@crosspaycluster.c9tl0ik.mongodb.net/CrossPay?retryWrites=true&w=majority
JWT_SECRET=<secret>
```
Start the backend server, run the following commands:
```
cd server
npm start
```
This will run a local server on port 8000, connecting to MongoDB via Node/Express.

## Running the app

Open a new terminal window and run one of the following commands in the TinyQuickstartReactNative/ folder:

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

## V 0.1.0
### Features
### Bug Fixes
### Known Issues
