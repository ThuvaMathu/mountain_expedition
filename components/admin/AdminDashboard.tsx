"use client"

import { useState, useEffect } from "react"
import { Users, Mountain, Calendar, DollarSign, TrendingUp, FileText } from "lucide-react"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeMountains: 0,
    totalUsers: 0,
    monthlyGrowth: 0,
    recentBookings: [],
  })

  useEffect(() => {
    // Mock data - in real app, fetch from Firebase
    setStats({
      totalBookings: 156,
      totalRevenue: 2450000,
      activeMountains: 42,
      totalUsers: 1234,
      monthlyGrowth: 12.5,
      recentBookings: [
        { id: "1", customer: "John Doe", mountain: "Mount Everest", amount: 65000, date: "2024-01-15" },
        { id: "2", customer: "Jane Smith", mountain: "Kilimanjaro", amount: 3500, date: "2024-01-14" },
        { id: "3", customer: "Mike Johnson", mountain: "Denali", amount: 8500, date: "2024-01-13" },
      ],
    })
  }, [])

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Total Revenue",
      value: `$${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "bg-green-500",
      change: "+18%",
    },
    {
      title: "Active Mountains",
      value: stats.activeMountains,
      icon: Mountain,
      color: "bg-purple-500",
      change: "+3%",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-orange-500",
      change: "+25%",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your expeditions.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {stats.recentBookings.map((booking: any) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.customer}</p>
                  <p className="text-sm text-gray-600">{booking.mountain}</p>
                  <p className="text-xs text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${booking.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Mountain className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-900">Add New Mountain</span>
              </div>
            </button>
            <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-green-900">Manage Bookings</span>
              </div>
            </button>
            <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium text-purple-900">Create Blog Post</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
