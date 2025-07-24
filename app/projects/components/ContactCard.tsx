import Card from "@/app/components/Card";

{
  /* ...your existing code above... */
}
export default function ContactCard() {
  return (
    <Card className="w-full col-span-2 p-0">
      <div className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 bg-background relative z-20 text-primary border-b border-secondary rounded-t-xl">
        <span className="w-3 h-3 rounded-full bg-surface" />
        <span className="w-3 h-3 rounded-full bg-surface" />
        <span className="w-3 h-3 rounded-full bg-surface" />
        <span className="ml-2 text-xs font-mono text-surface/60">
          projects/contact.tsx
        </span>
      </div>
      <div className="relative z-10 px-6 py-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Interested in working together?
        </h2>
        <a
          href="/contact"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-4"
        >
          Contact Me
        </a>
        <hr className="my-4 w-1/2 border-gray-300" />
        <h3 className="text-lg font-medium mb-2 text-center">
          What people say
        </h3>
        <blockquote className="italic text-gray-600 max-w-xl text-center">
          {`"`}Working with Snehil was a fantastic experience. The projects
          exceeded our expectations!{`"`}
        </blockquote>
        <span className="mt-2 text-sm text-gray-500">— Happy Client</span>
        <div className="mt-6 flex justify-center">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            See more on GitHub
          </a>
        </div>
      </div>
    </Card>
  );
}
