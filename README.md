# Restaurant App - React Native
This project implements an app for a restaurant using React Native, Redux and Expo SDK. The project only implements the client side of the app. Most of the data is fetched from a server and is persisted on device using `redux-persist`. The codebase is only intended to be used for Android and IOS, and contains components that might not work in a browser.
The server for this app can easily be implemented using code from my [other back-end project](https://github.com/sukhrajklair/restaurant-website-backend-express-mongoDB). 

# Install
1. Download or clone this repository
2. Go to the directory where it's downloaded and run `yarn` command from terminal window at that location. This will install all of the dependencies.

# Run
1. Setup a server serving the data expected by the app and configure server's url in './shared/baseUrl.js'. You can use code from [this project](https://github.com/sukhrajklair/restaurant-website-backend-express-mongoDB) to implement the server. 
2. Execute `yarn start` command from a terminal window at the project location
3. Follow the directions from the terminal window to open the app on your phone using the Expo client app

# Use
The app is fairly simple to use. It uses **drawer navigation** to reach the major components. The components are as follows:

### Login
This component let users sign-in or register a new account.

### Home
This component shows the current promotions, featured dish and featured person.

### Menu
This components list all of the dishes on the menu. You can click on any dish to navigate to the **Dishdetail** component. This component shows description of the dish and previous comments about this dish. The component also includes icons to make the dish your favorite, share it on social media or post a new comment. There is also *gesture support* in this component. A *left-swipe* on the picture of the dish adds the dish to your favorites and a *right-swipe* launches the comment form to place a new comment.

### Favorites
This components shows the favorite dishes of the logged-in user. A *left-swipeout* on a dish reveals a *delete* button which lets you delete the dish from your favorites.

### Reservation
This component lets you place a new reservation. Once the request is submitted, a calendar event for the reservation is automatically added to your calendar.

### About 
This describe the restaurant and its in more detail. It also introduces the key people involved in running the restaurant.

### Contact
This component includes a form that lets you send feedback to the restaurant via an email client on your phone. 