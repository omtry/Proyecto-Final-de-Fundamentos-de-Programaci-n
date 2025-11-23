// Sistema de autenticación simple usando Firebase
// Basado en el sistema que ya funciona en public/index.html

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDE4G922U64anqvonQe-_b4iuzXYa3u_as",
    authDomain: "keyspaces-2b692.firebaseapp.com",
    projectId: "keyspaces-2b692",
    storageBucket: "keyspaces-2b692.appspot.com",
    messagingSenderId: "197899248871",
    appId: "1:197899248871:web:1b9652b572badd2dc42e42"
};

// Variables globales
let app, auth, db;
let currentUser = null;
let isAuthenticated = false;
let userRole = 'user'; // Rol del usuario actual: 'user' o 'admin'

// Firebase functions cache
let firebaseAuth, firebaseFirestore;

// Inicializar Firebase
async function initFirebase() {
    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        firebaseAuth = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        firebaseFirestore = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

        const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = firebaseAuth;
        const { getFirestore, doc, getDoc, setDoc } = firebaseFirestore;

        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        // Auth state listener
        onAuthStateChanged(auth, async (user) => {
            console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
            currentUser = user;
            isAuthenticated = !!user;
            
            // Obtener rol del usuario si está autenticado
            if (user) {
                await getUserRole(user.uid);
            } else {
                userRole = 'user';
            }
            
            updateUI();
            notifyAuthChange();
            
            // Redirect to home page after successful login
            if (user && window.location.pathname === '/login') {
                console.log('Redirecting to home page after login...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
            
            // If on profile page and user is not authenticated, redirect to login
            if (!user && window.location.pathname === '/profile') {
                console.log('User not authenticated on profile page, redirecting to login...');
                window.location.href = '/login';
            }
        });

        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Login con email y contraseña
async function loginWithEmail(email, password) {
    if (!auth || !firebaseAuth) return false;
    
    try {
        const { signInWithEmailAndPassword } = firebaseAuth;
        const result = await signInWithEmailAndPassword(auth, email, password);
        await saveUserProfile(result.user);
        return true;
    } catch (error) {
        console.error('Login error:', error);
        alert('Error de login: ' + error.message);
        return false;
    }
}

// Login con Google
async function loginWithGoogle() {
    if (!auth || !firebaseAuth) return false;
    
    try {
        const { GoogleAuthProvider, signInWithPopup } = firebaseAuth;
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await saveUserProfile(result.user);
        return true;
    } catch (error) {
        console.error('Google login error:', error);
        alert('Error de Google login: ' + error.message);
        return false;
    }
}

// Registrar usuario
async function registerUser(email, password, displayName = '') {
    if (!auth || !firebaseAuth) return false;
    
    try {
        const { createUserWithEmailAndPassword, updateProfile } = firebaseAuth;
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        if (displayName) {
            await updateProfile(result.user, { displayName });
        }
        
        await saveUserProfile(result.user);
        return true;
    } catch (error) {
        console.error('Register error:', error);
        alert('Error de registro: ' + error.message);
        return false;
    }
}

// Cerrar sesión
async function logout() {
    if (!auth || !firebaseAuth) return false;
    
    try {
        const { signOut } = firebaseAuth;
        await signOut(auth);
        
        // Clear local state
        currentUser = null;
        isAuthenticated = false;
        
        // Update UI immediately
        updateUI();
        
        // Redirect to home page
        window.location.href = '/';
        
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error al cerrar sesión: ' + error.message);
        return false;
    }
}

// Recuperar contraseña
async function resetPassword(email) {
    if (!auth || !firebaseAuth) {
        throw new Error('Firebase no está inicializado');
    }
    
    try {
        const { sendPasswordResetEmail } = firebaseAuth;
        await sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent successfully to:', email);
        return true;
    } catch (error) {
        console.error('Password reset error:', error);
        throw error; // Lanzar el error para que el frontend lo maneje
    }
}

// Obtener rol del usuario desde Firestore
async function getUserRole(userId) {
    if (!db || !firebaseFirestore) {
        userRole = 'user';
        return 'user';
    }
    
    try {
        const { doc, getDoc } = firebaseFirestore;
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const userData = userSnap.data();
            userRole = userData.role || 'user';
            console.log('User role:', userRole);
            return userRole;
        } else {
            // Si no existe el documento, crear uno con rol 'user' por defecto
            userRole = 'user';
            return 'user';
        }
    } catch (error) {
        console.error('Error getting user role:', error);
        userRole = 'user';
        return 'user';
    }
}

// Guardar perfil de usuario
async function saveUserProfile(user) {
    if (!db || !user || !firebaseFirestore) return;
    
    try {
        const { doc, getDoc, setDoc } = firebaseFirestore;
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                role: 'user', // Rol por defecto
                createdAt: new Date().toISOString()
            });
            userRole = 'user';
        } else {
            // Si ya existe, obtener el rol actual
            const userData = userSnap.data();
            userRole = userData.role || 'user';
        }

        // Sincronizar con el backend si está disponible
        if (window.API && window.API.usuarios) {
            try {
                await window.API.usuarios.sync({
                    email: user.email,
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || ''
                });
                console.log('✅ Usuario sincronizado con backend');
            } catch (error) {
                console.warn('⚠️ No se pudo sincronizar con backend:', error.message);
            }
        }
    } catch (error) {
        console.error('Error saving user profile:', error);
    }
}

