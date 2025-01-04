function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

function getGender(isMale) {
  return isMale ? "Male" : "Female";
}

function getFullName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

module.exports = {
  calculateAge,
  getGender,
  getFullName,
};
