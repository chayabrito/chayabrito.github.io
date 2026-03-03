/* ============================================================
   ছায়াবৃত (Chayabrito) — Firebase Cloud Messaging (FCM)
   Push Notification Client
   ============================================================ */

(function () {
  'use strict';

  var config = window.CHAYABRITO && window.CHAYABRITO.firebase;
  if (!config || config.apiKey === 'YOUR_FIREBASE_API_KEY') {
    // Firebase not configured
    return;
  }

  var bellBtn = document.getElementById('notification-bell');
  var footerBtn = document.getElementById('footer-subscribe-btn');
  var notifDot = document.getElementById('notification-dot');
  var swRegistration = null;
  var messagingInstance = null;
  var firestoreInstance = null;

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
    console.log('Initializing Firebase for FCM...');

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

      messagingInstance = firebase.messaging();
      // Initialize Firestore (compat) if available
      if (firebase.firestore) {
        firestoreInstance = firebase.firestore();
      }

      // Register service worker (store registration to use when requesting token)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
          .then(function (registration) {
            swRegistration = registration;
            console.log('FCM Service Worker registered:', registration);
          })
          .catch(function (err) {
            console.warn('FCM SW registration failed:', err);
          });
      }

      return messagingInstance;
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
        var getTokenOptions = { vapidKey: config.vapidKey };
        if (swRegistration) getTokenOptions.serviceWorkerRegistration = swRegistration;

        messaging.getToken(getTokenOptions)
          .then(function (token) {
            if (token) {
              console.log('FCM Token:', token);
              localStorage.setItem('chayabrito-fcm-subscribed', 'true');
              localStorage.setItem('chayabrito-fcm-token', token);
              updateUI();
              saveTokenToFirestore(token);
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
      var token = localStorage.getItem('chayabrito-fcm-token');
      // Try to delete token from FCM and Firestore
      if (token && messagingInstance && typeof messagingInstance.deleteToken === 'function') {
        messagingInstance.deleteToken(token).catch(function (err) {
          console.warn('Failed to delete FCM token:', err);
        });
      }
      if (token) removeTokenFromFirestore(token);
      localStorage.removeItem('chayabrito-fcm-subscribed');
      localStorage.removeItem('chayabrito-fcm-token');
      updateUI();
    } else {
      subscribe();
    }
  }

  function saveTokenToFirestore(token) {
    if (!firestoreInstance) return;
    try {
      firestoreInstance.collection('fcm_tokens').doc(token).set({
        token: token,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent || '',
        projectId: config.projectId || ''
      }).then(function () {
        console.log('Saved FCM token to Firestore');
      }).catch(function (err) {
        console.warn('Failed to save token to Firestore:', err);
      });
    } catch (e) {
      console.warn('Firestore save error:', e);
    }
  }

  function removeTokenFromFirestore(token) {
    if (!firestoreInstance) return;
    try {
      firestoreInstance.collection('fcm_tokens').doc(token).delete().then(function () {
        console.log('Removed FCM token from Firestore');
      }).catch(function (err) {
        console.warn('Failed to remove token from Firestore:', err);
      });
    } catch (e) {
      console.warn('Firestore delete error:', e);
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
