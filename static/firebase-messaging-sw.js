/* ============================================================
   ছায়াবৃত (Chayabrito) — Firebase Messaging Service Worker
   ============================================================ */

// NOTE: Replace the config below with your actual Firebase project config
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCFotnMTyJbOCDVJhVBxQzD1NFnebXBnk",
  authDomain: "chayabrito-magazine.firebaseapp.com",
  projectId: "chayabrito-magazine",
  storageBucket: "chayabrito-magazine.firebasestorage.app",
  messagingSenderId: "981536754689",
  appId: "1:981536754689:web:23785028c7dbcdc79e0400",
  measurementId: "G-55QLJ078HT"
};

firebase.initializeApp(firebaseConfig);

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
