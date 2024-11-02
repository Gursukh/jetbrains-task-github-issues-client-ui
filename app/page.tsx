import TabBar from "./(components)/Tabs";
import RespositoryPage from "./(components)/RespositoryPage";

export default function Home() {
  
  return (
    <main className="flex flex-col h-full px-10">
      <TabBar />
      <RespositoryPage />
    </main>
  );
}
