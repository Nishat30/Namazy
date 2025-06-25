import React, { createContext, useContext, useEffect, useState } from 'react';
import { CalculationMethod, PrayerTimes, Coordinates, Madhab } from 'adhan'; // Import adhan-js classes

const PrayerContext = createContext();

export const usePrayer = () => {
  const context = useContext(PrayerContext);
  if (!context) {
    throw new Error('usePrayer must be used within a PrayerProvider');
  }
  return context;
};
//Heart of the Quran
// Define the base structure for prayersData (Surahs and Arabic names are static)
// Initial times will be 'Loading...' or 'N/A' until fetched
const basePrayersData = {
  fajr: {
    name: 'Fajr',
    arabicName: 'الفجر',
    surah: {
      name: 'Surah Yaseen',
      arabic: 'سورة يس',
      translation: '"Heart of the Quran"',
      pdfUrl: '/pdfs/surah_yaseen.pdf'
    }
  },
  dhuhr: {
    name: 'Dhuhr',
    arabicName: 'الظهر',
    surah: {
      name: 'Surah Fatah',
      arabic: 'سورة الفتح',
      translation: '"The Victory"',
      pdfUrl: '/pdfs/surah_fatah.pdf'
    }
  },
  asr: {
    name: 'Asr',
    arabicName: 'العصر',
    surah: {
      name: 'Surah Naba',
      arabic: 'سورة النبأ',
      translation: '"The Tidings"',
      pdfUrl: '/pdfs/surah_naba.pdf'
    }
  },
  maghrib: {
    name: 'Maghrib',
    arabicName: 'المغرب',
    surah: {
      name: 'Surah Waqiah',
      arabic: 'سورة الواقعة',
      translation: '"The Inevitable"',
      pdfUrl: '/pdfs/surah_waqiah.pdf'
    }
  },
  isha: {
    name: 'Isha',
    arabicName: 'العشاء',
    surah: {
      name: 'Surah Mulk',
      arabic: 'سورة الملك',
      translation: '"The Sovereignty"',
      pdfUrl: '/pdfs/surah_mulk.pdf'
    }
  }
};

