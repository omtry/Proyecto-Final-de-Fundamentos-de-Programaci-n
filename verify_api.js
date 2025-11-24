// const fetch = require('node-fetch'); // Built-in in Node 18+

const BASE_URL = 'http://localhost:3001/api';

async function testApi() {
    console.log('Testing API...');

    try {
        // 1. Test Health Check
        console.log('\n1. Testing Health Check...');
        const healthRes = await fetch(`${BASE_URL}/health`);
        const healthData = await healthRes.json();
        console.log('Health Check Status:', healthRes.status);
        console.log('Health Check Response:', healthData);

        if (healthRes.status !== 200) throw new Error('Health check failed');

        // 2. Test Get Reservations
        console.log('\n2. Testing Get Reservations...');
        const getRes = await fetch(`${BASE_URL}/reservas`);
        const contentType = getRes.headers.get('content-type');
        console.log('Content-Type:', contentType);

        if (!contentType.includes('application/json')) {
            const text = await getRes.text();
            console.error('ERROR: Expected JSON but got:', text.substring(0, 100));
            throw new Error('Get Reservations returned non-JSON');
        }

        const getData = await getRes.json();
        console.log('Get Reservations Status:', getRes.status);
        console.log('Reservations Count:', getData.data ? getData.data.length : 0);

        // 3. Test Create Reservation
        console.log('\n3. Testing Create Reservation...');
        const newReservation = {
            userId: 'test-user-123',
            salaId: 1,
            fecha: new Date().toISOString().split('T')[0],
            horario: '10:00',
            duracion: 1,
            proposito: 'Test Reservation',
            participantes: 2
        };

        const createRes = await fetch(`${BASE_URL}/reservas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReservation)
        });

        const createData = await createRes.json();
        console.log('Create Reservation Status:', createRes.status);
        console.log('Create Reservation Response:', createData);

        if (createRes.status === 201) {
            console.log('Reservation created successfully!');

            // Clean up (optional, but good practice)
            if (createData.data && createData.data.id) {
                console.log('Cleaning up reservation...');
                await fetch(`${BASE_URL}/reservas/${createData.data.id}`, { method: 'DELETE' });
            }
        } else if (createRes.status === 400 || createRes.status === 409) {
            console.log('Reservation failed (expected if duplicate/conflict):', createData.message);
        } else {
            throw new Error('Create Reservation failed with unexpected status');
        }

        console.log('\n✅ API Verification Completed Successfully');

    } catch (error) {
        console.error('\n❌ API Verification Failed:', error.message);
    }
}

testApi();
