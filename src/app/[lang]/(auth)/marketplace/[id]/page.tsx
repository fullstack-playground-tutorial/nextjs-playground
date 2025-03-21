interface Props {
  params: { language: string; id: string };
}
export default function (props: Props) {
  return <>Product ID: {props.params.id}</>;
}
