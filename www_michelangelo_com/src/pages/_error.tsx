import { NextPage } from 'next';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-error mb-4">
          {statusCode
            ? `服务器错误 (${statusCode})`
            : '客户端错误'}
        </h1>
        <p className="text-text-secondary mb-4">
          {statusCode
            ? '服务器端发生错误'
            : '客户端发生错误'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary w-full"
        >
          重试
        </button>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 