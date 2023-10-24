import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { EmergencyKit } from './components/EmergencyKit'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginGuard } from './utils/LoginGuard'
import { Suspense, lazy } from 'react'
import { FullScreenLoading } from './components/ui/FullScreenLoading'
import { Registration } from './pages/Registration'
import { AccountImport } from './pages/AccountImport'
import { GuestTimelinePage } from './pages/GuestTimeline'
import ApiProvider from './context/api'
import { PreferenceProvider } from './context/PreferenceContext'
import './i18n'

const AppPage = lazy(() => import('./App'))
const Welcome = lazy(() => import('./pages/Welcome'))

const domain = localStorage.getItem('Domain') ?? ''
const prvkey = localStorage.getItem('PrivateKey') ?? ''

const logined = domain !== '' && prvkey !== ''

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ErrorBoundary FallbackComponent={EmergencyKit}>
        <Suspense fallback={<FullScreenLoading message="Loading..." />}>
            <PreferenceProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/register" element={<Registration />} />
                        <Route path="/import" element={<AccountImport />} />
                        {!logined && <Route path="/stream" element={<GuestTimelinePage />} />}
                        {!logined && <Route path="/entity/:id" element={<GuestTimelinePage />} />}
                        <Route
                            path="*"
                            element={
                                <LoginGuard
                                    component={
                                        <ApiProvider>
                                            <AppPage />
                                        </ApiProvider>
                                    }
                                    redirect="/welcome"
                                />
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </PreferenceProvider>
        </Suspense>
    </ErrorBoundary>
)
