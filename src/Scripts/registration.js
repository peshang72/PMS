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
}

window.onload = setMaxDate;
