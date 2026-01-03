import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const OwnerAnalytics = () => {
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data on mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/analytics/data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setAnalytics(response.data.analytics);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [getToken]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-12">Loading analytics...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  // Convert revenue by month to array for chart
  const revenueData = Object.entries(analytics.revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  // Convert room performance to array for chart
  const roomData = Object.entries(analytics.roomPerformance).map(
    ([roomType, bookings]) => ({
      roomType,
      bookings,
    })
  );

  // Status distribution data
  const statusData = [
    { name: "Confirmed", value: analytics.confirmedBookings },
    { name: "Cancelled", value: analytics.cancelledBookings },
  ];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Analytics Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-[#5b5dff]">
            {import.meta.env.VITE_CURRENCY}{analytics.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-2">Total Bookings</p>
          <p className="text-3xl font-bold text-blue-500">
            {analytics.totalBookings}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-2">Avg Booking Value</p>
          <p className="text-3xl font-bold text-green-500">
            {import.meta.env.VITE_CURRENCY}{analytics.averageBookingValue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-2">Cancellation Rate</p>
          <p className="text-3xl font-bold text-red-500">
            {analytics.cancellationRate}%
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue Trend</h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${import.meta.env.VITE_CURRENCY}${value.toFixed(2)}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#5b5dff"
                  dot={{ fill: "#5b5dff", r: 5 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No revenue data available</p>
          )}
        </div>

        {/* Booking Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Status</h2>
          {statusData[0].value > 0 || statusData[1].value > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No booking data available</p>
          )}
        </div>
      </div>

      {/* Room Performance */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Room Performance</h2>
        {roomData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="roomType" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="bookings"
                fill="#10b981"
                name="Total Bookings"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No room data available</p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-bold text-gray-800 mb-3">Confirmed Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">
            {analytics.confirmedBookings}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {analytics.totalBookings > 0
              ? ((analytics.confirmedBookings / analytics.totalBookings) * 100).toFixed(1)
              : 0}
            % of total bookings
          </p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="font-bold text-gray-800 mb-3">Cancelled Bookings</h3>
          <p className="text-3xl font-bold text-red-600">
            {analytics.cancelledBookings}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {analytics.cancellationRate}% cancellation rate
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerAnalytics;
