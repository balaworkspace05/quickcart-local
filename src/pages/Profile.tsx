import { motion } from 'framer-motion';
import { User, MapPin, Phone, Mail, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import CreditBadge from '@/components/revenue/CreditBadge';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Profile Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-6 mb-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-primary to-secondary text-white">
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {user?.email || 'Guest User'}
                  </h2>
                  <p className="text-muted-foreground">LocalCart Member</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">+91 XXXXX XXXXX</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">Koramangala, Bangalore</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* LocalCart Credit Badge */}
          <CreditBadge />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <User className="w-4 h-4 mr-2" />
                My Orders
              </Button>
              <Button variant="outline" className="justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Saved Addresses
              </Button>
              <Button variant="outline" className="justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button 
                variant="outline" 
                className="justify-start text-destructive hover:text-destructive"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
