/* ============================================================
   ছায়াবৃত (Chayabrito) — Firebase Messaging Service Worker
   ============================================================ */

// NOTE: Replace the config below with your actual Firebase project config
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title || 'ছায়াবৃত';
  const notificationOptions = {
    body: payload.notification.body || 'নতুন লেখা প্রকাশিত হয়েছে!',
    icon: '/images/logo-192.png',
    badge: '/images/logo-72.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = '/';
  if (event.notification.data && event.notification.data.url) {
    url = event.notification.data.url;
  }
  event.waitUntil(clients.openWindow(url));
});
