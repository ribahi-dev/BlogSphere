import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function GoogleCallbackHandler() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      toast({ title: 'Erreur Google', description: error, variant: 'destructive' });
      navigate('/login', { replace: true });
      return;
    }

    if (!code) {
      // This page shouldn't be visited without a code
      navigate('/login', { replace: true });
      return;
    }

    // Redirect to backend callback which will handle auth and redirect back with token
    window.location.href = `/api/auth/google/callback?${params.toString()}`;
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to Google authentication...</p>
    </div>
  );
}
