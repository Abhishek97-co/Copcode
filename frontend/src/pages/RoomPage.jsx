
import { useLocation } from "react-router-dom";

export default function RoomPage() {
  const { state } = useLocation();

  return (
    <div style={{ color: "white", padding: "40px" }}>
      <h1>Room loaded ✅</h1>
      <p>Room ID: {state?.roomId}</p>
    </div>
  );
}