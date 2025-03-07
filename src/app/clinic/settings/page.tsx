// Clininc Settings(for marking clinic as open or close)\
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Clinic Hours */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Clinic Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opening-time">Opening Time</Label>
              <Input id="opening-time" type="time" defaultValue="09:00" />
            </div>
            <div>
              <Label htmlFor="closing-time">Closing Time</Label>
              <Input id="closing-time" type="time" defaultValue="17:00" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      {/* Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="email-notifications" />
            <Label htmlFor="email-notifications">Email Notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="sms-notifications" />
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      {/* User Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>User Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="admin-access" />
            <Label htmlFor="admin-access">Admin Access</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="edit-permissions" />
            <Label htmlFor="edit-permissions">Edit Permissions</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}