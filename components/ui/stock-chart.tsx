"use client"

import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface PricePoint {
    time: number
    price: number
}

type TimeRange = 'day' | 'month' | 'year'

interface StockChartProps {
    data: PricePoint[]
    ticker: string
    color?: string
}

export function StockChart({ data, ticker, color = "#3b82f6" }: StockChartProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('day')

    const formatTime = (timestamp: number, range: TimeRange) => {
        const date = new Date(timestamp)
        if (range === 'year') {
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        } else if (range === 'month') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`
    }

    // Filter data based on time range
    const getFilteredData = () => {
        const now = Date.now()
        let cutoffTime = now

        switch (timeRange) {
            case 'day':
                cutoffTime = now - (24 * 60 * 60 * 1000) // Last 24 hours
                break
            case 'month':
                cutoffTime = now - (30 * 24 * 60 * 60 * 1000) // Last 30 days
                break
            case 'year':
                cutoffTime = now - (365 * 24 * 60 * 60 * 1000) // Last 365 days
                break
        }

        return data.filter(point => point.time >= cutoffTime)
    }

    const filteredData = getFilteredData()

    return (
        <div className="w-full">
            {/* Time Range Filter Buttons */}
            <div className="flex justify-end gap-1 mb-3">
                {(['day', 'month', 'year'] as TimeRange[]).map(range => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${timeRange === range
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                    >
                        {range === 'day' ? 'Day' : range === 'month' ? 'Month' : 'Year'}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id={`gradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                        <XAxis
                            dataKey="time"
                            tickFormatter={(time) => formatTime(time, timeRange)}
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            tickFormatter={formatPrice}
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            formatter={(value: number) => formatPrice(value)}
                            labelFormatter={(time) => formatTime(time, timeRange)}
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '8px 12px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={color}
                            strokeWidth={2}
                            fill={`url(#gradient-${ticker})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Data Info */}
            <div className="text-xs text-muted-foreground text-right mt-2">
                Showing {filteredData.length} data points
            </div>
        </div>
    )
}
