import { css, Global } from '@emotion/react';
import { useSelector } from 'react-redux';

const Color = () => {
  const user = useSelector((state) => state.auth.user);
  const primaryColor = user?.role_name === 'Brand Manager' ? user.primary_color || '#202f5f' : '#202f5f';
  
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const gradientEndColor = lightenColor(primaryColor, 30);

  return (
    <Global
      styles={css`
        :root {
          --primary-color: ${primaryColor};
        }
        .sidebar_menu li a.active{
          background: linear-gradient(45deg, ${primaryColor}, ${gradientEndColor});
        }    
        .sub_menu:before{
          background: ${gradientEndColor};
        }
        .sub_menu li a:before{
          background: ${gradientEndColor};
        }
        .sub_menu li a:after{
          border-left: 2px solid ${gradientEndColor};
          border-bottom: 2px solid ${gradientEndColor};
        }
        .dashboard_filter .custom_date_picker .rmdp-day-picker .rmdp-week .rmdp-today span{
          background-color: ${primaryColor};
        }
        .dashboard_filter .custom_date_picker .rmdp-day-picker .rmdp-week .rmdp-range{
          background-color: ${primaryColor};
        }
        .dashboard_filter .custom_date_picker .rmdp-day-picker .rmdp-week .rmdp-day span:hover{
          background-color: ${primaryColor};
        }  
      `}
    />
  );
};

export default Color;
