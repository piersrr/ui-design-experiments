export type TabItem = {
  id: string;
  label: string;
  panel: React.ReactNode;
};

type CssTabsProps = {
  tabs: TabItem[];
  /** Unique prefix for input ids (e.g. "tab" or "tab-pill") so multiple tab sets don't conflict */
  namePrefix: string;
  /** "default" = original sliding border style; "anchor-pill" = CSS anchor hover + active pills */
  variant?: 'default' | 'anchor-pill';
};

export function CssTabs({
  tabs,
  namePrefix,
  variant = 'default',
}: CssTabsProps) {
  const wrapperClass =
    variant === 'anchor-pill' ? 'anchor-pill-tabs' : 'css-tabs';
  const showPills = variant === 'anchor-pill';

  return (
    <div className={wrapperClass}>
      {tabs.map((tab, i) => (
        <input
          key={tab.id}
          type="radio"
          name={namePrefix}
          id={`${namePrefix}-${tab.id}`}
          defaultChecked={i === 0}
          aria-label={`${tab.label} tab`}
        />
      ))}
      <div className="tab-list" role="tablist">
        {showPills && (
          <>
            <span className="hover-pill" aria-hidden="true" />
            <span className="active-pill" aria-hidden="true" />
          </>
        )}
        {tabs.map((tab, i) => (
          <label
            key={tab.id}
            htmlFor={`${namePrefix}-${tab.id}`}
            role="tab"
            id={`${namePrefix}-${tab.id}-label`}
            className={showPills ? `tab-anchor tab-${i + 1}` : undefined}
            style={showPills ? { anchorName: `--tab-${i + 1}` } : undefined}
          >
            <span className="tab-label-text">{tab.label}</span>
          </label>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          className={`panel panel-${i + 1}`}
          role="tabpanel"
          aria-labelledby={`${namePrefix}-${tab.id}-label`}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
