import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const error: any = useRouteError();
  console.error('Route error:', error);

  return (
    <div style={{ padding: 40 }}>
      <h2>Ứng dụng gặp lỗi</h2>
      <p style={{ color: '#a00' }}>{String(error?.statusText || error?.message || 'Không rõ lỗi')}</p>
      {error?.stack && (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f6f6f6', padding: 12 }}>{error.stack}</pre>
      )}
    </div>
  );
};

export default ErrorPage;
