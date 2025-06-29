import React, { useState } from 'react';
import { useAuth } from './auth-provider';

export default function GoogleAuth() {
  const { user, idToken, login, logout, refreshToken } = useAuth();
  const [hasuraResult, setHasuraResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const HASURA_URL = import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT;

  // 1️⃣ Upsert (Create/Update) user in Hasura
  const upsertUserInHasura = async () => {
    if (!user || !idToken) return;
    setLoading(true);

    const mutation = `
      mutation UpsertUser($firebase_uid: String!, $email: String!, $name: String!) {
        insert_users_one(
          object: {
            firebase_uid: $firebase_uid,
            email: $email,
            name: $name
          },
          on_conflict: {
            constraint: users_firebase_uid_key,
            update_columns: [email, name]
          }
        ) {
          id
          firebase_uid
          email
          name
          role
        }
      }
    `;

    try {
      const res = await fetch(HASURA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            firebase_uid: user.uid,
            email: user.email,
            name: user.displayName || user.email
          }
        })
      });
      const json = await res.json();
      setHasuraResult(json);
    } catch (err) {
      console.error(err);
      setHasuraResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Fetch the user's row from Hasura
  const fetchUserFromHasura = async () => {
    if (!user || !idToken) return;
    setLoading(true);

    const query = `
      query GetUserByUID($firebase_uid: String!) {
        users(where: { firebase_uid: { _eq: $firebase_uid } }) {
          id
          email
          name
          role
        }
      }
    `;

    try {
      const res = await fetch(HASURA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          query,
          variables: { firebase_uid: user.uid }
        })
      });
      const json = await res.json();
      setHasuraResult(json);
    } catch (err) {
      console.error(err);
      setHasuraResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Firebase Google Auth + Hasura JWT Demo</h1>

      {!user && (
        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      )}

      {user && (
        <>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded mb-2"
          >
            Sign Out
          </button>

          <div className="bg-gray-100 p-2 rounded mb-2">
            <p><strong>Signed in as:</strong> {user.email}</p>
          </div>

          <button
            onClick={refreshToken}
            className="bg-green-500 text-white px-4 py-2 rounded mb-2"
          >
            Refresh ID Token
          </button>

          <pre className="bg-gray-200 p-2 overflow-x-auto mb-2">{idToken}</pre>

          <button
            onClick={upsertUserInHasura}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded mb-2"
          >
            {loading ? 'Creating/Updating...' : 'Upsert User in Hasura'}
          </button>

          <button
            onClick={fetchUserFromHasura}
            disabled={loading}
            className="bg-indigo-500 text-white px-4 py-2 rounded mb-2 ml-2"
          >
            {loading ? 'Fetching...' : 'Fetch User from Hasura'}
          </button>

          {hasuraResult && (
            <pre className="bg-gray-200 p-2 mt-2 overflow-x-auto">
              {JSON.stringify(hasuraResult, null, 2)}
            </pre>
          )}
        </>
      )}
    </div>
  );
}
