'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Calculator, 
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Plus,
  FileText,
  Settings,
  Wallet,
  Target,
  Download,
  Save,
  X,
  Eye,
  Trash2,
  History,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
  FileDown,
  Edit,
  CreditCard as CreditCardIcon
} from 'lucide-react'

interface IncomeSource {
  id: string
  description: string
  value: number
}

interface ExpenseCategory {
  id: string
  category: string
  estimated: number
  spent: number
  color: string
}

interface FixedExpense {
  id: string
  description: string
  category: string
  value: number
  dueDate: string
  status: 'pago' | 'pendente' | 'atrasado'
  referenceMonth: string
}

interface CardExpense {
  id: string
  description: string
  category: string
  value: number
  dueDate: string
  installment?: string
}

interface CreditCard {
  id: string
  name: string
  bank: string
  color: string
  icon: string
  expenses: CardExpense[]
  isActive: boolean
  createdAt: string
}

interface MonthlyData {
  id: string
  month: string
  year: number
  income: number
  expenses: number
  remaining: number
  categories: ExpenseCategory[]
  fixedExpenses: FixedExpense[]
  cardExpenses: { [cardId: string]: CardExpense[] }
  incomeSources: IncomeSource[]
  closedAt: string
  notes?: string
}

interface AppSettings {
  currency: string
  monthStartDay: number
  alertThreshold: number
  categories: string[]
}

const PASTEL_COLORS = {
  contas: '#E0E7FF',
  cosmeticos: '#FCE7F3',
  educacao: '#E0F2FE',
  lazer: '#FEF3C7',
  mercado: '#D1FAE5',
  outros: '#F3F4F6',
  pets: '#FED7AA',
  streaming: '#E9D5FF',
  restaurante: '#FECACA',
  saude: '#DBEAFE',
  transporte: '#FEF3C7',
  veiculo: '#FBBF24',
  vestuario: '#C084FC',
  viagem: '#A7F3D0'
}

const CARD_COLORS = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Roxo', value: '#8B5CF6' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Laranja', value: '#F97316' },
  { name: 'Cinza', value: '#6B7280' },
  { name: 'Vermelho', value: '#EF4444' },
  { name: 'Amarelo', value: '#EAB308' }
]

const DEFAULT_CATEGORIES = [
  'Contas', 'Cosméticos', 'Educação', 'Lazer', 'Mercado', 'Outros', 
  'Pets', 'Streaming', 'Restaurante', 'Saúde', 'Transporte', 'Veículo', 
  'Vestuário', 'Viagem'
]

