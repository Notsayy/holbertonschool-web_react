import PropTypes from 'prop-types';
import WithLogging from '../../components/HOC/WithLogging';
import useLogin from '../../hooks/useLogin';

function Login({ logIn = () => {} }) {
  const {
    email,
    password,
    enableSubmit,
    handleChangeEmail,
    handleChangePassword,
    handleLoginSubmit,
  } = useLogin(logIn);
  return (
    <div className="App-login p-10 flex-1 border-t-[3px] border-[var(--main-color)] max-[520px]:px-1 max-[520px]:pt-5 max-[520px]:pb-0 max-[520px]:-mt-3 max-[520px]:mb-[195px]">
      <p className="text-xl mb-5 max-[520px]:mb-9">Login to access the full dashboard</p>
      <form onSubmit={handleLoginSubmit} className="flex flex-col items-start gap-2.5 max-[520px]:gap-0 sm:flex-row sm:items-center">
        <label htmlFor="email" className="mr-1">Email</label>
        <input type="email" id="email" name="email" value={email} onChange={handleChangeEmail} className="mr-4 border border-gray-400 rounded px-2 py-1 max-[520px]:w-60 max-[520px]:mr-0 max-[520px]:px-1 max-[520px]:py-0.5 max-[520px]:mb-1.5 max-[520px]:border-black" />
        <label htmlFor="password" className="mr-1">Password</label>
        <input type="password" id="password" name="password" value={password} onChange={handleChangePassword} className="mr-4 border border-gray-400 rounded px-2 py-1 max-[520px]:w-60 max-[520px]:mr-0 max-[520px]:px-1 max-[520px]:py-0.5 max-[520px]:mb-1.5 max-[520px]:border-black" />
        <input type="submit" value="OK" disabled={!enableSubmit} className="ml-1 cursor-pointer border border-gray-400 rounded px-3 py-1 max-[520px]:ml-0 max-[520px]:mt-2 max-[520px]:px-1 max-[520px]:py-px max-[520px]:border-black" />
      </form>
    </div>
  );
}

Login.propTypes = {
  logIn: PropTypes.func,
};

const LoginWithLogging = WithLogging(Login);

export default LoginWithLogging;
