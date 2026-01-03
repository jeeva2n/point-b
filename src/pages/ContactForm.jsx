import React, { useState, useEffect } from 'react';

const getBackendUrl = () => {
  return localStorage.getItem('backend_url') || 'http://192.168.1.9:5001';
};

export default function ContactForm() {
  const [result, setResult] = useState("");
  const [user, setUser] = useState(null);
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");

    const formData = new FormData(event.target);
    formData.append("access_key", "73a5d128-f5b6-4b66-80c6-bdac56b080c8");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${backendUrl}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            name: event.target.name.value,
            email: event.target.email.value,
            phone: event.target.phone?.value || '',
            company: event.target.company?.value || '',
            message: event.target.message.value,
            user_id: user?.id || null
          })
        });
      } catch (dbError) {
        console.error('Failed to sync with local DB:', dbError);
      }

      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      setResult("Error: " + data.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" defaultValue={user?.full_name || ""} placeholder="Your Name" required />
      <input type="email" name="email" defaultValue={user?.email || ""} placeholder="Your Email" required />
      <input type="text" name="phone" defaultValue={user?.phone || ""} placeholder="Phone Number" />
      <input type="text" name="company" defaultValue={user?.company || ""} placeholder="Company Name" />
      <textarea name="message" placeholder="Message" required></textarea>
      <button type="submit">Submit Form</button>
      <div style={{marginTop: "10px"}}>{result}</div>
    </form>
  );
}