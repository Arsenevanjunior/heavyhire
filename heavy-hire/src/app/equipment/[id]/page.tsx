"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface EquipmentDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  location: string;
  city: string;
  country: string;
  images: string[];
  rating: number;
  reviewCount: number;
  minHireDays: number;
  specs: Record<string, any>;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export default function EquipmentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [equipment, setEquipment] = useState<EquipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchEquipment = async () => {
      try {
        const res = await fetch(`/api/equipment/${id}`);
        const data = await res.json();
        setEquipment(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Equipment not found</p>
          <Link href="/equipment" className="text-primary-600 font-semibold">
            Back to Equipment
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = equipment.pricePerDay * selectedDays;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/equipment" className="text-primary-600 font-semibold">
            ← Back to Equipment
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images & Info */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative h-96 bg-gray-200 rounded-2xl overflow-hidden mb-6">
              {equipment.images?.[0] ? (
                <img
                  src={equipment.images[0]}
                  alt={equipment.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🏗️
                </div>
              )}
            </div>

            {/* Title & Info */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {equipment.title}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Rating</div>
                <div className="text-2xl font-bold">
                  ⭐ {equipment.rating}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Reviews</div>
                <div className="text-2xl font-bold">{equipment.reviewCount}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Location</div>
                <div className="text-lg font-semibold">{equipment.city}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Min Hire</div>
                <div className="text-lg font-semibold">
                  {equipment.minHireDays} day{equipment.minHireDays > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Equipment
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {equipment.description}
              </p>
            </div>

            {/* Specifications */}
            {equipment.specs && Object.keys(equipment.specs).length > 0 && (
              <div className="bg-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Specifications
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(equipment.specs).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-semibold text-gray-900">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </dt>
                      <dd className="text-gray-600">{String(value)}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Price Per Day</div>
                <div className="text-4xl font-bold text-primary-600">
                  {equipment.pricePerDay.toLocaleString()}
                  <span className="text-lg"> RWF</span>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  min={equipment.minHireDays}
                  value={selectedDays}
                  onChange={(e) => setSelectedDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">
                    {equipment.pricePerDay.toLocaleString()} × {selectedDays} days
                  </span>
                  <span className="font-semibold">
                    {totalPrice.toLocaleString()} RWF
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/auth/login"
                className="block w-full py-3 bg-primary-600 text-white rounded-lg font-semibold text-center hover:bg-primary-700 transition mb-3"
              >
                Book Now
              </Link>
              <button className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                Contact Owner
              </button>

              {/* Owner Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Owner</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    {equipment.owner.avatar ? (
                      <img
                        src={equipment.owner.avatar}
                        alt={equipment.owner.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">👤</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {equipment.owner.name}
                    </p>
                    <p className="text-sm text-gray-600">Equipment Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
