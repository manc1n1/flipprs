import { Table } from '../Table';
import { columns } from './columns';

import { TTimeseries } from '@/types/chart';

const RecentTradesTable = ({ timeseries }: { timeseries?: TTimeseries[] }) => {
  return (
    <Table
      columns={columns}
      data={timeseries}
    />
  );
};

export default RecentTradesTable;
