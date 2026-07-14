import { getLandingAnalytics, type CountedItem, type LandingAnalytics } from '@/services/analytics';

import { AdminPageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EVENT_TYPE_LABELS: Record<string, string> = {
  page_view: 'Page view',
  language_switch: 'Language switch',
  cta_click: 'CTA click',
  social_click: 'Social click',
  nav_click: 'Navigation click',
};

function formatUtc(iso: string): string {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

function CountList({ items, empty }: { items: CountedItem[]; empty: string }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">{empty}</p>;
  }
  const max = items[0]?.count ?? 1;
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate">{item.label}</span>
            <span className="text-muted-foreground shrink-0 tabular-nums">{item.count}</span>
          </div>
          <div className="bg-muted h-1.5 rounded-full">
            <div
              className="bg-primary h-1.5 rounded-full"
              style={{ width: `${Math.max(4, Math.round((item.count / max) * 100))}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DailyViewsChart({ analytics }: { analytics: LandingAnalytics }) {
  const max = Math.max(1, ...analytics.dailyViews.map((day) => day.views));
  return (
    <div className="flex h-40 items-end gap-1.5">
      {analytics.dailyViews.map((day) => (
        <div key={day.date} className="flex h-full flex-1 flex-col justify-end gap-1">
          <div
            className="bg-primary/80 hover:bg-primary w-full rounded-t-sm transition-colors"
            style={{ height: `${Math.max(2, Math.round((day.views / max) * 100))}%` }}
            title={`${day.date}: ${day.views} views`}
          />
          <span className="text-muted-foreground text-center text-[10px] tabular-nums">
            {day.date.slice(8)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const analytics = await getLandingAnalytics();

  if (!analytics) {
    return (
      <div className="flex flex-col gap-6">
        <AdminPageHeader title="Dashboard" description="Landing page traffic and interactions" />
        <Card>
          <CardHeader>
            <CardTitle>Analytics is not set up yet</CardTitle>
            <CardDescription>
              The landing_events table could not be read. Apply
              migrations/003_multilang_and_analytics.sql to your Supabase project, then reload this
              page. Events start recording as soon as the migration is applied.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Dashboard"
        description={`Landing page traffic and interactions — last ${analytics.rangeDays} days`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Page views"
          value={String(analytics.pageViews)}
          description={`Last ${analytics.rangeDays} days`}
        />
        <StatCard
          title="Visitors"
          value={String(analytics.uniqueSessions)}
          description="Unique sessions"
        />
        <StatCard
          title="Interactions"
          value={String(analytics.interactions)}
          description="Clicks & language switches"
        />
        <StatCard
          title="Views today"
          value={String(analytics.viewsToday)}
          description="Since midnight UTC"
        />
      </div>

      {analytics.truncated && (
        <p className="text-muted-foreground text-xs">
          Showing the most recent 20,000 events — totals are a lower bound.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daily page views</CardTitle>
          <CardDescription>Last 14 days (UTC)</CardDescription>
        </CardHeader>
        <CardContent>
          <DailyViewsChart analytics={analytics} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top pages</CardTitle>
            <CardDescription>By page views</CardDescription>
          </CardHeader>
          <CardContent>
            <CountList items={analytics.topPages} empty="No page views recorded yet." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top interactions</CardTitle>
            <CardDescription>CTA, social, navigation and language clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <CountList items={analytics.clickTargets} empty="No interactions recorded yet." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audience</CardTitle>
            <CardDescription>Language and device of page views</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs font-medium uppercase">Language</p>
              <CountList items={analytics.languages} empty="No data yet." />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs font-medium uppercase">Device</p>
              <CountList items={analytics.devices} empty="No data yet." />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest visitor events</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentEvents.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No events yet — they appear here as soon as someone visits the landing page.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                    <th className="py-2 pr-4 font-medium">Time</th>
                    <th className="py-2 pr-4 font-medium">Event</th>
                    <th className="py-2 pr-4 font-medium">Page</th>
                    <th className="py-2 pr-4 font-medium">Target</th>
                    <th className="py-2 font-medium">Lang / Device</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentEvents.map((event, index) => (
                    <tr key={`${event.occurredAt}-${index}`} className="border-b last:border-0">
                      <td className="text-muted-foreground py-2 pr-4 whitespace-nowrap tabular-nums">
                        {formatUtc(event.occurredAt)}
                      </td>
                      <td className="py-2 pr-4">{EVENT_TYPE_LABELS[event.type] ?? event.type}</td>
                      <td className="max-w-48 truncate py-2 pr-4">{event.path}</td>
                      <td className="text-muted-foreground max-w-48 truncate py-2 pr-4">
                        {event.target ?? '—'}
                      </td>
                      <td className="text-muted-foreground py-2 whitespace-nowrap">
                        {[event.language, event.device].filter(Boolean).join(' / ') || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
