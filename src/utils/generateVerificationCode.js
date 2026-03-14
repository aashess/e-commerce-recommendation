

export const generateVerificationCode = () => {
  const randomNumber = Math.random();
  console.log(randomNumber);
  const code = Math.floor(100000 + randomNumber * 900000);
  return code.toString();
}