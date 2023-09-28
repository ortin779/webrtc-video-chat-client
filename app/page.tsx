import CreateRoom from '@/components/CreateRoom';
import { JoinRoom } from '@/components/JoinRoom';

export default function Home() {
  return (
    <main className="flex min-h-screen gap-8 flex-col items-center p-24">
      <h1 className="text-2xl md:text-4xl text-violet-500">
        Welcome to Video.io
      </h1>
      <JoinRoom />
      <CreateRoom />
    </main>
  );
}
