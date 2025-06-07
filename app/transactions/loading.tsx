import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Money Transfer</h1>
        </div>

        {/* Status Bar Skeleton */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
            <div className="h-2 bg-blue-500 w-1/3 rounded-full" />
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-blue-500 text-white">
                <span>1</span>
              </div>
              <span className="text-xs mt-1">Enter Details</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-600">
                <span>2</span>
              </div>
              <span className="text-xs mt-1">Confirm</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-600">
                <span>3</span>
              </div>
              <span className="text-xs mt-1">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Transaction Form Skeleton */}
          <div className="lg:col-span-7">
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b">
                <div className="flex items-center">
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-72 mt-1" />
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>

                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Information Skeleton */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-8 w-48" />
                  </div>
                  
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <Skeleton className="h-3 w-24 mb-2" />
                        <Skeleton className="h-5 w-28" />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Skeleton className="h-5 w-32 mb-4" />
                      
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <Skeleton className="h-8 w-8 rounded-full mr-3" />
                              <div>
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24 mt-1" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-16" />
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <Skeleton className="h-9 w-40 mx-auto" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-32" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start">
                      <Skeleton className="h-8 w-8 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
