import NavigationSideBar from '@/components/nav/Navigation-bar';
import { ClientWrapper } from '@/components/ClientWrappen'; 

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <ClientWrapper>
        <div className="md:flex h-full w-auto fixed inset-y-0 z-40 bg-[#202225]">
          <NavigationSideBar />
        </div>
      </ClientWrapper>

      <div>
        
        <main className="md:pl-[72px] h-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
