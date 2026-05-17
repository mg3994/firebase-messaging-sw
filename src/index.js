export default {
  async fetch(request, env, ctx) {
    const jsContent = `
      importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
      importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

      const firebaseConfig = {
        apiKey: "AIzaSyDtRB-0S8VNgY-HoQYAAvkLX7iOAK-K-i0",
        authDomain: "antinnamain.firebaseapp.com",
        projectId: "antinnamain",
        storageBucket: "antinnamain.appspot.com",
        messagingSenderId: "907520801915",
        appId: "1:907520801915:web:5a99962f7ce400da54b6de"
      };

      firebase.initializeApp(firebaseConfig);
      const messaging = firebase.messaging();

      messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        
        const notificationTitle = payload.notification?.title || 'New Notification';
        const notificationOptions = {
          body: payload.notification?.body || 'You have a new update.',
          icon: payload.notification?.image || '/favicon.ico',
          data: payload.data
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
      });
    `;

    return new Response(jsContent, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Service-Worker-Allowed": "/",
      },
    });
  },
};
