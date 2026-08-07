"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: string;
  equipment: { title: string; owner: { name: string } };
  client?: { name: string; email: string; phone: string | null };
}

interface EquipmentListing {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  isApproved: boolean;
  isAvailable: boolean;
}

const categories = ["CONSTRUCTION", "AGRICULTURAL", "HEAVY_TRANSPORT", "REFRIGERATED"];

function ClientBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading your bookings...</p>;
  if (bookings.length === 0) return <p className="text-gray-500">You haven't booked any equipment yet.</p>;

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div key={b.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">{b.equipment.title}</p>
            <p className="text-sm text-gray-600">
              {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()} ({b.totalDays} days)
            </p>
            <p className="text-sm text-gray-600">Owner: {b.equipment.owner.name}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary-600">{b.totalPrice.toLocaleString()} RWF</p>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{b.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function OwnerPanel() {
  const [listings, setListings] = useState<EquipmentListing[]>([]);
  const [incoming, setIncoming] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    description: "",
    pricePerDay: "",
    location: "",
    city: "",
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/equipment?owner=me").then((r) => r.json()),
      fetch("/api/bookings?as=owner").then((r) => r.json()),
    ])
      .then(([eq, bk]) => {
        setListings(eq);
        setIncoming(bk);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const submitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pricePerDay: Number(form.pricePerDay),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create listing");
      }
      setForm({ title: "", category: categories[0], description: "", pricePerDay: "", location: "", city: "" });
      setShowForm(false);
      loadData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading your listings...</p>;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Equipment ({listings.length})</h2>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold"
          >
            {showForm ? "Cancel" : "+ Add Equipment"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={submitListing} className="bg-white rounded-lg shadow p-4 mb-4 space-y-3">
            {formError && <p className="text-red-600 text-sm">{formError}</p>}
            <input
              required
              placeholder="Title"
              className="w-full border rounded px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <select
              className="w-full border rounded px-3 py-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c.replace("_", " ")}</option>
              ))}
            </select>
            <textarea
              required
              placeholder="Description (min 10 characters)"
              className="w-full border rounded px-3 py-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              required
              type="number"
              min="1"
              placeholder="Price per day (RWF)"
              className="w-full border rounded px-3 py-2"
              value={form.pricePerDay}
              onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
            />
            <input
              required
              placeholder="Location (address/area)"
              className="w-full border rounded px-3 py-2"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <input
              required
              placeholder="City"
              className="w-full border rounded px-3 py-2"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 bg-primary-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Submit for approval"}
            </button>
          </form>
        )}

        {listings.length === 0 ? (
          <p className="text-gray-500">You haven't listed any equipment yet.</p>
        ) : (
          <div className="space-y-3">
            {listings.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.category.replace("_", " ")} — {item.pricePerDay.toLocaleString()} RWF/day</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${item.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {item.isApproved ? "Approved" : "Pending approval"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Incoming Bookings ({incoming.length})</h2>
        {incoming.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {incoming.map((b) => (
              <div key={b.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{b.equipment.title}</p>
                  <p className="text-sm text-gray-600">Client: {b.client?.name} ({b.client?.phone || b.client?.email})</p>
                  <p className="text-sm text-gray-600">
                    {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{b.totalPrice.toLocaleString()} RWF</p>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPanel() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/equipment?pending=true")
      .then((r) => r.json())
      .then(setPending)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const decide = async (id: string, approve: boolean) => {
    setBusyId(id);
    try {
      if (approve) {
        await fetch(`/api/equipment/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isApproved: true }),
        });
      } else {
        await fetch(`/api/equipment/${id}`, { method: "DELETE" });
      }
      load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading pending listings...</p>;
  if (pending.length === 0) return <p className="text-gray-500">No listings awaiting approval.</p>;

  return (
    <div className="space-y-3">
      {pending.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-600">
              {item.category.replace("_", " ")} — {item.pricePerDay.toLocaleString()} RWF/day — by {item.owner.name}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              disabled={busyId === item.id}
              onClick={() => decide(item.id, true)}
              className="px-3 py-1 bg-green-600 text-white rounded font-semibold disabled:opacity-50"
            >
              Approve
            </button>
            <button
              disabled={busyId === item.id}
              onClick={() => decide(item.id, false)}
              className="px-3 py-1 bg-red-600 text-white rounded font-semibold disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/login");
  }

  const role = (session!.user as any)?.role as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl">HeavyHire Dashboard</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session!.user?.name} · {role}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-red-600 font-semibold"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {role === "OWNER" ? "Owner Dashboard" : role === "ADMIN" ? "Admin Dashboard" : "My Bookings"}
        </h1>

        {role === "OWNER" && <OwnerPanel />}
        {role === "ADMIN" && <AdminPanel />}
        {role === "CLIENT" && <ClientBookings />}
      </div>
    </div>
  );
}
