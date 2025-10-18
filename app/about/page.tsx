export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold">About Supply Chain Map</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Supply Chain Map is a simple way to explore US public companies through
          their industry value chains and supplier relationships.
        </p>

        <div className="mx-auto mt-10 max-w-xl rounded-lg border bg-background p-6">
          <h2 className="mb-2 text-xl font-semibold">Contact Us</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
          <a
            href="mailto:stocserver@gmail.com"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            stocserver@gmail.com
          </a>
        </div>
      </div>
    </div>
  )
}


