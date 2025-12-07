"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineProps {
    data: number[]
    color?: string
    className?: string
}

export function Sparkline({ data, color = "#22c55e", className = "" }: SparklineProps) {
    const [isReady, setIsReady] = useState(false)
    const chartData = data.map((value, index) => ({ value, index }))

    useEffect(() => {
        // Delay rendering to ensure parent dimensions are calculated
        const timer = setTimeout(() => setIsReady(true), 0)
        return () => clearTimeout(timer)
    }, [])

    if (!isReady) {
        return <div className={className} />
    }

    return (
        <ResponsiveContainer width="100%" height="100%" className={className}>
            <LineChart data={chartData}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
