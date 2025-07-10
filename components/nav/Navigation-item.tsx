'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Button_custom from './action-button';

interface NavigationItemProps {
  name: string;
  id: string;
  imageUrl: string;
}

export default function NavigationItem({
  id,
  name,
  imageUrl,
}: NavigationItemProps) {
  const params = useParams();
  const router = useRouter();

  const isActive = params?.serverId === id;

  const handleClick = () => {
    if (!isActive) {
      router.push(`/servers/${id}`);
    }
  };

  return (
    <div className="relative flex items-center group">
      {/* Discord-style white indicator bar */}
      <div className={cn(
        "absolute -left-3 w-1 bg-white rounded-r-full transition-all duration-200",
        isActive ? "h-8" : "h-2 group-hover:h-5" // Tiny by default, medium on hover, full when active
      )} />
      
      <Button_custom side="top" align="center" label={name}>
        <button
          onClick={handleClick}
          className={cn(
            "relative transition-all duration-500",
            isActive && "scale-105"
          )}
          aria-current={isActive ? "page" : undefined}
        >
          <div
            className={cn(
              "relative w-12 h-12 rounded-full overflow-hidden",
              "transition-all duration-500",
              isActive 
                ? "rounded-[16px]" 
                : "group-hover:rounded-[16px]"
            )}
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover -text-black"
              sizes="48px"
            />
          </div>
        </button>
      </Button_custom>
    </div>
  );
}
