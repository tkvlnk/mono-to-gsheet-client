import { useState } from "react";

const STORAGE_ITEM = "disclaimer-dismissed";

export function Disclaimer() {
  const [isDismissed, dismiss] = useState(() =>
    sessionStorage.getItem(STORAGE_ITEM) === "true"
  );

  if (isDismissed) {
    return null;
  }

  return (
    <div className="notification is-info">
      <button className="delete" onClick={() => {
        dismiss(true);
        sessionStorage.setItem(STORAGE_ITEM, 'true');
      }}/>
      Цей застосунок дозволяє імпортувати дані з Monobank в Google таблицю. Він
      не спілкується ні з якими сторонніми серверами, всі дані беруться напряму
      з серверів монобанка і відправляються напряму на сервери гугла для
      збереження у вказаній вами таблиці.
    </div>
  );
}
