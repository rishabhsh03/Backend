document
  .getElementsById("userForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const userData = {
      user_id: document.getElementById("user_id").value,
      name: document.getElementById("name").value,
      email_id: document.getElementById("email_id").value,
      phone_no: document.getElementById("phone_no").value,
    };

    try {
      const response = await fetch(
        "http://localhost:5500/api/save-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  });