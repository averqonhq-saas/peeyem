import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="w-full py-space-xl bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
        <div className="relative rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary p-space-lg lg:p-space-xl text-on-primary shadow-xl overflow-hidden">
          {/* Abstract Industrial Geometry SVG in Background */}
          <svg
            className="absolute right-0 top-0 bottom-0 h-full w-auto text-surface-container-lowest/10 pointer-events-none"
            fill="currentColor"
            viewBox="0 0 400 300"
          >
            <path d="M0,0 L200,0 L350,300 L150,300 Z" opacity="0.4"></path>
            <path d="M120,0 L270,0 L420,300 L270,300 Z" opacity="0.25"></path>
            <circle cx="320" cy="80" opacity="0.3" r="60"></circle>
          </svg>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-md items-center">
            <div className="lg:col-span-8">
              <span className="px-3 py-1 rounded-full bg-surface-container-lowest/20 font-code-spec text-code-spec uppercase tracking-wider text-surface-bright inline-block mb-space-xs">
                Specialist Engineering Consultation
              </span>
              <h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-on-primary tracking-tight">
                Have a Specific Requirement?
              </h2>
              <p className="font-body-lg text-body-md lg:text-body-lg text-on-primary-container max-w-2xl mt-space-xs leading-relaxed">
                Share your requirement and our technical team can help you with the relevant product information, technical sizing, tensile stress ratings, and price estimates.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-space-sm mt-space-sm lg:mt-0">
              <Link
                className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md font-bold shadow-lg hover:bg-tertiary-fixed-dim transition-all w-full sm:w-auto text-center"
                href="#enquiry-form"
              >
                <span className="material-symbols-outlined text-[20px]">calculate</span>
                <span>Request a Technical Quote</span>
              </Link>
              <span className="font-body-sm text-body-sm text-on-primary-container">
                Prompt quotes tailored to your ply &amp; width requirements
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
