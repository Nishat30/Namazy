import React from 'react';
import { usePrayer } from '../contexts/PrayerContext';
import { Clock, FileText, BookOpen, CheckCircle, XCircle, Star, Calendar, Trash2, Home, List, CalendarDays } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useState, useEffect } from 'react';

// Array of Islamic quotes for dynamic display
const islamicQuotes = [
  {
    arabic: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    translation: "Indeed, prayer has been decreed upon the believers a decree of specified times.✨",
    source: "Quran 4:103"
  },
  {
    arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
    translation: "And I did not create the jinn and mankind except to worship Me.✨",
    source: "Quran 51:56"
  },
  {
    arabic: "لَا يَسْتَوِي الْخَبِيثُ وَالطَّيِّبُ",
    translation: "The evil and the good are not equal.✨",
    source: "Quran 5:100"
  },
  {
    arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
    translation: "Indeed, Allah loves those who repent and loves those who purify themselves.✨",
    source: "Quran 2:222"
  },
  {
    arabic: "وَعَسَى أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ",
    translation: "Perhaps you hate a thing and it is good for you.✨",
    source: "Quran 2:216"
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.✨",
    source: "Quran 20:114"
  },
  {
    arabic: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    translation: "Indeed, mankind is in loss,✨",
    source: "Quran 103:2"
  },
  {
    arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ",
    translation: "Except for those who have believed and done righteous deeds.✨",
    source: "Quran 103:3"
  },
  {
    arabic: "وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    translation: "And advised each other to truth and advised each other to patience.✨",
    source: "Quran 103:3"
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship, there is ease. Indeed, with hardship, there is ease.✨",
    source: "Quran 94:5-6"
  }
];

