import { getGreeting } from '@/lib/edge-config';

export default async function WelcomePage() {
  const greeting = await getGreeting();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Vercel Edge Config Demo
        </h1>
        
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Current greeting from Edge Config:
          </p>
          
          {greeting ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <p className="text-2xl font-semibold text-green-700">
                "{greeting}"
              </p>
              <p className="text-sm text-green-600 mt-2">
                ✅ Successfully loaded from Edge Config
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <p className="text-lg text-red-600">
                ❌ No greeting found in Edge Config
              </p>
              <p className="text-sm text-red-500 mt-2">
                Check your EDGE_CONFIG environment variable
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">🔗 Test Endpoints:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <a href="/welcome" className="underline">/welcome</a> - This page</li>
              <li>• <a href="/api/welcome" className="underline" target="_blank">/api/welcome</a> - JSON API (opens in new tab)</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">📝 Configuration Info:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Store ID: <code className="bg-gray-200 px-1 rounded text-xs">ecfg_8pvlhgacvkcz7zaxen/7qdwapa9gj</code></li>
              <li>• Current item: <code className="bg-gray-200 px-1 rounded text-xs">greeting</code></li>
              <li>• Value: <code className="bg-gray-200 px-1 rounded text-xs">"hello world"</code></li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">⚙️ Next Steps:</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Set your EDGE_CONFIG environment variable</li>
              <li>Update the greeting in Vercel dashboard</li>
              <li>Refresh this page to see changes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}