import { useEffect, useId } from "react";

export default function YandexAdBlock({ blockId = "R-A-19257860-1", className = "" }) {
  const reactId = useId().replace(/:/g, "");
  const renderTo = `yandex_rtb_${blockId}_${reactId}`;

  useEffect(() => {
    if (!window.yaContextCb) {
      window.yaContextCb = [];
    }

    window.yaContextCb.push(() => {
      if (window.Ya?.Context?.AdvManager) {
        window.Ya.Context.AdvManager.render({
          blockId,
          renderTo,
        });
      }
    });
  }, [blockId, renderTo]);

  return (
    <div className={`ad-block yandex-ad-block ${className}`}>
      <div id={renderTo}></div>
    </div>
  );
}