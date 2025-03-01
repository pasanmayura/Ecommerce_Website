import { registerUser } from "../Services/authService";

export const formSubmit = async (event) => {
  event.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const result = await registerUser(data.name, data.email, data.password);
    alert(result.message);
  } catch (error) {
    console.error("Error:", error);
    alert("There was an error with the registration. Please try again.");
  }
};