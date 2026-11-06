import PropTypes from 'prop-types';
import { getCurrentYear, getFooterCopy } from '../../utils/utils';
import { initialState } from '../../appReducer';

function Footer({ user = initialState.user }) {
  return (
    <div className="App-footer border-t-[3px] border-[var(--main-color)] text-center italic p-2.5 w-full mt-auto max-[520px]:text-sm">
      <p>Copyright {getCurrentYear()} - {getFooterCopy(false)}</p>
      {user && user.isLoggedIn && (
        <p><a href="#">Contact us</a></p>
      )}
    </div>
  );
}

Footer.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }),
};

export default Footer;
