import './experiments.css';

export const metadata = {
  title: 'CSS Experiments',
  description: 'Pure CSS experiments and demos',
};

export default function ExperimentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-100">
          CSS Experiments
        </h1>
        <p className="mb-8 text-zinc-400">
          Pure CSS demos—no JavaScript required for interactivity.
        </p>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium text-zinc-300">
            Experiment 1: Pure CSS Tabs
          </h2>
          <p className="mb-4 text-sm text-zinc-500">
            Tab switching is driven by hidden radio inputs and the :checked
            selector. Click the labels to switch content.
          </p>

          <div className="css-tabs">
            <input
              type="radio"
              name="tabs"
              id="tab1"
              defaultChecked
              aria-label="Overview tab"
            />
            <input
              type="radio"
              name="tabs"
              id="tab2"
              aria-label="Details tab"
            />
            <input
              type="radio"
              name="tabs"
              id="tab3"
              aria-label="Settings tab"
            />
            <div className="tab-list" role="tablist">
              <label htmlFor="tab1" role="tab" id="tab1-label">
                <span className="tab-label-text">Overview</span>
              </label>
              <label htmlFor="tab2" role="tab" id="tab2-label">
                <span className="tab-label-text">Details</span>
              </label>
              <label htmlFor="tab3" role="tab" id="tab3-label">
                <span className="tab-label-text">Settings</span>
              </label>
            </div>
            <div
              className="panel panel-1"
              role="tabpanel"
              aria-labelledby="tab1-label"
            >
              <h3 className="mb-2 font-medium text-zinc-200">Overview</h3>
              <p className="text-sm text-zinc-400">
                This is the first panel. The active tab is controlled entirely
                by CSS using hidden radio inputs and the <code className="rounded bg-zinc-800 px-1 py-0.5 text-emerald-400">:checked</code> pseudo-class.
                No JavaScript is involved.
              </p>
            </div>
            <div
              className="panel panel-2"
              role="tabpanel"
              aria-labelledby="tab2-label"
            >
              <h3 className="mb-2 font-medium text-zinc-200">Details</h3>
              <p className="text-sm text-zinc-400">
                Second panel content. You can put any markup here—lists, forms,
                or more sections. The tab list and panels are siblings so that
                the general sibling combinator (<code className="rounded bg-zinc-800 px-1 py-0.5 text-emerald-400">~</code>) can show the right panel.
              </p>
            </div>
            <div
              className="panel panel-3"
              role="tabpanel"
              aria-labelledby="tab3-label"
            >
              <h3 className="mb-2 font-medium text-zinc-200">Settings</h3>
              <p className="text-sm text-zinc-400">
                Third panel. To add more tabs, add another radio input, a
                matching label in the tab list, and a panel with the
                corresponding class (e.g. <code className="rounded bg-zinc-800 px-1 py-0.5 text-emerald-400">panel-4</code>), then extend the CSS selectors.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
