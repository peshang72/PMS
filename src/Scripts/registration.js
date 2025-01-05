function calculateAge() {
  const dob = document.getElementById("dateOfBirth").value;
  const dobDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();

  // Adjust age if birthday hasn't occurred this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dobDate.getDate())
  ) {
    age--;
  }

  document.getElementById("age").value = age;
}

function setMaxDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dateOfBirth").setAttribute("max", today);
  document.getElementById("dateOfBirth").setAttribute("min", "1900-01-01");
}

window.onload = setMaxDate;

function validateForm() {
  // Validate Phone Numbers with regex
  const phoneRegex = /^[+]?[0-9]{10,15}$/; // Match 10-15 digit phone number, optional '+'
  const phone = document.getElementById("phoneNumber").value;
  const secondaryPhone = document.getElementById("secondaryContact").value;

  if (!phoneRegex.test(phone)) {
    alert("Please enter a valid phone number.");
    return false;
  }
  if (!phoneRegex.test(secondaryPhone)) {
    alert("Please enter a valid secondary phone number.");
    return false;
  }

  return true;
}
