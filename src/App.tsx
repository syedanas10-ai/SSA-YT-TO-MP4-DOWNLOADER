import { useState } from 'react';
import { Download, Video, AlertCircle, Loader2, CheckCircle, PlayCircle, Clock } from 'lucide-react';

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  formats: Array<{
    quality: string;
    format: string;
    url: string;
  }>;
}

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetVideo = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const apiUrl = `${import.meta.env.VITE_Bolt Database_URL}/functions/v1/youtube-downloader?url=${encodeURIComponent(videoUrl)}&action=info`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_Bolt Database_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch video information');
      }

      const data = await response.json();
      setVideoInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (quality: string) => {
    if (!videoInfo) return;

    try {
      const link = document.createElement('a');
      link.href = videoInfo.formats[0].url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();

      setError('Note: YouTube does not allow direct downloads. Opening video page - you can use YouTube Premium for offline viewing.');
    } catch (err) {
      setError('Failed to open video');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMDktMS43OTEgNC00IDRzLTQtMS43OTEtNC00IDEuNzkxLTQgNC00IDQgMS43OTEgNCA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

      <div className="relative z-10">
        <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-2.5 rounded-xl shadow-lg shadow-red-500/30">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">YT Downloader</h1>
                  <p className="text-xs text-slate-400">Fast & Free</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20 mb-6">
                <PlayCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">Professional Video Downloader</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Download YouTube Videos
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  In Seconds
                </span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                Fast, secure, and easy-to-use YouTube video downloader. Paste any YouTube URL and get instant access.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 md:p-10 mb-8">
              <div className="mb-6">
                <label htmlFor="videoUrl" className="block text-sm font-semibold text-slate-300 mb-3">
                  Paste YouTube URL
                </label>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      id="videoUrl"
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleGetVideo()}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-5 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-xl focus:outline-none focus:border-red-500 transition-all text-white placeholder-slate-500 text-base"
                      disabled={loading}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Video className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                  <button
                    onClick={handleGetVideo}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 min-w-[160px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Get Video</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>

            {videoInfo && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative group">
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-full h-72 md:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">Video Found</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
                      {videoInfo.title}
                    </h2>
                    {videoInfo.duration !== 'N/A' && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{videoInfo.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Download className="w-5 h-5 text-red-400" />
                    Download Options
                  </h3>
                  <div className="space-y-3">
                    {videoInfo.formats.map((format, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between p-5 bg-slate-900/50 rounded-xl hover:bg-slate-900/70 transition-all border border-slate-700/50 hover:border-red-500/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-red-500/30">
                            <Video className="w-6 h-6 text-red-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-lg">
                              {format.quality} Quality
                            </p>
                            <p className="text-sm text-slate-400">
                              {format.format} Format • Best Quality
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(format.quality)}
                          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 group-hover:scale-105"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-300">
                        <p className="font-semibold mb-1">Legal Notice</p>
                        <p className="text-amber-400/80">
                          YouTube's Terms of Service restrict direct video downloads. This tool provides video information and links.
                          For offline viewing, consider YouTube Premium or YouTube's official mobile app download feature.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                  <Video className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Fast Processing</h3>
                <p className="text-slate-400 text-sm">Get your video information instantly with our powerful servers</p>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 border border-green-500/20">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">100% Free</h3>
                <p className="text-slate-400 text-sm">No hidden fees, no subscriptions. Completely free forever</p>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 border border-red-500/20">
                  <Download className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Easy to Use</h3>
                <p className="text-slate-400 text-sm">Simple interface, just paste URL and download. No technical skills needed</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Supports: youtube.com/watch • youtu.be • youtube.com/embed
              </p>
            </div>
          </div>
        </div>

        <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-xl mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-slate-400 text-sm">
              <p>© 2024 YT Downloader. Made with passion for video enthusiasts.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
