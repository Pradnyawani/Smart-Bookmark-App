"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookmarks:", error.message);
      return;
    }

    if (data) setBookmarks(data);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Add bookmark
  const addBookmark = async () => {
    if (!title || !url) return;

    const { error } = await supabase.from("bookmarks").insert([{ title, url }]);

    if (error) {
      console.error("Error adding bookmark:", error.message);
      return;
    }

    setTitle("");
    setUrl("");
    fetchBookmarks();
  };

  // Delete bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting bookmark:", error.message);
      return;
    }

    fetchBookmarks();
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>

      {/* Add Bookmark Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={addBookmark}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Bookmarks List */}
      <ul>
        {bookmarks.map((b) => (
          <li
            key={b.id}
            className="flex justify-between items-center border-b py-2"
          >
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              {b.title}
            </a>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500 px-2 py-1 border rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
