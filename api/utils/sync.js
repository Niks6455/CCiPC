import axios from 'axios';

export default axios.create({
    auth: { username: process.env.SYNC_USERNAME, password: process.env.SYNC_PASSWORD },
});