import cors from "cors";

const allowedOrigins = [
  "http://localhost:3001",
  "https://ssas.dev.rdcenter.ru",
  "https://ssas.sfedu.ru",
];

export default cors({
  origin: (origin, callback) => {
    // Разрешаем запросы без origin (например, curl или Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});
