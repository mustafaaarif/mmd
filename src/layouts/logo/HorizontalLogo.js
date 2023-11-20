import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import React from 'react';
// import { ReactComponent as LogoDarkIcon } from '../../assets/images/logos/xtreme-dark-icon.svg';
// import { ReactComponent as LogoDarkText } from '../../assets/images/logos/xtreme-dark-text.svg';
// import { ReactComponent as LogoWhiteIcon } from '../../assets/images/logos/xtreme-white-icon.svg';
import logo from "../../assets/images/mmlogo.png"
// import { ReactComponent as LogoWhiteText } from '../../assets/images/logos/xtreme-white-text.svg';

const HorizontalLogo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const activetopbarBg = useSelector((state) => state.customizer.topbarBg);
  return (
    <Link to="/" className="d-flex align-items-center gap-2">
      {isDarkMode || activetopbarBg !== 'white' ? (
        <>
          {/* <LogoWhiteIcon /> */}
          <img src={logo} width={"52px"} className='py-1' />
          {/* <LogoWhiteText className="d-none d-lg-block" /> */}
          
        </>
      ) : (
        <>
          <img src={logo} width={"52px"} className='py-1' />
          {/* <LogoDarkIcon /> */}
          {/* <LogoDarkText className="d-none d-lg-block" /> */}
        </>
      )}
    </Link>
  );
};

export default HorizontalLogo;
