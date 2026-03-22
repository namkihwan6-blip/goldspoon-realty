import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a2e1a 0%, #064e2b 50%, #0a3d20 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #10b981, #34d399, #10b981)",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            金
          </div>
          <span style={{ fontSize: "48px", fontWeight: "bold", color: "white" }}>
            금수저공인중개사 사무소
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#86efac",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          군산·새만금 토지 & 공장 전문 공인중개사
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginBottom: "40px",
          }}
        >
          {["토지 매물", "공장 매물", "새만금 전문", "맞춤 컨설팅"].map(
            (text) => (
              <div
                key={text}
                style={{
                  padding: "12px 28px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  fontSize: "22px",
                }}
              >
                {text}
              </div>
            )
          )}
        </div>

        {/* Contact */}
        <div style={{ fontSize: "22px", color: "rgba(255,255,255,0.6)" }}>
          📞 010-4289-4924 | 📍 전북특별자치도 군산시 새만금북로 534-5
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
