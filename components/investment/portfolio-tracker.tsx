'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, TrendingUp, TrendingDown, Plus, Eye, Target, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  purchasePrice: number;
  quantity: number;
  purchaseDate: string;
  sector: string;
  change24h: number;
  changePercent: number;
}

interface Portfolio {
  id: string;
  name: string;
  stocks: Stock[];
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  gainLossPercent: number;
}

interface InvestmentGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  priority: 'high' | 'medium' | 'low';
}

const MOCK_STOCKS: Stock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 185.50,
    purchasePrice: 175.00,
    quantity: 10,
    purchaseDate: '2024-01-15',
    sector: 'Technology',
    change24h: 2.50,
    changePercent: 1.37
  },
  {
    id: '2',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 142.30,
    purchasePrice: 138.00,
    quantity: 5,
    purchaseDate: '2024-02-10',
    sector: 'Technology',
    change24h: -1.20,
    changePercent: -0.84
  },
  {
    id: '3',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    currentPrice: 248.75,
    purchasePrice: 220.00,
    quantity: 8,
    purchaseDate: '2024-03-05',
    sector: 'Automotive',
    change24h: 12.45,
    changePercent: 5.27
  },
  {
    id: '4',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 420.15,
    purchasePrice: 405.00,
    quantity: 3,
    purchaseDate: '2024-01-20',
    sector: 'Technology',
    change24h: 3.85,
    changePercent: 0.93
  },
  {
    id: '5',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currentPrice: 875.30,
    purchasePrice: 720.00,
    quantity: 2,
    purchaseDate: '2024-02-28',
    sector: 'Technology',
    change24h: 25.60,
    changePercent: 3.01
  }
];

const MOCK_GOALS: InvestmentGoal[] = [
  {
    id: '1',
    name: 'Retirement Fund',
    targetAmount: 500000,
    currentAmount: 125000,
    targetDate: '2050-12-31',
    monthlyContribution: 1200,
    priority: 'high'
  },
  {
    id: '2',
    name: 'Emergency Fund',
    targetAmount: 50000,
    currentAmount: 32000,
    targetDate: '2025-12-31',
    monthlyContribution: 800,
    priority: 'high'
  },
  {
    id: '3',
    name: 'Vacation Fund',
    targetAmount: 15000,
    currentAmount: 8500,
    targetDate: '2025-06-30',
    monthlyContribution: 500,
    priority: 'medium'
  }
];

