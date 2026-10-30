import { useState } from 'react';

function useLogin(onLogin) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const enableSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8;

  const handleChangeEmail = (event) => {
    const email = event.target.value;
    setFormData((previousData) => ({ ...previousData, email }));
  };

  const handleChangePassword = (event) => {
    const password = event.target.value;
    setFormData((previousData) => ({ ...previousData, password }));
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (enableSubmit) {
      onLogin(email, password);
    }
  };

  return {
    email,
    password,
    enableSubmit,
    handleChangeEmail,
    handleChangePassword,
    handleLoginSubmit,
  };
}

export default useLogin;
