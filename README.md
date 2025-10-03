# user-tracking-app

This project is deployed with [vercel](https://vercel.com/), and for the websocket service deployed using [Railway](https://railway.com/).
## [Live Demo](https://user-tracking-app-peach.vercel.app/)

This is a real-time user tracking application using Next.js and any mapping library. The app should simulate and render the location of at least 100 users, updating in real-time.

Using [react-leaflet](https://react-leaflet.js.org/) map because of free, not like google maps that need billing even only just want to show the map

![cover](https://github.com/user-attachments/assets/1c239147-a197-4e59-bb72-5aa2ed60eaf9)

## Setup instructions
Here the project consist of two main folder, the client for the web, and server for websocket service

### Clone project
First clone the project
```bash
git clone https://github.com/kevinkellyyyy/employee-management-mini-proj.git
```
After cloning, install all dependency first
```bash
npm install
```

### Run the server node js
```bash
node index.js
```

### Run the client next js
```bash
npm run dev
```

## Login
Here is simple login page for storing the name of user

![login](https://github.com/user-attachments/assets/74cd470c-cf92-4442-a851-b2657eabeab9)

## Desktop
After login then it will show current location of user (Red Marker), and if there are Real user who online (connected to the socket) will shown by Green Marker
Here also some comtrol panel to logout, open new tab for simulate real user, and simulate fake user by n number (shown by Blue Marker), we can simulate over 100 simulated (fake) user

![desktop view](https://github.com/user-attachments/assets/7a51ef50-466e-4cb0-8430-78e5d15677ac)

## Mobile
Also works on mobile

![mobile view](https://github.com/user-attachments/assets/e0287dbb-c683-4e45-9681-372a2098bec0)

# Thankyou

## Copyright © [Kevin Kelly Isyanta](https://kevinkellyyyy.vercel.app/)
