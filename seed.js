/**
 * seed.js — One-time seed script to populate Firestore with initial data.
 * Run with: node seed.js
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env variable set to your service account key.
 */

const admin = require("firebase-admin");
const serviceAccount = require("./service-account-key.json"); // Download from Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "communitypulse-901d1",
});

const db = admin.firestore();

async function seed() {
    console.log("🌱 Seeding CommunityPulse...");

    // ── Wards ───────────────────────────────────────────────────────────────
    const wards = [
        { id: "ward-1", name: "Ward 1 — Central Market", city: "Solapur", volunteers: 12 },
        { id: "ward-2", name: "Ward 2 — Bus Stand Area", city: "Solapur", volunteers: 8 },
        { id: "ward-3", name: "Ward 3 — Railway Colony", city: "Solapur", volunteers: 15 },
        { id: "ward-4", name: "Ward 4 — Nagar Road", city: "Solapur", volunteers: 20 },
        { id: "ward-5", name: "Ward 5 — Hotgi Road", city: "Solapur", volunteers: 6 },
    ];
    for (const ward of wards) {
        const { id, ...data } = ward;
        await db.collection("wards").doc(id).set(data);
        console.log(`  ✓ Ward: ${ward.name}`);
    }

    // ── Demo Tasks ──────────────────────────────────────────────────────────
    const tasks = [
        {
            title: "Food emergency — Nagar Road families",
            description: "5 families near Nagar Road well have had no food for 3 days.",
            category: "food",
            urgency: 9,
            affectedCount: 5,
            location: "Nagar Road, Solapur",
            wardId: "ward-4",
            status: "open",
            assignedTo: null,
            tags: ["food", "urgent", "elderly"],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        {
            title: "Medical check-up — Ward 3 camp",
            description: "Mobile health camp needs 3 more volunteers for form filling.",
            category: "medical",
            urgency: 6,
            affectedCount: 40,
            location: "Railway Colony Community Hall",
            wardId: "ward-3",
            status: "open",
            assignedTo: null,
            tags: ["medical", "camp"],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        {
            title: "Education tutoring — local school",
            description: "10 children need tutoring support Mon-Fri 4-6 PM.",
            category: "education",
            urgency: 4,
            affectedCount: 10,
            location: "Zilla Parishad School, Ward 2",
            wardId: "ward-2",
            status: "open",
            assignedTo: null,
            tags: ["education", "children"],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
    ];
    for (const task of tasks) {
        const ref = await db.collection("tasks").add(task);
        console.log(`  ✓ Task: ${task.title} [${ref.id}]`);
    }

    // ── Demo Report ─────────────────────────────────────────────────────────
    await db.collection("reports").add({
        title: "Flood shelter report — Ward 4",
        description: "3 houses damaged near nala. 8 people displaced.",
        wardId: "ward-4",
        category: "shelter",
        location: "Behind Masjid Lane, Nagar Road",
        authorId: "demo-user-001",
        status: "pending_review",
        urgencyScore: 7,
        affectedCount: 8,
        mediaUrls: [],
        aiAnalysis: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log("  ✓ Demo report created");

    console.log("\n✅ Seed complete! Your Firestore is ready.");
    process.exit(0);
}

seed().catch(err => {
    console.error("Seed failed:", err);
    process.exit(1);
});
