export default function Loading() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F7FA" }}>
      <div
        aria-label="Yükleniyor"
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "3px solid #e2eaf2",
          borderTopColor: "#10b981",
          animation: "mvSpin .8s linear infinite",
        }}
      />
      <style>{`@keyframes mvSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
