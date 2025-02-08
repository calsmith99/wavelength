import { LastFMForm } from "~/app/_components/forms/LastFMForm";

export default function SettingsPage() {
  return (

    <main className="flex min-h-screen flex-col items-center p-6 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div>
        <h1>User Settings</h1>
        <p>This is the user settings page.</p>
        <LastFMForm />
      </div>
    </main>
  );
}