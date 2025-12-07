"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BorderBeam } from "@/components/ui/border-beam"
import { Sparkline } from "@/components/ui/sparkline"
import { StockChart } from "@/components/ui/stock-chart"
import { TrendingUp, TrendingDown, Plus, X, LogOut, Activity } from "lucide-react"

// Supported stocks
const SUPPORTED_STOCKS = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'] as const
type StockTicker = typeof SUPPORTED_STOCKS[number]

interface PricePoint {
    time: number
    price: number
}

interface StockPrice {
    ticker: StockTicker
    price: number
    previousPrice: number
    change: number
    changePercent: number
    high24h: number
    low24h: number
    history: PricePoint[]
}

export function StockBrokerDashboard() {
    const [userEmail, setUserEmail] = React.useState<string>("")
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false)
    const [emailInput, setEmailInput] = React.useState<string>("")
    const [subscribedStocks, setSubscribedStocks] = React.useState<StockTicker[]>([])
    const [stockPrices, setStockPrices] = React.useState<Map<StockTicker, StockPrice>>(new Map())
    const [newStockInput, setNewStockInput] = React.useState<string>("")

    // Load user session from localStorage on mount
    React.useEffect(() => {
        const savedEmail = localStorage.getItem('userEmail')
        const savedStocks = localStorage.getItem('subscribedStocks')

        if (savedEmail) {
            setUserEmail(savedEmail)
            setIsLoggedIn(true)
        }

        if (savedStocks) {
            setSubscribedStocks(JSON.parse(savedStocks))
        }
    }, [])

    // Initialize stock prices for subscribed stocks
    React.useEffect(() => {
        const newPrices = new Map<StockTicker, StockPrice>()

        subscribedStocks.forEach(ticker => {
            if (!stockPrices.has(ticker)) {
                const initialPrice = getRandomPrice(ticker)
                newPrices.set(ticker, {
                    ticker,
                    price: initialPrice,
                    previousPrice: initialPrice,
                    change: 0,
                    changePercent: 0,
                    high24h: initialPrice,
                    low24h: initialPrice,
                    history: [{ time: Date.now(), price: initialPrice }]
                })
            } else {
                newPrices.set(ticker, stockPrices.get(ticker)!)
            }
        })

        setStockPrices(newPrices)
    }, [subscribedStocks])

    // Real-time price updates every second
    React.useEffect(() => {
        if (subscribedStocks.length === 0) return

        const interval = setInterval(() => {
            setStockPrices(prevPrices => {
                const newPrices = new Map(prevPrices)

                subscribedStocks.forEach(ticker => {
                    const currentStock = newPrices.get(ticker)
                    if (currentStock) {
                        const newPrice = updatePrice(currentStock.price)
                        const change = newPrice - currentStock.price
                        const changePercent = (change / currentStock.price) * 100

                        // Update history (keep last 100 points)
                        const newHistory = [...currentStock.history, { time: Date.now(), price: newPrice }]
                        if (newHistory.length > 100) newHistory.shift()

                        // Update 24h high/low
                        const high24h = Math.max(currentStock.high24h, newPrice)
                        const low24h = Math.min(currentStock.low24h, newPrice)

                        newPrices.set(ticker, {
                            ticker,
                            price: newPrice,
                            previousPrice: currentStock.price,
                            change,
                            changePercent,
                            high24h,
                            low24h,
                            history: newHistory
                        })
                    }
                })

                return newPrices
            })
        }, 1000) // Update every second

        return () => clearInterval(interval)
    }, [subscribedStocks])

    // Generate initial random price based on stock ticker
    const getRandomPrice = (ticker: StockTicker): number => {
        const basePrices: Record<StockTicker, number> = {
            'GOOG': 140,
            'TSLA': 250,
            'AMZN': 175,
            'META': 485,
            'NVDA': 875
        }
        const base = basePrices[ticker]
        return base + (Math.random() * 20 - 10) // ±10 variation
    }

    // Update price with small random fluctuation
    const updatePrice = (currentPrice: number): number => {
        const change = (Math.random() - 0.5) * 5 // Random change between -2.5 and +2.5
        return Math.max(0.01, currentPrice + change)
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (emailInput.trim() && emailInput.includes('@')) {
            setUserEmail(emailInput)
            setIsLoggedIn(true)
            localStorage.setItem('userEmail', emailInput)
            setEmailInput("")
        }
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setUserEmail("")
        setSubscribedStocks([])
        setStockPrices(new Map())
        localStorage.removeItem('userEmail')
        localStorage.removeItem('subscribedStocks')
    }

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        const ticker = newStockInput.toUpperCase() as StockTicker

        if (SUPPORTED_STOCKS.includes(ticker) && !subscribedStocks.includes(ticker)) {
            const updated = [...subscribedStocks, ticker]
            setSubscribedStocks(updated)
            localStorage.setItem('subscribedStocks', JSON.stringify(updated))
            setNewStockInput("")
        }
    }

    const handleUnsubscribe = (ticker: StockTicker) => {
        const updated = subscribedStocks.filter(s => s !== ticker)
        setSubscribedStocks(updated)
        localStorage.setItem('subscribedStocks', JSON.stringify(updated))

        setStockPrices(prev => {
            const newPrices = new Map(prev)
            newPrices.delete(ticker)
            return newPrices
        })
    }

    // Calculate portfolio summary
    const portfolioValue = Array.from(stockPrices.values()).reduce((sum, stock) => sum + stock.price, 0)
    const portfolioChange = Array.from(stockPrices.values()).reduce((sum, stock) => sum + stock.change, 0)
    const portfolioChangePercent = portfolioValue > 0 ? (portfolioChange / portfolioValue) * 100 : 0

    // Login Screen
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
                <Card className="w-full max-w-md relative overflow-hidden">
                    <BorderBeam size={250} duration={12} delay={9} />
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold text-center">Stock Broker Dashboard</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email to access your portfolio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="trader@example.com"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" size="lg">
                                Access Dashboard
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            <p>Supported Stocks: {SUPPORTED_STOCKS.join(', ')}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Dashboard Screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold">Stock Broker Dashboard</h1>
                            <p className="text-sm text-muted-foreground">{userEmail}</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <Tabs defaultValue="portfolio" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
                        <TabsTrigger value="subscribe">Add Stocks</TabsTrigger>
                    </TabsList>

                    {/* Portfolio Tab */}
                    <TabsContent value="portfolio" className="space-y-6">
                        {/* Portfolio Summary */}
                        {subscribedStocks.length > 0 && (
                            <Card className="relative overflow-hidden">
                                <BorderBeam size={200} duration={15} colorFrom="#3b82f6" colorTo="#8b5cf6" />
                                <CardHeader>
                                    <CardTitle className="text-lg">Portfolio Overview</CardTitle>
                                    <CardDescription>Total value of all subscribed stocks</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-4xl font-bold">${portfolioValue.toFixed(2)}</div>
                                            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${portfolioChange >= 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {portfolioChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                <span>
                                                    {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)} ({portfolioChangePercent.toFixed(2)}%)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {subscribedStocks.length} {subscribedStocks.length === 1 ? 'stock' : 'stocks'} tracked
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Stock Cards */}
                        {subscribedStocks.length === 0 ? (
                            <Card className="relative overflow-hidden">
                                <BorderBeam size={200} duration={15} />
                                <CardHeader>
                                    <CardTitle>No Stocks Subscribed</CardTitle>
                                    <CardDescription>
                                        Subscribe to stocks from the "Add Stocks" tab to start tracking prices
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {subscribedStocks.map(ticker => {
                                    const stock = stockPrices.get(ticker)
                                    if (!stock) return null

                                    const isPositive = stock.change >= 0
                                    const sparklineData = stock.history.slice(-20).map(p => p.price)

                                    return (
                                        <Card key={ticker} className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                                            <BorderBeam
                                                size={150}
                                                duration={10}
                                                colorFrom={isPositive ? "#22c55e" : "#ef4444"}
                                                colorTo={isPositive ? "#16a34a" : "#dc2626"}
                                            />
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <CardDescription className="text-xs mb-1">{ticker}</CardDescription>
                                                        <CardTitle className="text-3xl font-bold">${stock.price.toFixed(2)}</CardTitle>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleUnsubscribe(ticker)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {/* Price Change */}
                                                <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                    <span>
                                                        {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                                                    </span>
                                                </div>

                                                {/* Sparkline */}
                                                <div style={{ width: '100%', height: '64px' }}>
                                                    <Sparkline
                                                        data={sparklineData}
                                                        color={isPositive ? "#22c55e" : "#ef4444"}
                                                    />
                                                </div>

                                                {/* 24h High/Low */}
                                                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                                                    <div>
                                                        <div className="font-medium">24h High</div>
                                                        <div className="text-foreground">${stock.high24h.toFixed(2)}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">24h Low</div>
                                                        <div className="text-foreground">${stock.low24h.toFixed(2)}</div>
                                                    </div>
                                                </div>

                                                {/* Price History Chart */}
                                                <div className="pt-4 border-t">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-sm font-semibold">Price History</h4>
                                                        <span className="text-xs text-muted-foreground">Last {stock.history.length} updates</span>
                                                    </div>
                                                    <StockChart
                                                        data={stock.history}
                                                        ticker={ticker}
                                                        color={isPositive ? "#22c55e" : "#3b82f6"}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Subscribe Tab */}
                    <TabsContent value="subscribe" className="space-y-4">
                        <Card className="relative overflow-hidden">
                            <BorderBeam size={200} duration={15} />
                            <CardHeader>
                                <CardTitle>Subscribe to Stocks</CardTitle>
                                <CardDescription>
                                    Enter a stock ticker from the supported list: {SUPPORTED_STOCKS.join(', ')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubscribe} className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Enter ticker (e.g., GOOG)"
                                            value={newStockInput}
                                            onChange={(e) => setNewStockInput(e.target.value.toUpperCase())}
                                            maxLength={5}
                                        />
                                    </div>
                                    <Button type="submit">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Subscribe
                                    </Button>
                                </form>

                                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                    {SUPPORTED_STOCKS.map(ticker => {
                                        const isSubscribed = subscribedStocks.includes(ticker)
                                        return (
                                            <Button
                                                key={ticker}
                                                variant={isSubscribed ? "secondary" : "outline"}
                                                className="w-full"
                                                onClick={() => {
                                                    if (!isSubscribed) {
                                                        const updated = [...subscribedStocks, ticker]
                                                        setSubscribedStocks(updated)
                                                        localStorage.setItem('subscribedStocks', JSON.stringify(updated))
                                                    }
                                                }}
                                                disabled={isSubscribed}
                                            >
                                                {ticker}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
