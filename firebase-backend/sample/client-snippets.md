Client snippets (minimal)

1) Client-side signup with Firebase Web SDK (email/password)

```js
// initialize firebase on client with config
// import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

// Signup
const auth = getAuth();
await createUserWithEmailAndPassword(auth, email, password);

// After client signup, Cloud Function `onUserCreate` will create the Firestore `users` doc.
```

2) Google sign-in (client)

```js
const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
// result.user contains user; on first sign-in onUserCreate will run too.
```

3) Call protected API (send Firebase ID token in Authorization)

```js
const token = await auth.currentUser.getIdToken();
fetch('/courses', { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify({ title:'My Course' }) });
```
