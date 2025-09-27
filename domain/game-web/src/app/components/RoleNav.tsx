'use client';

import Link from 'next/link';

interface RoleNavProps {
  currentPath?: string;
  showHeroContent?: boolean;
  heroTagline?: string;
  heroDescription?: string;
  heroImage?: string;
}

// Always use these same nav items
const navItems = [
  {
    href: '/play',
    mainTitle: 'PLAY',
    subTitle: 'a hero',
    color: 'purple'
  },
  {
    href: '/guide',
    mainTitle: 'GUIDE',
    subTitle: 'the fates',
    color: 'cyan'
  },
  {
    href: '/read',
    mainTitle: 'READ',
    subTitle: 'the legends',
    color: 'blue'
  }
];

export function RoleNav({ 
  currentPath = '/',
  showHeroContent = true,
  heroTagline = 'Watch chaos become legend',
  heroDescription = 'Real gameplay transforms into epic narrative. Choose your role in the story.',
  heroImage = '/landing-root.png'
}: RoleNavProps) {
  
  return (
    <section>
      {/* Hero Section - Full Width */}
      <div 
        className="relative h-[400px] md:h-[500px]"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Bottom gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        {/* Content Container */}
        <div className="relative z-10 h-full max-w-6xl mx-auto px-8">
          {/* Top Row - Title and Login */}
          <div className="flex justify-between items-center pt-8 mb-8">
            <Link href="/" className="text-3xl font-bold text-white hover:text-cyan-400 transition-colors">
              River of Souls
            </Link>
            <a 
              href="/auth/login" 
              className="px-6 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
            >
              Login
            </a>
          </div>
          
          {/* Tab Navigation - now inside hero */}
          <nav className="flex justify-center mt-16">
            <div className="flex gap-16">
              {navItems.map((item) => {
                const isActive = currentPath === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      text-center group transition-all
                      ${isActive ? '' : 'hover:scale-105'}
                    `}
                  >
                    <div className={`
                      text-5xl font-bold tracking-wider transition-colors
                      ${isActive 
                        ? `${item.color === 'purple' ? 'text-purple-400' : item.color === 'cyan' ? 'text-cyan-400' : 'text-blue-400'}` 
                        : `text-white ${item.color === 'purple' ? 'hover:text-purple-400' : item.color === 'cyan' ? 'hover:text-cyan-400' : 'hover:text-blue-400'}`
                      }
                    `}>
                      {item.mainTitle}
                    </div>
                    <div className={`
                      text-xl mt-2 transition-colors
                      ${isActive 
                        ? 'text-slate-300' 
                        : 'text-slate-400 group-hover:text-slate-300'
                      }
                    `}>
                      {item.subTitle}
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
          
          {/* Text content - bottom aligned */}
          {showHeroContent && (
            <div className="absolute bottom-0 left-0 right-0 pb-12 px-8">
              <div className="max-w-2xl">
                <p className="text-2xl text-slate-100 mb-4 font-semibold">
                  {heroTagline}
                </p>
                <p className="text-lg text-slate-200 leading-relaxed">
                  {heroDescription}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </section>
  );
}