import styles from './Home.module.css';

import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import Item from '@/pages/Home/Item';

import Marquee from '@/components/Marquee';
import { Autocomplete } from '@/components/Autocomplete';
import WikiImage from '@/components/WikiImage';

import { useItemsQuery } from '@/hooks/useItemsQuery';

import type { TSearchItem } from '@/types/item';

import { MARQUEE_ITEMS } from '@/constants';

const Home = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { data: items = [] } = useItemsQuery();

  const handleSelect = (item: TSearchItem) => {
    navigate(`item/${item.id}`);
  };

  if (itemId) {
    const id = Number(itemId);
    return <Item itemId={id} />;
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.marqueeContainer}>
        <Marquee>
          {MARQUEE_ITEMS.map((item) => (
            <img
              className={styles.img}
              src={`/${item}.png`}
              key={item}
            />
          ))}
        </Marquee>
      </div>
      <motion.div
        className={styles.autocompleteContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Autocomplete
          options={items}
          onSelect={handleSelect}
          getOptionLabel={(item: TSearchItem) => item.name}
          renderOption={(item: TSearchItem) => (
            <div className={styles.option}>
              <div className={styles.imgContainer}>
                <WikiImage
                  icon={item.icon}
                  alt={item.name}
                />
              </div>
              {item.name}
            </div>
          )}
        />
      </motion.div>
    </div>
  );
};

export default Home;
