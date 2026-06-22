import { useState, useEffect } from "react";
function UserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    phone_no: "",
  });

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get-user-data");
        const result = await response.json();
        setUsers(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/save-user-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(data);

      if (editId) {
        setUsers(
          users.map((user) =>
            user.user_id === editId ? { ...user, ...formData } : user
          )
        );
        setEditId(null);
      } else {
        setUsers([...users, formData]);
      }

      setFormData({
        name: "",
        email_id: "",
        phone_no: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDuplicateUsers = () => {
    const duplicates = users.filter((user, index, self) =>
      self.findIndex(
        (u) => u.email_id === user.email_id && u.phone_no === user.phone_no
      ) !== index
    );

    if (duplicates.length > 0) {
      console.log("Duplicate users:", duplicates);
      alert(`Found ${duplicates.length} duplicate user(s). Check console for details.`);
    } else {
      alert("No duplicate users found.");
    }
  };

  const handleDelete = (userId) => {
    setUsers(users.filter((user) => user.user_id !== userId));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email_id"
          placeholder="Enter Email"
          value={formData.email_id}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone_no"
          placeholder="Enter Phone Number"
          value={formData.phone_no}
          onChange={handleChange}
        />

        <button type="submit">{editId ? "Update" : "Submit"}</button>
      </form>
      <button onClick={fetchDuplicateUsers}>Show Duplicate Users</button>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email_id}</td>
              <td>{user.phone_no}</td>
              <td>
                <button
                  type="button"
                  onClick={() => {
                    setEditId(user.user_id);
                    setFormData({
                      name: user.name,
                      email_id: user.email_id,
                      phone_no: user.phone_no,
                    });
                  }}
                >
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(user.user_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default UserForm;
