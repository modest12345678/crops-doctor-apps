
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = 'postgresql://neondb_owner:npg_FTdQN4SD3oPl@ep-billowing-credit-a1q9bze8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function testConnection() {
    console.log('Testing connection to Neon DB...');
    const pool = new Pool({ connectionString });

    try {
        const client = await pool.connect();
        console.log('Connected successfully!');
        const result = await client.query('SELECT NOW() as time');
        console.log('Query result:', result.rows[0]);
        client.release();
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await pool.end();
    }
}

testConnection();
