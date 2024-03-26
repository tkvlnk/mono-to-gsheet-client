export function GoogleSheetText({
  sheet: { id, name },
}: {
  sheet: { id: string; name: string };
}) {
  return (
    <span>
      {name} (<GoogleSheetId id={id} />)
    </span>
  );
}

function GoogleSheetId({ id }: { id: string }) {
  return (
    <span
      title={id}
    >
      id: {id.substring(0, 5)}…
    </span>
  );
}