export const PrayerProvider = ({ children }) => {
  // State for dynamic prayer times, initialized with base structure and 'Loading...' times
  const [prayersData, setPrayersData] = useState(() => {
    const initial = {};
    for (const key in basePrayersData) {
      initial[key] = { ...basePrayersData[key], startTime: 'Loading...', endTime: 'Loading...' };
    }
    return initial;
  });

  const [loadingPrayerTimes, setLoadingPrayerTimes] = useState(true);
  const [prayerTimesError, setPrayerTimesError] = useState(null);

  const [currentView, setCurrentView] = useState('home');
  const [lastResetDate, setLastResetDate] = useState(() => {
    const stored = localStorage.getItem('namaz-last-reset-date');
    return stored || new Date().toDateString();
  });

  const [prayerStatus, setPrayerStatus] = useState(() => {
    const stored = localStorage.getItem('namaz-prayer-status');
    return stored ? JSON.parse(stored) : {};
  });

  const [qazaPrayers, setQazaPrayers] = useState(() => {
    const stored = localStorage.getItem('namaz-qaza-prayers');
    return stored ? JSON.parse(stored) : [];
  });

  // Effect to fetch geolocation and calculate prayer times
  useEffect(() => {
    const fetchAndCalculatePrayerTimes = () => {
      setLoadingPrayerTimes(true);
      setPrayerTimesError(null);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const date = new Date();
            const coordinates = new Coordinates(latitude, longitude);

            // Configure calculation parameters (customize as needed)
            const params = CalculationMethod.MuslimWorldLeague(); // Common method
            params.madhab = Madhab.Shafi; // Hanafi, Shafi, Maliki, Hanbali (for Asr prayer)

            const prayerTimes = new PrayerTimes(coordinates, date, params);

            // Helper to format Date objects to HH:MM strings
            const formatTime = (dateObj) => {
              if (!dateObj) return 'N/A';
              return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
            };

            const updatedPrayers = {
              fajr: { 
                ...basePrayersData.fajr, 
                startTime: formatTime(prayerTimes.fajr), 
                endTime: formatTime(prayerTimes.sunrise) 
              },
              dhuhr: { 
                ...basePrayersData.dhuhr,
                startTime: formatTime(prayerTimes.dhuhr), 
                endTime: formatTime(prayerTimes.asr) 
              },
              asr: { 
                ...basePrayersData.asr,
                startTime: formatTime(prayerTimes.asr), 
                endTime: formatTime(prayerTimes.maghrib) 
              },
              maghrib: { 
                ...basePrayersData.maghrib,
                startTime: formatTime(prayerTimes.maghrib), 
                endTime: formatTime(prayerTimes.isha) 
              },
              isha: { 
                ...basePrayersData.isha,
                startTime: formatTime(prayerTimes.isha),
                endTime: '23:59' 
              },
            };
            
            setPrayersData(updatedPrayers);
            setLoadingPrayerTimes(false);
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            let errorMessage = "Could not retrieve your location.";
            if (error.code === error.PERMISSION_DENIED) {
                errorMessage += " Please allow location access to get accurate prayer times.";
            } else {
                errorMessage += " Displaying default times.";
            }
            setPrayerTimesError(errorMessage);
            // Fallback to a static or 'N/A' version if geolocation fails
            const fallbackPrayers = {};
            for (const key in basePrayersData) {
              fallbackPrayers[key] = { ...basePrayersData[key], startTime: 'N/A', endTime: 'N/A' };
            }
            setPrayersData(fallbackPrayers);
            setLoadingPrayerTimes(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000, // Increased timeout for better chance of getting location
            maximumAge: 0 // Don't use cached position
          }
        );
      } else {
        setPrayerTimesError("Geolocation is not supported by your browser. Displaying default times.");
        const fallbackPrayers = {};
        for (const key in basePrayersData) {
          fallbackPrayers[key] = { ...basePrayersData[key], startTime: 'N/A', endTime: 'N/A' };
        }
        setPrayersData(fallbackPrayers);
        setLoadingPrayerTimes(false);
      }
    };

    fetchAndCalculatePrayerTimes(); // Run once on mount

    // Optional: Recalculate daily at midnight or if a specific event occurs
    // For now, it fetches once. For daily updates, you'd integrate a daily trigger.

  }, []); // Empty dependency array means this effect runs once on mount


  // Check if we need to reset daily prayer status
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      // Reset prayer status for new day but keep qaza prayers
      setPrayerStatus({});
      setLastResetDate(today);
      localStorage.setItem('namaz-last-reset-date', today);
    }
  }, [lastResetDate]);

  useEffect(() => {
    localStorage.setItem('namaz-prayer-status', JSON.stringify(prayerStatus));
  }, [prayerStatus]);

  useEffect(() => {
    localStorage.setItem('namaz-qaza-prayers', JSON.stringify(qazaPrayers));
  }, [qazaPrayers]);

  const toggleStudied = (prayerKey) => {
    const today = new Date().toDateString();
    const key = `${prayerKey}-${today}`;
    
    setPrayerStatus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const markAsQaza = (prayerKey, date = new Date()) => {
    const dateString = date.toDateString();
    
    // Check if this exact prayer for this exact date is already in qaza
    const alreadyInQaza = qazaPrayers.some(qaza => 
      qaza.prayerKey === prayerKey && qaza.dateMissed === dateString
    );
    
    if (!alreadyInQaza) {
      const qazaEntry = {
        id: `${prayerKey}-${Date.now()}`,
        prayer: prayersData[prayerKey], // Ensure it uses the current prayersData (dynamic)
        prayerKey,
        dateMissed: dateString,
        completed: false
      };

      setQazaPrayers(prev => [...prev, qazaEntry]);
    }
  };

  const completeQaza = (qazaId) => {
    setQazaPrayers(prev => 
      prev.map(qaza => 
        qaza.id === qazaId ? { ...qaza, completed: true } : qaza
      )
    );
  };

  const removeCompletedQaza = (qazaId) => {
    setQazaPrayers(prev => {
    const updated = prev.filter(qaza => qaza.id !== qazaId);
    console.log('Updated Qaza List (test):', updated); // 👈 Add this
    return updated;
  });
  };

  const isStudied = (prayerKey) => {
    const today = new Date().toDateString();
    const key = `${prayerKey}-${today}`;
    return !!prayerStatus[key];
  };

  return (
    <PrayerContext.Provider value={{
      prayersData,
      prayerStatus,
      qazaPrayers,
      currentView,
      setCurrentView,
      toggleStudied,
      markAsQaza,
      completeQaza,
      removeCompletedQaza,
      isStudied,
      loadingPrayerTimes, // Expose loading state
      prayerTimesError // Expose error state
    }}>
      {children}
    </PrayerContext.Provider>
  );
};