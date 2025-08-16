"use client"

import { TrendingDown, TrendingUp } from "lucide-react"

interface CompetitorPrice {
  company: string
  price: number
}
interface PriceComparisonProps {
  competitorPrices: CompetitorPrice[]
}

export function PriceComparison({ competitorPrices }: PriceComparisonProps) {
  const ourPrice = competitorPrices.find((p) => p.company === "Summit Quest")?.price || 0
  const others = competitorPrices.filter((p) => p.company !== "Summit Quest")
  const avgCompetitorPrice = others.length ? others.reduce((s, p) => s + p.price, 0) / others.length : 0
  const savings = Math.max(avgCompetitorPrice - ourPrice, 0)
  const savingsPercentage = avgCompetitorPrice ? ((savings / avgCompetitorPrice) * 100).toFixed(1) : "0.0"

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Comparison</h2>

      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-green-800">
              You save ${savings.toLocaleString()} ({savingsPercentage}%)
            </div>
            <div className="text-sm text-green-600">Compared to average competitor pricing</div>
          </div>
          <TrendingDown className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="space-y-3">
        {competitorPrices.map((competitor, index) => {
          const isOurs = competitor.company === "Summit Quest"
          const difference = competitor.price - ourPrice
          const percentDiff = ourPrice > 0 ? ((difference / ourPrice) * 100).toFixed(1) : "0"
          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${isOurs ? "bg-teal-50 border border-teal-200" : "bg-gray-50"}`}
            >
              <div className="flex items-center">
                <span className={`font-medium ${isOurs ? "text-teal-900" : "text-gray-900"}`}>
                  {competitor.company}
                </span>
                {isOurs && (
                  <span className="ml-2 px-2 py-1 bg-teal-600 text-white text-xs rounded-full">Our Price</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${isOurs ? "text-teal-900" : "text-gray-900"}`}>
                  ${competitor.price.toLocaleString()}
                </span>
                {!isOurs && difference !== 0 && (
                  <div className="flex items-center text-sm">
                    {difference > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className={difference > 0 ? "text-red-600" : "text-green-600"}>
                      {difference > 0 ? "+" : ""}
                      {percentDiff}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        * Prices are approximate and may vary based on season and availability
      </div>
    </div>
  )
}
