export default {
  async fetch(request, env, ctx) {
    const jsContent = `
      importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
      importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

      const firebaseConfig = {
        apiKey: "${env.FIREBASE_API_KEY || "AIzaSyDtRB-0S8VNgY-HoQYAAvkLX7iOAK-K-i0"}",
        authDomain: "${env.FIREBASE_AUTH_DOMAIN || "antinnamain.firebaseapp.com"}",
        projectId: "${env.FIREBASE_PROJECT_ID || "antinnamain"}",
        storageBucket: "${env.FIREBASE_STORAGE_BUCKET || "antinnamain.appspot.com"}",
        messagingSenderId: "${env.FIREBASE_MESSAGING_SENDER_ID || "907520801915"}",
        appId: "${env.FIREBASE_APP_ID || "1:907520801915:web:5a99962f7ce400da54b6de"}"
      };

      firebase.initializeApp(firebaseConfig);
      const messaging = firebase.messaging();

      // Handle background messages
      messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received message:', payload);
        
        // CRITICAL FIX: If the payload already has a 'notification' object, 
        // Firebase automatically shows it. Do NOT manually show it again or you get duplicates.
        if (payload.notification) {
          console.log('Firebase is handling this display natively.');
          return;
        }

        // Only manually build it if you are sending a DATA-ONLY payload
        const notificationTitle = payload.data?.title || 'New Notification';
        const notificationOptions = {
          body: payload.data?.body,
          icon: payload.data?.image || '/favicon.ico',
          data: {
            url: payload.data?.url || '/'
          }
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
      });

      // Handle notification clicks
      self.addEventListener("notificationclick", (event) => {
        event.notification.close();
        
        // Support BOTH Firebase's native link property AND your custom data block URL
        let targetUrl = event.notification.data?.url || event.notification.click_action;
        
        // Fallback to origin if nothing is found
        if (!targetUrl) {
          targetUrl = self.location.origin + "/";
        } else {
          // Ensure it's a fully qualified URL string
          targetUrl = new URL(targetUrl, self.location.origin).href;
        }

        event.waitUntil(
          clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (const client of windowClients) {
              if (client.url === targetUrl && 'focus' in client) return client.focus();
            }
            return clients.openWindow(targetUrl);
          })
        );
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