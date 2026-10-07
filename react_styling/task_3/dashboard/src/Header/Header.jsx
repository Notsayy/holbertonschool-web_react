import holbertonLogo from '../assets/holberton-logo.jpg';

function Header() {
  return (
    <div className="App-header flex items-center border-b-[3px] border-[var(--main-color)] p-2.5 px-5">
      <img src={holbertonLogo} alt="holberton logo" className="h-48" />
      <h1 className="text-[var(--main-color)] text-4xl font-bold ml-5">School dashboard</h1>
    </div>
  );
}

export default Header;
