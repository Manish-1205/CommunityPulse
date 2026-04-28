/**
 * firebase-messaging-sw.js
 * Place this file at the ROOT of your project (same level as index.html).
 * This is the Service Worker that handles background FCM push notifications.
 */

importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js");

// ── ⬇ REPLACE WITH YOUR CONFIG ────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyB5Upl9BmNSCuMxyHtLku9kbO1Ivg2VtWw",
    authDomain: "communitypulse-901d1.firebaseapp.com",
    projectId: "communitypulse-901d1",
    storageBucket: "communitypulse-901d1.firebasestorage.app",
    messagingSenderId: "114517623206",
    appId: "1:114517623206:web:51b27e58742b0449bd8f67",
    measurementId: "G-YHL4H1H100"
};
// ── ⬆ REPLACE WITH YOUR CONFIG ────────────────────────────────────────────

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("[SW] Background message:", payload);

    const { title, body } = payload.notification || {};
    const data = payload.data || {};

    self.registration.showNotification(title || "CommunityPulse", {
        body: body || "You have a new update",
        icon: "/assets/icon-192.png",
        badge: "/assets/badge-72.png",
        tag: data.taskId || "cp-notification",
        data: { url: buildUrl(data) },
        actions: [
            { action: "view", title: "View" },
            { action: "dismiss", title: "Dismiss" },
        ],
    });
});

// Click handler — open the relevant page
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    if (event.action === "dismiss") return;

    const url = event.notification.data?.url || "/home.html";
    event.waitUntil(clients.openWindow(url));
});

function buildUrl(data) {
    if (data.type === "task_assignment" || data.type === "task_status_update") {
        return `/task-detail.html?id=${data.taskId}`;
    }
    return "/notifications.html";
}
