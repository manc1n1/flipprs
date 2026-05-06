import styles from './Favourites.module.css';

import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download,
  FileWarning,
  Heart,
  HeartCrack,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { toast } from 'react-toastify';

import { Table, type IColumn } from '@/components/Table';
import WikiImage from '@/components/WikiImage';
import { PriceChange } from '@/components/ItemMetrics/PriceChange';
import { LastUpdateTime } from '@/components/ItemMetrics/LastUpdateTime';
import { Margin } from '@/components/ItemMetrics/Margin';
import { Volume } from '@/components/ItemMetrics/Volume';
import { ROI } from '@/components/ItemMetrics/ROI';
import { BuyLimit } from '@/components/ItemMetrics/BuyLimit';
import { PotentialProfit } from '@/components/ItemMetrics/PotentialProfit';
import FloatingActionButton, {
  type IFABAction,
} from '@/components/FloatingActionButton';

import {
  getAllFavourites,
  deleteAllFavourites,
  setFavourite,
} from '@/db/favouritesDB';

import { useFavourites } from '@/hooks/useFavourites';
import { useFavouriteItemsQuery } from '@/hooks/useFavouriteItemsQuery';
import { useHaptics } from '@/hooks/useHaptics';

import type { TItem } from '@/types/item';

import MemberIcon from '@/assets/images/Member_icon.png';
import F2PIcon from '@/assets/images/Free-to-play_icon.png';

const Favourites = () => {
  const { selection } = useHaptics();
  const {
    favourites,
    isLoadingFavourites,
    toggleFavourite,
    isFavourite,
    refresh,
    deleteAll,
  } = useFavourites();
  const { favItems, loading } = useFavouriteItemsQuery({
    favourites,
    isLoadingFavourites,
  });

  const exportFavourites = async () => {
    const itemIds = await getAllFavourites();
    if (itemIds.length > 0) {
      const blob = new Blob([JSON.stringify(itemIds, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flipprs-favourites.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      toast.error('No favourites to export', { icon: <FileWarning /> });
    }
  };

  const importFavourites = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const itemIds: number[] = JSON.parse(text);

        await deleteAllFavourites();
        await Promise.all(itemIds.map((itemId) => setFavourite(itemId)));
        await refresh();

        const bc = new BroadcastChannel('favourites-sync');
        bc.postMessage('update');
        bc.close();

        toast.success(`Imported ${itemIds.length} favourites`, {
          icon: <Download />,
        });
      } catch {
        toast.error('Invalid file format', { icon: <FileWarning /> });
      }
    };
    input.click();
  };

  const hasFavourites = favourites.length > 0;

  const handleTableNavClick = useCallback(() => {
    selection();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selection]);

  const actions: IFABAction[] = [
    {
      icon: <Download className={styles.importButton} />,
      label: 'Import favourites',
      onClick: importFavourites,
    },
    ...(hasFavourites
      ? [
          {
            icon: <Upload className={styles.exportButton} />,
            label: 'Export favourites',
            onClick: exportFavourites,
          },
          {
            direction: 'down',
            icon: <Trash2 className={styles.trashButton} />,
            label: 'Clear favourites',
            onClick: () => deleteAll(),
          } as IFABAction,
        ]
      : []),
  ];

  const columns = useMemo<IColumn<TItem>[]>(
    () => [
      {
        accessor: 'icon',
        sortable: false,
        render: (_value, row) => (
          <Link to={`/item/${row.id}`}>
            <motion.button
              type='button'
              tabIndex={0}
              aria-label='Item link'
              className={styles.motionButton}
              whileTap={{ scale: 0.95 }}
              onClick={handleTableNavClick}
            >
              <WikiImage
                icon={row.icon}
                alt={row.name}
              />
            </motion.button>
          </Link>
        ),
      },
      {
        header: 'Name',
        accessor: 'name',
        render: (value, row) => (
          <Link
            to={`/item/${row.id}`}
            className={styles.itemLink}
            onClick={handleTableNavClick}
          >
            {value}
          </Link>
        ),
      },
      {
        header: 'Buy price',
        accessor: 'high',
        render: (_value, row) => (
          <div className={styles.price}>
            <PriceChange value={row.high} />
          </div>
        ),
      },
      {
        header: 'Buy time',
        accessor: (row) => -(row.highTime ?? 0),
        render: (_value, row) => <LastUpdateTime timestamp={row.highTime} />,
      },
      {
        header: 'Sell price',
        accessor: 'low',
        render: (_value, row) => (
          <div className={styles.price}>
            <PriceChange value={row.low} />
          </div>
        ),
      },
      {
        header: 'Sell time',
        accessor: (row) => -(row.lowTime ?? 0),
        render: (_value, row) => <LastUpdateTime timestamp={row.lowTime} />,
      },
      {
        header: 'Margin',
        accessor: (row) => (row.high ?? 0) - (row.low ?? 0),
        render: (_value, row) => <Margin item={row} />,
      },
      {
        header: 'ROI',
        accessor: (row) => {
          const marginValue = (row.high ?? 0) - (row.low ?? 0);
          return parseFloat(((marginValue / (row.low ?? 0)) * 100).toFixed(2));
        },
        render: (_value, row) => <ROI item={row} />,
      },
      {
        header: 'Volume',
        accessor: 'volume',
        render: (_value, row) => <Volume volume={row.volume} />,
      },
      {
        header: 'Buy limit',
        accessor: 'limit',
        render: (_value, row) => <BuyLimit item={row} />,
      },
      {
        header: 'Potential profit',
        accessor: (row) => {
          const marginValue = (row.high ?? 0) - (row.low ?? 0);
          return marginValue * (row.limit ?? 0);
        },
        render: (_value, row) => <PotentialProfit item={row} />,
      },
      {
        header: 'Members',
        accessor: 'members',
        render: (_value, row) => (
          <div>
            {row.members === true ? (
              <img
                loading='lazy'
                decoding='async'
                src={MemberIcon}
                alt='Member icon'
              />
            ) : (
              <img
                loading='lazy'
                decoding='async'
                src={F2PIcon}
                alt='Free-to-play icon'
              />
            )}
          </div>
        ),
      },
      { header: 'Item ID', accessor: 'id' },
      {
        accessor: 'id',
        sortable: false,
        render: (_value, row) => (
          <motion.button
            type='button'
            tabIndex={0}
            aria-label='Remove favourite'
            onClick={(e) => {
              e.stopPropagation();
              selection();
              void toggleFavourite(row.id);
            }}
            className={styles.motionButton}
            whileTap={{ scale: 0.95 }}
          >
            {isFavourite(row.id) ? (
              <Heart className={styles.favoriteFill} />
            ) : (
              <Heart />
            )}
          </motion.button>
        ),
      },
    ],
    [handleTableNavClick, isFavourite, selection, toggleFavourite],
  );

  if (loading) {
    return <div className={styles.loadingContainer} />;
  }

  if (!hasFavourites) {
    return (
      <>
        <div className={styles.noFavouritesContainer}>
          <HeartCrack className={styles.noFavouritesIcon} />
        </div>
        <FloatingActionButton
          actions={actions}
          fabIcon={<Plus />}
          label='Open menu'
        />
      </>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        data={favItems}
      />
      <FloatingActionButton
        actions={actions}
        fabIcon={<Plus />}
        label='Open menu'
      />
    </>
  );
};

export default Favourites;
