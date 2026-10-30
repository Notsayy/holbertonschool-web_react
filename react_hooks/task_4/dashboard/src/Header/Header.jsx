import { useContext } from 'react';
import holbertonLogo from '../assets/holberton-logo.jpg';
import newContext from '../Context/context';

function Header() {
  const { user, logOut } = useContext(newContext);

  const handleLogOut = (event) => {
    event.preventDefault();
    logOut();
  };

  return (
    <>
      <div className="App-header flex items-center border-b-[3px] border-[var(--main-color)] p-2.5 px-5 max-[520px]:flex-col max-[520px]:items-center max-[520px]:px-2 max-[520px]:border-b-0 max-[520px]:border-transparent max-[520px]:pt-[7px] max-[520px]:pb-5">
        <img src={holbertonLogo} alt="holberton logo" className="h-48 max-[520px]:h-60" />
        <h1 className="text-[var(--main-color)] text-4xl font-bold ml-5 max-[520px]:ml-0 max-[520px]:mt-2 max-[520px]:text-center">School dashboard</h1>
      </div>
      {user.isLoggedIn && (
        <section id="logoutSection" className="mt-2 px-5 max-[520px]:text-center">
          Welcome {user.email} (<a href="#" onClick={handleLogOut} className="italic cursor-pointer">logout</a>)
        </section>
      )}
    </>
  );
}

export default Header;
