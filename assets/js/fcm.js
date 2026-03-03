/* ============================================================
   ছায়াবৃত (Chayabrito) — Firebase Cloud Messaging (FCM)
   Push Notification Client
   ============================================================ */

(function () {
  'use strict';

  var config = window.PATANGA && window.PATANGA.firebase;
  if (!config || config.apiKey === 'YOUR_FIREBASE_API_KEY') {
    // Firebase not configured
    return;
  }

  var bellBtn = document.getElementById('notification-bell');
  var footerBtn = document.getElementById('footer-subscribe-btn');
  var notifDot = document.getElementById('notification-dot');

  function isSubscribed() {
    return localStorage.getItem('chayabrito-fcm-subscribed') === 'true';
  }

  function updateUI() {
    if (isSubscribed()) {
      if (bellBtn) bellBtn.title = 'বিজ্ঞপ্তি চালু আছে';
      if (notifDot) notifDot.removeAttribute('hidden');
      if (footerBtn) footerBtn.textContent = 'বিজ্ঞপ্তি চালু আছে ✓';
    } else {
      if (bellBtn) bellBtn.title = 'বিজ্ঞপ্তি সাবস্ক্রাইব করুন';
      if (notifDot) notifDot.setAttribute('hidden', '');
      if (footerBtn) footerBtn.textContent = 'বিজ্ঞপ্তি চালু করুন';
    }
  }

  function initFirebase() {
    if (typeof firebase === 'undefined') return;

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: config.apiKey,
          authDomain: config.authDomain,
          projectId: config.projectId,
          storageBucket: config.storageBucket,
          messagingSenderId: config.messagingSenderId,
          appId: config.appId
        });
      }

      var messaging = firebase.messaging();

      // Register service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
          .then(function (registration) {
            messaging.useServiceWorker(registration);
          })
          .catch(function (err) {
            console.warn('FCM SW registration failed:', err);
          });
      }

      return messaging;
    } catch (e) {
      console.warn('Firebase init failed:', e);
      return null;
    }
  }

  function subscribe() {
    var messaging = initFirebase();
    if (!messaging) {
      alert('বিজ্ঞপ্তি সেবা বর্তমানে অনুপলব্ধ।');
      return;
    }

    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {
        messaging.getToken({ vapidKey: config.vapidKey })
          .then(function (token) {
            if (token) {
              console.log('FCM Token:', token);
              localStorage.setItem('chayabrito-fcm-subscribed', 'true');
              localStorage.setItem('chayabrito-fcm-token', token);
              updateUI();
            }
          })
          .catch(function (err) {
            console.warn('FCM token error:', err);
          });
      } else {
        alert('বিজ্ঞপ্তির অনুমতি প্রয়োজন। ব্রাউজার সেটিংস থেকে অনুমতি দিন।');
      }
    });
  }

  function toggleSubscription() {
    if (isSubscribed()) {
      localStorage.removeItem('chayabrito-fcm-subscribed');
      localStorage.removeItem('chayabrito-fcm-token');
      updateUI();
    } else {
      subscribe();
    }
  }

  // Event listeners
  if (bellBtn) bellBtn.addEventListener('click', toggleSubscription);
  if (footerBtn) footerBtn.addEventListener('click', toggleSubscription);

  // Initialize UI state
  updateUI();

  // Handle foreground messages
  if (typeof firebase !== 'undefined' && isSubscribed()) {
    var messaging = initFirebase();
    if (messaging) {
      messaging.onMessage(function (payload) {
        var title = payload.notification.title || 'ছায়াবৃত';
        var options = {
          body: payload.notification.body || 'নতুন লেখা প্রকাশিত হয়েছে!',
          icon: '/images/logo-192.png',
          badge: '/images/logo-72.png'
        };
        new Notification(title, options);
      });
    }
  }

})();
