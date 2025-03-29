const apiBaseUrl = "http://localhost:8080/users";

// 🟢 Load Users (GET Request)
async function loadUsers() {
    try {
        const response = await fetch(apiBaseUrl);
        if (!response.ok) throw new Error("Failed to fetch users");
        const users = await response.json();
        let tableBody = document.getElementById("userTableBody");
        tableBody.innerHTML = "";
        users.forEach(user => {
            tableBody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <a href="edit-user.html?id=${user.id}" class="btn">Edit</a>
                        <button onclick="deleteUser(${user.id})" class="btn">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading users:", error);
        alert("Error loading users");
    }
}

// ✅ Add User (POST Request) - FIXED
const addUserForm = document.getElementById("addUserForm");
if (addUserForm) {
    addUserForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        try {
            const response = await fetch(apiBaseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });

            if (!response.ok) throw new Error("Failed to add user");
            console.log("User added successfully!");
            alert("User added successfully!");
            addUserForm.reset();
            loadUsers(); // Refresh the table
        } catch (error) {
//            console.error("Error adding user:", error);
            alert("Failed to add user!");
        }
    });
}

// 🟢 Load User for Edit Page
async function loadEditUser() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");
    if (!userId) return;

    try {
        const response = await fetch(`${apiBaseUrl}/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const user = await response.json();
        document.getElementById("userId").value = user.id;
        document.getElementById("editName").value = user.name;
        document.getElementById("editEmail").value = user.email;
    } catch (error) {
//        console.error("Error loading user:", error);
        alert("Error loading user");
    }
}

// 🟢 Update User (PUT Request)
const editUserForm = document.getElementById("editUserForm");
if (editUserForm) {
    editUserForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userId = document.getElementById("userId").value;
        const updatedUser = {
            name: document.getElementById("editName").value,
            email: document.getElementById("editEmail").value
        };

        try {
            const response = await fetch(`${apiBaseUrl}/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) throw new Error("Failed to update user");
            alert("User updated successfully!");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user!");
        }
    });
}

// 🟢 Delete User (DELETE Request)
async function deleteUser(id) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await fetch(`${apiBaseUrl}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete user");
            alert("User deleted successfully!");
            loadUsers(); // Refresh the table
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user!");
        }
    }
}

// 🟢 Auto-load Users on Home Page
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("userTableBody")) {
        loadUsers();
    }
    if (document.getElementById("editUserForm")) {
        loadEditUser();
    }
});