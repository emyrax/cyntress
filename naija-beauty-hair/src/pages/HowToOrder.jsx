import { Helmet } from 'react-helmet-async'

export default function HowToOrder() {
  const steps = [
    { title: 'Browse', description: 'Explore our collection of wigs and hair tools.' },
    { title: 'Select', description: 'Choose your preferred style, size, and quantity.' },
    { title: 'Add to Cart', description: 'Click "Add to Cart" and review your order.' },
      { title: 'Checkout', description: 'Fill in your shipping details and order via WhatsApp.' },
    { title: 'Delivery', description: 'We process and ship your order within 1-3 business days.' },
  ]

  return (
    <>
      <Helmet>
        <title>How to Order – Cyntress Luxury</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">How to Order</h1>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center font-bold text-lg">
                {i + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">Contact us on WhatsApp for personalized assistance.</p>
          <a
            href="https://api.whatsapp.com/send?phone=2349124449757"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
