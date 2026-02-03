import './tabs.css';
import { CssTabs } from '../components/CssTabs';

export const metadata = {
  title: 'Tabs',
  description: 'Pure CSS tab demos',
};

const sharedTabs = [
  {
    id: '1',
    label: 'Overview',
    panel: (
      <>
        <h3 className="mb-2 font-medium text-zinc-800 dark:text-zinc-200">Overview</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This is the first panel. The active tab is controlled entirely by CSS
          using hidden radio inputs and the{' '}
          <code className="rounded bg-zinc-300 px-1 py-0.5 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400">
            :checked
          </code>{' '}
          pseudo-class. No JavaScript is involved.
        </p>
      </>
    ),
  },
  {
    id: '2',
    label: 'Details',
    panel: (
      <>
        <h3 className="mb-2 font-medium text-zinc-800 dark:text-zinc-200">Details</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Second panel content. You can put any markup here—lists, forms, or
          more sections. The tab list and panels are siblings so that the
          general sibling combinator (
          <code className="rounded bg-zinc-300 px-1 py-0.5 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400">
            ~
          </code>
          ) can show the right panel.
        </p>
      </>
    ),
  },
  {
    id: '3',
    label: 'Settings',
    panel: (
      <>
        <h3 className="mb-2 font-medium text-zinc-800 dark:text-zinc-200">Settings</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Third panel. To add more tabs, add another radio input, a matching
          label in the tab list, and a panel with the corresponding class (e.g.{' '}
          <code className="rounded bg-zinc-300 px-1 py-0.5 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400">
            panel-4
          </code>
          ), then extend the CSS selectors.
        </p>
      </>
    ),
  },
];

export default function TabsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 p-8 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Tabs
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Pure CSS demos—no JavaScript required for interactivity.
        </p>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Pure CSS Tabs
          </h2>
          <p className="mb-4 text-sm text-zinc-500">
            Tab switching is driven by hidden radio inputs and the :checked
            selector. Click the labels to switch content.
          </p>

          <CssTabs tabs={sharedTabs} namePrefix="tab" variant="default" />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Slider pill tabs (CSS anchors)
          </h2>
          <p className="mb-4 text-sm text-zinc-500">
            Pill-style tabs using CSS Anchor Positioning. The hover highlight
            follows the tab under the cursor as you move between tabs; click and
            the active pill snaps to the selected tab. Requires a browser that
            supports anchor positioning (e.g. Chrome 125+).
          </p>

          <CssTabs tabs={sharedTabs} namePrefix="pill" variant="anchor-pill" />
        </section>
      </div>
    </div>
  );
}
