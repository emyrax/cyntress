export const mainNav = [
  { label: 'HOME', path: '/' },
  { label: 'WIG ON SALE', path: '/collections/wigs-on-sale' },
  {
    label: 'ALL WIGS',
    path: '/collections/all',
    children: [
      { label: 'Glueless Wigs', path: '/collections/glueless-wigs' },
      { label: 'Bob Wig', path: '/collections/bob-wig' },
      { label: 'Bone Straight Wigs', path: '/collections/straight-wig' },
      { label: 'Raw Wavy Wig', path: '/collections/raw-wavy-wig' },
      { label: 'Original Curly Wig', path: '/collections/original-curly-wig' },
      { label: 'Fringe Wig', path: '/collections/fringe-wig' },
      { label: 'Short Cut Wig', path: '/collections/short-cut-wig' },
      { label: 'Headband Wig', path: '/collections/headband-wig-1' },
      { label: 'Hair Bundles', path: '/collections/hair-bundles' },
      { label: 'Wig Combo', path: '/collections/wig-combo' },
    ],
  },
  { label: 'ROYAL LACE', path: '/collections/undetectable-lace' },
  { label: 'NEW ARRIVALS', path: '/collections/new-in' },
  { label: 'HAIR TOOLS', path: '/collections/hair-tools' },
  { label: 'HOW TO ORDER', path: '/how-to-order' },
  {
    label: 'BLOG',
    path: '/blog',
    children: [
      { label: 'WIG TIPS', path: '/blog/category/wig-tips' },
      { label: 'HAIR CARE', path: '/blog/category/hair-care' },
      { label: 'HAIRSTYLE', path: '/blog/category/hairstyle' },
      { label: 'CYTRESS MEDIA', path: '/blog/category/cyntress-media' },
      { label: 'PRODUCT SPOTLIGHT', path: '/blog/category/product-spotlight' },
      { label: 'CUSTOMER REVIEWS', path: '/blog/category/customer-reviews' },
    ],
  },
]

export const footerLinks = {
  store: {
    title: 'STORE',
    items: [
      { label: '1004 Store', href: '#' },
      { label: 'MON - SAT : 9 am - 6 pm', href: null },
      { label: 'SUN : 12 pm - 6 pm', href: null },
    ],
    contact: [
      { label: 'Call: 09124449757', href: 'tel:09124449757' },
      { label: 'WA: 09124449757', href: 'https://api.whatsapp.com/send?phone=2349124449757' },
    ],
  },
  about: {
    title: 'ABOUT US',
    items: [
      { label: 'About us', path: '/about' },
      { label: 'Contact us', path: '/contact' },
      { label: 'Contact Us On Whatsapp', href: 'https://api.whatsapp.com/send?phone=2349124449757' },
      { label: 'FAQs', path: '/faqs' },
      { label: 'Order Tutorial', path: '/how-to-order' },
      { label: 'Share For Rewards', path: '/share-rewards' },
      { label: 'Blog', path: '/blog' },
    ],
  },
  policies: {
    title: 'POLICIES',
    items: [
      { label: 'Shipment Policy', path: '/shipment-policy' },
      { label: 'Return Policy', path: '/return-policy' },
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Intellectual Property Rights', path: '/ip-rights' },
    ],
  },
  social: {
    title: 'FOLLOW US',
    items: [
      { label: 'Facebook', href: 'https://facebook.com/cyntress' },
      { label: 'Twitter', href: 'https://twitter.com/cyntress' },
      { label: 'Instagram', href: 'https://www.instagram.com/cyntressluxury/' },
    ],
  },
}

export const adminSidebar = [
  { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard', roles: ['admin', 'editor'] },
  { label: 'Products', path: '/admin/products', icon: 'Package', roles: ['admin', 'editor'] },
  { label: 'Blog Posts', path: '/admin/posts', icon: 'FileText', roles: ['admin', 'editor'] },
  { label: 'Product Categories', path: '/admin/categories/product', icon: 'Tags', roles: ['admin'] },
  { label: 'Blog Categories', path: '/admin/categories/blog', icon: 'Tags', roles: ['admin', 'editor'] },
  { label: 'Banners', path: '/admin/banners', icon: 'Image', roles: ['admin'] },
  { label: 'Orders', path: '/admin/orders', icon: 'ShoppingCart', roles: ['admin'] },
  { label: 'API Keys', path: '/admin/api-keys', icon: 'Key', roles: ['admin'] },
  { label: 'SEO Settings', path: '/admin/seo', icon: 'Search', roles: ['admin'] },
  { label: 'Pages', path: '/admin/pages', icon: 'File', roles: ['admin'] },
  { label: 'Admin Users', path: '/admin/admins', icon: 'Users', roles: ['admin'] },
]
