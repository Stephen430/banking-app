"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggleSimple } from "@/components/theme-toggle"
import { 
  Banknote, Shield, Users, TrendingUp, ArrowRight, 
  Smartphone, CreditCard, Globe, Lock, Zap, Award,
  Star, CheckCircle, BarChart3, Wallet, PiggyBank,
  Target, Clock, DollarSign, ChevronDown
} from "lucide-react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "SecureBank has transformed how I manage my business finances. The analytics are incredible!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      content: "Best banking app I've ever used. The security features give me complete peace of mind.",
      rating: 5
    },
    {
      name: "Emma Williams",
      role: "Marketing Manager",
      content: "The 24/7 support and intuitive interface make banking so much easier. Highly recommend!",
      rating: 5
    }
  ]

  const stats = [
    { label: "Active Users", value: "2.5M+", icon: Users },
    { label: "Transactions Daily", value: "50K+", icon: ArrowRight },
    { label: "Countries", value: "25+", icon: Globe },
    { label: "Uptime", value: "99.9%", icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Banknote className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                SecureBank
              </span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                Trusted by 2.5M+
              </Badge>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex items-center space-x-6">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">Security</a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </nav>
              <div className="flex items-center space-x-3">
                <ThemeToggleSimple />
                <Link href="/login">
                  <Button variant="ghost" className="border-border hover:bg-accent">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggleSimple />
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-4">
              <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 mb-4">
                🎉 New: AI-Powered Financial Insights
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Banking for the
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Digital Age
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Experience next-generation banking with AI-powered insights, military-grade security, and seamless user experience designed for modern life.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg">
                  Start Banking Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-border hover:bg-accent px-8 py-4 text-lg">
                  Access Your Account
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative bg-card/50 backdrop-blur-lg border border-border rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground font-semibold">Dashboard Preview</h3>
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">Live</Badge>
                </div>
                
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Total Balance</span>
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">$24,758.90</div>
                  <div className="text-green-600 dark:text-green-400 text-sm">+12.5% this month</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card/50 rounded-xl p-4 border border-border">
                    <PiggyBank className="h-8 w-8 text-purple-500 mb-2" />
                    <div className="text-foreground font-semibold">Savings</div>
                    <div className="text-muted-foreground">$12,450</div>
                  </div>
                  <div className="bg-card/50 rounded-xl p-4 border border-border">
                    <CreditCard className="h-8 w-8 text-blue-500 mb-2" />
                    <div className="text-foreground font-semibold">Checking</div>
                    <div className="text-muted-foreground">$8,308.90</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-gradient-to-r from-muted/30 to-accent/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive suite of features is designed to make your financial life simpler, safer, and smarter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Military-Grade Security",
                description: "256-bit encryption, biometric authentication, and real-time fraud detection protect your assets 24/7.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Instant Transfers",
                description: "Send money anywhere in the world instantly with our lightning-fast transfer system.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: BarChart3,
                title: "AI Financial Insights",
                description: "Get personalized recommendations and spending insights powered by advanced AI algorithms.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Smartphone,
                title: "Mobile First",
                description: "Full banking functionality optimized for mobile with offline capabilities and sync.",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: Target,
                title: "Smart Goals",
                description: "Set and track financial goals with automated savings plans and progress monitoring.",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                icon: Award,
                title: "Premium Rewards",
                description: "Earn cashback, travel points, and exclusive benefits with every transaction you make.",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-card/50 border-border backdrop-blur-lg hover:bg-card/70 transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-foreground text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Trusted by Millions
            </h2>
            <p className="text-xl text-muted-foreground">See what our customers are saying about SecureBank</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/50 border-border backdrop-blur-lg">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl text-foreground mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="text-foreground">
                  <div className="font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  title={`View testimonial ${index + 1}`}
                  aria-label={`View testimonial ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of users who trust SecureBank for their financial needs. Open your account in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg">
                Open Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border hover:bg-accent px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-card/30 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Banknote className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">SecureBank</span>
              </div>
              <p className="text-muted-foreground mb-4">
                The most trusted digital banking platform for modern financial needs.
              </p>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-foreground text-sm">FDIC Insured</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-foreground font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Checking Accounts</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Savings Accounts</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Credit Cards</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Loans</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-foreground font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-foreground font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 SecureBank. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-muted-foreground text-sm">Available on:</span>
              <Badge variant="secondary" className="bg-muted text-foreground border-border">iOS</Badge>
              <Badge variant="secondary" className="bg-muted text-foreground border-border">Android</Badge>
              <Badge variant="secondary" className="bg-muted text-foreground border-border">Web</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
