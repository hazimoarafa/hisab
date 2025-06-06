import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import {
	BarChart3,
	Bitcoin,
	Car,
	Home,
	MoreVertical,
	Plus,
	TrendingUp
} from "lucide-react"

interface Asset {
  id: number
  name: string
  type: 'stocks' | 'bonds' | 'real_estate' | 'vehicle' | 'crypto'
  value: number
  change?: number
  changePercent?: number
}

const mockAssets: Asset[] = [
  {
    id: 1,
    name: 'Primary Residence',
    type: 'real_estate',
    value: 450000,
    change: 15000,
    changePercent: 3.45
  },
  {
    id: 2,
    name: 'S&P 500 Index Fund',
    type: 'stocks',
    value: 85000,
    change: 2800,
    changePercent: 3.41
  },
  {
    id: 3,
    name: '2022 Tesla Model 3',
    type: 'vehicle',
    value: 42000,
    change: -3000,
    changePercent: -6.67
  },
  {
    id: 4,
    name: 'Bitcoin',
    type: 'crypto',
    value: 15000,
    change: 1200,
    changePercent: 8.70
  },
  {
    id: 5,
    name: 'Corporate Bonds',
    type: 'bonds',
    value: 25000,
    change: 150,
    changePercent: 0.60
  }
]

function getAssetIcon(type: Asset['type']) {
  switch (type) {
    case 'stocks':
      return <TrendingUp className="h-5 w-5" />
    case 'bonds':
      return <BarChart3 className="h-5 w-5" />
    case 'real_estate':
      return <Home className="h-5 w-5" />
    case 'vehicle':
      return <Car className="h-5 w-5" />
    case 'crypto':
      return <Bitcoin className="h-5 w-5" />
  }
}

function getAssetTypeLabel(type: Asset['type']) {
  switch (type) {
    case 'stocks':
      return 'Stocks'
    case 'bonds':
      return 'Bonds'
    case 'real_estate':
      return 'Real Estate'
    case 'vehicle':
      return 'Vehicle'
    case 'crypto':
      return 'Cryptocurrency'
  }
}

function getAssetTypeColor(type: Asset['type']) {
  switch (type) {
    case 'stocks':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'bonds':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'real_estate':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'vehicle':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'crypto':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
}

export default function AssetsPage() {
  const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0)
  const totalChange = mockAssets.reduce((sum, asset) => sum + (asset.change || 0), 0)
  const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100

  // Group assets by type for summary
  const assetsByType = mockAssets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = { value: 0, count: 0 }
    }
    acc[asset.type].value += asset.value
    acc[asset.type].count += 1
    return acc
  }, {} as Record<Asset['type'], { value: number; count: number }>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">
            Track your investments, real estate, and other valuable assets
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={totalChange >= 0 ? "text-green-500" : "text-red-500"}>
                {totalChange >= 0 ? "+" : ""}{formatCurrency(totalChange)} ({totalChangePercent.toFixed(2)}%)
              </span>
            </div>
          </CardContent>
        </Card>

        {Object.entries(assetsByType).map(([type, data]) => (
          <Card key={type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getAssetTypeLabel(type as Asset['type'])}</CardTitle>
              {getAssetIcon(type as Asset['type'])}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.value)}</div>
              <p className="text-xs text-muted-foreground">
                {data.count} {data.count === 1 ? 'asset' : 'assets'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assets List */}
      <div className="grid gap-4">
        {mockAssets.map((asset) => (
          <Card key={asset.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    {getAssetIcon(asset.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{asset.name}</h3>
                      <Badge 
                        variant="secondary" 
                        className={getAssetTypeColor(asset.type)}
                      >
                        {getAssetTypeLabel(asset.type)}
                      </Badge>
                    </div>
                    {asset.change !== undefined && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={asset.change >= 0 ? "text-green-600" : "text-red-600"}>
                          {asset.change >= 0 ? "+" : ""}{formatCurrency(asset.change)}
                        </span>
                        <span className={asset.changePercent! >= 0 ? "text-green-600" : "text-red-600"}>
                          ({asset.changePercent! >= 0 ? "+" : ""}{asset.changePercent?.toFixed(2)}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatCurrency(asset.value)}
                    </div>
                    <p className="text-xs text-muted-foreground">Current value</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 