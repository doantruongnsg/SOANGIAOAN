import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

export const UserSyncService = {
  // Save user profile
  async saveUserProfile(userId, profile) {
    if (!db || !userId) return;
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...profile,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn("Could not save user profile to Firestore:", e);
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    if (!db || !userId) return null;
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      console.warn("Could not get user profile:", e);
      return null;
    }
  },

  // Save a Schedule for a specific user
  async saveSchedule(userId, scheduleData) {
    if (!db || !userId) return;
    try {
      const id = scheduleData.id || ('sched_' + Date.now());
      const schedRef = doc(db, 'users', userId, 'schedules', id);
      const payload = {
        ...scheduleData,
        id,
        updatedAt: serverTimestamp()
      };
      await setDoc(schedRef, payload, { merge: true });
      return id;
    } catch (e) {
      console.error("Firestore save schedule error:", e);
      throw e;
    }
  },

  // Get all Schedules for a specific user
  async getSchedules(userId) {
    if (!db || !userId) return [];
    try {
      const schedColl = collection(db, 'users', userId, 'schedules');
      const q = query(schedColl, orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.warn("Firestore get schedules fallback:", e);
      // Fallback without orderBy if index not created
      try {
        const schedColl = collection(db, 'users', userId, 'schedules');
        const snap = await getDocs(schedColl);
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        return list;
      } catch (err) {
        return [];
      }
    }
  },

  // Delete a Schedule for a specific user
  async deleteSchedule(userId, scheduleId) {
    if (!db || !userId || !scheduleId) return;
    try {
      const schedRef = doc(db, 'users', userId, 'schedules', scheduleId);
      await deleteDoc(schedRef);
    } catch (e) {
      console.error("Firestore delete schedule error:", e);
      throw e;
    }
  },

  // Save a Lesson Plan for a specific user
  async saveLessonPlan(userId, planData) {
    if (!db || !userId) return;
    try {
      const id = planData.id || ('plan_' + Date.now());
      const planRef = doc(db, 'users', userId, 'lesson_plans', id);
      const payload = {
        ...planData,
        id,
        updatedAt: serverTimestamp()
      };
      await setDoc(planRef, payload, { merge: true });
      return id;
    } catch (e) {
      console.error("Firestore save lesson plan error:", e);
      throw e;
    }
  },

  // Get all Lesson Plans for a specific user
  async getLessonPlans(userId) {
    if (!db || !userId) return [];
    try {
      const planColl = collection(db, 'users', userId, 'lesson_plans');
      const snap = await getDocs(planColl);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.warn("Firestore get lesson plans error:", e);
      return [];
    }
  },

  // Delete a Lesson Plan for a specific user
  async deleteLessonPlan(userId, planId) {
    if (!db || !userId || !planId) return;
    try {
      const planRef = doc(db, 'users', userId, 'lesson_plans', planId);
      await deleteDoc(planRef);
    } catch (e) {
      console.error("Firestore delete lesson plan error:", e);
      throw e;
    }
  },

  // Save active session state for seamless cross-device resume
  async saveActiveState(userId, state) {
    if (!db || !userId) return;
    try {
      const stateRef = doc(db, 'users', userId, 'state', 'active_session');
      await setDoc(stateRef, {
        state,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn("Firestore save active state error:", e);
    }
  },

  // Get active session state
  async getActiveState(userId) {
    if (!db || !userId) return null;
    try {
      const stateRef = doc(db, 'users', userId, 'state', 'active_session');
      const snap = await getDoc(stateRef);
      return snap.exists() ? snap.data().state : null;
    } catch (e) {
      return null;
    }
  }
};