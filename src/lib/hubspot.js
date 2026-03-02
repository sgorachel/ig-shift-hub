/**
 * Send assessment results to HubSpot in the background.
 * Errors are swallowed — this should never block the user flow.
 */
export async function sendToHubspot(portalId, formId, fields) {
  if (!portalId || !formId || portalId === 'YOUR_PORTAL_ID') return;
  try {
    await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: Object.entries(fields).map(([name, value]) => ({ name, value: String(value) })),
        }),
      }
    );
  } catch {
    // silent — HubSpot is non-critical
  }
}
