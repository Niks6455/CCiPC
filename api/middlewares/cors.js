import cors from 'cors';

export default cors({
    credentials: true,
    origin: ["http://localhost:3001"],
    exposedHeaders: '*',
});