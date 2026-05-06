export function Volume({ volume }: { volume: number }) {
  return <div>{volume.toLocaleString()}</div>;
}
