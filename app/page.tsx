export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen w-[min(100%-48px,1180px)] flex-col justify-center py-20 max-[720px]:w-[min(100%-32px,1180px)]">
        <p className="text-sm font-semibold uppercase tracking-normal text-slate-600">
          Alex Metelli
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-normal text-slate-950 max-[720px]:text-4xl">
          Software Engineer
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
          Backend systems. Developer tooling. Blockchain infrastructure.
        </p>
      </section>
    </main>
  );
}
