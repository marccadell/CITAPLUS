import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase-config';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          let collectionName = '';
          let userData = null;

          // Determina el tipo de usuario consultando primero en 'patients'
          const patientDoc = await getDoc(doc(db, 'patients', user.uid));
          if (patientDoc.exists()) {
            collectionName = 'patients';
            userData = patientDoc.data();
          } else {
            // Si no es paciente, entonces es doctor (se asume que cada usuario está en una sola colección)
            const doctorDoc = await getDoc(doc(db, 'doctors', user.uid));
            if (doctorDoc.exists()) {
              collectionName = 'doctors';
              userData = doctorDoc.data();
            }
          }

          if (userData) {
            setCurrentUser({ ...user, role: collectionName === 'patients' ? 'patient' : 'doctor', userData });
          } else {
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;




