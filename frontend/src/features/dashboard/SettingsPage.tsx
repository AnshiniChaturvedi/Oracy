"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Card, CardHeader, Notice, PageHeader, SelectField, Toggle } from "@/components/dashboard/ui";
import { TextField } from "@/components/forms/Field";
import { useDashboard } from "@/features/dashboard/DashboardContext";
import { INTERVIEW_TYPES, SESSION_LENGTHS, resetDashboard, type InterviewType } from "@/lib/dashboard-data";
import { signOut } from "@/services/auth";

export function SettingsPage() {
  const { data, update, session } = useDashboard();
  const router = useRouter();
  const s = data.settings;
  const [inApp, setInApp] = useState(s.inApp);
  const [practiceReminders, setPracticeReminders] = useState(s.practiceReminders);
  const [weeklySummary, setWeeklySummary] = useState(s.weeklySummary);
  const [reminderTime, setReminderTime] = useState(s.reminderTime);
  const [interviewType, setInterviewType] = useState<InterviewType>(s.interviewType);
  const [sessionMinutes, setSessionMinutes] = useState(s.sessionMinutes);
  const [sampleMode, setSampleMode] = useState(data.sampleMode);
  const [timeError, setTimeError] = useState<string>();
  const [status, setStatus] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = practiceReminders && !/^\d{2}:\d{2}$/.test(reminderTime) ? "Choose a reminder time." : undefined;
    setTimeError(err);
    if (err) {
      setStatus({ tone: "bad", text: "Please fix the highlighted field." });
      return;
    }
    const ok = update((d) => ({ ...d, sampleMode, settings: { ...d.settings, inApp, practiceReminders, weeklySummary, reminderTime: reminderTime || d.settings.reminderTime, interviewType, sessionMinutes } }));
    setStatus(ok ? { tone: "ok", text: "Settings saved." } : { tone: "bad", text: "Saved for this visit, but your browser blocked storage so it won’t persist." });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Preferences are saved in this browser. No emails or push notifications are sent yet." />

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <Card labelledBy="st-notif">
          <CardHeader id="st-notif" title="Notifications" />
          <div className="divide-y divide-line">
            <Toggle checked={inApp} onChange={setInApp} label="In-app notifications" description="Show the unread dot and updates in the bell menu." />
            <Toggle checked={practiceReminders} onChange={setPracticeReminders} label="Practice reminders" description="Saved as a preference. Reminders aren’t delivered until a backend exists." />
            <Toggle checked={weeklySummary} onChange={setWeeklySummary} label="Weekly progress summary" description="Saved as a preference. Summaries aren’t sent yet." />
          </div>
          {practiceReminders && (
            <div className="mt-4 max-w-xs"><TextField label="Reminder time" type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} error={timeError} /></div>
          )}
        </Card>

        <Card labelledBy="st-prefs">
          <CardHeader id="st-prefs" title="Practice preferences" />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField label="Preferred interview type" value={interviewType} options={INTERVIEW_TYPES.map((t) => ({ value: t, label: t }))} onChange={(e) => setInterviewType(e.target.value as InterviewType)} />
            <SelectField label="Preferred session length" value={sessionMinutes} options={SESSION_LENGTHS.map((m) => ({ value: m, label: `${m} minutes` }))} onChange={(e) => setSessionMinutes(e.target.value)} />
          </div>
          <div className="mt-4 border-t border-line pt-2">
            <Toggle checked={sampleMode} onChange={setSampleMode} label="Show sample data" description="Fills the dashboard with clearly labelled illustrative scores and sessions. Turn off to see your real, empty state." />
          </div>
        </Card>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit">Save settings</Button>
          {status && <div className="min-w-0 flex-1"><Notice tone={status.tone}>{status.text}</Notice></div>}
        </div>
      </form>

      <Card labelledBy="st-account">
        <CardHeader id="st-account" title="Account and data" />
        <p className="text-sm text-sub">Signed in as <span className="text-ink">{session.email}</span> (local demo session).</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="outline" onClick={async () => { await signOut(); router.push("/"); }}>Sign out</Button>
          {!confirmReset ? (
            <Button variant="outline" className="hover:!border-bad hover:!text-bad" onClick={() => setConfirmReset(true)}>Reset dashboard data</Button>
          ) : (
            <div role="alertdialog" aria-label="Confirm reset" className="flex flex-wrap items-center gap-3 rounded-xl border border-bad/30 bg-bad/5 px-4 py-3">
              <p className="text-sm text-ink">Clear your saved profile, goals, plan and settings from this browser?</p>
              <Button className="!bg-bad px-5 py-2.5 !shadow-none hover:!bg-red-700" onClick={() => { resetDashboard(session.email); setConfirmReset(false); }}>Yes, reset</Button>
              <Button variant="outline" className="px-5 py-2.5" onClick={() => setConfirmReset(false)}>Cancel</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
