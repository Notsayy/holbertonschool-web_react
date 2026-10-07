import WithLogging from '../HOC/WithLogging';

function Login() {
  return (
    <div className="App-body p-10 flex-1 border-t-[3px] border-[var(--main-color)]">
      <p className="text-xl mb-5">Login to access the full dashboard</p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
        <label htmlFor="email" className="mr-1">Email: </label>
        <input type="email" id="email" name="email" className="mr-4 border border-gray-300 rounded px-2 py-1" />
        <label htmlFor="password" className="mr-1">Password: </label>
        <input type="password" id="password" name="password" className="mr-4 border border-gray-300 rounded px-2 py-1" />
        <button type="button" className="ml-1 cursor-pointer border border-gray-300 rounded px-3 py-1">OK</button>
      </div>
    </div>
  );
}

export default WithLogging(Login);
