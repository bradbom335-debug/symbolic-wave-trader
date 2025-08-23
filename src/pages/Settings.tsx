import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Bell, Shield, Palette, Zap, Brain, Key } from 'lucide-react';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  // Mock user profile data
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: user?.email || '',
    timezone: 'UTC-5',
    riskTolerance: 'moderate'
  });

  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    newsUpdates: true,
    portfolioChanges: true,
    marketAnalysis: false,
    weeklyReports: true
  });

  const [aiSettings, setAiSettings] = useState({
    autoAnalysis: true,
    aggressiveSignals: false,
    quantumMode: true,
    neuralLearning: true,
    riskAdjustment: 'medium'
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Save to Supabase
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Badge variant="outline" className="border-primary text-primary">
          Premium Account
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={profile.riskTolerance}
                    onChange={(e) => setProfile({ ...profile, riskTolerance: e.target.value })}
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications for {key.toLowerCase()}
                    </div>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [key]: checked })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI & Machine Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Auto Analysis</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically analyze new stocks in your watchlist
                  </div>
                </div>
                <Switch
                  checked={aiSettings.autoAnalysis}
                  onCheckedChange={(checked) =>
                    setAiSettings({ ...aiSettings, autoAnalysis: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Quantum Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Enable quantum-enhanced prediction algorithms
                  </div>
                </div>
                <Switch
                  checked={aiSettings.quantumMode}
                  onCheckedChange={(checked) =>
                    setAiSettings({ ...aiSettings, quantumMode: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Neural Learning</div>
                  <div className="text-sm text-muted-foreground">
                    Allow AI to learn from your trading patterns
                  </div>
                </div>
                <Switch
                  checked={aiSettings.neuralLearning}
                  onCheckedChange={(checked) =>
                    setAiSettings({ ...aiSettings, neuralLearning: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Aggressive Signals</div>
                  <div className="text-sm text-muted-foreground">
                    Show more aggressive trading signals
                  </div>
                </div>
                <Switch
                  checked={aiSettings.aggressiveSignals}
                  onCheckedChange={(checked) =>
                    setAiSettings({ ...aiSettings, aggressiveSignals: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">API Keys</div>
                    <div className="text-sm text-muted-foreground">Manage your API access keys</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Change Password</div>
                    <div className="text-sm text-muted-foreground">Update your account password</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Danger Zone</h3>
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-destructive">Sign Out</div>
                      <div className="text-sm text-muted-foreground">Sign out of your account</div>
                    </div>
                    <Button variant="destructive" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="p-4 border border-border rounded-lg cursor-pointer hover:border-primary">
                      <div className="w-full h-20 bg-gradient-neural rounded mb-2"></div>
                      <div className="text-center text-sm">Neural Dark</div>
                    </div>
                    <div className="p-4 border border-border rounded-lg cursor-pointer hover:border-primary">
                      <div className="w-full h-20 bg-gradient-wave rounded mb-2"></div>
                      <div className="text-center text-sm">Quantum Wave</div>
                    </div>
                    <div className="p-4 border border-border rounded-lg cursor-pointer hover:border-primary">
                      <div className="w-full h-20 bg-gradient-cognition rounded mb-2"></div>
                      <div className="text-center text-sm">Cognition</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Animation Effects</div>
                    <div className="text-sm text-muted-foreground">
                      Enable neural pulse and wave animations
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Reduced Motion</div>
                    <div className="text-sm text-muted-foreground">
                      Reduce motion for accessibility
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;