import { getCurrentYear, getFooterCopy } from '../../utils/utils';

function Footer() {
  return (
    <div className="App-footer border-t-[3px] border-[var(--main-color)] text-center italic p-2.5 w-full mt-auto max-[520px]:text-sm">
      <p>Copyright {getCurrentYear()} - {getFooterCopy(true)}</p>
    </div>
  );
}

export default Footer;

