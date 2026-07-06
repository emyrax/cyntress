import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const categories = [
  { name: 'Glueless Wigs', slug: 'glueless-wigs', order: 1 },
  { name: 'Bob Wig', slug: 'bob-wig', order: 2 },
  { name: 'Bone Straight Wigs', slug: 'straight-wig', order: 3 },
  { name: 'Raw Wavy Wig', slug: 'raw-wavy-wig', order: 4 },
  { name: 'Original Curly Wig', slug: 'original-curly-wig', order: 5 },
  { name: 'Fringe Wig', slug: 'fringe-wig', order: 6 },
  { name: 'Short Cut Wig', slug: 'short-cut-wig', order: 7 },
  { name: 'Headband Wig', slug: 'headband-wig-1', order: 8 },
  { name: 'Hair Bundles', slug: 'hair-bundles', order: 9 },
  { name: 'Wig Combo', slug: 'wig-combo', order: 10 },
  { name: 'Royal Lace', slug: 'undetectable-lace', order: 11 },
  { name: 'New Arrivals', slug: 'new-in', order: 12 },
  { name: 'Hair Tools', slug: 'hair-tools', order: 13 },
  { name: 'Wigs on Sale', slug: 'wigs-on-sale', order: 14 },
]

const seoDefaults = {
  siteTitle: 'Cyntress Luxury',
  siteDescription: 'Elevate Your Style with Premium Human Hair Wigs',
  ogImage: '',
  twitterHandle: '@cyntress',
  facebookPage: 'cyntress',
  favicon: '',
  googleAnalyticsId: '',
  facebookPixelId: '',
}

async function seed() {
  console.log('Seeding categories...')
  for (const cat of categories) {
    await addDoc(collection(db, 'categories'), {
      ...cat,
      createdAt: serverTimestamp(),
    })
    console.log(`  ✓ ${cat.name}`)
  }

  console.log('Seeding SEO settings...')
  await setDoc(doc(db, 'seo_settings', 'global'), {
    ...seoDefaults,
    updatedAt: serverTimestamp(),
  })
  console.log('  ✓ Global SEO settings')

  console.log('Done!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
