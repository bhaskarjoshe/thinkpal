"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useChat } from "@ai-sdk/react";

export default function ChatUI() {
  const [query, setQuery] = useState("");

  const { messages, sendMessage } = useChat({
    apiEndpoint: "http://localhost:8000/api/chat",

    // Map your backend response to the SDK expected format
    responseMapping: (res: any) => {
      // Your backend returns { ui_component: { ... } }
      if (res.ui_component) {
        return {
          ...res.ui_component,
          type: res.ui_component.component_type || "card",
          text: res.ui_component.content, // SDK expects a `text` field
        };
      }

      // fallback for normal text responses
      return { type: "text", text: res.text || res };
    },
  });

  const handleSend = () => {
    if (!query) return;
    sendMessage({ query }); // send an object matching your backend schema
    setQuery("");
  };

  return (
    <div className="p-6">
      {/* Input */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask AI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>

      {/* Render messages/cards */}
      <div className="space-y-4">
        {messages.map((msg: any, idx: number) => {
          if (msg.type === "card") {
            return (
              <div key={idx} className="max-w-md mx-auto shadow-lg rounded-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>{msg.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{msg.content}</p>
                    <ul className="list-disc pl-6 space-y-1">
                      {(msg.features || []).map((f: string, i: number) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            );
          }

          // fallback for text messages
          if (msg.type === "text") {
            return (
              <div key={idx} className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
                {msg.text}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
