import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div className="p-6">You must be logged in to view this page.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      tracks: true,
      purchases: {
        include: { track: true },
      },
    },
  });

  if (!user) return <div className="p-6">User not found.</div>;

  const purchasedTracks = user.purchases.filter((p) => !!p.track);

  return (
    <div className="min-h-screen bg-white text-black p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Account</h1>
        <div className="text-right">
          <p className="text-sm text-zinc-500 mb-1">{session.user.email}</p>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="bg-zinc-800 text-white text-sm px-4 py-2 rounded hover:bg-zinc-700"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* Uploaded Tracks */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Uploaded Tracks</h2>
        {user.tracks.length === 0 ? (
          <p className="text-zinc-500">You haven’t uploaded any tracks yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {user.tracks.map((track) => (
              <div
                key={track.id}
                className="relative overflow-hidden rounded-lg shadow hover:shadow-lg transition transform hover:scale-[1.01]"
              >
                <img
                  src={track.imageUrl || "/default-track.jpg"}
                  alt={track.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3">
                  <h3 className="font-semibold text-sm truncate">{track.title}</h3>
                  <p className="text-sm">${Number(track.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Purchased Tracks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Purchased Tracks</h2>
        {purchasedTracks.length === 0 ? (
          <p className="text-zinc-500">You haven’t purchased any tracks yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {purchasedTracks.map((purchase) => (
              <div
                key={purchase.id}
                className="relative overflow-hidden rounded-lg shadow hover:shadow-lg transition transform hover:scale-[1.01] bg-white"
              >
                <img
                  src={purchase.track.imageUrl || "/default-track.jpg"}
                  alt={purchase.track.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 text-black flex flex-col justify-between h-64 -mt-64 bg-gradient-to-t from-white/80 via-white/70 to-transparent">
                  <div>
                    <h3 className="font-bold text-base">{purchase.track.title}</h3>
                    <p className="text-sm text-gray-700">
                      ${Number(purchase.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Purchased: {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-4">
                    <audio
                      controls
                      src={purchase.track.fileUrl}
                      className="w-full rounded"
                    />
                    <a
                      href={purchase.track.fileUrl}
                      download
                      className="mt-3 inline-block w-full text-center bg-black text-white font-medium text-sm py-2 rounded-md hover:bg-zinc-900 transition"
                    >
                      Download Track
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
