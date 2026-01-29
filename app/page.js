"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");

  async function createPaste() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setLink(data.url);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Pastebin Lite</h1>
      <textarea
        rows="8"
        cols="60"
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button onClick={createPaste}>Create Paste</button>
      {link && <p>{link}</p>}
    </div>
  );
}
