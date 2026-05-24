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
import { toast } from 'sonner';

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

import { getItemMetrics } from '@/utils/metrics';

import type { TItem } from '@/types/item';

import MemberIcon from '@/assets/images/Member_icon.png';
import F2PIcon from '@/assets/images/Free-to-play_icon.png';

const Favourites = () => {
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
      toast.error('No favourites to export', {
        id: 'no-favourites-export-toast',
        icon: <FileWarning />,
        duration: 1500,
      });
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
          id: 'import-favourites-toast',
          icon: <Download />,
          duration: 1500,
        });
      } catch {
        toast.error('Invalid file format', {
          id: 'invalid-favourites-file-toast',
          icon: <FileWarning />,
          duration: 1500,
        });
      }
    };

    input.click();
  };

  const hasFavourites = favourites.length > 0;

  const handleTableNavClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
        id: 'icon',
        accessor: 'icon',
        sortable: false,
        render: (value, row) => (
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
                icon={value}
                alt={row.name}
              />
            </motion.button>
          </Link>
        ),
      },
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        align: 'left',
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
        id: 'high',
        header: 'Buy price',
        accessor: 'high',
        align: 'right',
        render: (value) => (
          <div className={styles.price}>
            <PriceChange value={value} />
          </div>
        ),
      },
      {
        id: 'highTime',
        header: 'Buy time',
        align: 'right',
        accessor: (row) => row.highTime ?? 0,
        render: (value) => <LastUpdateTime timestamp={value} />,
      },
      {
        id: 'low',
        header: 'Sell price',
        accessor: 'low',
        align: 'right',
        render: (value) => (
          <div className={styles.price}>
            <PriceChange value={value} />
          </div>
        ),
      },
      {
        id: 'lowTime',
        header: 'Sell time',
        align: 'right',
        accessor: (row) => row.lowTime ?? 0,
        render: (value) => <LastUpdateTime timestamp={value} />,
      },
      {
        id: 'margin',
        header: 'Margin',
        align: 'right',
        accessor: (row) => {
          const { marginValue } = getItemMetrics(row);

          return marginValue;
        },
        render: (_value, row) => <Margin item={row} />,
      },
      {
        id: 'roi',
        header: 'ROI',
        align: 'right',
        accessor: (row) => {
          const { roiValue } = getItemMetrics(row);

          return roiValue;
        },
        render: (_value, row) => <ROI item={row} />,
      },
      {
        id: 'volume',
        header: 'Volume',
        accessor: 'volume',
        align: 'right',
        render: (_value, row) => <Volume volume={row.volume} />,
      },
      {
        id: 'limit',
        header: 'Buy limit',
        accessor: 'limit',
        align: 'right',
        render: (_value, row) => <BuyLimit item={row} />,
      },
      {
        id: 'potentialProfit',
        header: 'Potential profit',
        align: 'right',
        accessor: (row) => {
          const { potentialProfitValue } = getItemMetrics(row);

          if (potentialProfitValue === 0) return null;

          return potentialProfitValue;
        },
        render: (_value, row) => <PotentialProfit item={row} />,
      },
      {
        id: 'members',
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
      {
        id: 'id',
        header: 'Item ID',
        accessor: 'id',
        align: 'right',
      },
      {
        id: 'favourite',
        accessor: 'id',
        sortable: false,
        render: (_value, row) => (
          <motion.button
            type='button'
            tabIndex={0}
            aria-label='Remove favourite'
            onClick={(e) => {
              e.stopPropagation();
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
    [handleTableNavClick, isFavourite, toggleFavourite],
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
        variant='favourites'
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
