# Last.fm STALKER 📻

![Last.FM STALKER](https://github.com/user-attachments/assets/32d377c8-6e60-4b54-b160-62bd9d811b07)

## Description

Last.fm Live Player is a React-based web application that allows users to view your real-time listening activity on Last.fm. The app features a Windows XP-inspired interface with a draggable window, displaying the currently playing track and your 10 most recently played songs. Users can refresh the data to see live updates of your music listening habits.

Key features:
- Live "Now Playing" display
- List of 10 most recent tracks
- Manual refresh functionality
- Windows XP-style UI with draggable window
- Tabbed interface for easy navigation

## How to Get a Last.fm API Key

1. Visit the [Last.fm API account creation page](https://www.last.fm/api/account/create).
2. Fill out the form with your application details.
3. After submitting, you'll receive an API key that you can use in the `.env` file.

## How to Run and Build

1. Clone the repository:
   ```
   git clone https://github.com/vys69/FM-Stalker.git
   cd LastFM-Live
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Last.fm API key:
   ```
   REACT_APP_LASTFM_API_KEY=REPLACE_ME_WITH_API_KEY
   REACT_APP_LASTFM_USERNAME=REPLACE_ME_WITH_USERNAME
   ```

4. Run the development server:
   ```
   npm start
   ```

5. To build for production:
   ```
   npm run build
   ```

## Connect with the Developer

- Twitter: [@fuckgrimlabs](https://twitter.com/fuckgrimlabs)
- Discord: [usbank](https://discord.com/users/913656519847981067)
