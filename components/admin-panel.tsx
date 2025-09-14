"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { firebaseUtils } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

interface AdminPanelProps {
  currentLanguage: string
}

export default function AdminPanel({ currentLanguage }: AdminPanelProps) {
  const [users, setUsers] = useState<any>({})
  const [keys, setKeys] = useState<any>({})
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    totalKeys: 0,
    usedKeys: 0,
    expiredKeys: 0,
  })
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [newKeyData, setNewKeyData] = useState({
    type: "one-time" as "one-time" | "unlimited",
    expiryDate: "",
    keyMode: "random" as "random" | "custom",
    customKey: "",
  })
  const [generatedKey, setGeneratedKey] = useState("")
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    action: () => void
  }>({
    open: false,
    title: "",
    description: "",
    action: () => {},
  })

  const { toast } = useToast()

  useEffect(() => {
    loadData()

    const unsubscribeUsers = firebaseUtils.onUsersChange((userData) => {
      setUsers(userData)
      updateStats(userData, keys)
    })

    const unsubscribeKeys = firebaseUtils.onKeysChange((keyData) => {
      setKeys(keyData)
      updateStats(users, keyData)
    })

    return () => {
      unsubscribeUsers()
      unsubscribeKeys()
    }
  }, [])

  const loadData = async () => {
    try {
      console.log("[v0] Loading admin data via API...")
      const response = await fetch("/api/admin/users", {
        headers: {
          "admin-password": "TMXCALCU",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch admin data")
      }

      const { users: userData, keys: keyData } = await response.json()

      console.log("[v0] Loaded users:", userData)
      console.log("[v0] Loaded keys:", keyData)

      setUsers(userData)
      setKeys(keyData)
      updateStats(userData, keyData)
    } catch (error) {
      console.log("[v0] Error loading admin data:", error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
    }
  }

  const updateStats = (userData: any, keyData: any) => {
    const userArray = Object.values(userData || {}) as any[]
    const keyArray = Object.entries(keyData || {}) as any[]

    const now = new Date()

    setStats({
      totalUsers: userArray.length,
      activeUsers: userArray.filter((user) => !user.banned).length,
      bannedUsers: userArray.filter((user) => user.banned).length,
      totalKeys: keyArray.length,
      usedKeys: keyArray.filter(([_, key]) => key.used).length,
      expiredKeys: keyArray.filter(([_, key]) => key.expiryDate && new Date(key.expiryDate) < now).length,
    })
  }

  const generateKey = async () => {
    console.log("[v0] Starting key generation via API...")
    setIsGeneratingKey(true)
    try {
      if (newKeyData.keyMode === "custom") {
        if (!newKeyData.customKey.trim()) {
          toast({
            title: "Error",
            description: "Please enter a custom key",
            variant: "destructive",
          })
          setIsGeneratingKey(false)
          return
        }

        if (newKeyData.customKey.length < 4) {
          toast({
            title: "Error",
            description: "Custom key must be at least 4 characters long",
            variant: "destructive",
          })
          setIsGeneratingKey(false)
          return
        }
      }

      console.log("[v0] Generating key with data:", newKeyData)

      const response = await fetch("/api/admin/generate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminPassword: "TMXCALCU",
          type: newKeyData.type,
          expiryDate: newKeyData.expiryDate || undefined,
          keyMode: newKeyData.keyMode,
          customKey: newKeyData.customKey.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate key")
      }

      const { key } = await response.json()
      console.log("[v0] Generated key:", key)

      setGeneratedKey(key)
      setNewKeyData({ type: "one-time", expiryDate: "", keyMode: "random", customKey: "" })
      toast({
        title: "Success",
        description: "Activation key generated successfully",
      })
      loadData()
    } catch (error: any) {
      console.log("[v0] Error generating key:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate key",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingKey(false)
    }
  }

  const banUser = async (username: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminPassword: "TMXCALCU",
          action: "ban",
          username,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to ban user")
      }

      toast({
        title: "Success",
        description: `User ${username} has been banned`,
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      })
    }
  }

  const unbanUser = async (username: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminPassword: "TMXCALCU",
          action: "unban",
          username,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to unban user")
      }

      toast({
        title: "Success",
        description: `User ${username} has been unbanned`,
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unban user",
        variant: "destructive",
      })
    }
  }

  const deleteUser = async (username: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminPassword: "TMXCALCU",
          action: "delete",
          username,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      toast({
        title: "Success",
        description: `User ${username} has been deleted`,
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const deleteKey = async (key: string) => {
    try {
      const response = await fetch("/api/admin/keys", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminPassword: "TMXCALCU",
          key,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete key")
      }

      toast({
        title: "Success",
        description: "Activation key has been deleted",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete key",
        variant: "destructive",
      })
    }
  }

  const openConfirmDialog = (title: string, description: string, action: () => void) => {
    setConfirmDialog({
      open: true,
      title,
      description,
      action,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="glass-card border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold font-mono text-primary">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <i className="fas fa-users text-primary"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-accent/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold font-mono text-accent">{stats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <i className="fas fa-user-check text-accent"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-destructive/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Banned Users</p>
                <p className="text-2xl font-bold font-mono text-destructive">{stats.bannedUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <i className="fas fa-user-slash text-destructive"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Keys</p>
                <p className="text-2xl font-bold font-mono text-foreground">{stats.totalKeys}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <i className="fas fa-key text-muted-foreground"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Used Keys</p>
                <p className="text-2xl font-bold font-mono text-foreground">{stats.usedKeys}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <i className="fas fa-key text-muted-foreground"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired Keys</p>
                <p className="text-2xl font-bold font-mono text-foreground">{stats.expiredKeys}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <i className="fas fa-clock text-muted-foreground"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <Tabs defaultValue="keys" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger
                value="keys"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <i className="fas fa-key mr-2"></i>
                Key MNG
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <i className="fas fa-users mr-2"></i>
                User MNG
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="keys" className="space-y-4">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Generate New Key</CardTitle>
                  <CardDescription>Create activation keys for new users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Key Generation Mode</Label>
                    <Select
                      value={newKeyData.keyMode}
                      onValueChange={(value: "random" | "custom") =>
                        setNewKeyData((prev) => ({ ...prev, keyMode: value, customKey: "" }))
                      }
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">
                          <div className="flex items-center gap-2">
                            <i className="fas fa-dice text-primary"></i>
                            Random Key
                          </div>
                        </SelectItem>
                        <SelectItem value="custom">
                          <div className="flex items-center gap-2">
                            <i className="fas fa-edit text-accent"></i>
                            Custom Key
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newKeyData.keyMode === "custom" && (
                    <div className="space-y-2">
                      <Label>Custom Key</Label>
                      <Input
                        type="text"
                        value={newKeyData.customKey}
                        onChange={(e) => setNewKeyData((prev) => ({ ...prev, customKey: e.target.value }))}
                        className="bg-input font-mono"
                        placeholder="Enter your custom activation key"
                        maxLength={50}
                      />
                      <p className="text-xs text-muted-foreground">Key must be at least 4 characters long and unique</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Key Type</Label>
                      <Select
                        value={newKeyData.type}
                        onValueChange={(value: "one-time" | "unlimited") =>
                          setNewKeyData((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger className="bg-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time Use</SelectItem>
                          <SelectItem value="unlimited">Unlimited Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Expiry Date (Optional)</Label>
                      <Input
                        type="date"
                        value={newKeyData.expiryDate}
                        onChange={(e) => setNewKeyData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                        className="bg-input"
                      />
                    </div>
                  </div>

                  <Button onClick={generateKey} disabled={isGeneratingKey} className="bg-accent hover:bg-accent/90">
                    {isGeneratingKey ? (
                      <>
                        <i className="fas fa-spinner animate-spin mr-2"></i>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className={`fas ${newKeyData.keyMode === "random" ? "fa-dice" : "fa-plus"} mr-2`}></i>
                        {newKeyData.keyMode === "random" ? "Generate Random Key" : "Create Custom Key"}
                      </>
                    )}
                  </Button>

                  {generatedKey && (
                    <Alert className="border-accent/30 bg-accent/10">
                      <i className="fas fa-key w-4 h-4"></i>
                      <AlertDescription>
                        <div className="space-y-2">
                          <p>New activation key generated:</p>
                          <div className="flex items-center gap-2">
                            <code className="bg-background px-2 py-1 rounded font-mono text-sm">{generatedKey}</code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(generatedKey)}
                            >
                              <i className="fas fa-copy"></i>
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activation Keys</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Key</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Used By</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(keys).map(([key, data]: [string, any]) => (
                          <TableRow key={key}>
                            <TableCell className="font-mono text-sm">{key.substring(0, 12)}...</TableCell>
                            <TableCell>
                              <Badge variant={data.type === "unlimited" ? "default" : "secondary"}>{data.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  data.used
                                    ? "destructive"
                                    : data.expiryDate && new Date(data.expiryDate) < new Date()
                                      ? "destructive"
                                      : "default"
                                }
                              >
                                {data.used
                                  ? "Used"
                                  : data.expiryDate && new Date(data.expiryDate) < new Date()
                                    ? "Expired"
                                    : "Active"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{new Date(data.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-sm">
                              {data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : "Never"}
                            </TableCell>
                            <TableCell className="text-sm">{data.usedBy || "-"}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openConfirmDialog(
                                    "Delete Key",
                                    `Are you sure you want to delete this activation key?`,
                                    () => deleteKey(key),
                                  )
                                }
                                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Activation Key</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(users).map(([username, data]: [string, any]) => (
                          <TableRow key={username}>
                            <TableCell className="font-medium">{username}</TableCell>
                            <TableCell>
                              <Badge variant={data.banned ? "destructive" : "default"}>
                                {data.banned ? "Banned" : "Active"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {data.activationKey?.substring(0, 12)}...
                            </TableCell>
                            <TableCell className="text-sm">
                              {data.lastLogin ? new Date(data.lastLogin).toLocaleDateString() : "Never"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {data.banned ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      openConfirmDialog(
                                        "Unban User",
                                        `Are you sure you want to unban ${username}?`,
                                        () => unbanUser(username),
                                      )
                                    }
                                    className="border-accent/30 text-accent hover:bg-accent/10"
                                  >
                                    <i className="fas fa-user-check"></i>
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      openConfirmDialog("Ban User", `Are you sure you want to ban ${username}?`, () =>
                                        banUser(username),
                                      )
                                    }
                                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                                  >
                                    <i className="fas fa-ban"></i>
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    openConfirmDialog(
                                      "Delete User",
                                      `Are you sure you want to permanently delete ${username}? This action cannot be undone.`,
                                      () => deleteUser(username),
                                    )
                                  }
                                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                confirmDialog.action()
                setConfirmDialog((prev) => ({ ...prev, open: false }))
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
