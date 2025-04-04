import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const isAuthenticated = sessionStorage.getItem('jwtToken'); // Check for a token in sessionStorage
      if (!isAuthenticated) {
        router.push('/SignIn'); // Redirect to the sign-in page if not authenticated
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;