const API_URL = "http://localhost:5000/api";

async function testAuth() {
  const testEmail = `test_${Date.now()}@example.com`;

  console.log("--- Testing Registration ---");
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: testEmail,
        password: "password123",
      }),
    });
    const data = await response.json();
    console.log("Registration Status:", response.status);
    console.log("Registration Response:", data);
  } catch (error) {
    console.log("Registration Request Failed:", error.message);
  }

  console.log("\n--- Testing Login (Success case) ---");
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "password123",
      }),
    });
    const data = await response.json();
    console.log("Login Status:", response.status);
    console.log("Login Response:", data);
  } catch (error) {
    console.log("Login Request Failed:", error.message);
  }
}

testAuth();
