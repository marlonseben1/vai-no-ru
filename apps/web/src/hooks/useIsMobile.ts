import useMediaQuery from '@mui/material/useMediaQuery';
import { responsiveMediaQuery } from '@/utils/isResponsive';

const useIsMobile = () => {
  return useMediaQuery(responsiveMediaQuery);
};

export default useIsMobile;
