"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslationContext } from "@/lib/translation-context"

interface Currency {
  code: string
  name: string
  flag: string
  symbol: string
}

const defaultCurrencies: Currency[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩", symbol: "৳" },
]

const presetCurrencies: Currency[] = [
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷", symbol: "₩" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰", symbol: "HK$" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿", symbol: "NZ$" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰", symbol: "kr" },
  { code: "PLN", name: "Polish Zloty", flag: "🇵🇱", symbol: "zł" },
  { code: "CZK", name: "Czech Koruna", flag: "🇨🇿", symbol: "Kč" },
  { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺", symbol: "Ft" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺", symbol: "₽" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷", symbol: "₺" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦", symbol: "R" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽", symbol: "$" },
  { code: "ARS", name: "Argentine Peso", flag: "🇦🇷", symbol: "$" },
  { code: "CLP", name: "Chilean Peso", flag: "🇨🇱", symbol: "$" },
  { code: "COP", name: "Colombian Peso", flag: "🇨🇴", symbol: "$" },
  { code: "PEN", name: "Peruvian Sol", flag: "🇵🇪", symbol: "S/" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾", symbol: "RM" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩", symbol: "Rp" },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭", symbol: "₱" },
  { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳", symbol: "₫" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰", symbol: "₨" },
  { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰", symbol: "₨" },
  { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵", symbol: "₨" },
  { code: "AFN", name: "Afghan Afghani", flag: "🇦🇫", symbol: "؋" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦", symbol: "﷼" },
  { code: "QAR", name: "Qatari Riyal", flag: "🇶🇦", symbol: "﷼" },
  { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼", symbol: "د.ك" },
  { code: "BHD", name: "Bahraini Dinar", flag: "🇧🇭", symbol: ".د.ب" },
  { code: "OMR", name: "Omani Rial", flag: "🇴🇲", symbol: "﷼" },
  { code: "JOD", name: "Jordanian Dinar", flag: "🇯🇴", symbol: "د.ا" },
  { code: "LBP", name: "Lebanese Pound", flag: "🇱🇧", symbol: "ل.ل" },
  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬", symbol: "£" },
  { code: "MAD", name: "Moroccan Dirham", flag: "🇲🇦", symbol: "د.م." },
  { code: "TND", name: "Tunisian Dinar", flag: "🇹🇳", symbol: "د.ت" },
  { code: "DZD", name: "Algerian Dinar", flag: "🇩🇿", symbol: "د.ج" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬", symbol: "₦" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭", symbol: "₵" },
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪", symbol: "KSh" },
  { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬", symbol: "USh" },
  { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿", symbol: "TSh" },
  { code: "ETB", name: "Ethiopian Birr", flag: "🇪🇹", symbol: "Br" },
  { code: "BTC", name: "Bitcoin", flag: "🟠", symbol: "₿" },
  { code: "ETH", name: "Ethereum", flag: "🔷", symbol: "Ξ" },
  { code: "BNB", name: "Binance Coin", flag: "🟡", symbol: "BNB" },
  { code: "ADA", name: "Cardano", flag: "🔵", symbol: "₳" },
  { code: "DOT", name: "Polkadot", flag: "🟣", symbol: "DOT" },
  { code: "XRP", name: "Ripple", flag: "🔘", symbol: "XRP" },
  { code: "LTC", name: "Litecoin", flag: "⚪", symbol: "Ł" },
  { code: "LINK", name: "Chainlink", flag: "🔗", symbol: "LINK" },
  { code: "BCH", name: "Bitcoin Cash", flag: "🟢", symbol: "BCH" },
  { code: "XLM", name: "Stellar", flag: "⭐", symbol: "XLM" },
  { code: "DOGE", name: "Dogecoin", flag: "🐕", symbol: "Ð" },
  { code: "MATIC", name: "Polygon", flag: "🟪", symbol: "MATIC" },
  { code: "SOL", name: "Solana", flag: "🌅", symbol: "SOL" },
  { code: "AVAX", name: "Avalanche", flag: "🔺", symbol: "AVAX" },
  { code: "UNI", name: "Uniswap", flag: "🦄", symbol: "UNI" },
]

interface CalculatorData {
  currency: string
  initialCapital: string
  interestRateType: "low" | "custom"
  interestRate: string
  riskPerTrade: string
  winRate: string
  riskRewardRatio: string
  useStopLoss: boolean
  stopLossType: "percentage" | "fixed"
  stopLossValue: string
  useDailyTrades: boolean
  dailyTradesCount: string
  includesAllDays: boolean
  selectedWeekdays: string[]
  dateInputType: "manual" | "calendar"
  manualYear: string
  manualMonth: string
  manualDay: string
  startDate: string
  endDate: string
}

interface TradingCalculatorFormProps {
  onCalculate: (data: CalculatorData) => void
  onReset: () => void
  currentLanguage: string
}

export default function TradingCalculatorForm({ onCalculate, onReset, currentLanguage }: TradingCalculatorFormProps) {
  const { t } = useTranslationContext()

  const [currentStep, setCurrentStep] = useState(1)
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies)
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false)

  const [formData, setFormData] = useState<CalculatorData>({
    currency: "USD",
    initialCapital: "",
    interestRateType: "custom",
    interestRate: "",
    riskPerTrade: "",
    winRate: "",
    riskRewardRatio: "",
    useStopLoss: false,
    stopLossType: "percentage",
    stopLossValue: "",
    useDailyTrades: false,
    dailyTradesCount: "",
    includesAllDays: true,
    selectedWeekdays: [],
    dateInputType: "manual",
    manualYear: "",
    manualMonth: "",
    manualDay: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCurrencies = localStorage.getItem("trading-calculator-currencies")
      const savedSelectedCurrency = localStorage.getItem("trading-calculator-selected-currency")

      if (savedCurrencies) {
        try {
          const parsed = JSON.parse(savedCurrencies)
          setCurrencies(parsed)
        } catch (error) {
          console.error("Error parsing saved currencies:", error)
        }
      }

      if (savedSelectedCurrency) {
        setFormData((prev) => ({ ...prev, currency: savedSelectedCurrency }))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("trading-calculator-currencies", JSON.stringify(currencies))
    }
  }, [currencies])

  useEffect(() => {
    if (typeof window !== "undefined" && formData.currency) {
      localStorage.setItem("trading-calculator-selected-currency", formData.currency)
    }
  }, [formData.currency])

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof CalculatorData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addPresetCurrency = (currency: Currency) => {
    const isAlreadyAdded = currencies.some((c) => c.code === currency.code)
    if (!isAlreadyAdded) {
      setCurrencies((prev) => [...prev, currency])
      setFormData((prev) => ({ ...prev, currency: currency.code }))
    } else {
      setFormData((prev) => ({ ...prev, currency: currency.code }))
    }
    setShowCurrencyDialog(false)
  }

  const handleSubmit = () => {
    onCalculate(formData)
  }

  const handleReset = () => {
    setFormData({
      currency: "USD",
      initialCapital: "",
      interestRateType: "custom",
      interestRate: "",
      riskPerTrade: "",
      winRate: "",
      riskRewardRatio: "",
      useStopLoss: false,
      stopLossType: "percentage",
      stopLossValue: "",
      useDailyTrades: false,
      dailyTradesCount: "",
      includesAllDays: true,
      selectedWeekdays: [],
      dateInputType: "manual",
      manualYear: "",
      manualMonth: "",
      manualDay: "",
      startDate: "",
      endDate: "",
    })
    setCurrentStep(1)
    onReset()
  }

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.currency && formData.initialCapital
      case 2:
        return formData.interestRateType === "low" || (formData.interestRateType === "custom" && formData.interestRate)
      case 3:
        return (
          (!formData.useStopLoss || formData.stopLossValue) && (!formData.useDailyTrades || formData.dailyTradesCount)
        )
      case 4:
        const hasValidDates =
          formData.dateInputType === "manual"
            ? formData.manualYear || formData.manualMonth || formData.manualDay // At least one manual field
            : formData.startDate && formData.endDate // Both calendar dates
        return (formData.includesAllDays || formData.selectedWeekdays.length > 0) && hasValidDates
      default:
        return false
    }
  }

  const handleWeekdayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedWeekdays: prev.selectedWeekdays.includes(day)
        ? prev.selectedWeekdays.filter((d) => d !== day)
        : [...prev.selectedWeekdays, day],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>
                {t.stepOf.replace("{current}", currentStep.toString()).replace("{total}", totalSteps.toString())}
              </span>
              <span>{t.percentComplete.replace("{percent}", Math.round(progress).toString())}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t.basicSetup}</span>
              <span>{t.riskParameters}</span>
              <span>{t.advancedOptions}</span>
              <span>{t.timePeriod}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Steps */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <i className="fas fa-calculator text-primary"></i>
            {currentStep === 1 && t.basicSetup}
            {currentStep === 2 && t.riskParameters}
            {currentStep === 3 && t.advancedOptions}
            {currentStep === 4 && t.timePeriod}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && t.configureBasicSetup}
            {currentStep === 2 && t.setRiskParameters}
            {currentStep === 3 && t.optionalStopLoss}
            {currentStep === 4 && t.defineTimePeriod}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Setup */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Currency Selector */}
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">
                  {t.tradingCurrency}
                </Label>
                <div className="flex gap-2">
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                    <SelectTrigger className="flex-1 bg-input border-border">
                      <SelectValue>
                        {currencies.find((c) => c.code === formData.currency) && (
                          <div className="flex items-center gap-2">
                            <span>{currencies.find((c) => c.code === formData.currency)?.flag}</span>
                            <span>{formData.currency}</span>
                            <span className="text-muted-foreground">
                              - {currencies.find((c) => c.code === formData.currency)?.name}
                            </span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="glass-card border-primary/30">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span>{currency.code}</span>
                            <span className="text-muted-foreground">- {currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={showCurrencyDialog} onOpenChange={setShowCurrencyDialog}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="border-primary/30 hover:border-primary/50 bg-transparent"
                      >
                        <i className="fas fa-plus"></i>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-primary/30 max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="font-heading flex items-center gap-2">
                          <i className="fas fa-coins text-primary"></i>
                          {t.addCurrency || "Add Currency"}
                        </DialogTitle>
                        <DialogDescription>
                          {t.selectCurrencyToAdd || "Select a currency to add to your available options"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                        {presetCurrencies
                          .filter((preset) => !currencies.some((c) => c.code === preset.code))
                          .map((currency) => (
                            <Button
                              key={currency.code}
                              variant="outline"
                              className="justify-start h-auto p-3 border-border hover:border-primary/50 hover:bg-primary/10 bg-transparent transition-all duration-200"
                              onClick={() => addPresetCurrency(currency)}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <span className="text-xl min-w-[24px] flex justify-center">{currency.flag}</span>
                                <div className="text-left flex-1">
                                  <div className="font-medium text-sm">{currency.code}</div>
                                  <div className="text-xs text-muted-foreground truncate">{currency.name}</div>
                                </div>
                              </div>
                            </Button>
                          ))}
                      </div>
                      {presetCurrencies.filter((preset) => !currencies.some((c) => c.code === preset.code)).length ===
                        0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <i className="fas fa-check-circle text-2xl mb-2 text-accent"></i>
                          <p>{t.allCurrenciesAdded || "All available currencies have been added"}</p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Initial Capital */}
              <div className="space-y-2">
                <Label htmlFor="initialCapital" className="text-sm font-medium">
                  {t.initialCapital}
                </Label>
                <div className="relative">
                  <Input
                    id="initialCapital"
                    type="number"
                    placeholder="10000"
                    value={formData.initialCapital}
                    onChange={(e) => handleInputChange("initialCapital", e.target.value)}
                    className="bg-input border-border pl-10"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-medium text-sm">
                    {currencies.find((c) => c.code === formData.currency)?.symbol || "$"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Risk Parameters */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Interest Rate Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t.interestRateType || "Interest Rate Type"}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={formData.interestRateType === "low" ? "default" : "outline"}
                    onClick={() => handleInputChange("interestRateType", "low")}
                    className="h-auto p-4 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fas fa-chart-line text-accent"></i>
                      <span className="font-medium">{t.lowInterest || "Low Interest"}</span>
                    </div>
                    <p className="text-xs text-left opacity-80">
                      {t.lowInterestDesc || "7-10% daily earnings from initial capital"}
                    </p>
                  </Button>

                  <Button
                    type="button"
                    variant={formData.interestRateType === "custom" ? "default" : "outline"}
                    onClick={() => handleInputChange("interestRateType", "custom")}
                    className="h-auto p-4 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fas fa-cog text-primary"></i>
                      <span className="font-medium">{t.customInterest || "Custom Interest"}</span>
                    </div>
                    <p className="text-xs text-left opacity-80">
                      {t.customInterestDesc || "Set your own compound interest rate"}
                    </p>
                  </Button>
                </div>
              </div>

              {formData.interestRateType === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="text-sm font-medium">
                    {t.interestRate || "Interest Rate (%)"}
                  </Label>
                  <Input
                    id="interestRate"
                    type="number"
                    placeholder="10"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange("interestRate", e.target.value)}
                    className="bg-input border-border"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {t.compoundInterestNote || "Interest will be compounded daily on the updated balance"}
                  </p>
                </div>
              )}

              {formData.interestRateType === "low" && (
                <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-info-circle text-accent"></i>
                    <span className="font-medium text-sm">{t.lowInterestInfo || "Low Interest Mode"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t.lowInterestExplanation ||
                      "Daily earnings will be randomly selected between 7-10% of your initial capital amount."}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="riskPerTrade" className="text-sm font-medium">
                    {t.riskPerTrade} <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="riskPerTrade"
                    type="number"
                    placeholder="2"
                    value={formData.riskPerTrade}
                    onChange={(e) => handleInputChange("riskPerTrade", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="winRate" className="text-sm font-medium">
                    {t.winRate} <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="winRate"
                    type="number"
                    placeholder="60"
                    value={formData.winRate}
                    onChange={(e) => handleInputChange("winRate", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskRewardRatio" className="text-sm font-medium">
                  {t.riskRewardRatio} <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Select
                  value={formData.riskRewardRatio}
                  onValueChange={(value) => handleInputChange("riskRewardRatio", value)}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder={t.selectRatio} />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-primary/30">
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="1:1.5">1:1.5</SelectItem>
                    <SelectItem value="1:2">1:2</SelectItem>
                    <SelectItem value="1:2.5">1:2.5</SelectItem>
                    <SelectItem value="1:3">1:3</SelectItem>
                    <SelectItem value="1:4">1:4</SelectItem>
                    <SelectItem value="1:5">1:5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Advanced Options */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Stop Loss Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">{t.enableStopLoss}</Label>
                    <p className="text-xs text-muted-foreground">{t.addStopLossCalculations}</p>
                  </div>
                  <Switch
                    checked={formData.useStopLoss}
                    onCheckedChange={(checked) => handleInputChange("useStopLoss", checked)}
                  />
                </div>

                {formData.useStopLoss && (
                  <div className="pl-4 border-l-2 border-primary/30 space-y-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={formData.stopLossType === "percentage" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("stopLossType", "percentage")}
                        className="flex-1"
                      >
                        {t.percentage}
                      </Button>
                      <Button
                        type="button"
                        variant={formData.stopLossType === "fixed" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("stopLossType", "fixed")}
                        className="flex-1"
                      >
                        {t.fixedAmount}
                      </Button>
                    </div>
                    <Input
                      placeholder={formData.stopLossType === "percentage" ? "2.5" : "100"}
                      value={formData.stopLossValue}
                      onChange={(e) => handleInputChange("stopLossValue", e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Daily Trades Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">{t.limitDailyTrades}</Label>
                    <p className="text-xs text-muted-foreground">{t.setMaximumTrades}</p>
                  </div>
                  <Switch
                    checked={formData.useDailyTrades}
                    onCheckedChange={(checked) => handleInputChange("useDailyTrades", checked)}
                  />
                </div>

                {formData.useDailyTrades && (
                  <div className="pl-4 border-l-2 border-accent/30">
                    <Input
                      placeholder="5"
                      value={formData.dailyTradesCount}
                      onChange={(e) => handleInputChange("dailyTradesCount", e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Time Period */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">{t.includesAllDays || "Includes All Days"}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t.includeWeekendsInCalculation || "Include weekends in trading calculations"}
                    </p>
                  </div>
                  <Switch
                    checked={formData.includesAllDays}
                    onCheckedChange={(checked) => handleInputChange("includesAllDays", checked)}
                  />
                </div>

                {!formData.includesAllDays && (
                  <div className="pl-4 border-l-2 border-primary/30 space-y-3">
                    <Label className="text-sm font-medium">{t.selectTradingDays || "Select Trading Days"}</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { key: "monday", label: t.monday || "Monday" },
                        { key: "tuesday", label: t.tuesday || "Tuesday" },
                        { key: "wednesday", label: t.wednesday || "Wednesday" },
                        { key: "thursday", label: t.thursday || "Thursday" },
                        { key: "friday", label: t.friday || "Friday" },
                        { key: "saturday", label: t.saturday || "Saturday" },
                        { key: "sunday", label: t.sunday || "Sunday" },
                      ].map((day) => (
                        <Button
                          key={day.key}
                          type="button"
                          variant={formData.selectedWeekdays.includes(day.key) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleWeekdayToggle(day.key)}
                          className="text-xs"
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Date Input Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t.dateInputType || "Date Input Type"}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={formData.dateInputType === "manual" ? "default" : "outline"}
                    onClick={() => handleInputChange("dateInputType", "manual")}
                    className="h-auto p-4 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fas fa-keyboard text-primary"></i>
                      <span className="font-medium">{t.manualDate || "Manual Date"}</span>
                    </div>
                    <p className="text-xs text-left opacity-80">{t.manualDateDesc || "Minimum one field required"}</p>
                  </Button>

                  <Button
                    type="button"
                    variant={formData.dateInputType === "calendar" ? "default" : "outline"}
                    onClick={() => handleInputChange("dateInputType", "calendar")}
                    className="h-auto p-4 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fas fa-calendar text-accent"></i>
                      <span className="font-medium">{t.calendarDate || "Calendar Date"}</span>
                    </div>
                    <p className="text-xs text-left opacity-80">
                      {t.calendarDateDesc || "Select start and end dates using calendar picker"}
                    </p>
                  </Button>
                </div>
              </div>

              {formData.dateInputType === "manual" ? (
                <div className="space-y-4">
                  <Label className="text-sm font-medium">{t.manualDateInput || "Manual Date Input"}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="manualYear" className="text-xs text-muted-foreground">
                        {t.year || "Year"} <span className="text-xs">(Optional)</span>
                      </Label>
                      <Input
                        id="manualYear"
                        type="number"
                        placeholder="2024"
                        value={formData.manualYear}
                        onChange={(e) => handleInputChange("manualYear", e.target.value)}
                        className="bg-input border-border"
                        min="1900"
                        max="2100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manualMonth" className="text-xs text-muted-foreground">
                        {t.month || "Month"} <span className="text-xs">(Optional)</span>
                      </Label>
                      <Select
                        value={formData.manualMonth}
                        onValueChange={(value) => handleInputChange("manualMonth", value)}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder={t.selectMonth || "Select Month"} />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-primary/30">
                          <SelectItem value="1">{t.january || "January"}</SelectItem>
                          <SelectItem value="2">{t.february || "February"}</SelectItem>
                          <SelectItem value="3">{t.march || "March"}</SelectItem>
                          <SelectItem value="4">{t.april || "April"}</SelectItem>
                          <SelectItem value="5">{t.may || "May"}</SelectItem>
                          <SelectItem value="6">{t.june || "June"}</SelectItem>
                          <SelectItem value="7">{t.july || "July"}</SelectItem>
                          <SelectItem value="8">{t.august || "August"}</SelectItem>
                          <SelectItem value="9">{t.september || "September"}</SelectItem>
                          <SelectItem value="10">{t.october || "October"}</SelectItem>
                          <SelectItem value="11">{t.november || "November"}</SelectItem>
                          <SelectItem value="12">{t.december || "December"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manualDay" className="text-xs text-muted-foreground">
                        {t.day || "Day"} <span className="text-xs">(Optional)</span>
                      </Label>
                      <Input
                        id="manualDay"
                        type="number"
                        placeholder="15"
                        value={formData.manualDay}
                        onChange={(e) => handleInputChange("manualDay", e.target.value)}
                        className="bg-input border-border"
                        min="1"
                        max="31"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fas fa-info-circle text-primary text-sm"></i>
                      <span className="font-medium text-sm">{t.manualDateInfo || "Manual Date Info"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.manualDateExplanation ||
                        "Fill at least one field. You can specify year only, month only, day only, or any combination."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium">
                      {t.startDate}
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      {t.endDate}
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-border hover:border-primary/50 bg-transparent"
            >
              <i className="fas fa-chevron-left mr-2"></i>
              {t.previous}
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
              >
                <i className="fas fa-redo mr-2"></i>
                {t.reset}
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="bg-primary hover:bg-primary/90 neon-glow"
                >
                  {t.next}
                  <i className="fas fa-chevron-right ml-2"></i>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground neon-glow"
                >
                  <i className="fas fa-calculator mr-2"></i>
                  {t.calculate}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
