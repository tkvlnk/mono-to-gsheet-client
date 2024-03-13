export function GoogleSheetText({
  sheet: { id, name },
}: {
  sheet: { id: string; name: string };
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5em",
      }}
    >
      <div>{name}</div>{" "}
      <div style={{ display: "flex" }}>
        (<GoogleSheetId id={id} />)
      </div>
    </div>
  );
}

function GoogleSheetId({ id }: { id: string }) {
  return (
    <div
      style={{
        maxWidth: "5em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflowWrap: "unset"
      }}
      title={id}
    >
      id: {id}
    </div>
  );
}
