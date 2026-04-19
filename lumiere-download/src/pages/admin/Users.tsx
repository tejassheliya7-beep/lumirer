import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, Shield, ShieldOff } from 'lucide-react';

const ROLES_KEY = 'lumiere_roles';

const getRoles = (): Array<{ user_id: string; role: string }> => {
  try {
    return JSON.parse(localStorage.getItem(ROLES_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveRoles = (roles: Array<{ user_id: string; role: string }>) => {
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
};

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Load registered users from offline DB
  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const db = JSON.parse(localStorage.getItem('lumiere_db') || '[]');
      return db.sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

  // Load roles from localStorage (offline)
  const { data: roles } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => getRoles(),
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ profileId, makeAdmin }: { profileId: string; makeAdmin: boolean }) => {
      const current = getRoles();
      if (makeAdmin) {
        if (!current.find(r => r.user_id === profileId && r.role === 'admin')) {
          current.push({ user_id: profileId, role: 'admin' });
        }
      } else {
        const idx = current.findIndex(r => r.user_id === profileId && r.role === 'admin');
        if (idx >= 0) current.splice(idx, 1);
      }
      saveRoles(current);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      toast({ title: 'User role updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const isUserAdmin = (id: string) =>
    roles?.some(r => r.user_id === id && r.role === 'admin');

  const filtered = profiles?.filter((p: any) =>
    (p.display_name || p.displayName || p.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(search.toLowerCase()) ||
    p.id.includes(search)
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">{profiles?.length || 0} registered users</p>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-9"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-center py-3 px-4 font-medium">Role</th>
                    <th className="text-right py-3 px-4 font-medium">Joined</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((profile: any) => {
                    const admin = isUserAdmin(profile.id);
                    return (
                      <tr key={profile.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <div className="font-medium">{profile.display_name || profile.displayName || 'Unnamed'}</div>
                          <div className="text-xs text-muted-foreground font-mono">{profile.id.slice(0, 12)}...</div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{profile.email || '—'}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              admin
                                ? 'bg-primary/20 text-primary'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {admin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          {profile.created_at
                            ? new Date(profile.created_at).toLocaleDateString('en-IN')
                            : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleAdminMutation.mutate({ profileId: profile.id, makeAdmin: !admin })
                            }
                            disabled={toggleAdminMutation.isPending}
                          >
                            {admin ? (
                              <><ShieldOff className="w-4 h-4 mr-1" /> Remove Admin</>
                            ) : (
                              <><Shield className="w-4 h-4 mr-1" /> Make Admin</>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
