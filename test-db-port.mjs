import net from "net";

const socket = net.createConnection(5432, "db.sfqzkvodulafamrhaxtg.supabase.co", () => {
  console.log("Connected to db.sfqzkvodulafamrhaxtg.supabase.co:5432!");
  socket.end();
});

socket.on("error", (err) => {
  console.log("Socket connection error:", err.message);
});