export default function PortfolioTracker() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [goals, setGoals] = useState<InvestmentGoal[]>(MOCK_GOALS);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newStock, setNewStock] = useState({
    symbol: '',
    quantity: '',
    purchasePrice: ''
  });
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    monthlyContribution: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  useEffect(() => {
    // Initialize portfolio with mock data
    const totalValue = MOCK_STOCKS.reduce((sum, stock) => sum + (stock.currentPrice * stock.quantity), 0);
    const totalInvested = MOCK_STOCKS.reduce((sum, stock) => sum + (stock.purchasePrice * stock.quantity), 0);
    const totalGainLoss = totalValue - totalInvested;
    const gainLossPercent = (totalGainLoss / totalInvested) * 100;

    setPortfolio({
      id: '1',
      name: 'My Portfolio',
      stocks: MOCK_STOCKS,
      totalValue,
      totalInvested,
      totalGainLoss,
      gainLossPercent
    });
  }, []);

  const handleAddStock = () => {
    if (!newStock.symbol || !newStock.quantity || !newStock.purchasePrice) {
      return;
    }

    const stock: Stock = {
      id: Date.now().toString(),
      symbol: newStock.symbol.toUpperCase(),
      name: `${newStock.symbol.toUpperCase()} Corporation`,
      currentPrice: parseFloat(newStock.purchasePrice) * (1 + (Math.random() - 0.5) * 0.2),
      purchasePrice: parseFloat(newStock.purchasePrice),
      quantity: parseInt(newStock.quantity),
      purchaseDate: new Date().toISOString().split('T')[0],
      sector: 'Technology',
      change24h: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 10
    };

    if (portfolio) {
      const updatedStocks = [...portfolio.stocks, stock];
      const totalValue = updatedStocks.reduce((sum, s) => sum + (s.currentPrice * s.quantity), 0);
      const totalInvested = updatedStocks.reduce((sum, s) => sum + (s.purchasePrice * s.quantity), 0);
      const totalGainLoss = totalValue - totalInvested;
      const gainLossPercent = (totalGainLoss / totalInvested) * 100;

      setPortfolio({
        ...portfolio,
        stocks: updatedStocks,
        totalValue,
        totalInvested,
        totalGainLoss,
        gainLossPercent
      });
    }

    setNewStock({ symbol: '', quantity: '', purchasePrice: '' });
    setIsAddingStock(false);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate || !newGoal.monthlyContribution) {
      return;
    }

    const goal: InvestmentGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      targetDate: newGoal.targetDate,
      monthlyContribution: parseFloat(newGoal.monthlyContribution),
      priority: newGoal.priority
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', targetAmount: '', targetDate: '', monthlyContribution: '', priority: 'medium' });
    setIsAddingGoal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (!portfolio) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              {portfolio.gainLossPercent >= 0 ? '+' : ''}{formatPercent(portfolio.gainLossPercent)} from invested
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolio.totalInvested)}</div>
            <p className="text-xs text-muted-foreground">
              Initial investment amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gain/Loss</CardTitle>
            {portfolio.totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(portfolio.totalGainLoss)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercent(portfolio.gainLossPercent)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolio.stocks.length}</div>
            <p className="text-xs text-muted-foreground">
              Active positions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="holdings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="goals">Investment Goals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Stock Holdings</h3>
            <Dialog open={isAddingStock} onOpenChange={setIsAddingStock}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Stock</DialogTitle>
                  <DialogDescription>
                    Add a new stock to your portfolio
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="symbol">Stock Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="e.g., AAPL"
                      value={newStock.symbol}
                      onChange={(e) => setNewStock({...newStock, symbol: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="e.g., 10"
                      value={newStock.quantity}
                      onChange={(e) => setNewStock({...newStock, quantity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Purchase Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 150.00"
                      value={newStock.purchasePrice}
                      onChange={(e) => setNewStock({...newStock, purchasePrice: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddStock} className="w-full">
                    Add Stock
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {portfolio.stocks.map((stock) => {
              const currentValue = stock.currentPrice * stock.quantity;
              const investedValue = stock.purchasePrice * stock.quantity;
              const gainLoss = currentValue - investedValue;
              const gainLossPercent = (gainLoss / investedValue) * 100;

              return (
                <Card key={stock.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedStock(stock)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{stock.symbol}</h4>
                          <Badge variant="secondary">{stock.sector}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                        <p className="text-sm">
                          {stock.quantity} shares @ {formatCurrency(stock.currentPrice)}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold">
                          {formatCurrency(currentValue)}
                        </div>
                        <div className={`text-sm ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(gainLoss)} ({formatPercent(gainLossPercent)})
                        </div>
                        <div className={`text-xs flex items-center ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.changePercent >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {formatPercent(stock.changePercent)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Investment Goals</h3>
            <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Investment Goal</DialogTitle>
                  <DialogDescription>
                    Set a new financial goal to track your progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goalName">Goal Name</Label>
                    <Input
                      id="goalName"
                      placeholder="e.g., Retirement Fund"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      placeholder="e.g., 100000"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      placeholder="e.g., 500"
                      value={newGoal.monthlyContribution}
                      onChange={(e) => setNewGoal({...newGoal, monthlyContribution: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newGoal.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewGoal({...newGoal, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddGoal} className="w-full">
                    Add Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const monthsRemaining = Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)));
              const projectedAmount = goal.currentAmount + (goal.monthlyContribution * monthsRemaining);
              const onTrack = projectedAmount >= goal.targetAmount;

              return (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <CardDescription>
                          Target: {formatCurrency(goal.targetAmount)} by {new Date(goal.targetDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progress.toFixed(1)}% complete</span>
                        <span>{monthsRemaining} months remaining</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Monthly: </span>
                        <span className="font-medium">{formatCurrency(goal.monthlyContribution)}</span>
                      </div>
                      <div className={`text-sm ${onTrack ? 'text-green-600' : 'text-red-600'}`}>
                        {onTrack ? '✓ On Track' : '⚠ Behind Schedule'}
                      </div>
                    </div>

                    {!onTrack && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Consider increasing monthly contributions to {formatCurrency(Math.ceil((goal.targetAmount - goal.currentAmount) / monthsRemaining))} to stay on track.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
                <CardDescription>Portfolio distribution by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    portfolio.stocks.reduce((acc, stock) => {
                      const value = stock.currentPrice * stock.quantity;
                      acc[stock.sector] = (acc[stock.sector] || 0) + value;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([sector, value]) => {
                    const percentage = (value / portfolio.totalValue) * 100;
                    return (
                      <div key={sector} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{sector}</span>
                          <span>{formatCurrency(value)} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Key portfolio metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Best Performer</span>
                  <div className="text-right">
                    {(() => {
                      const best = portfolio.stocks.reduce((prev, current) => {
                        const prevGain = ((prev.currentPrice - prev.purchasePrice) / prev.purchasePrice) * 100;
                        const currentGain = ((current.currentPrice - current.purchasePrice) / current.purchasePrice) * 100;
                        return currentGain > prevGain ? current : prev;
                      });
                      const gain = ((best.currentPrice - best.purchasePrice) / best.purchasePrice) * 100;
                      return (
                        <div>
                          <div className="font-medium">{best.symbol}</div>
                          <div className="text-sm text-green-600">{formatPercent(gain)}</div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Worst Performer</span>
                  <div className="text-right">
                    {(() => {
                      const worst = portfolio.stocks.reduce((prev, current) => {
                        const prevGain = ((prev.currentPrice - prev.purchasePrice) / prev.purchasePrice) * 100;
                        const currentGain = ((current.currentPrice - current.purchasePrice) / current.purchasePrice) * 100;
                        return currentGain < prevGain ? current : prev;
                      });
                      const gain = ((worst.currentPrice - worst.purchasePrice) / worst.purchasePrice) * 100;
                      return (
                        <div>
                          <div className="font-medium">{worst.symbol}</div>
                          <div className={`text-sm ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercent(gain)}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Gain/Loss</span>
                  <div className={`font-medium ${portfolio.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(portfolio.gainLossPercent)}
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Positions</span>
                  <div className="font-medium">{portfolio.stocks.length}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Stock Detail Modal */}
      {selectedStock && (
        <Dialog open={!!selectedStock} onOpenChange={() => setSelectedStock(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedStock.symbol} - {selectedStock.name}</DialogTitle>
              <DialogDescription>Stock details and performance</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Current Price</Label>
                  <div className="text-lg font-semibold">{formatCurrency(selectedStock.currentPrice)}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Purchase Price</Label>
                  <div className="text-lg font-semibold">{formatCurrency(selectedStock.purchasePrice)}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Quantity</Label>
                  <div className="text-lg font-semibold">{selectedStock.quantity} shares</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Total Value</Label>
                  <div className="text-lg font-semibold">
                    {formatCurrency(selectedStock.currentPrice * selectedStock.quantity)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Performance</Label>
                <div className="flex justify-between items-center">
                  <span>Gain/Loss</span>
                  <span className={`font-semibold ${((selectedStock.currentPrice - selectedStock.purchasePrice) * selectedStock.quantity) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency((selectedStock.currentPrice - selectedStock.purchasePrice) * selectedStock.quantity)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>24h Change</span>
                  <span className={`font-semibold ${selectedStock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(selectedStock.changePercent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Purchase Date</span>
                  <span>{new Date(selectedStock.purchaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sector</span>
                  <Badge variant="secondary">{selectedStock.sector}</Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
