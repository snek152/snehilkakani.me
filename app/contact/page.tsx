import ContactForm from "../lib/components/ContactForm";
import Footer from "../lib/components/Footer";

export default function ContactPage() {
  return (
    <section className="min-h-screen grid grid-cols-2 px-4 py-8 gap-8">
      <section className="flex-col items-center justify-center flex">
        <div className="w-full bg-secondary p-8 bg-gradient-to-bl from-primary/20 via-background to-primary/10 border border-primary/5 rounded-2xl shadow-xl ">
          <ContactForm />
        </div>
        <div className="w-full mt-8">
          <Footer />
        </div>
      </section>
    </section>
  );
}
