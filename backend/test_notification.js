import axios from 'axios';

async function testBackend() {
  try {
    // 1. We don't have a valid user login token here, so the auth middleware might block updateFmcToken.
    // 2. Let's try calling notification send directly to see what it requires.
    const res = await axios.post('http://localhost:5000/api/v1/notification/send', {
      title: "Test Notification",
      body: "This is a test from the backend script",
      // recieverId: "some_valid_id" -> we need a valid ID here to test it properly
    });
    console.log("Success:", res.data);
  } catch(e) {
    console.error("Error:", e.response?.data || e.message);
  }
}

testBackend();
