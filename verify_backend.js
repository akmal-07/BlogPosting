
// Using global fetch (Node 18+)

async function testBackend() {
    const registerUrl = 'http://localhost:3000/register';
    const loginUrl = 'http://localhost:3000/login';

    const uniqueId = Date.now();
    const user = {
        username: `testuser_${uniqueId}`,
        email: `test_${uniqueId}@example.com`,
        password: 'password123',
        dob: '2000-01-01'
    };

    console.log('Testing Registration...');
    try {
        const regRes = await fetch(registerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const regData = await regRes.json();
        console.log('Register Status:', regRes.status);
        console.log('Register Response:', regData);

        if (regRes.ok) {
            console.log('Testing Login...');
            const loginRes = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username, password: user.password })
            });
            const loginData = await loginRes.json();
            console.log('Login Status:', loginRes.status);
            console.log('Login Response:', loginData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testBackend();
