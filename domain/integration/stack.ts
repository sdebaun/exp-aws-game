export default function stack() {
  const bus = new sst.aws.Bus("bus");
  return { bus };
}
