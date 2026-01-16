import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/services/api';

type TabType = 'dashboard' | 'articles' | 'users' | 'messages';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dashboardRes = await apiClient.get('/admin/dashboard');
      if (dashboardRes) {
        setStats(dashboardRes.statistics || dashboardRes);
      }
      
      try {
        const articlesRes = await apiClient.get('/admin/articles');
        if (articlesRes && Array.isArray(articlesRes)) {
          setAllArticles(articlesRes);
        }
      } catch (err) {
        setAllArticles([]);
      }
      
      try {
        const usersRes = await apiClient.get('/admin/users');
        if (usersRes && Array.isArray(usersRes)) {
          setAllUsers(usersRes);
        }
      } catch (err) {
        setAllUsers([]);
      }
      
      try {
        const messagesRes = await apiClient.get('/admin/messages');
        if (messagesRes && Array.isArray(messagesRes)) {
          setAllMessages(messagesRes);
        }
      } catch (err) {
        setAllMessages([]);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Non autorisé');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Erreur de chargement');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
    if (!confirm('Supprimer cet article?')) return;
    try {
      setDeleting(articleId);
      await apiClient.delete(`/articles/${articleId}`);
      setAllArticles(allArticles.filter(a => a.id !== articleId));
    } catch (err) {
      alert('Erreur');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>
          <p>{error}</p>
          <Button onClick={() => navigate('/login')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-8 py-4 flex justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </header>

      <div className="border-b bg-white">
        <div className="px-8 flex gap-4">
          {['dashboard', 'articles', 'users', 'messages'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`py-4 border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-4 gap-4">
            <Card><CardContent className="pt-4"><p className="text-3xl">{stats.totalUsers || 0}</p><p className="text-sm text-gray-600">Users</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-3xl">{stats.totalArticles || 0}</p><p className="text-sm text-gray-600">Articles</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-3xl">{stats.publishedArticles || 0}</p><p className="text-sm text-gray-600">Published</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-3xl">{stats.totalComments || 0}</p><p className="text-sm text-gray-600">Comments</p></CardContent></Card>
          </div>
        )}

        {activeTab === 'articles' && (
          <Card>
            <CardHeader><CardTitle>Articles</CardTitle></CardHeader>
            <CardContent>
              {allArticles.map((a: any) => (
                <div key={a.id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-gray-600">{a.author?.name}</p>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteArticle(a.id)} disabled={deleting === a.id}>
                    {deleting === a.id ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader><CardTitle>Users</CardTitle></CardHeader>
            <CardContent>
              {allUsers.map((u: any) => (
                <div key={u.id} className="p-2 border-b">
                  <p className="font-medium">{u.name || u.email}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === 'messages' && (
          <Card>
            <CardHeader><CardTitle>Messages</CardTitle></CardHeader>
            <CardContent>
              {allMessages.map((m: any) => (
                <div key={m.id} className="p-2 border-b">
                  <p className="font-medium">{m.subject}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
