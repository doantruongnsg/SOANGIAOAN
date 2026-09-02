// ==========================================================
// FIREBASE CLOUD INTEGRATION & REAL-TIME SYNC
// Project: soangiaoan-7b315
// ==========================================================

const firebaseConfig = {
  apiKey: "AIzaSyDuCkaUJe17b_gzsJZaSQzpK_qDyCe_9vU",
  authDomain: "soangiaoan-7b315.firebaseapp.com",
  projectId: "soangiaoan-7b315",
  storageBucket: "soangiaoan-7b315.firebasestorage.app",
  messagingSenderId: "945267023845",
  appId: "1:945267023845:web:52f58e5d87da65cffb190c",
  measurementId: "G-8QLLBWYQH4"
};

window.FirebaseSync = {
  app: null,
  analytics: null,
  db: null,
  isInitialized: false,

  init() {
    try {
      if (typeof firebase !== 'undefined') {
        this.app = firebase.initializeApp(firebaseConfig);
        if (typeof firebase.analytics === 'function') {
          this.analytics = firebase.analytics();
          console.log("Firebase Analytics initialized:", firebaseConfig.measurementId);
        }
        if (typeof firebase.firestore === 'function') {
          this.db = firebase.firestore();
          console.log("Firebase Firestore initialized for project:", firebaseConfig.projectId);
        }
        this.isInitialized = true;
        this.updateBadge("connected", "Firebase Cloud: Sẵn sàng");
      } else {
        console.warn("Firebase SDK not loaded, using Local Backend API mode");
        this.updateBadge("local", "Chế độ: Máy chủ cục bộ");
      }
    } catch (err) {
      console.warn("Firebase initialization error:", err);
      this.updateBadge("local", "Chế độ: Máy chủ cục bộ");
    }
  },

  updateBadge(status, text) {
    const badge = document.getElementById("firebaseBadge");
    if (!badge) return;
    badge.className = "server-badge " + status;
    badge.innerHTML = '<span class="dot"></span> ' + text;
  },

  // Save Schedule to Firebase Firestore
  async syncScheduleToCloud(scheduleData) {
    if (!this.db || !scheduleData) return;
    try {
      const id = scheduleData.id || ("sched_" + Date.now());
      await this.db.collection("schedules").doc(id).set({
        ...scheduleData,
        syncedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log("Synced schedule to Firestore:", id);
    } catch(e) {
      console.warn("Firestore syncSchedule error:", e);
    }
  },

  // Save Lesson Plan to Firebase Firestore
  async syncLessonPlanToCloud(lessonPlanData) {
    if (!this.db || !lessonPlanData) return;
    try {
      const id = lessonPlanData.id || ("lp_" + Date.now());
      await this.db.collection("lesson_plans").doc(id).set({
        ...lessonPlanData,
        syncedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log("Synced lesson plan to Firestore:", id);
    } catch(e) {
      console.warn("Firestore syncLessonPlan error:", e);
    }
  },

  // Save Program to Firebase Firestore
  async syncProgramToCloud(programData) {
    if (!this.db || !programData) return;
    try {
      const id = programData.id || programData.code || ("prog_" + Date.now());
      await this.db.collection("programs").doc(id).set({
        ...programData,
        syncedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log("Synced program to Firestore:", id);
    } catch(e) {
      console.warn("Firestore syncProgram error:", e);
    }
  },

  // Full Cloud Sync
  async syncAllToCloud() {
    if (!this.db) {
      if (typeof showToast === 'function') showToast("Firebase Cloud chưa được kích hoạt.", "warning");
      return;
    }
    try {
      if (typeof showToast === 'function') showToast("Đang đồng bộ dữ liệu lên Firebase Cloud...", "info");
      
      // Get all local data
      const progs = typeof API !== 'undefined' ? (await API.getPrograms()).data : [];
      const scheds = typeof API !== 'undefined' ? (await API.getSchedules()).data : [];
      const lps = typeof API !== 'undefined' ? (await API.getLessonPlans()).data : [];

      for (const p of progs) await this.syncProgramToCloud(p);
      for (const s of scheds) await this.syncScheduleToCloud(s);
      for (const lp of lps) await this.syncLessonPlanToCloud(lp);

      if (typeof showToast === 'function') showToast("Đồng bộ lên Firebase Cloud thành công!", "success");
    } catch(e) {
      console.error("Full cloud sync error:", e);
      if (typeof showToast === 'function') showToast("Lỗi đồng bộ Cloud: " + e.message, "error");
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.FirebaseSync.init();
});
