import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';

// All three routes are lazy, Home included — Home is the one that statically
// imports AvatarHero/ButterflyCursor (Three.js/react-three-fiber/drei), so
// if it were the one non-lazy import here, that whole chunk would still ride
// along in the entry bundle index.html always loads first, on every route.
// Splitting Home out too means /about and /projects genuinely never fetch
// it. (See Home.tsx's own idle-deferred mount for *when*, within Home
// itself, the heavy 3D content starts loading once its chunk does arrive,
// and RootLayout's own idle-prefetch for how these three chunks normally end
// up already fetched by the time a route is actually navigated to.)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* RootLayout (nav pill + ambient background) is the parent route —
            mounted once, persists across every navigation below it, with
            `<Outlet/>` standing in for whichever page is active, and its own
            Suspense boundary scoped to just that Outlet. See RootLayout.tsx
            for why this replaced each page mounting its own copy of the same
            chrome, and why the Suspense boundary moved down into it instead
            of wrapping the whole tree here — a boundary above RootLayout
            would unmount the nav/background themselves every time a lazy
            page chunk suspends, which is the opposite of the fix. */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
