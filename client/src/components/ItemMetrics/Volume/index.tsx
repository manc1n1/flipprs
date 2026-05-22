export function Volume({ volume }: { volume: number | null }) {
  return <div>{volume !== null ? volume.toLocaleString() : '-'}</div>;
}
