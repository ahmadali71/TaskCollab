import { useState } from 'react'
import { TrendingUp, Users, CheckCircle2, Clock, Target, Zap } from 'lucide-react'

interface MetricCard {
  label: string
  value: string | number
  change: number
  icon: any
  color: string
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d')

  const metrics: MetricCard[] = [
    { label: 'Total Tasks', value: 156, change: 12.5, icon: Target, color: 'blue' },
    { label: 'Completed', value: 89, change: 8.3, icon: CheckCircle2, color: 'green' },
    { label: 'In Progress', value: 42, change: -3.2, icon: TrendingUp, color: 'purple' },
    { label: 'Team Members', value: 8, change: 0, icon: Users, color: 'orange' },
    { label: 'Avg. Completion', value: '2.4 days', change: -15.0, icon: Clock, color: 'indigo' },
    { label: 'Productivity', value: '87%', change: 5.1, icon: Zap, color: 'pink' },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
      green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'text-indigo-500' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', icon: 'text-pink-500' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-500 mt-1">Track your team's performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const colors = getColorClasses(metric.color)
          return (
            <div key={metric.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <metric.icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <span className={`text-sm font-medium ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-500">{metric.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Task Completion Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart placeholder - Integrate Chart.js here
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Team Workload</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart placeholder - Integrate Chart.js here
          </div>
        </div>
      </div>
    </div>
  )
}