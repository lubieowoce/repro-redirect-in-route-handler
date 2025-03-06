/* eslint-disable react/no-unescaped-entities */
"use client";

import { type ReactNode, useState } from "react";

export default function Home() {
  return (
    <main style={{ maxWidth: "100ch" }}>
      <h1>
        What's the result of POSTing to a route handler <br />
        that redirect()s to a static page?
      </h1>
      {process.env.NODE_ENV === "development" && (
        <p style={{ border: "1px solid lightgrey", padding: "1em" }}>
          <strong>WARNING</strong>: this will not work correctly in dev mode,
          because we're not returning 405 for POST requests to static pages
        </p>
      )}
      <section>
        <h2>❌ 405</h2>
        <p>(because it returns a 307, and the POST is retried)</p>
        <SendRequest
          action={() =>
            fetch("/redirecting-handler", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ what: "ever" }),
            })
          }
        >
          POST json
        </SendRequest>
        <div style={{ height: "0.5em" }}></div>
        <SendRequest
          action={() =>
            fetch("/redirecting-handler", {
              method: "POST",
              headers: { "content-type": "text/plain" },
              body: "whatever",
            })
          }
        >
          POST plaintext
        </SendRequest>
        <div style={{ height: "0.5em" }}></div>
        <SendRequest
          action={() =>
            fetch("/redirecting-handler", {
              method: "POST",
              headers: {
                // this what the browser would set by default, but i'm adding it here to be explicit.
                "content-type":
                  "application/x-www-form-urlencoded;charset=UTF-8",
              },
              body: new URLSearchParams({ what: "ever" }),
            })
          }
        >
          POST urlencoded (with charset=utf-8)
        </SendRequest>
      </section>
      <br />
      <section>
        <h2>✅ 200</h2>
        <p>(because it returns a 303, and the browser does a GET instead)</p>
        <SendRequest
          action={() =>
            fetch("/redirecting-handler", {
              method: "POST",
              body: (() => {
                const formData = new FormData();
                formData.append("what", "ever");
                return formData;
              })(),
            })
          }
        >
          POST multipart
        </SendRequest>
        <div style={{ height: "0.5em" }}></div>
        <SendRequest
          action={() =>
            fetch("/redirecting-handler", {
              method: "POST",
              headers: {
                "content-type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({ what: "ever" }),
            })
          }
        >
          POST urlencoded
        </SendRequest>
      </section>
    </main>
  );
}

function SendRequest({
  action,
  children,
}: {
  action: () => Promise<Response>;
  children: ReactNode;
}) {
  const [result, setResult] = useState<NonNullable<ReactNode> | null>(null);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
      <button
        type="button"
        style={{
          minWidth: "18ch",
          fontFamily: "monospace",
          textAlign: "start",
        }}
        onClick={() =>
          action().then((res) =>
            setResult(
              <span style={{ color: res.ok ? "green" : "tomato" }}>
                response status: {res.status}
              </span>
            )
          )
        }
      >
        {children}
      </button>
      {result !== null && <div>{result}</div>}
    </div>
  );
}
