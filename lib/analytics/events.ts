export type AnalyticsEventName = 'answer_submitted' | 'game_finished' | 'room_created';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  payload: Record<string, unknown>;
  at: string;
}

export function trackEvent(name: AnalyticsEventName, payload: Record<string, unknown>) {
  const event: AnalyticsEvent = {
    name,
    payload,
    at: new Date().toISOString()
  };

  // MVP: local log. Reemplazar por proveedor real en milestone posterior.
  console.info('[analytics]', event);
}
