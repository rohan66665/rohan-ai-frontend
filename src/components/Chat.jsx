import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  // CHAT
  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { user: message, bot: data.answer || "No response" },
      ]);

      setMessage("");
    } catch (err) {
      alert("Error sending message");
    }

    setLoading(false);
  };

  // IMAGE
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/upload/image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        {
          user: "📷 Image Uploaded",
          bot: data.text || JSON.stringify(data),
        },
      ]);
    } catch (err) {
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="main">
      <h1 style={{ textAlign: "center" }}>Rohan AI</h1>

      <div className="chat-container">
        {chat.map((c, i) => (
          <div key={i}>
            <div className="user">{c.user}</div>
            <div className="bot">{c.bot}</div>
          </div>
        ))}
        {loading && <div className="bot">Typing...</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything..."
        />

        <input type="file" onChange={handleFileUpload} />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}