import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { Vote } from '../types';

const COLLECTION_NAME = 'votes';

export const submitVote = async (presidentId: string, vicePresidentId: string): Promise<boolean> => {
  try {
    // Basic local check for double voting (UI level)
    if (localStorage.getItem('hasVoted') === 'true') {
      console.warn("User has already voted (local check).");
      return false;
    }

    await addDoc(collection(db, COLLECTION_NAME), {
      presidentId,
      vicePresidentId,
      timestamp: serverTimestamp()
    });

    localStorage.setItem('hasVoted', 'true');
    return true;
  } catch (error) {
    console.error("Error submitting vote: ", error);
    throw error;
  }
};

export const subscribeToVotes = (onUpdate: (votes: Vote[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const votes: Vote[] = [];
    querySnapshot.forEach((doc) => {
      votes.push(doc.data() as Vote);
    });
    onUpdate(votes);
  });

  return unsubscribe;
};

export const hasUserVoted = (): boolean => {
  return localStorage.getItem('hasVoted') === 'true';
};