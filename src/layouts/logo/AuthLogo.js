import React from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as LogoDarkIcon } from '../../assets/images/logos/xtreme-dark-icon.svg';
import { ReactComponent as LogoDarkText } from '../../assets/images/logos/xtreme-dark-text.svg';
import { ReactComponent as LogoWhiteIcon } from '../../assets/images/logos/xtreme-white-icon.svg';
import { ReactComponent as LogoWhiteText } from '../../assets/images/logos/xtreme-white-text.svg';

const AuthLogo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);

  return (
    <div className="p-4 d-flex justify-content-center gap-2">
      {isDarkMode !== false ? (
        <>
          <LogoWhiteIcon />
          <LogoWhiteText />
        </>
      ) : (
        <>
          <LogoDarkIcon />
          <LogoDarkText />
        </>
      )}
    </div>
  );
};

export default AuthLogo;
