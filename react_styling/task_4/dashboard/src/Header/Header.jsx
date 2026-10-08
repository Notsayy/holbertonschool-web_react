import holbertonLogo from '../assets/holberton-logo.jpg';

function Header() {
  return (
    <div className="App-header flex items-center border-b-[3px] border-[var(--main-color)] p-2.5 px-5 max-[520px]:flex-col max-[520px]:items-center max-[520px]:px-2 max-[520px]:border-b-0">
      <img src={holbertonLogo} alt="holberton logo" className="h-48 max-[520px]:h-36" />
      <h1 className="text-[var(--main-color)] text-4xl font-bold ml-5 max-[520px]:ml-0 max-[520px]:mt-2 max-[520px]:text-3xl max-[520px]:text-center">School dashboard</h1>
    </div>
  );
}

export default Header;
