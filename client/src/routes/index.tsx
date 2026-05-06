import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Spinner from '@/components/Spinner';

import ItemRouteGuard from '@/utils/ItemRouteGuard';

const Layout = lazy(() => import('@/pages/Layout'));
const Home = lazy(() => import('@/pages/Home'));
const Favourites = lazy(() => import('@/pages/Favourites'));
const DeathsCoffer = lazy(() => import('@/pages/DeathsCoffer'));
const PageNotFound = lazy(() => import('@/pages/PageNotFound'));

function Fallback() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        minHeight: '100svh',
      }}
    >
      <Spinner />
    </div>
  );
}

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route
            path='/'
            element={<Layout />}
          >
            <Route
              index
              element={<Home />}
            />
            <Route
              path='item/:itemId'
              element={<ItemRouteGuard />}
            />
            <Route
              path='favourites'
              element={<Favourites />}
            />
            <Route
              path='deaths-coffer'
              element={<DeathsCoffer />}
            />
            <Route
              path='404'
              element={<PageNotFound />}
            />
            <Route
              path='*'
              element={<PageNotFound />}
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
