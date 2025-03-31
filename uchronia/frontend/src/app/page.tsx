import { Suspense } from "react";
import { fetchInitialEvents } from "@/services/api";
import { Slider } from "@/components/Slider";

async function EventsLoader() {
  const data = await fetchInitialEvents();
  const sortedEvents = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  console.log("sortedEvents: ", JSON.stringify(sortedEvents, null, 2));
  return <Slider events={sortedEvents} />;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center">
      <p>Loading</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#F5F5F5]">
      <Suspense fallback={<LoadingFallback />}>
        <EventsLoader />
      </Suspense>
    </main>
  );
}
