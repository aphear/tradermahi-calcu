"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, DollarSign } from "lucide-react"

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", symbol: "CHF" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿", symbol: "NZ$" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷", symbol: "₩" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰", symbol: "HK$" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴", symbol: "kr" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪", symbol: "kr" },
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
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩", symbol: "৳" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰", symbol: "₨" },
  { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰", symbol: "₨" },
  { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵", symbol: "₨" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦", symbol: "﷼" },
  { code: "QAR", name: "Qatari Riyal", flag: "🇶🇦", symbol: "﷼" },
  { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼", symbol: "د.ك" },
  { code: "BHD", name: "Bahraini Dinar", flag: "🇧🇭", symbol: ".د.ب" },
  { code: "OMR", name: "Omani Rial", flag: "🇴🇲", symbol: "﷼" },
  { code: "JOD", name: "Jordanian Dinar", flag: "🇯🇴", symbol: "د.ا" },
  { code: "LBP", name: "Lebanese Pound", flag: "🇱🇧", symbol: "ل.ل" },
  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬", symbol: "£" },
  { code: "ILS", name: "Israeli Shekel", flag: "🇮🇱", symbol: "₪" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬", symbol: "₦" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭", symbol: "₵" },
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪", symbol: "KSh" },
  { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬", symbol: "USh" },
  { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿", symbol: "TSh" },
  { code: "ETB", name: "Ethiopian Birr", flag: "🇪🇹", symbol: "Br" },
]

export default function FxMoneyManagerPage() {
  const router = useRouter()
  const [selectedCurrency, setSelectedCurrency] = useState<string>("")
  const [initialCapital, setInitialCapital] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedCurrencyData = currencies.find((c) => c.code === selectedCurrency)

  const handleNext = () => {
    if (selectedCurrency && initialCapital) {
      // Store data and navigate to next step
      localStorage.setItem(
        "fxManager",
        JSON.stringify({
          currency: selectedCurrency,
          initialCapital: Number.parseFloat(initialCapital),
        }),
      )
      router.push("/fx-money-manager/interest-type")
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1520] text-[#e6eef9]">
      {/* Header */}
      <header className="border-b border-[#2a7fff]/20 bg-[#131d2d]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-[#2a7fff]/30 hover:border-[#2a7fff]/50 bg-[#131d2d] text-[#e6eef9]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="w-10 h-10 rounded-lg bg-[#2a7fff]/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[#2a7fff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e6eef9] font-['Rajdhani']">FX Money Manager</h1>
              <p className="text-sm text-[#8fa3bf]">Step 1 of 7</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-[#131d2d] rounded-full h-2">
              <div
                className="bg-[#2a7fff] h-2 rounded-full transition-all duration-300"
                style={{ width: "14.3%" }}
              ></div>
            </div>
          </div>

          <Card className="bg-[#131d2d] border-[#2a7fff]/30 rounded-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-[#e6eef9] font-['Rajdhani'] mb-2">
                Select Trading Currency
              </CardTitle>
              <p className="text-[#8fa3bf] font-['Inter']">Choose your base currency and enter your initial capital</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8fa3bf]" />
                <Input
                  placeholder="Search currencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] placeholder-[#8fa3bf] font-['Inter']"
                />
              </div>

              {/* Currency Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
                {filteredCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => setSelectedCurrency(currency.code)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      selectedCurrency === currency.code
                        ? "border-[#2a7fff] bg-[#2a7fff]/10 shadow-lg shadow-[#2a7fff]/20"
                        : "border-[#2a7fff]/20 bg-[#0d1520] hover:border-[#2a7fff]/40"
                    }`}
                  >
                    <div className="text-xl mb-1">{currency.flag}</div>
                    <div className="text-xs font-bold text-[#e6eef9] font-['Rajdhani']">{currency.code}</div>
                    <div className="text-xs text-[#8fa3bf] font-['Inter'] truncate">{currency.name}</div>
                    <div className="text-xs text-[#2a7fff] font-['JetBrains_Mono'] mt-1">{currency.symbol}</div>
                  </button>
                ))}
              </div>

              {/* Initial Capital Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e6eef9] font-['Inter']">Initial Capital</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8fa3bf] font-['JetBrains_Mono']">
                    {selectedCurrencyData?.symbol || "$"}
                  </span>
                  <Input
                    type="number"
                    placeholder="Enter your initial capital"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(e.target.value)}
                    className="pl-12 bg-[#0d1520] border-[#2a7fff]/30 text-[#e6eef9] placeholder-[#8fa3bf] font-['JetBrains_Mono']"
                  />
                </div>
              </div>

              {/* Next Button */}
              <Button
                onClick={handleNext}
                disabled={!selectedCurrency || !initialCapital}
                className="w-full bg-[#2a7fff] hover:bg-[#2a7fff]/80 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-['Rajdhani']"
              >
                Next Step
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
