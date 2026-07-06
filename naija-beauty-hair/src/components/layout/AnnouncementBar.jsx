export default function AnnouncementBar({ message = 'Buy Wigs Get Free Gifts' }) {
  return (
    <div className="bg-ink text-white text-center text-sm py-2 px-4">
      <p className="tracking-wide">{message}</p>
    </div>
  )
}
