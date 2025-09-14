"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { Trash2, Download } from "lucide-react"

interface PLSheetProps {
  onBack: () => void
  prePopulatedData?: {
    currency: string
    currencySymbol: string
    entries: PLEntry[]
    totalDays: number
    isFromResults: boolean
  }
  sheetType?: "binary" | "forex" // Added sheetType prop to distinguish between binary and forex sheets
}

interface PLEntry {
  date: string
  profit: number
  loss: number
  total: number
  isWeekend?: boolean
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "₣", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "LKR", symbol: "₨", name: "Sri Lankan Rupee" },
  { code: "NPR", symbol: "₨", name: "Nepalese Rupee" },
  { code: "AFN", symbol: "؋", name: "Afghan Afghani" },
  { code: "ALL", symbol: "L", name: "Albanian Lek" },
  { code: "DZD", symbol: "د.ج", name: "Algerian Dinar" },
  { code: "AOA", symbol: "Kz", name: "Angolan Kwanza" },
  { code: "ARS", symbol: "$", name: "Argentine Peso" },
  { code: "AMD", symbol: "֏", name: "Armenian Dram" },
  { code: "AWG", symbol: "ƒ", name: "Aruban Florin" },
  { code: "AZN", symbol: "₼", name: "Azerbaijani Manat" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
  { code: "BBD", symbol: "$", name: "Barbadian Dollar" },
  { code: "BYN", symbol: "Br", name: "Belarusian Ruble" },
  { code: "BZD", symbol: "$", name: "Belize Dollar" },
  { code: "BMD", symbol: "$", name: "Bermudian Dollar" },
  { code: "BTN", symbol: "Nu.", name: "Bhutanese Ngultrum" },
  { code: "BOB", symbol: "Bs.", name: "Bolivian Boliviano" },
  { code: "BAM", symbol: "КМ", name: "Bosnia-Herzegovina Convertible Mark" },
  { code: "BWP", symbol: "P", name: "Botswanan Pula" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { code: "BIF", symbol: "Fr", name: "Burundian Franc" },
  { code: "KHR", symbol: "៛", name: "Cambodian Riel" },
  { code: "XAF", symbol: "Fr", name: "Central African CFA Franc" },
  { code: "XPF", symbol: "Fr", name: "CFP Franc" },
  { code: "CLP", symbol: "$", name: "Chilean Peso" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "KMF", symbol: "Fr", name: "Comorian Franc" },
  { code: "CDF", symbol: "Fr", name: "Congolese Franc" },
  { code: "CRC", symbol: "₡", name: "Costa Rican Colón" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna" },
  { code: "CUP", symbol: "$", name: "Cuban Peso" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "DJF", symbol: "Fr", name: "Djiboutian Franc" },
  { code: "DOP", symbol: "$", name: "Dominican Peso" },
  { code: "XCD", symbol: "$", name: "East Caribbean Dollar" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound" },
  { code: "ERN", symbol: "Nfk", name: "Eritrean Nakfa" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  { code: "FJD", symbol: "$", name: "Fijian Dollar" },
  { code: "GMD", symbol: "D", name: "Gambian Dalasi" },
  { code: "GEL", symbol: "₾", name: "Georgian Lari" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "GIP", symbol: "£", name: "Gibraltar Pound" },
  { code: "GTQ", symbol: "Q", name: "Guatemalan Quetzal" },
  { code: "GNF", symbol: "Fr", name: "Guinean Franc" },
  { code: "GYD", symbol: "$", name: "Guyanaese Dollar" },
  { code: "HTG", symbol: "G", name: "Haitian Gourde" },
  { code: "HNL", symbol: "L", name: "Honduran Lempira" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "ISK", symbol: "kr", name: "Icelandic Króna" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "IRR", symbol: "﷼", name: "Iranian Rial" },
  { code: "IQD", symbol: "ع.د", name: "Iraqi Dinar" },
  { code: "ILS", symbol: "₪", name: "Israeli New Sheqel" },
  { code: "JMD", symbol: "$", name: "Jamaican Dollar" },
  { code: "JOD", symbol: "د.ا", name: "Jordanian Dinar" },
  { code: "KZT", symbol: "₸", name: "Kazakhstani Tenge" },
  { code: "KES", symbol: "Sh", name: "Kenyan Shilling" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar" },
  { code: "KGS", symbol: "с", name: "Kyrgystani Som" },
  { code: "LAK", symbol: "₭", name: "Laotian Kip" },
  { code: "LBP", symbol: "ل.ل", name: "Lebanese Pound" },
  { code: "LSL", symbol: "L", name: "Lesotho Loti" },
  { code: "LRD", symbol: "$", name: "Liberian Dollar" },
  { code: "LYD", symbol: "ل.د", name: "Libyan Dinar" },
  { code: "MOP", symbol: "P", name: "Macanese Pataca" },
  { code: "MKD", symbol: "ден", name: "Macedonian Denar" },
  { code: "MGA", symbol: "Ar", name: "Malagasy Ariary" },
  { code: "MWK", symbol: "MK", name: "Malawian Kwacha" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "MVR", symbol: ".ރ", name: "Maldivian Rufiyaa" },
  { code: "MRU", symbol: "UM", name: "Mauritanian Ouguiya" },
  { code: "MUR", symbol: "₨", name: "Mauritian Rupee" },
  { code: "MDL", symbol: "L", name: "Moldovan Leu" },
  { code: "MNT", symbol: "₮", name: "Mongolian Tugrik" },
  { code: "MAD", symbol: "د.م.", name: "Moroccan Dirham" },
  { code: "MZN", symbol: "MT", name: "Mozambican Metical" },
  { code: "MMK", symbol: "Ks", name: "Myanmar Kyat" },
  { code: "NAD", symbol: "$", name: "Namibian Dollar" },
  { code: "NIO", symbol: "C$", name: "Nicaraguan Córdoba" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "OMR", symbol: "ر.ع.", name: "Omani Rial" },
  { code: "PEN", symbol: "S/", name: "Peruvian Nuevo Sol" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "QAR", symbol: "ر.ق", name: "Qatari Rial" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "RWF", symbol: "Fr", name: "Rwandan Franc" },
  { code: "SAR", symbol: "ر.س", name: "Saudi Riyal" },
  { code: "RSD", symbol: "дин.", name: "Serbian Dinar" },
  { code: "SCR", symbol: "₨", name: "Seychellois Rupee" },
  { code: "SLL", symbol: "Le", name: "Sierra Leonean Leone" },
  { code: "SOS", symbol: "Sh", name: "Somali Shilling" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee" },
  { code: "SRD", symbol: "$", name: "Surinamese Dollar" },
  { code: "SZL", symbol: "L", name: "Swazi Lilangeni" },
  { code: "TJS", symbol: "ЅМ", name: "Tajikistani Somoni" },
  { code: "TZS", symbol: "Sh", name: "Tanzanian Shilling" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "TOP", symbol: "T$", name: "Tongan Paʻanga" },
  { code: "TTD", symbol: "$", name: "Trinidad & Tobago Dollar" },
  { code: "TND", symbol: "د.ت", name: "Tunisian Dinar" },
  { code: "TMT", symbol: "m", name: "Turkmenistani Manat" },
  { code: "UGX", symbol: "Sh", name: "Ugandan Shilling" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
  { code: "AED", symbol: "د.إ", name: "United Arab Emirates Dirham" },
  { code: "UYU", symbol: "$", name: "Uruguayan Peso" },
  { code: "UZS", symbol: "so'm", name: "Uzbekistan Som" },
  { code: "VUV", symbol: "Vt", name: "Vanuatu Vatu" },
  { code: "VES", symbol: "Bs.S", name: "Venezuelan Bolívar" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "XOF", symbol: "Fr", name: "West African CFA Franc" },
  { code: "YER", symbol: "﷼", name: "Yemeni Rial" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  { code: "ZWL", symbol: "$", name: "Zimbabwean Dollar" },
]

const weekDays = [
  { id: "sunday", label: "Sunday", short: "Sun" },
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
]

export default function PLSheet({ onBack, prePopulatedData, sheetType = "binary" }: PLSheetProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("")
  const [durationType, setDurationType] = useState("ymd")
  const [years, setYears] = useState("")
  const [months, setMonths] = useState("")
  const [days, setDays] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [includeAllDays, setIncludeAllDays] = useState("yes")
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ])
  const [plEntries, setPLEntries] = useState<PLEntry[]>([])
  const [showSheet, setShowSheet] = useState(false)
  const [showResultsAlert, setShowResultsAlert] = useState(false)

  useEffect(() => {
    if (prePopulatedData) {
      // Pre-populate with results data
      setSelectedCurrency(prePopulatedData.currency)
      setPLEntries(
        prePopulatedData.entries.map((entry, index) => {
          let runningTotal = 0
          for (let i = 0; i <= index; i++) {
            runningTotal += prePopulatedData.entries[i].profit - prePopulatedData.entries[i].loss
          }
          return {
            ...entry,
            total: runningTotal,
          }
        }),
      )
      setShowSheet(true)

      // Show popup if created from results
      if (prePopulatedData.isFromResults) {
        setShowResultsAlert(true)
      }
    } else {
      const storageKey = sheetType === "forex" ? "forexPLSheetData" : "binaryPLSheetData"
      const savedPLSheet = localStorage.getItem(storageKey)
      if (savedPLSheet) {
        try {
          const parsedData = JSON.parse(savedPLSheet)
          setSelectedCurrency(parsedData.selectedCurrency || "")
          setDurationType(parsedData.durationType || "ymd")
          setYears(parsedData.years || "")
          setMonths(parsedData.months || "")
          setDays(parsedData.days || "")
          setStartDate(parsedData.startDate || "")
          setEndDate(parsedData.endDate || "")
          setIncludeAllDays(parsedData.includeAllDays || "yes")
          setSelectedWeekDays(parsedData.selectedWeekDays || ["monday", "tuesday", "wednesday", "thursday", "friday"])
          setPLEntries(parsedData.plEntries || [])
          setShowSheet(parsedData.showSheet || false)
        } catch (error) {
          console.error("Error loading P/L Sheet data:", error)
        }
      }
    }
  }, [prePopulatedData, sheetType])

  useEffect(() => {
    if (showSheet) {
      savePLSheetData()
    }
  }, [
    selectedCurrency,
    durationType,
    years,
    months,
    days,
    startDate,
    endDate,
    includeAllDays,
    selectedWeekDays,
    plEntries,
    showSheet,
  ])

  const getCurrencySymbol = () => {
    const currency = currencies.find((c) => c.code === selectedCurrency)
    return currency?.symbol || "$"
  }

  const generateDateRange = () => {
    const entries: PLEntry[] = []
    let currentDate = new Date()
    let endDateCalc = new Date()

    if (durationType === "ymd") {
      const totalDays =
        (Number.parseInt(years) || 0) * 365 + (Number.parseInt(months) || 0) * 30 + (Number.parseInt(days) || 0)
      endDateCalc.setDate(currentDate.getDate() + totalDays)
    } else {
      if (startDate && endDate) {
        currentDate = new Date(startDate)
        endDateCalc = new Date(endDate)
      }
    }

    while (currentDate <= endDateCalc) {
      const dayOfWeek = currentDate.getDay()
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const dayName = dayNames[dayOfWeek]

      let isIncluded = true
      if (includeAllDays === "no") {
        isIncluded = selectedWeekDays.includes(dayName)
      }

      entries.push({
        date: format(currentDate, "MMM dd, yyyy (EEE)"),
        profit: 0,
        loss: 0,
        total: 0,
        isWeekend: !isIncluded,
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return entries
  }

  const savePLSheetData = () => {
    const dataToSave = {
      selectedCurrency,
      durationType,
      years,
      months,
      days,
      startDate,
      endDate,
      includeAllDays,
      selectedWeekDays,
      plEntries,
      showSheet,
    }
    const storageKey = sheetType === "forex" ? "forexPLSheetData" : "binaryPLSheetData"
    localStorage.setItem(storageKey, JSON.stringify(dataToSave))
  }

  const handleCreateSheet = () => {
    if (!selectedCurrency) return
    if (durationType === "ymd" && !years && !months && !days) return
    if (durationType === "dtod" && (!startDate || !endDate)) return

    const entries = generateDateRange()
    setPLEntries(entries)
    setShowSheet(true)
  }

  const updateEntry = (index: number, field: "profit" | "loss", value: number) => {
    // If from results, only allow editing losses
    if (prePopulatedData?.isFromResults && field === "profit") {
      return
    }

    const updatedEntries = [...plEntries]
    updatedEntries[index][field] = value

    let runningTotal = 0
    updatedEntries.forEach((entry, i) => {
      if (i <= index) {
        runningTotal += entry.profit - entry.loss
      }
      if (i === index) {
        entry.total = runningTotal
      }
    })

    for (let i = index + 1; i < updatedEntries.length; i++) {
      runningTotal += updatedEntries[i].profit - updatedEntries[i].loss
      updatedEntries[i].total = runningTotal
    }

    setPLEntries(updatedEntries)
  }

  const calculateTotals = () => {
    const totalProfit = plEntries.reduce((sum, entry) => sum + entry.profit, 0)
    const totalLoss = plEntries.reduce((sum, entry) => sum + entry.loss, 0)
    const netTotal = totalProfit - totalLoss
    return { totalProfit, totalLoss, netTotal }
  }

  const handleDeleteSheet = () => {
    setSelectedCurrency("")
    setDurationType("ymd")
    setYears("")
    setMonths("")
    setDays("")
    setStartDate("")
    setEndDate("")
    setIncludeAllDays("yes")
    setSelectedWeekDays(["monday", "tuesday", "wednesday", "thursday", "friday"])
    setPLEntries([])
    setShowSheet(false)
    const storageKey = sheetType === "forex" ? "forexPLSheetData" : "binaryPLSheetData"
    localStorage.removeItem(storageKey)
  }

  const handleWeekDayChange = (dayId: string, checked: boolean) => {
    if (checked) {
      setSelectedWeekDays([...selectedWeekDays, dayId])
    } else {
      setSelectedWeekDays(selectedWeekDays.filter((id) => id !== dayId))
    }
  }

  const handleDownloadPDF = () => {
    const { totalProfit, totalLoss, netTotal } = calculateTotals()
    const currencySymbol = getCurrencySymbol()

    // Create PDF content
    let pdfContent = `P/L Sheet Report\n\n`
    pdfContent += `Currency: ${selectedCurrency} (${currencySymbol})\n`
    pdfContent += `Generated: ${format(new Date(), "PPP")}\n\n`

    pdfContent += `Summary:\n`
    pdfContent += `Total Profit: ${currencySymbol}${totalProfit.toFixed(2)}\n`
    pdfContent += `Total Loss: ${currencySymbol}${totalLoss.toFixed(2)}\n`
    pdfContent += `Net Total: ${currencySymbol}${netTotal.toFixed(2)}\n\n`

    pdfContent += `Detailed Entries:\n`
    pdfContent += `Date\t\t\tProfit\t\tLoss\t\tTotal\n`
    pdfContent += `${"=".repeat(60)}\n`

    plEntries.forEach((entry) => {
      pdfContent += `${entry.date}\t${currencySymbol}${entry.profit.toFixed(2)}\t\t${currencySymbol}${entry.loss.toFixed(2)}\t\t${currencySymbol}${entry.total.toFixed(2)}\n`
    })

    // Create and download the file
    const blob = new Blob([pdfContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `PL-Sheet-${format(new Date(), "yyyy-MM-dd")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  if (showSheet) {
    const { totalProfit, totalLoss, netTotal } = calculateTotals()

    return (
      <div className="space-y-6">
        {showResultsAlert && (
          <AlertDialog open={showResultsAlert} onOpenChange={setShowResultsAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sheet Created from Results</AlertDialogTitle>
                <AlertDialogDescription>
                  You're Sheet, Set On Your Results Just You Can Edit The Loss, Everything Is Already Seteed
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowResultsAlert(false)}>Got it</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">{sheetType === "forex" ? "Forex" : "Binary"} P/L Sheet</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{sheetType === "forex" ? "Forex" : "Binary"} Profit & Loss Tracking Sheet</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete P/L Sheet</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this {sheetType === "forex" ? "Forex" : "Binary"} P/L sheet?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSheet}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* ... existing table and content code ... */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Loss</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plEntries.map((entry, index) => (
                    <TableRow key={index} className={entry.isWeekend ? "opacity-50 bg-muted/20" : ""}>
                      <TableCell className="font-medium">{entry.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">{getCurrencySymbol()}</span>
                          <Input
                            type="number"
                            value={entry.profit === 0 ? "" : entry.profit}
                            onChange={(e) => updateEntry(index, "profit", Number.parseFloat(e.target.value) || 0)}
                            className="w-24"
                            disabled={entry.isWeekend || prePopulatedData?.isFromResults}
                            min="0"
                            step="0.01"
                            placeholder="0"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">-</span>
                          <Input
                            type="number"
                            value={entry.loss === 0 ? "" : entry.loss}
                            onChange={(e) => updateEntry(index, "loss", Number.parseFloat(e.target.value) || 0)}
                            className="w-24 border-red-200 focus:border-red-400"
                            disabled={entry.isWeekend}
                            min="0"
                            step="0.01"
                            placeholder="0"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-mono font-bold ${entry.total >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {getCurrencySymbol()}
                          {entry.total.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>
                  Profit = {getCurrencySymbol()}
                  {totalProfit.toFixed(2)}
                </span>
                <span className="text-red-500">
                  Loss = {getCurrencySymbol()}
                  {totalLoss.toFixed(2)}
                </span>
                <span className={`${netTotal >= 0 ? "text-green-500" : "text-red-500"}`}>
                  Total: {getCurrencySymbol()}
                  {netTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {sheetType === "forex" ? "Forex" : "Binary"} P/L Sheet
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create {sheetType === "forex" ? "Forex" : "Binary"} Profit & Loss Sheet</CardTitle>
          <CardDescription>
            Set up your {sheetType === "forex" ? "Forex" : "Binary"} P/L tracking sheet with custom parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ... existing form content ... */}
          {/* Currency Selection */}
          <div className="space-y-2">
            <Label htmlFor="currency">Select Currency *</Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Choose currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selection */}
          <div className="space-y-4">
            <Label>Duration *</Label>
            <RadioGroup value={durationType} onValueChange={setDurationType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ymd" id="ymd" />
                <Label htmlFor="ymd">Years / Month / Day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dtod" id="dtod" />
                <Label htmlFor="dtod">Start To End</Label>
              </div>
            </RadioGroup>

            {durationType === "ymd" && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="years">Years</Label>
                  <Input
                    id="years"
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="months">Months</Label>
                  <Input
                    id="months"
                    type="number"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    placeholder="0"
                    min="0"
                    max="12"
                  />
                </div>
                <div>
                  <Label htmlFor="days">Days</Label>
                  <Input
                    id="days"
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="0"
                    min="0"
                    max="31"
                  />
                </div>
              </div>
            )}

            {durationType === "dtod" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-input border-border"
                    min={startDate}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Include All Days */}
          <div className="space-y-4">
            <Label>Includes All Days</Label>
            <RadioGroup value={includeAllDays} onValueChange={setIncludeAllDays}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>

            {includeAllDays === "no" && (
              <div className="space-y-2">
                <Label>Select Days to Include:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={selectedWeekDays.includes(day.id)}
                        onCheckedChange={(checked) => handleWeekDayChange(day.id, checked as boolean)}
                      />
                      <Label htmlFor={day.id}>{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleCreateSheet}
            className="w-full"
            disabled={
              !selectedCurrency ||
              (durationType === "ymd" && !years && !months && !days) ||
              (durationType === "dtod" && (!startDate || !endDate))
            }
          >
            Create Sheet
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