// Helper function to format 24-hour time to 12-hour format
const formatTo12Hour = (time24) => {
  if (!time24 || time24 === 'N/A') return time24;
  const [hours, minutes] = time24.split(':').map(Number);

  // Create a dummy Date object to use toLocaleTimeString
  const date = new Date();
  date.setHours(hours, minutes, 0, 0); // Set hours and minutes to the dummy date

  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

// PrayerCard component displays individual prayer details
const PrayerCard = ({ prayerKey, prayer }) => {
  // Access prayer state and actions from PrayerContext
  const { toggleStudied, isStudied, markAsQaza } = usePrayer();
  const studied = isStudied(prayerKey); // Check if prayer is marked as studied
  const [qazaDisabled, setQazaDisabled] = useState(false); // State to disable Qaza button

  // Effect to manage Qaza button's disabled state based on local storage
  useEffect(() => {
    const storedTime = localStorage.getItem(`qaza-disabled-${prayerKey}`);
    if (storedTime) {
      const clickedAt = new Date(storedTime);
      const now = new Date();
      const hoursPassed = (now - clickedAt) / (1000 * 60 * 60);
      // If less than 24 hours have passed, keep button disabled
      if (hoursPassed >= 24) {
        localStorage.removeItem(`qaza-disabled-${prayerKey}`); // Reset after 24 hours
        setQazaDisabled(false);
      } else {
        setQazaDisabled(true);
      }
    }
  }, [prayerKey]); // Re-run effect if prayerKey changes

  // Determine the current status of the prayer (upcoming, current, past)
  const status = (() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    if (currentTime < prayer.startTime) return 'upcoming';
    if (currentTime >= prayer.startTime && currentTime <= prayer.endTime) return 'current';
    return 'past';
  })();

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border-l-4 
      ${status === 'current' 
        ? 'border-emerald-500 shadow-emerald-200 dark:shadow-emerald-900 scale-105' // Highlight current prayer
        : status === 'upcoming' 
          ? 'border-amber-500' // Amber for upcoming
          : 'border-gray-300' // Gray for past
      }`}>
      {/* Header section of the prayer card */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-100">
            {prayer.name} {/* Prayer name in English */}
          </h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-300">
            {prayer.arabicName} {/* Prayer name in Arabic */}
          </p>
        </div>
        {/* Prayer status badge */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'current' ? 'bg-emerald-500 text-white' :
          status === 'upcoming' ? 'bg-amber-500 text-white' : 'bg-gray-500 text-white'
        }`}>
          {status === 'current' ? 'Now' : status === 'upcoming' ? 'Next' : 'Past'}
        </div>
      </div>

      {/* Prayer times section */}
      <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-3 mb-3">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-emerald-600 dark:text-emerald-400">Start</p>
            <p className="font-bold text-emerald-800 dark:text-emerald-100">{formatTo12Hour(prayer.startTime)}</p>
          </div>
          <div>
            <p className="text-emerald-600 dark:text-emerald-400">End</p>
            <p className="font-bold text-emerald-800 dark:text-emerald-100">{formatTo12Hour(prayer.endTime)}</p>
          </div>
        </div>
      </div>

      {/* Recommended Surah section */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen size={16} className="text-amber-600 dark:text-amber-500" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-500">
            Recommended Surah
          </span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold text-amber-800 dark:text-amber-100 font-islamic">
              {prayer.surah.name}
            </p>
            {/* Link to PDF if available */}
            {prayer.surah.pdfUrl && (
              <a
                href={prayer.surah.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                title={`Read ${prayer.surah.name} PDF`}
              >
                <FileText size={20} />
              </a>
            )}
          </div>
          {/* Surah Arabic text and translation */}
          <div>
            <p className="text-sm text-amber-600 dark:text-amber-300 font-arabic mb-2">
              {prayer.surah.arabic}
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-200 ">
              {prayer.surah.translation}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons: Mark as Done / Qaza */}
      <div className="flex items-center gap-3">
        {/* Toggle for 'Done' status */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={studied}
            onChange={() => toggleStudied(prayerKey)}
            className="sr-only peer"
          />
          <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 dark:bg-gray-700 rounded-full peer peer-checked:bg-emerald-500 transition-all"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-full"></div>
        </label>
        <span className="text-m font-medium text-gray-700 dark:text-gray-300">
          {studied ? 'Done' : 'Pending'}
        </span>

        {/* Qaza button */}
        <>
          <button
            onClick={() => {
              markAsQaza(prayerKey);
              localStorage.setItem(`qaza-disabled-${prayerKey}`, new Date().toISOString());
              setQazaDisabled(true);
            }}
            disabled={qazaDisabled || studied} // Disable if already Qaza or Done
            className={`px-2 py-2 rounded-lg text-white transition-all text-sm ${
              qazaDisabled || studied ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            <Star size={16} /> {/* Star icon for Qaza */}
          </button>
          <span className="text-m font-medium text-gray-700 dark:text-gray-300">
            {'Qaza'}
          </span>
        </>
      </div>
    </div>
  );
};

// QazaCard component displays individual Qaza prayer details
const QazaCard = ({ qaza }) => {
  const { completeQaza, removeCompletedQaza } = usePrayer();

  // Basic check for valid qaza data
  if (!qaza || !qaza.prayer) {
    return null;
  }

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border-l-4 h-full flex flex-col justify-between 
      ${qaza.completed ? 'border-emerald-500 opacity-75' : 'border-red-500'}
    `}>
      {/* Header section for Qaza card */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-red-800 dark:text-red-200">
            {qaza.prayer.name} {/* Prayer name in English */}
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300">
            {qaza.prayer.arabicName} {/* Prayer name in Arabic */}
          </p>
        </div>
        {/* Status badge for Qaza */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          qaza.completed ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {qaza.completed ? 'Done' : 'Qaza'}
        </div>
      </div>

      {/* Date missed section */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-3">
        <div className="flex items-center space-x-2">
          <Calendar size={14} className="text-red-600 dark:text-red-400" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {new Date(qaza.dateMissed).toLocaleDateString()} {/* Formatted date missed */}
          </p>
        </div>
      </div>

      {/* Action buttons for Qaza prayers */}
      <div className="flex gap-2">
        {!qaza.completed ? (
          <button
            onClick={() => completeQaza(qaza.id)} // Mark as complete
            className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-sm"
          >
            <CheckCircle size={16} />
            <span>Complete</span>
          </button>
        ) : (
          <button
            onClick={() => {
              console.log('Clicked remove:', qaza.id);
              removeCompletedQaza(qaza.id) // Remove completed Qaza
            }}
            className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
          >
            <Trash2 size={16} />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
};


// Dashboard component - Main application layout
const Dashboard = () => {
  // Access prayers data and view state from PrayerContext
  const { prayersData, qazaPrayers, currentView, setCurrentView } = usePrayer();
  // Get current time for display
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Filter Qaza prayers into pending and completed for display
  const pendingQaza = qazaPrayers.filter(qaza => !qaza.completed);
  const completedQaza = qazaPrayers.filter(qaza => qaza.completed);

  // Console logs for debugging (can be removed in production)
  console.log('Qaza prayers:', qazaPrayers);
  console.log('Pending qaza:', pendingQaza);
  console.log('Completed qaza:', completedQaza);

  // Get today's date and format it
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString(undefined, options);

  // Select a daily quote based on the day of the month
  const dayOfMonth = today.getDate(); // 1 to 31
  const quoteIndex = (dayOfMonth - 1) % islamicQuotes.length; // Ensure index wraps around
  const dailyQuote = islamicQuotes[quoteIndex];

  return (
    // Main container for the entire dashboard.
    // Uses flexbox to arrange content vertically, ensuring min-h-screen for full height.
    <div className="relative min-h-screen islamic-pattern flex flex-col">

      {/* Moving text / Marquee fixed to the top */}
      <div className="relative flex overflow-x-hidden bg-emerald-100 dark:bg-emerald-900 border-y border-emerald-300 dark:border-emerald-600">
        <div className="py-2 animate-marquee whitespace-nowrap text-emerald-900 dark:text-emerald-100 font-medium">
          <span className="mx-2 text-sm md:text-lg">
            Recite Subḥānallāh (33 times), Alḥamdulillāh (33 times), and Allāhu Akbar (34 times) after each Salah ✨ – a beautiful dhikr recommended by the Prophet ﷺ. Let your tongue remain moist with the remembrance of Allah. 💚 A small act with great rewards. 🌙 Never underestimate the power of consistent dhikr in your daily life. 🤲 May Allah grant us steadfastness in worship and sincerity in remembrance. 💫 Keep your heart connected.💌 Keep your soul nourished.☪️
          </span>
        </div>

        <div className="absolute top-0 py-2 gap-0 animate-marquee2 whitespace-nowrap text-emerald-900 dark:text-emerald-100 font-medium">
          <span className="mx-1 text-sm md:text-lg">
            Recite Subḥānallāh (33 times), Alḥamdulillāh (33 times), and Allāhu Akbar (34 times) after each Salah ✨ – a beautiful dhikr recommended by the Prophet ﷺ. Let your tongue remain moist with the remembrance of Allah. 💚 A small act with great rewards. 🌙 Never underestimate the power of consistent dhikr in your daily life. 🤲 May Allah grant us steadfastness in worship and sincerity in remembrance. 💫 Keep your heart connected.💌 Keep your soul nourished.☪️
          </span>
        </div>
      </div>

      {/* This div acts as the main content area that expands vertically.
          It contains the header/navigation and the dynamically rendered main content. */}
      <div className="flex-grow flex flex-col items-center w-full"> 
        {/* Header/Navigation bar */}
        <div className="bg-white/90 dark:bg-emerald-900/90 backdrop-blur-md border-b border-emerald-200 dark:border-emerald-700 p-4 w-full">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* App title and current time */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">ن</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-emerald-800 dark:text-emerald-100">
                  Namazy
                </h1>
                <div className="flex items-center space-x-2">
                  <h3>Your Namaz Reminder</h3>
                  <Clock size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-100">
                    {currentTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation buttons and Theme Toggle */}
            <div className="flex items-center space-x-2">
              {/* ThemeToggle button moved to the front as requested */}
              <ThemeToggle /> 

              <button
                onClick={() => setCurrentView('home')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${currentView === 'home'
                  ? 'bg-emerald-500 text-white'
                  : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800'
                  }`}
              >
                <Home size={18} />
                <span>Prayers</span>
              </button>

              <button
                onClick={() => setCurrentView('qaza')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${currentView === 'qaza'
                  ? 'bg-emerald-500 text-white'
                  : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800'
                  }`}
              >
                <List size={18} />
                <span>Qaza ({pendingQaza.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area: this section is independently scrollable if content overflows */}
        <div className="flex-1 p-4 w-full max-w-7xl overflow-y-auto">
          {currentView === 'home' ? (
            // Home View: Displays Today's Prayers
            <div>
              <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-100 mb-4 text-center">
                Today's Prayers
              </h2>
              <div className="mt-2 mb-4 flex w-fit mx-auto items-center justify-center space-x-2 bg-white/80 dark:bg-emerald-900/50 backdrop-blur-sm rounded-full px-4 py-1.5 text-emerald-700 dark:text-emerald-200 text-sm font-medium">
                <CalendarDays size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>{formattedDate}</span>
              </div>
              {/* Dynamic Islamic Quote Section */}
              <div className="mt-8 mb-8 max-w-xl mx-auto text-center bg-white/80 dark:bg-emerald-700/50 backdrop-blur-sm rounded-xl p-6 shadow-md">
                <p className="text-xl text-emerald-400 dark:text-emerald-200 mb-3 font-arabic">
                  {dailyQuote.arabic}
                </p>
                <p className=" text-xl text-emerald-600 dark:text-emerald-400">
                  {dailyQuote.translation}
                </p>
                <p className="text-m text-emerald-500 dark:text-emerald-500 mt-2">
                  {dailyQuote.source}
                </p>
              </div>
              {/* Grid for Prayer Cards, responsive column layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(prayersData).map(([key, prayer]) => (
                  <PrayerCard key={key} prayerKey={key} prayer={prayer} />
                ))}
              </div>
            </div>
          ) : (
            // Qaza View: Displays Qaza Prayers
            // This container also uses flexbox for its content's vertical alignment
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-100 mb-4 text-center">
                Qaza Prayers
              </h2>

              {qazaPrayers.length === 0 ? (
                // Empty state for Qaza prayers, centered using flex-grow
                <div className="flex-grow flex items-center justify-center">
                  <div className="text-center bg-white/80 dark:bg-emerald-900/50 backdrop-blur-sm rounded-2xl p-8">
                    <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-100 mb-2">
                      ✨🤲  َقَدْ أَفْلَحَ الْمُؤْمِنُونَ ٱلَّذِينَ هُمْ فِى صَلَاتِهِمْ خَٰشِعُونَ
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-300">
                      "Indeed, the believers have succeeded: Those who are humble in their prayers."
                    </p>
                  </div>
                </div>
              ) : (
                // Grid for Qaza Prayer Cards, responsive column layout
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qazaPrayers.map((qaza) => (
                    <div key={qaza.id} className="min-w-[200px]">
                      <QazaCard qaza={qaza} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Footer: Fixed at the bottom of the page */}
      <footer className="w-full bg-emerald-900/90 backdrop-blur-md text-emerald-200 text-center py-4 text-sm mt-8">
        <div className="container mx-auto">
          &copy; 2025 Namazy | Built with <span className="text-red-500">❤</span> by Nishat
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;