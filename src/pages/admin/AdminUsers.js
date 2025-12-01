// src/pages/admin/AdminUsers.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      setUsers(list);
    } catch (err) {
      console.error("Error loading users:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Restrict a user
  const handleRestrict = async (id) => {
    if (!window.confirm("Restrict this account?")) return;

    try {
      await updateDoc(doc(db, "users", id), { status: "restricted" });
      alert("User restricted.");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to restrict user");
    }
  };

  // Activate a user
  const handleActivate = async (id) => {
    try {
      await updateDoc(doc(db, "users", id), { status: "active" });
      alert("User activated.");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to activate user");
    }
  };

  // Delete a user document from Firestore (NOT Firebase Auth yet)
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this user from database?")) return;

    try {
      await deleteDoc(doc(db, "users", id));
      alert("User deleted.");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin – User Management</h1>

      {loading ? (
        <p className="text-green-300">Loading users…</p>
      ) : users.length === 0 ? (
        <p className="text-green-300">No users found.</p>
      ) : (
        <div className="overflow-x-auto border border-green-500 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-green-700 text-black">
              <tr>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-green-700 hover:bg-green-900/30"
                >
                  <td className="p-3">{u.email || "—"}</td>
                  <td className="p-3 capitalize">{u.status || "active"}</td>
                  <td className="p-3 capitalize">{u.role || "user"}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleRestrict(u.id)}
                      className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs font-semibold hover:bg-yellow-400"
                    >
                      Restrict
                    </button>
                    <button
                      onClick={() => handleActivate(u.id)}
                      className="bg-blue-500 text-black px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-400"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-600 text-black px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={fetchUsers}
        className="mt-5 bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-400"
      >
        Refresh
      </button>
    </div>
  );
}
