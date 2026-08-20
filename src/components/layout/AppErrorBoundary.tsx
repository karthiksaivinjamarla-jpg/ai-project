import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react'
import { Button } from '../ui/Button'

interface State { hasError: boolean }

export class AppErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State { return { hasError: true } }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SevaCare application error', error, info)
  }

  private recover = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
        <section role="alert" className="w-full max-w-lg rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
          <p className="mt-3 text-slate-600">SevaCare could not display this screen. Your saved enquiries are kept in your browser.</p>
          <Button className="mt-6" onClick={this.recover}>Reload SevaCare</Button>
        </section>
      </main>
    )
  }
}
