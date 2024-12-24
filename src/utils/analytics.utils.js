import UAParser from 'ua-parser-js';

export function processAnalytics(clicks) {
  const parser = new UAParser();
  const uniqueIPs = new Set();
  const deviceTypes = new Map();
  const osTypes = new Map();
  const clicksByDate = new Map();

  clicks.forEach(click => {
    const ua = parser.setUA(click.user_agent).getResult();
    uniqueIPs.add(click.ip_address);

    const device = ua.device.type || 'desktop';
    deviceTypes.set(device, (deviceTypes.get(device) || 0) + 1);

    const os = ua.os.name;
    osTypes.set(os, (osTypes.get(os) || 0) + 1);

    const date = new Date(click.created_at).toISOString().split('T')[0];
    clicksByDate.set(date, (clicksByDate.get(date) || 0) + 1);
  });

  return {
    totalClicks: clicks.length,
    uniqueClicks: uniqueIPs.size,
    clicksByDate: Array.from(clicksByDate, ([date, count]) => ({ date, count })),
    osType: Array.from(osTypes, ([osName, count]) => ({ osName, count })),
    deviceType: Array.from(deviceTypes, ([deviceName, count]) => ({ deviceName, count })),
  };
}

export function processTopicAnalytics(analytics, aliases) {
  return {
    totalClicks: analytics.length,
    uniqueClicks: new Set(analytics.map(a => a.ip_address)).size,
    clicksByDate: processClicksByDate(analytics),
    urls: aliases.map(alias => ({
      shortUrl: `${process.env.BASE_URL}/${alias}`,
      ...processAnalytics(analytics.filter(a => a.url_alias === alias)),
    })),
  };
}

function processClicksByDate(analytics) {
  const clicksByDate = new Map();

  analytics.forEach(click => {
    const date = new Date(click.created_at).toISOString().split('T')[0];
    clicksByDate.set(date, (clicksByDate.get(date) || 0) + 1);
  });

  return Array.from(clicksByDate, ([date, count]) => ({ date, count }));
}
