const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verify authentication (optional, but recommended)
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (decodedToken.role !== 'teacher') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Forbidden: Teacher access required' })
      };
    }

    const { title, videoUrl, notes } = JSON.parse(event.body);

    if (!title || !videoUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Title and videoUrl are required' })
      };
    }

    const newVideo = {
      title,
      videoUrl,
      notes: notes || '',
      createdBy: decodedToken.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('lessons').add(newVideo);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ id: docRef.id, ...newVideo })
    };
  } catch (error) {
    console.error('Error adding video:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
