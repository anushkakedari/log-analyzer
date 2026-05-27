import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AnalyzePage from './pages/AnalyzePage'
import HistoryPage from './pages/HistoryPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <>
            <SignedOut><LoginPage /></SignedOut>
            <SignedIn><Navigate to="/dashboard" /></SignedIn>
          </>
        } />
        <Route path="/dashboard" element={
          <>
            <SignedIn><DashboardPage /></SignedIn>
            <SignedOut><Navigate to="/login" /></SignedOut>
          </>
        } />
        <Route path="/analyze" element={
          <>
            <SignedIn><AnalyzePage /></SignedIn>
            <SignedOut><Navigate to="/login" /></SignedOut>
          </>
        } />
        <Route path="/history" element={
          <>
            <SignedIn><HistoryPage /></SignedIn>
            <SignedOut><Navigate to="/login" /></SignedOut>
          </>
        } />

        <Route path="/analytics" element={
        <>
          <SignedIn><AnalyticsPage /></SignedIn>
          <SignedOut><Navigate to="/login" /></SignedOut>
        </>
      } />
      </Routes>
    </BrowserRouter>
  )
}

export default App










// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { SignedIn, SignedOut } from '@clerk/clerk-react'
// import LandingPage from './pages/LandingPage'
// import LoginPage from './pages/LoginPage'
// import DashboardPage from './pages/DashboardPage'

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={
//           <>
//             <SignedOut><LoginPage /></SignedOut>
//             <SignedIn><Navigate to="/dashboard" /></SignedIn>
//           </>
//         } />
//         <Route path="/dashboard" element={
//           <>
//             <SignedIn><DashboardPage /></SignedIn>
//             <SignedOut><Navigate to="/login" /></SignedOut>
//           </>
//         } />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App