import styles from './WikiImage.module.css';

import { buildIconUrl } from '@/utils/buildIconUrl';

type TWikiImageProps = {
  icon: string | undefined;
  alt: string;
};

const WikiImage = ({ icon, alt }: TWikiImageProps) => {
  if (!icon) return null;
  return (
    <img
      className={styles.img}
      loading='lazy'
      decoding='async'
      src={buildIconUrl(icon)}
      alt={alt}
    />
  );
};

export default WikiImage;
