"use client";

/**
 * React 错误边界组件
 *
 * 捕获子组件的渲染错误，防止整个应用崩溃
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  private resetTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // 调用自定义错误处理
    this.props.onError?.(error, errorInfo);

    // 开发环境输出到控制台
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // 生产环境可以发送到错误追踪服务
    // 例如: Sentry.captureException(error, { extra: errorInfo });
  }

  public componentDidUpdate(prevProps: Props) {
    const { hasError } = this.state;
    const { resetKeys } = this.props;

    // 如果提供了 resetKeys，当它们变化时重置错误状态
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index],
      );

      if (hasResetKeyChanged) {
        this.reset();
      }
    }
  }

  public componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private reset = () => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      // 使用自定义 fallback 或默认错误 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorUI error={this.state.error} onReset={this.reset} />;
    }

    return this.props.children;
  }
}

// 默认错误 UI
function DefaultErrorUI({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="min-h-[300px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface0 rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-red/10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="错误图标"
            >
              <title>错误</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text mb-2">出错了</h2>
          <p className="text-subtext0 mb-4">
            页面加载时发生错误，请尝试刷新页面
          </p>
        </div>

        {isDev && error && (
          <div className="mb-6 text-left">
            <details className="bg-surface1 rounded-lg p-4">
              <summary className="cursor-pointer text-sm font-medium text-text">
                错误详情（仅开发环境可见）
              </summary>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-red font-mono break-all">
                  {error.name}: {error.message}
                </p>
                {error.stack && (
                  <pre className="text-xs text-subtext0 overflow-auto max-h-40 p-2 bg-surface0 rounded">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors"
          >
            重试
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-surface1 text-text rounded-lg hover:bg-surface2 transition-colors"
          >
            刷新页面
          </button>
        </div>
      </div>
    </div>
  );
}

// 用于特定页面的错误边界 Hook
export function useErrorBoundary() {
  return {
    ErrorBoundary,
  };
}

// 便捷导出：带默认样式的错误边界
export function PageErrorBoundary({
  children,
  pageName = "页面",
}: {
  children: ReactNode;
  pageName?: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface0 rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-bold text-text mb-2">
              {pageName}加载失败
            </h2>
            <p className="text-subtext0 mb-4">请刷新页面重试</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
