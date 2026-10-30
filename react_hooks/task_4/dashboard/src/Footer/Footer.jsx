import { useContext } from 'react';
import { getCurrentYear, getFooterCopy } from '../utils/utils';
import newContext from '../Context/context';

function Footer() {
  const { user } = useContext(newContext);

  return (
    <div className="App-footer border-t-[3px] border-[var(--main-color)] text-center italic p-2.5 w-full mt-auto max-[520px]:text-sm">
      <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
      {user && user.isLoggedIn && (
        <p><a href="#">Contact us</a></p>
      )}
    </div>
  );
}

export default Footer;
