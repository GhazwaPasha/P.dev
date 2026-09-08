import { NavLink, useLocation } from 'react-router-dom';
import glass from '../glass/Glass.module.css';
import styles from './NavPill.module.css';

interface NavItem {
  to: string;
  title: string;
  icon: React.ReactNode;
}

const items: NavItem[] = [
  {
    to: '/',
    title: 'Home',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.6 3.5 9.8V21a1 1 0 0 0 1 1H9.5a1 1 0 0 0 1-1v-6a1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5v6a1 1 0 0 0 1 1H19.5a1 1 0 0 0 1-1V9.8Z" />
      </svg>
    ),
  },
  {
    to: '/about',
    title: 'About',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="4.2" />
        <path d="M4 21c0-4.4 3.6-7.2 8-7.2s8 2.8 8 7.2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
      </svg>
    ),
  },
  {
    to: '/projects',
    title: 'Projects',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="8" height="8" rx="2.2" />
        <rect x="13" y="3" width="8" height="8" rx="2.2" />
        <rect x="3" y="13" width="8" height="8" rx="2.2" />
        <rect x="13" y="13" width="8" height="8" rx="2.2" />
      </svg>
    ),
  },
];

export default function NavPill() {
  const { pathname } = useLocation();
  const activeIndex = items.findIndex((item) =>
    item.to === '/' ? pathname === '/' : pathname.startsWith(item.to),
  );

  return (
    <nav
      className={glass.glass}
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '10px 22px',
        borderRadius: 999,
      }}
    >
      {/* Active-item indicator — its own glass surface sliding under the
          icons, not a real WebGL context refracting the pill's own render
          anymore (that composited-refraction trick was specific to the old
          shader; plain CSS just stacks a second, smaller glass circle in
          the same spot). */}
      {activeIndex !== -1 && (
        <div
          className={glass.glass}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 6,
            left: 18,
            width: 40,
            height: 40,
            borderRadius: 999,
            pointerEvents: 'none',
            transform: `translateX(${activeIndex * 52}px)`,
            transition: 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      )}
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          title={item.title}
          aria-label={item.title}
          className={styles.icon}
        >
          {item.icon}
        </NavLink>
      ))}
    </nav>
  );
}
