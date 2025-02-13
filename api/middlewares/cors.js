import cors from 'cors';

// Предоставляем доступ cors
export default cors({
    credentials: true,
    origin: ["http://localhost:3001"],
    exposedHeaders: '*',
});