import { Helmet } from 'react-helmet-async'

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us – Cyntress Luxury</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">About Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {[3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div key={n} className="aspect-[4/3] bg-gray-100 rounded overflow-hidden flex items-center justify-center text-gray-400">
              <span className="text-sm">Gallery image {n}</span>
            </div>
          ))}
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            Cyntress Luxury is Nigeria's premier destination for premium human hair wigs. 
            We are committed to delivering unparalleled beauty with a blend of fashion, comfort, and quality.
          </p>
          <p className="text-gray-600 mt-4">
            Our collection includes classic Bob Wigs, original Curly Wigs, unique Headband Wigs, and many more styles 
            designed to elevate your look. Every wig is crafted from 100% human hair to ensure durability, 
            natural appearance, and styling versatility.
          </p>
          <p className="text-gray-600 mt-4">
            Visit our physical store at 1004, open Mon–Sat 9am–6pm, Sunday 12pm–6pm. 
            You can also reach us by phone at 09124449757 or via WhatsApp at 09124449757.
          </p>
        </div>
      </div>
    </>
  )
}