export default function ControleFinanceiro() {
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
  const [showCloseMonthDialog, setShowCloseMonthDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [showAddCardDialog, setShowAddCardDialog] = useState(false)
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState<MonthlyData | null>(null)
  const [historySearch, setHistorySearch] = useState('')
  const [historyFilter, setHistoryFilter] = useState('all')
  const [closeMonthNotes, setCloseMonthNotes] = useState('')
  
  const [creditCards, setCreditCards] = useState<CreditCard[]>([
    {
      id: '1',
      name: 'Nubank',
      bank: 'Nubank',
      color: '#8B5CF6',
      icon: '🟣',
      expenses: [
        { id: '1', description: 'Netflix', category: 'Streaming', value: 45.90, dueDate: '2024-12-15', installment: '1/12' },
        { id: '2', description: 'iFood', category: 'Restaurante', value: 89.50, dueDate: '2024-12-15' }
      ],
      isActive: true,
      createdAt: '2024-01-01T00:00:00'
    },
    {
      id: '2',
      name: 'Bradesco',
      bank: 'Bradesco',
      color: '#EC4899',
      icon: '🌸',
      expenses: [
        { id: '1', description: 'Academia', category: 'Saúde', value: 120.00, dueDate: '2024-12-20', installment: '1/12' }
      ],
      isActive: true,
      createdAt: '2024-01-01T00:00:00'
    }
  ])

  const [newCard, setNewCard] = useState({
    name: '',
    bank: '',
    color: '#3B82F6',
    icon: '💳'
  })

  const [closedMonths, setClosedMonths] = useState<MonthlyData[]>([
    // Dados exemplo para demonstração
    {
      id: '1',
      month: 'Outubro/2024',
      year: 2024,
      income: 7500,
      expenses: 6200,
      remaining: 1300,
      categories: [
        { id: '1', category: 'Contas', estimated: 1500, spent: 1450, color: PASTEL_COLORS.contas },
        { id: '2', category: 'Mercado', estimated: 800, spent: 750, color: PASTEL_COLORS.mercado },
        { id: '3', category: 'Lazer', estimated: 400, spent: 500, color: PASTEL_COLORS.lazer },
      ],
      fixedExpenses: [
        { id: '1', description: 'Aluguel', category: 'Contas', value: 1200, dueDate: '2024-10-05', status: 'pago', referenceMonth: 'Outubro/2024' }
      ],
      cardExpenses: {
        '1': [
          { id: '1', description: 'Netflix', category: 'Streaming', value: 45.90, dueDate: '2024-10-15', installment: '1/12' }
        ],
        '2': []
      },
      incomeSources: [
        { id: '1', description: 'Salário 1', value: 5000 },
        { id: '2', description: 'Salário 2', value: 2000 },
        { id: '3', description: 'Renda Extra', value: 500 }
      ],
      closedAt: '2024-11-01T00:00:00',
      notes: 'Mês estável, controle de gastos bom'
    },
    {
      id: '2',
      month: 'Novembro/2024',
      year: 2024,
      income: 8000,
      expenses: 7200,
      remaining: 800,
      categories: [
        { id: '1', category: 'Contas', estimated: 1500, spent: 1600, color: PASTEL_COLORS.contas },
        { id: '2', category: 'Mercado', estimated: 800, spent: 900, color: PASTEL_COLORS.mercado },
        { id: '3', category: 'Saúde', estimated: 200, spent: 300, color: PASTEL_COLORS.saude },
      ],
      fixedExpenses: [
        { id: '1', description: 'Aluguel', category: 'Contas', value: 1200, dueDate: '2024-11-05', status: 'pago', referenceMonth: 'Novembro/2024' }
      ],
      cardExpenses: {
        '1': [
          { id: '1', description: 'Netflix', category: 'Streaming', value: 45.90, dueDate: '2024-11-15', installment: '2/12' }
        ],
        '2': [
          { id: '1', description: 'Academia', category: 'Saúde', value: 120.00, dueDate: '2024-11-20', installment: '2/12' }
        ]
      },
      incomeSources: [
        { id: '1', description: 'Salário 1', value: 5500 },
        { id: '2', description: 'Salário 2', value: 2000 },
        { id: '3', description: 'Bônus', value: 500 }
      ],
      closedAt: '2024-12-01T00:00:00',
      notes: 'Gastos acima do esperado, atenção para dezembro'
    }
  ])

  const [settings, setSettings] = useState<AppSettings>({
    currency: 'BRL',
    monthStartDay: 1,
    alertThreshold: 80,
    categories: DEFAULT_CATEGORIES
  })
  
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: '',
    value: '',
    type: 'category' as 'category' | 'fixed' | 'card',
    cardId: ''
  })
  
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { id: '1', description: 'Salário 1', value: 5000 },
    { id: '2', description: 'Salário 2', value: 2000 },
    { id: '3', description: 'Renda Extra', value: 500 }
  ])

  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([
    { id: '1', category: 'Contas', estimated: 1500, spent: 1200, color: PASTEL_COLORS.contas },
    { id: '2', category: 'Cosméticos', estimated: 200, spent: 250, color: PASTEL_COLORS.cosmeticos },
    { id: '3', category: 'Educação', estimated: 300, spent: 300, color: PASTEL_COLORS.educacao },
    { id: '4', category: 'Lazer', estimated: 400, spent: 450, color: PASTEL_COLORS.lazer },
    { id: '5', category: 'Mercado', estimated: 800, spent: 750, color: PASTEL_COLORS.mercado },
    { id: '6', category: 'Outros', estimated: 200, spent: 100, color: PASTEL_COLORS.outros },
    { id: '7', category: 'Pets', estimated: 150, spent: 150, color: PASTEL_COLORS.pets },
    { id: '8', category: 'Streaming', estimated: 100, spent: 100, color: PASTEL_COLORS.streaming },
    { id: '9', category: 'Restaurante', estimated: 300, spent: 400, color: PASTEL_COLORS.restaurante },
    { id: '10', category: 'Saúde', estimated: 200, spent: 150, color: PASTEL_COLORS.saude },
    { id: '11', category: 'Transporte', estimated: 250, spent: 200, color: PASTEL_COLORS.transporte },
    { id: '12', category: 'Veículo', estimated: 300, spent: 350, color: PASTEL_COLORS.veiculo },
    { id: '13', category: 'Vestuário', estimated: 200, spent: 180, color: PASTEL_COLORS.vestuario },
    { id: '14', category: 'Viagem', estimated: 500, spent: 0, color: PASTEL_COLORS.viagem }
  ])

  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([
    { id: '1', description: 'Aluguel', category: 'Contas', value: 1200, dueDate: '2024-12-05', status: 'pago', referenceMonth: 'Dezembro/2024' },
    { id: '2', description: 'Condomínio', category: 'Contas', value: 300, dueDate: '2024-12-10', status: 'pago', referenceMonth: 'Dezembro/2024' }
  ])

  // Cálculos automáticos
  const totalIncome = incomeSources.reduce((sum, source) => sum + source.value, 0)
  const totalEstimated = expenseCategories.reduce((sum, cat) => sum + cat.estimated, 0)
  const totalSpent = expenseCategories.reduce((sum, cat) => sum + cat.spent, 0)
  const totalFixedExpenses = fixedExpenses.reduce((sum, exp) => sum + exp.value, 0)
  const totalCards = creditCards.reduce((sum, card) => sum + card.expenses.reduce((cardSum, exp) => cardSum + exp.value, 0), 0)
  const difference = totalEstimated - totalSpent
  const remaining = totalIncome - totalSpent
  const budgetPercentage = totalIncome > 0 ? (totalSpent / totalIncome) * 100 : 0

  // Categoria que mais consumiu
  const topCategory = useMemo(() => {
    if (expenseCategories.length === 0) return { category: 'N/A', spent: 0 }
    return expenseCategories.reduce((max, cat) => 
      cat.spent > max.spent ? cat : max, expenseCategories[0]
    )
  }, [expenseCategories])

  // Filtros de histórico
  const filteredHistory = useMemo(() => {
    let filtered = [...closedMonths]
    
    if (historySearch) {
      filtered = filtered.filter(month => 
        month.month.toLowerCase().includes(historySearch.toLowerCase()) ||
        month.notes?.toLowerCase().includes(historySearch.toLowerCase())
      )
    }
    
    if (historyFilter !== 'all') {
      filtered = filtered.filter(month => {
        switch (historyFilter) {
          case 'positive':
            return month.remaining > 0
          case 'negative':
            return month.remaining < 0
          case 'high':
            return month.expenses > month.income * 0.9
          case 'low':
            return month.expenses < month.income * 0.5
          default:
            return true
        }
      })
    }
    
    return filtered.sort((a, b) => new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime())
  }, [closedMonths, historySearch, historyFilter])

  // Dados para gráficos históricos
  const historyChartData = useMemo(() => {
    return closedMonths.map(month => ({
      month: month.month,
      renda: month.income,
      gastos: month.expenses,
      saldo: month.remaining
    }))
  }, [closedMonths])

  const historyPieData = useMemo(() => {
    const totalExpenses = closedMonths.reduce((sum, month) => sum + month.expenses, 0)
    const categoryTotals: { [key: string]: number } = {}
    
    closedMonths.forEach(month => {
      month.categories.forEach(cat => {
        if (!categoryTotals[cat.category]) {
          categoryTotals[cat.category] = 0
        }
        categoryTotals[cat.category] += cat.spent
      })
    })
    
    return Object.entries(categoryTotals).map(([category, total]) => ({
      name: category,
      value: total,
      percentage: totalExpenses > 0 ? ((total / totalExpenses) * 100).toFixed(1) : '0'
    }))
  }, [closedMonths])

  // Dados para gráficos de cartões
  const cardChartData = useMemo(() => {
    return creditCards.filter(card => card.isActive).map(card => ({
      name: card.name,
      value: card.expenses.reduce((sum, exp) => sum + exp.value, 0),
      color: card.color,
      percentage: totalCards > 0 ? ((card.expenses.reduce((sum, exp) => sum + exp.value, 0) / totalCards) * 100) : 0
    }))
  }, [creditCards, totalCards])

  // Alertas inteligentes
  const alerts = useMemo(() => {
    const newAlerts = []
    
    if (totalSpent > totalIncome) {
      newAlerts.push({ type: 'error', message: '⚠️ Atenção: Seus gastos ultrapassaram a renda do mês!' })
    } else if (budgetPercentage > settings.alertThreshold) {
      newAlerts.push({ type: 'warning', message: `⚠️ Você já usou mais de ${settings.alertThreshold}% do seu orçamento!` })
    } else if (budgetPercentage > 70) {
      newAlerts.push({ type: 'info', message: 'ℹ️ Você já usou mais de 70% do seu orçamento.' })
    }
    
    const overspentCategories = expenseCategories.filter(cat => cat.spent > cat.estimated)
    if (overspentCategories.length > 0) {
      newAlerts.push({ 
        type: 'warning', 
        message: `📊 ${overspentCategories.length} categorias extrapolaram o orçamento: ${overspentCategories.map(c => c.category).join(', ')}` 
      })
    }
    
    return newAlerts
  }, [totalSpent, totalIncome, budgetPercentage, expenseCategories, settings.alertThreshold])

  // Dados para gráficos
  const chartData = expenseCategories.map(cat => ({
    category: cat.category,
    estimativa: cat.estimated,
    gasto: cat.spent,
    diferenca: cat.spent - cat.estimated
  }))

  const pieData = expenseCategories
    .filter(cat => cat.spent > 0)
    .map(cat => ({
      name: cat.category,
      value: cat.spent,
      percentage: totalSpent > 0 ? ((cat.spent / totalSpent) * 100).toFixed(1) : '0',
      color: cat.color
    }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: settings.currency
    }).format(value)
  }

  const getDaysUntilDue = (dueDate: string) => {
    if (!dueDate) return 999
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDueDateColor = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate)
    if (days < 0) return 'text-red-600 bg-red-50'
    if (days <= 3) return 'text-orange-600 bg-orange-50'
    if (days <= 7) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getDueDateText = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate)
    if (days < 0) return `Atrasado (${Math.abs(days)} dias)`
    if (days === 0) return 'Vence hoje'
    if (days === 1) return 'Vence amanhã'
    return `Vence em ${days} dias`
  }

  // Funções de atualização
  const updateIncomeValue = (id: string, value: string) => {
    const cleanValue = value.replace(/[^\d,-]/g, '').replace(',', '.')
    const numValue = parseFloat(cleanValue) || 0
    setIncomeSources(prev => prev.map(source => 
      source.id === id ? { ...source, value: numValue } : source
    ))
  }

  const updateExpenseCategory = (id: string, field: 'estimated' | 'spent', value: string) => {
    const cleanValue = value.replace(/[^\d,-]/g, '').replace(',', '.')
    const numValue = parseFloat(cleanValue) || 0
    setExpenseCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, [field]: numValue } : cat
    ))
  }

  const addFixedExpense = () => {
    const newExpense: FixedExpense = { 
      id: Date.now().toString(), 
      description: '', 
      category: '', 
      value: 0,
      dueDate: '',
      status: 'pendente',
      referenceMonth: currentMonth
    }
    setFixedExpenses(prev => [...prev, newExpense])
  }

  const updateFixedExpense = (id: string, field: keyof FixedExpense, value: string | number) => {
    setFixedExpenses(prev => prev.map(exp => {
      if (exp.id !== id) return exp
      
      if (field === 'value') {
        const cleanValue = typeof value === 'string' 
          ? value.replace(/[^\d,-]/g, '').replace(',', '.') 
          : value.toString()
        const numValue = parseFloat(cleanValue) || 0
        return { ...exp, [field]: numValue }
      }
      
      return { ...exp, [field]: value }
    }))
  }

  // Funções de cartões
  const addNewCard = () => {
    if (!newCard.name || !newCard.bank) {
      alert('Por favor, preencha o nome e o banco do cartão')
      return
    }

    const card: CreditCard = {
      id: Date.now().toString(),
      name: newCard.name,
      bank: newCard.bank,
      color: newCard.color,
      icon: newCard.icon,
      expenses: [],
      isActive: true,
      createdAt: new Date().toISOString()
    }

    setCreditCards(prev => [...prev, card])
    setNewCard({ name: '', bank: '', color: '#3B82F6', icon: '💳' })
    setShowAddCardDialog(false)
  }

  const deleteCard = (cardId: string) => {
    if (confirm('Tem certeza que deseja excluir este cartão? Todas as despesas associadas serão perdidas.')) {
      setCreditCards(prev => prev.filter(card => card.id !== cardId))
    }
  }

  const toggleCardStatus = (cardId: string) => {
    setCreditCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isActive: !card.isActive } : card
    ))
  }

  const addCardExpense = (cardId: string) => {
    const newExpense: CardExpense = { 
      id: Date.now().toString(), 
      description: '', 
      category: '', 
      value: 0,
      dueDate: '',
      installment: ''
    }
    
    setCreditCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, expenses: [...card.expenses, newExpense] }
        : card
    ))
  }

  const updateCardExpense = (cardId: string, expenseId: string, field: keyof CardExpense, value: string | number) => {
    setCreditCards(prev => prev.map(card => {
      if (card.id !== cardId) return card
      
      return {
        ...card,
        expenses: card.expenses.map(exp => {
          if (exp.id !== expenseId) return exp
          
          if (field === 'value') {
            const cleanValue = typeof value === 'string' 
              ? value.replace(/[^\d,-]/g, '').replace(',', '.') 
              : value.toString()
            const numValue = parseFloat(cleanValue) || 0
            return { ...exp, [field]: numValue }
          }
          
          return { ...exp, [field]: value }
        })
      }
    }))
  }

  const deleteCardExpense = (cardId: string, expenseId: string) => {
    setCreditCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, expenses: card.expenses.filter(exp => exp.id !== expenseId) }
        : card
    ))
  }

  // Funções das funcionalidades principais
  const handleCloseMonth = () => {
    const cardExpenses: { [cardId: string]: CardExpense[] } = {}
    creditCards.forEach(card => {
      cardExpenses[card.id] = [...card.expenses]
    })

    const monthData: MonthlyData = {
      id: Date.now().toString(),
      month: currentMonth,
      year: new Date().getFullYear(),
      income: totalIncome,
      expenses: totalSpent,
      remaining: remaining,
      categories: [...expenseCategories],
      fixedExpenses: [...fixedExpenses],
      cardExpenses: cardExpenses,
      incomeSources: [...incomeSources],
      closedAt: new Date().toISOString(),
      notes: closeMonthNotes
    }
    
    setClosedMonths(prev => [...prev, monthData])
    
    // Resetar dados para o próximo mês
    setExpenseCategories(prev => prev.map(cat => ({ ...cat, spent: 0 })))
    setFixedExpenses([])
    setCreditCards(prev => prev.map(card => ({ ...card, expenses: [] })))
    setCloseMonthNotes('')
    
    setShowCloseMonthDialog(false)
    
    // Atualizar para o próximo mês
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
  }

  const generateReport = () => {
    const reportData = {
      periodo: currentMonth,
      dataGeracao: new Date().toLocaleDateString('pt-BR'),
      resumo: {
        rendaTotal: totalIncome,
        gastosTotais: totalSpent,
        saldoRestante: remaining,
        percentualUtilizado: budgetPercentage.toFixed(1)
      },
      categorias: expenseCategories.map(cat => ({
        nome: cat.category,
        estimado: cat.estimated,
        gasto: cat.spent,
        diferenca: cat.spent - cat.estimated,
        status: cat.spent > cat.estimated ? 'Extrapolado' : cat.spent === 0 ? 'Sem gastos' : 'Dentro do esperado'
      })),
      cartoes: creditCards.filter(card => card.isActive).map(card => ({
        nome: card.name,
        banco: card.bank,
        total: card.expenses.reduce((sum, exp) => sum + exp.value, 0),
        despesas: card.expenses
      })),
      gastosFixos: fixedExpenses,
      mesesFechados: closedMonths.length,
      historico: closedMonths.map(month => ({
        mes: month.month,
        renda: month.income,
        gastos: month.expenses,
        saldo: month.remaining,
        notas: month.notes
      }))
    }
    
    // Criar e baixar arquivo JSON
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `relatorio-financeiro-${currentMonth.replace(/\s+/g, '-').toLowerCase()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const generateHistoryReport = () => {
    const historyData = {
      dataGeracao: new Date().toLocaleDateString('pt-BR'),
      totalMeses: closedMonths.length,
      resumoGeral: {
        rendaTotal: closedMonths.reduce((sum, month) => sum + month.income, 0),
        gastosTotais: closedMonths.reduce((sum, month) => sum + month.expenses, 0),
        saldoTotal: closedMonths.reduce((sum, month) => sum + month.remaining, 0),
        mediaRenda: closedMonths.length > 0 ? closedMonths.reduce((sum, month) => sum + month.income, 0) / closedMonths.length : 0,
        mediaGastos: closedMonths.length > 0 ? closedMonths.reduce((sum, month) => sum + month.expenses, 0) / closedMonths.length : 0
      },
      meses: closedMonths.map(month => ({
        mes: month.month,
        ano: month.year,
        renda: month.income,
        gastos: month.expenses,
        saldo: month.remaining,
        categorias: month.categories,
        gastosFixos: month.fixedExpenses,
        cartoes: month.cardExpenses,
        fontesRenda: month.incomeSources,
        dataFechamento: month.closedAt,
        notas: month.notes
      }))
    }
    
    const dataStr = JSON.stringify(historyData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `historico-completo-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const addNewExpense = () => {
    const cleanValue = newExpense.value.replace(/[^\d,-]/g, '').replace(',', '.')
    const numValue = parseFloat(cleanValue) || 0
    
    if (!newExpense.description || !newExpense.category || numValue <= 0) {
      alert('Por favor, preencha todos os campos corretamente')
      return
    }
    
    switch (newExpense.type) {
      case 'category':
        const existingCategory = expenseCategories.find(cat => cat.category === newExpense.category)
        if (existingCategory) {
          setExpenseCategories(prev => prev.map(cat => 
            cat.category === newExpense.category 
              ? { ...cat, spent: cat.spent + numValue }
              : cat
          ))
        }
        break
        
      case 'fixed':
        const newFixedExpense: FixedExpense = {
          id: Date.now().toString(),
          description: newExpense.description,
          category: newExpense.category,
          value: numValue,
          dueDate: new Date().toISOString().split('T')[0],
          status: 'pendente',
          referenceMonth: currentMonth
        }
        setFixedExpenses(prev => [...prev, newFixedExpense])
        break
        
      case 'card':
        if (!newExpense.cardId) {
          alert('Selecione um cartão')
          return
        }
        const newCardExpense: CardExpense = {
          id: Date.now().toString(),
          description: newExpense.description,
          category: newExpense.category,
          value: numValue,
          dueDate: new Date().toISOString().split('T')[0]
        }
        setCreditCards(prev => prev.map(card => 
          card.id === newExpense.cardId 
            ? { ...card, expenses: [...card.expenses, newCardExpense] }
            : card
        ))
        break
    }
    
    setNewExpense({ description: '', category: '', value: '', type: 'category', cardId: '' })
    setShowAddExpenseDialog(false)
  }

  const deleteHistoryMonth = (monthId: string) => {
    if (confirm('Tem certeza que deseja excluir este mês do histórico? Esta ação não pode ser desfeita.')) {
      setClosedMonths(prev => prev.filter(month => month.id !== monthId))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return <Badge className="bg-green-100 text-green-800">✓ Pago</Badge>
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pendente</Badge>
      case 'atrasado':
        return <Badge className="bg-red-100 text-red-800">⚠️ Atrasado</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getSpendingStatus = (spent: number, estimated: number) => {
    if (spent === 0) return { color: 'text-gray-500', bg: 'bg-gray-50', text: 'Sem gastos' }
    if (spent > estimated) return { color: 'text-red-600', bg: 'bg-red-50', text: 'Extrapolou' }
    return { color: 'text-green-600', bg: 'bg-green-50', text: 'Dentro do esperado' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      {/* Cabeçalho Principal Moderno */}
      <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-4xl md:text-5xl font-bold tracking-wide">
            Controle Financeiro
          </CardTitle>
          <p className="text-xl opacity-90 mt-2">{currentMonth}</p>
        </CardHeader>
      </Card>

      {/* Painel Resumo (Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-400 to-green-500 text-white">
          <CardContent className="p-6 text-center">
            <Wallet className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <p className="text-sm opacity-90">Renda Bruta</p>
            <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-400 to-red-500 text-white">
          <CardContent className="p-6 text-center">
            <TrendingDown className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <p className="text-sm opacity-90">Total Gastos</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-400 to-blue-500 text-white">
          <CardContent className="p-6 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <p className="text-sm opacity-90">Cartões</p>
            <p className="text-2xl font-bold">{formatCurrency(totalCards)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-400 to-purple-500 text-white">
          <CardContent className="p-6 text-center">
            <PiggyBank className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <p className="text-sm opacity-90">Sobra Final</p>
            <p className="text-2xl font-bold">{formatCurrency(remaining)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-400 to-orange-500 text-white">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <p className="text-sm opacity-90">% Orçamento</p>
            <p className="text-2xl font-bold">{budgetPercentage.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-400 to-pink-500 text-white">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <p className="text-sm opacity-90">Top Categoria</p>
            <p className="text-lg font-bold truncate">{topCategory.category}</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Inteligentes */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, index) => (
            <Card key={index} className={`border-l-4 ${
              alert.type === 'error' ? 'border-red-500 bg-red-50' : 
              alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' : 
              'border-blue-500 bg-blue-50'
            }`}>
              <CardContent className="p-4">
                <p className={`font-medium ${
                  alert.type === 'error' ? 'text-red-800' : 
                  alert.type === 'warning' ? 'text-yellow-800' : 
                  'text-blue-800'
                }`}>
                  {alert.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Barra de Progresso do Orçamento */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Progresso do Orçamento</h3>
            <span className="text-sm text-gray-600">{budgetPercentage.toFixed(1)}% utilizado</span>
          </div>
          <Progress 
            value={Math.min(budgetPercentage, 100)} 
            className={`h-4 ${
              budgetPercentage > 90 ? 'bg-red-200' : 
              budgetPercentage > 70 ? 'bg-yellow-200' : 
              'bg-green-200'
            }`}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(totalIncome)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fontes de Renda Modernizado */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-blue-900">
              <div className="p-2 bg-blue-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              Fontes de Renda
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-900">Descrição</TableHead>
                  <TableHead className="text-right text-blue-900">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeSources.map((source) => (
                  <TableRow key={source.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell className="font-medium text-gray-700">{source.description}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="text"
                        value={formatCurrency(source.value)}
                        onChange={(e) => updateIncomeValue(source.id, e.target.value)}
                        className="text-right font-mono border-blue-200 focus:border-blue-400"
                        placeholder="R$ 0,00"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <TableCell className="text-blue-900">Total de Rendas</TableCell>
                  <TableCell className="text-right text-blue-900 text-lg">
                    {formatCurrency(totalIncome)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Estimativas e Gastos por Categoria Modernizado */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-green-900">
              <div className="p-2 bg-green-500 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              Estimativas e Gastos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-green-900">Categoria</TableHead>
                    <TableHead className="text-right text-green-900">Estimativa</TableHead>
                    <TableHead className="text-right text-green-900">Gasto</TableHead>
                    <TableHead className="text-center text-green-900">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseCategories.map((cat) => {
                    const status = getSpendingStatus(cat.spent, cat.estimated)
                    return (
                      <TableRow key={cat.id} className={`hover:bg-green-50/50 transition-colors ${status.bg}`}>
                        <TableCell className="font-medium">
                          <Badge 
                            variant="outline" 
                            className="border-2"
                            style={{ 
                              backgroundColor: cat.color, 
                              borderColor: cat.color,
                              color: '#374151'
                            }}
                          >
                            {cat.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="text"
                            value={formatCurrency(cat.estimated)}
                            onChange={(e) => updateExpenseCategory(cat.id, 'estimated', e.target.value)}
                            className="text-right font-mono text-sm border-green-200 focus:border-green-400"
                            placeholder="R$ 0,00"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="text"
                            value={formatCurrency(cat.spent)}
                            onChange={(e) => updateExpenseCategory(cat.id, 'spent', e.target.value)}
                            className={`text-right font-mono text-sm border-green-200 focus:border-green-400 ${status.color} font-semibold`}
                            placeholder="R$ 0,00"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={status.bg + ' ' + status.color}>
                            {status.text}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Estimado</p>
                <p className="font-bold text-blue-900 text-lg">{formatCurrency(totalEstimated)}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Gastos</p>
                <p className="font-bold text-red-900 text-lg">{formatCurrency(totalSpent)}</p>
              </div>
              <div className={`p-3 rounded-lg ${difference >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm text-gray-600">Diferença</p>
                <p className={`font-bold text-lg ${difference >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  {formatCurrency(difference)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico Comparativo Melhorado */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-purple-900">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              Análise Comparativa: Estimativas vs Gastos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={11}
                  tick={{ fill: '#4B5563' }}
                />
                <YAxis tick={{ fill: '#4B5563' }} />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="estimativa" 
                  fill="#93C5FD" 
                  name="Estimativas" 
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="gasto" 
                  fill="#FCA5A5" 
                  name="Gastos Reais" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza Melhorado */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-pink-100 to-pink-200 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-pink-900">
              <div className="p-2 bg-pink-500 rounded-lg">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              Distribuição dos Gastos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(item.value)} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gastos Fixos Melhorado */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-orange-900">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              Gastos Fixos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-orange-900">Descrição</TableHead>
                    <TableHead className="text-orange-900">Categoria</TableHead>
                    <TableHead className="text-orange-900">Vencimento</TableHead>
                    <TableHead className="text-center text-orange-900">Status</TableHead>
                    <TableHead className="text-right text-orange-900">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fixedExpenses.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-orange-50/50 transition-colors">
                      <TableCell>
                        <Input
                          value={expense.description}
                          onChange={(e) => updateFixedExpense(expense.id, 'description', e.target.value)}
                          placeholder="Descrição"
                          className="text-sm border-orange-200 focus:border-orange-400"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={expense.category} onValueChange={(value) => updateFixedExpense(expense.id, 'category', value)}>
                          <SelectTrigger className="text-sm border-orange-200 focus:border-orange-400">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {settings.categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={expense.dueDate}
                          onChange={(e) => updateFixedExpense(expense.id, 'dueDate', e.target.value)}
                          className="text-sm border-orange-200 focus:border-orange-400"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(expense.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="text"
                          value={formatCurrency(expense.value)}
                          onChange={(e) => updateFixedExpense(expense.id, 'value', e.target.value)}
                          className="text-right font-mono text-sm border-orange-200 focus:border-orange-400"
                          placeholder="R$ 0,00"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={addFixedExpense}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Gasto Fixo
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Gastos Fixos</p>
                <p className="font-bold text-orange-900 text-lg">{formatCurrency(totalFixedExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cartões Dinâmicos */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                Cartões de Crédito
              </div>
              <Button
                onClick={() => setShowAddCardDialog(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cartão
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Gráfico dos Cartões */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4 text-indigo-900">Distribuição por Cartão</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cardChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
                  <YAxis tick={{ fill: '#4B5563' }} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="value" fill="#818CF8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Lista de Cartões */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {creditCards.filter(card => card.isActive).map((card) => (
                <div key={card.id}>
                  <div className="flex justify-between items-center mb-3 p-3 rounded-lg" style={{ backgroundColor: card.color + '20' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{card.icon}</span>
                      <div>
                        <h4 className="font-semibold" style={{ color: card.color }}>
                          {card.name}
                        </h4>
                        <p className="text-xs text-gray-600">{card.bank}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-bold" style={{ color: card.color }}>
                          {formatCurrency(card.expenses.reduce((sum, exp) => sum + exp.value, 0))}
                        </p>
                        <p className="text-xs text-gray-600">
                          {cardChartData.find(c => c.name === card.name)?.percentage.toFixed(1)}% do total
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleCardStatus(card.id)}
                          className="h-8 w-8 p-0"
                        >
                          {card.isActive ? '👁️' : '🙈'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteCard(card.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Descrição</TableHead>
                          <TableHead className="text-xs">Categoria</TableHead>
                          <TableHead className="text-xs">Venc.</TableHead>
                          <TableHead className="text-xs">Parcela</TableHead>
                          <TableHead className="text-xs text-right">Valor</TableHead>
                          <TableHead className="text-xs"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {card.expenses.map((expense) => (
                          <TableRow key={expense.id} className="hover:bg-gray-50/30">
                            <TableCell>
                              <Input
                                value={expense.description}
                                onChange={(e) => updateCardExpense(card.id, expense.id, 'description', e.target.value)}
                                placeholder="Descrição"
                                className="text-xs h-8 border-gray-200"
                              />
                            </TableCell>
                            <TableCell>
                              <Select value={expense.category} onValueChange={(value) => updateCardExpense(card.id, expense.id, 'category', value)}>
                                <SelectTrigger className="text-xs h-8 border-gray-200">
                                  <SelectValue placeholder="Cat" />
                                </SelectTrigger>
                                <SelectContent>
                                  {settings.categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={expense.dueDate}
                                onChange={(e) => updateCardExpense(card.id, expense.id, 'dueDate', e.target.value)}
                                className="text-xs h-8 border-gray-200"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={expense.installment || ''}
                                onChange={(e) => updateCardExpense(card.id, expense.id, 'installment', e.target.value)}
                                placeholder="1/12"
                                className="text-xs h-8 border-gray-200"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="text"
                                value={formatCurrency(expense.value)}
                                onChange={(e) => updateCardExpense(card.id, expense.id, 'value', e.target.value)}
                                className="text-right font-mono text-xs h-8 border-gray-200"
                                placeholder="R$ 0,00"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteCardExpense(card.id, expense.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Button
                    onClick={() => addCardExpense(card.id)}
                    className="mt-3 w-full"
                    style={{ backgroundColor: card.color }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Despesa
                  </Button>
                </div>
              ))}
            </div>

            {/* Cartões Inativos */}
            {creditCards.filter(card => !card.isActive).length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Cartões Inativos</h4>
                <div className="flex gap-2 flex-wrap">
                  {creditCards.filter(card => !card.isActive).map((card) => (
                    <Badge
                      key={card.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleCardStatus(card.id)}
                    >
                      {card.icon} {card.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Barra de Ações */}
      <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-gray-100 to-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Adicionar Novo Gasto */}
            <Dialog open={showAddExpenseDialog} onOpenChange={setShowAddExpenseDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Novo Gasto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Gasto</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Descrição
                    </Label>
                    <Input
                      id="description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                      className="col-span-3"
                      placeholder="Ex: Cinema no shopping"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Categoria
                    </Label>
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {settings.categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      Valor
                    </Label>
                    <Input
                      id="value"
                      value={newExpense.value}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, value: e.target.value }))}
                      className="col-span-3"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Tipo
                    </Label>
                    <Select value={newExpense.type} onValueChange={(value: any) => setNewExpense(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">Gasto por Categoria</SelectItem>
                        <SelectItem value="fixed">Gasto Fixo</SelectItem>
                        <SelectItem value="card">Cartão de Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newExpense.type === 'card' && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="card" className="text-right">
                        Cartão
                      </Label>
                      <Select value={newExpense.cardId} onValueChange={(value) => setNewExpense(prev => ({ ...prev, cardId: value }))}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione um cartão" />
                        </SelectTrigger>
                        <SelectContent>
                          {creditCards.filter(card => card.isActive).map((card) => (
                            <SelectItem key={card.id} value={card.id}>
                              {card.icon} {card.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddExpenseDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={addNewExpense}>
                    Adicionar Gasto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Histórico */}
            <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <History className="h-4 w-4 mr-2" />
                  Histórico ({closedMonths.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Histórico Financeiro
                  </DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="list">Lista de Meses</TabsTrigger>
                    <TabsTrigger value="charts">Análise Gráfica</TabsTrigger>
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="list" className="space-y-4">
                    {/* Filtros */}
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Buscar meses ou notas..."
                            value={historySearch}
                            onChange={(e) => setHistorySearch(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <Select value={historyFilter} onValueChange={setHistoryFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os meses</SelectItem>
                          <SelectItem value="positive">Saldo positivo</SelectItem>
                          <SelectItem value="negative">Saldo negativo</SelectItem>
                          <SelectItem value="high">Alto consumo</SelectItem>
                          <SelectItem value="low">Baixo consumo</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={generateHistoryReport} variant="outline">
                        <FileDown className="h-4 w-4 mr-2" />
                        Exportar Tudo
                      </Button>
                    </div>

                    {/* Lista de meses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredHistory.map((month) => (
                        <Card key={month.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold">{month.month}</h4>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedHistoryMonth(month)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteHistoryMonth(month.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Renda:</span>
                                <span className="font-medium">{formatCurrency(month.income)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Gastos:</span>
                                <span className="font-medium">{formatCurrency(month.expenses)}</span>
                              </div>
                              <div className="flex justify-between font-bold pt-1 border-t">
                                <span>Saldo:</span>
                                <span className={month.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {formatCurrency(month.remaining)}
                                </span>
                              </div>
                              {month.notes && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                  {month.notes}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="charts" className="space-y-6">
                    {/* Gráfico de linha - Evolução mensal */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Evolução Financeira Mensal
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={historyChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Line type="monotone" dataKey="renda" stroke="#10B981" strokeWidth={2} />
                            <Line type="monotone" dataKey="gastos" stroke="#EF4444" strokeWidth={2} />
                            <Line type="monotone" dataKey="saldo" stroke="#3B82F6" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Gráfico de pizza - Distribuição total */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChartIcon className="h-5 w-5" />
                          Distribuição Total de Gastos (Todos os Meses)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={historyPieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              dataKey="value"
                              label={({ name, percentage }) => `${name} ${percentage}%`}
                            >
                              {historyPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(${index * 30}, 70%, 60%)`} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4">
                    {selectedHistoryMonth ? (
                      <div className="space-y-4">
                        {/* Cabeçalho do mês selecionado */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                              <span>{selectedHistoryMonth.month}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedHistoryMonth(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Renda</p>
                                <p className="text-xl font-bold text-green-600">{formatCurrency(selectedHistoryMonth.income)}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Gastos</p>
                                <p className="text-xl font-bold text-red-600">{formatCurrency(selectedHistoryMonth.expenses)}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Saldo</p>
                                <p className={`text-xl font-bold ${selectedHistoryMonth.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(selectedHistoryMonth.remaining)}
                                </p>
                              </div>
                            </div>
                            {selectedHistoryMonth.notes && (
                              <div className="mt-4 p-3 bg-gray-50 rounded">
                                <p className="text-sm font-medium">Notas:</p>
                                <p className="text-sm text-gray-600">{selectedHistoryMonth.notes}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Categorias */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Categorias</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Categoria</TableHead>
                                  <TableHead className="text-right">Estimado</TableHead>
                                  <TableHead className="text-right">Gasto</TableHead>
                                  <TableHead className="text-right">Diferença</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedHistoryMonth.categories.map((cat) => (
                                  <TableRow key={cat.id}>
                                    <TableCell>{cat.category}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(cat.estimated)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(cat.spent)}</TableCell>
                                    <TableCell className={`text-right font-medium ${cat.spent > cat.estimated ? 'text-red-600' : 'text-green-600'}`}>
                                      {formatCurrency(cat.spent - cat.estimated)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>

                        {/* Fontes de Renda */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Fontes de Renda</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Descrição</TableHead>
                                  <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedHistoryMonth.incomeSources.map((source) => (
                                  <TableRow key={source.id}>
                                    <TableCell>{source.description}</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(source.value)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Selecione um mês na aba "Lista de Meses" para ver os detalhes</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Fechar Mês */}
            <AlertDialog open={showCloseMonthDialog} onOpenChange={setShowCloseMonthDialog}>
              <AlertDialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Fechar Mês
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[500px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Fechamento do Mês</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja fechar o mês <strong>{currentMonth}</strong>? 
                    Esta ação irá:
                    <ul className="mt-2 list-disc list-inside text-sm">
                      <li>Salvar todos os dados atuais no histórico</li>
                      <li>Resetar os gastos para R$ 0,00</li>
                      <li>Limpar despesas e cartões</li>
                      <li>Avançar para o próximo mês</li>
                    </ul>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm"><strong>Resumo do mês:</strong></p>
                      <p className="text-sm">Renda: {formatCurrency(totalIncome)}</p>
                      <p className="text-sm">Gastos: {formatCurrency(totalSpent)}</p>
                      <p className="text-sm">Saldo: {formatCurrency(remaining)}</p>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="notes">Notas do mês (opcional)</Label>
                      <Textarea
                        id="notes"
                        value={closeMonthNotes}
                        onChange={(e) => setCloseMonthNotes(e.target.value)}
                        placeholder="Adicione observações sobre este mês..."
                        className="mt-2"
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCloseMonth} className="bg-green-500 hover:bg-green-600">
                    Confirmar Fechamento
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Gerar Relatório */}
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <DialogTrigger asChild>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Relatório Financeiro - {currentMonth}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-green-600">Renda Total</h4>
                        <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-red-600">Gastos Totais</h4>
                        <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Resumo por Categoria</h4>
                      <div className="space-y-2">
                        {expenseCategories.filter(cat => cat.spent > 0).map((cat) => (
                          <div key={cat.id} className="flex justify-between items-center">
                            <span className="text-sm">{cat.category}</span>
                            <div className="text-right">
                              <span className="font-medium">{formatCurrency(cat.spent)}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({((cat.spent / totalSpent) * 100).toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Resumo dos Cartões</h4>
                      <div className="space-y-2">
                        {creditCards.filter(card => card.isActive).map((card) => {
                          const cardTotal = card.expenses.reduce((sum, exp) => sum + exp.value, 0)
                          return (
                            <div key={card.id} className="flex justify-between">
                              <span>{card.icon} {card.name}</span>
                              <span className="font-medium">{formatCurrency(cardTotal)}</span>
                            </div>
                          )
                        })}
                        <div className="flex justify-between font-bold pt-2 border-t">
                          <span>Total Cartões:</span>
                          <span>{formatCurrency(totalCards)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between items-center pt-4">
                    <p className="text-sm text-gray-600">
                      Gerado em {new Date().toLocaleDateString('pt-BR')}
                    </p>
                    <Button onClick={generateReport} className="bg-blue-500 hover:bg-blue-600">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar JSON
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Configurações */}
            <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Configurações</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currency" className="text-right">
                      Moeda
                    </Label>
                    <Select value={settings.currency} onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="threshold" className="text-right">
                      Alerta (%)
                    </Label>
                    <Input
                      id="threshold"
                      type="number"
                      value={settings.alertThreshold}
                      onChange={(e) => setSettings(prev => ({ ...prev, alertThreshold: parseInt(e.target.value) || 80 }))}
                      className="col-span-3"
                      min="50"
                      max="100"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="monthStart" className="text-right">
                      Dia do Mês
                    </Label>
                    <Input
                      id="monthStart"
                      type="number"
                      value={settings.monthStartDay}
                      onChange={(e) => setSettings(prev => ({ ...prev, monthStartDay: parseInt(e.target.value) || 1 }))}
                      className="col-span-3"
                      min="1"
                      max="31"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setShowSettingsDialog(false)}>
                    Salvar Configurações
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para Adicionar Cartão */}
      <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cartão</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardName" className="text-right">
                Nome
              </Label>
              <Input
                id="cardName"
                value={newCard.name}
                onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Ex: Visa Platinum"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardBank" className="text-right">
                Banco
              </Label>
              <Input
                id="cardBank"
                value={newCard.bank}
                onChange={(e) => setNewCard(prev => ({ ...prev, bank: e.target.value }))}
                className="col-span-3"
                placeholder="Ex: Itaú"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardColor" className="text-right">
                Cor
              </Label>
              <Select value={newCard.color} onValueChange={(value) => setNewCard(prev => ({ ...prev, color: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CARD_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardIcon" className="text-right">
                Ícone
              </Label>
              <Select value={newCard.icon} onValueChange={(value) => setNewCard(prev => ({ ...prev, icon: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="💳">💳 Cartão</SelectItem>
                  <SelectItem value="🏦">🏦 Banco</SelectItem>
                  <SelectItem value="💰">💰 Dinheiro</SelectItem>
                  <SelectItem value="💎">💎 Premium</SelectItem>
                  <SelectItem value="🌟">🌟 Especial</SelectItem>
                  <SelectItem value="🔵">🔵 Azul</SelectItem>
                  <SelectItem value="🟢">🟢 Verde</SelectItem>
                  <SelectItem value="🔴">🔴 Vermelho</SelectItem>
                  <SelectItem value="🟡">🟡 Amarelo</SelectItem>
                  <SelectItem value="🟣">🟣 Roxo</SelectItem>
                  <SelectItem value="🟠">🟠 Laranja</SelectItem>
                  <SelectItem value="⚫">⚫ Preto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddCardDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={addNewCard}>
              Adicionar Cartão
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}