// Verificar si el usuario actual es admin
function isAdmin() {
    return userRole === 'admin';
}

// Actualizar UI
function updateUI() {
    const userInfo = document.getElementById('userInfo');
    const profileLink = document.getElementById('profileLink');
    
    if (isAuthenticated && currentUser) {
        if (userInfo) {
            userInfo.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>Hola, ${currentUser.displayName || currentUser.email.split('@')[0]}</span>
                    <button onclick="window.auth.logout()" 
                            style="background-color: #EF4444; color: white; border: none; border-radius: 6px; padding: 6px 12px; font-size: 0.8rem; cursor: pointer;">
                        Cerrar Sesión
                    </button>
                </div>
            `;
        }
        
        // Show profile link when authenticated
        if (profileLink) {
            profileLink.style.display = 'block';
        }
    } else {
        // Don't show login button in navbar when not authenticated
        if (userInfo) {
            userInfo.innerHTML = '';
        }
        
        // Hide profile link when not authenticated
        if (profileLink) {
            profileLink.style.display = 'none';
        }
    }

    // Update main button if function exists
    if (typeof updateMainButton === 'function') {
        updateMainButton();
    }
}

// Verificar autenticación para reservas
function checkAuthForReservation() {
    if (!isAuthenticated) {
        alert('Debes iniciar sesión para hacer una reserva');
        window.location.href = '/login';
        return false;
    }
    return true;
}

// Verificar autenticación para perfil
function checkAuthForProfile() {
    if (!isAuthenticated) {
        alert('Debes iniciar sesión para ver tu perfil');
        window.location.href = '/login';
        return false;
    }
    return true;
}

// Función para notificar cambios de autenticación
function notifyAuthChange() {
    // Dispatch custom event for profile updates
    window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { user: currentUser, isAuthenticated }
    }));
}

// Exportar funciones globalmente
window.auth = {
    initFirebase,
    loginWithEmail,
    loginWithGoogle,
    registerUser,
    logout,
    resetPassword,
    isAuthenticated: () => isAuthenticated,
    getCurrentUser: () => currentUser,
    getUserRole: () => userRole,
    isAdmin: () => isAdmin(),
    getUserRoleFromFirestore: (userId) => getUserRole(userId),
    updateUI,
    checkAuthForReservation,
    checkAuthForProfile,
    notifyAuthChange
};

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initFirebase();
});
